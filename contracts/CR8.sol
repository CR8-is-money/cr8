pragma solidity >=0.5.15;

import {ICToken, IChai} from "./Interfaces.sol";
import {Maths} from "./Maths.sol";

import {SafeMath} from "openzeppelin-solidity/contracts/math/SafeMath.sol";
import {ERC20} from "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

interface ICR8 {
    function pack(uint256 amnt) external;
    function unpack(uint256 amnt) external;
    function crate() external view returns (uint256);
    function target() external returns (uint256, uint256);
    function packedDAI() external returns (uint256);
    function daiShare(address whose) external returns (uint256);
    function packable(address byWhom) external view returns (uint256);
    function cDAIPerBlockRate() external view returns (uint256);
    function CHAIPerBlockRate() external view returns (uint256);
}

contract CR8Utils is Maths {
    using SafeMath for uint256;

    IChai public CHAI;     // 18 decimals
    IERC20 public DAI;     // 18 decimals
    ICToken public cDAI;   //  8 decimals

    uint256 public constant UINT_MAX = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    uint256 public constant CDAI_RATE_SCALE_UP = 10 ** (27 - 18);
    uint256 public constant CDAI_BALANCE_SCALE_UP = 10 ** (18 - 8);
    uint256 public constant DSR_ONE = 10 ** 27;
    uint256 public constant SECONDS_PER_BLOCK = 13; // TODO: Make this not suck?


    function _getCDAI(uint256 daiToSend) internal {
        DAI.approve(address(cDAI), daiToSend);
        require(cDAI.mint(daiToSend) == 0, "CR8Utils/_getCDAI --- cDAI mint failed");
    }

    function _getCHAI(uint256 daiToSend) internal {
        DAI.approve(address(CHAI), daiToSend);
        CHAI.join(address(this), daiToSend);
    }

    // This function may fail if cDAI has a liquidity crunch
    // This may affect pack, but will likely ALWAYS affect unpack
    function _redeemCDAI(uint256 daiToGet) internal {
        require(
            cDAI.redeemUnderlying(daiToGet) == 0,
            "CR8Utils/_redeemCDAI --- cDAI.redeemUnderlying failed"
        );
    }

    function _redeemCHAI(uint256 daiToGet) internal {
        CHAI.draw(address(this), daiToGet);
    }

    function cDAIPerBlockRate() external view returns (uint256) {
        return _cDAIPerBlockRate();
    }

    // CDAI is 10**18 and no 1. Adjust to 10**27 and add 1
    function _cDAIPerBlockRate() internal view returns (uint256) {
        return cDAI.supplyRatePerBlock().mul(CDAI_RATE_SCALE_UP).add(DSR_ONE);
    }

    function CHAIPerBlockRate() external view returns (uint256) {
        return _CHAIPerBlockRate();
    }

    // DSR is per second. Adjust to per block
    function _CHAIPerBlockRate() internal view returns (uint256) {
        uint256 dsr = CHAI.pot().dsr();
        return  rpow(dsr, SECONDS_PER_BLOCK, DSR_ONE);
    }

    // cDAI has 8 decimals
    function _cDAIBalance() internal view returns (uint256) {
        return cDAI.balanceOf(address(this)).mul(CDAI_BALANCE_SCALE_UP);
    }

    function _CHAIBalance() internal view returns (uint256) {
        return CHAI.balanceOf(address(this));
    }
}

contract CR8 is ICR8, ERC20, CR8Utils {
    using SafeMath for uint256;

    // THIS IS AN ABSTRACT CONTRACT
    // IMPLEMENT _target IN CHILD CONTRACT
    function _target(uint256 cDAIRate, uint256 chaiRate) internal returns (Ratio memory);

    event Packed(address by, uint256 dai, uint256 cr8s);
    event Unpacked(address by, uint256 dai, uint256 cr8s);

    address public developer;

    uint256 public constant MIN_PACK = 10 ** 11;
    uint256 public constant DEV_FEE_DENOMINATOR = 250;

    struct Ratio {
        uint256 cdai;
        uint256 chai;
    }

    // ERC20 Detailed defaults
    string public name = "Unknown CR8";
    string public symbol = "CR8";
    uint8 public constant decimals = 18;

    constructor(ICToken _cDAI, IChai _CHAI, ERC20 _DAI, address _developer) public {
        cDAI = _cDAI;
        CHAI = _CHAI;
        DAI = _DAI;
        developer = _developer;
    }

    // amnt is DAI
    // This function may fail if cDAI has a liquidity crunch
    function pack(uint256 amnt) external {
        uint256 amount = amnt == 0 ? UINT_MAX : amnt;  // allow 0 to mean all
        amount = _min(amount, _packable(msg.sender));
        require(amount >= MIN_PACK, "CR8/pack --- amount too small. Hint: did you call DAI.approve?");
        require(
            // no SafeERC20 b/c DAI known to be safe.
            DAI.transferFrom(msg.sender, address(this), amount),
            "CR8/pack - transferFrom failed"
        );

        // Determine new allocation, counting new dai
        Ratio memory packed = _packedAllocation();
        uint256 currentDAITotal = packed.cdai.add(packed.chai);
        uint256 newDAITotal = amount.add(currentDAITotal);
        Ratio memory newAllocation = _allocate(newDAITotal);

        // Redeem first, then get more, then mint.
        if (newAllocation.cdai < packed.cdai) {
            _redeemCDAI(packed.cdai.sub(newAllocation.cdai));
        }
        if (newAllocation.chai < packed.chai) {
            _redeemCHAI(packed.chai.sub(newAllocation.chai));
        }
        if (newAllocation.cdai > packed.cdai) {
            _getCDAI(newAllocation.cdai.sub(packed.cdai));
        }
        if (newAllocation.chai > packed.chai) {
            _getCHAI(newAllocation.chai.sub(packed.chai));
        }

        uint256 mintAmount;
        uint256 supply = totalSupply();
        if (supply == 0) {
            // if supply is 0, mint the amount
            mintAmount = amount;
        } else {
            // else mint a pro-rata share
            mintAmount = amount.mul(supply).div(currentDAITotal);
        }
        _mint(msg.sender, mintAmount);
        emit Packed(msg.sender, amount, mintAmount);
    }

    // amnt is CR8
    // This function may fail if cDAI has a liquidity crunch
    function unpack(uint256 amnt) external {
        uint256 cr8Bal = balanceOf(msg.sender);
        uint256 amount = amnt == 0 ? UINT_MAX : amnt;  // allow 0 to mean "all"
        amount = _min(amount, cr8Bal);
        require(amount != 0, "CR8/unpack --- 0 amount");

        uint256 supply = totalSupply();  // cache before burning
        _burn(msg.sender, amount);

        if (msg.sender != developer) {
            uint256 devFee = amount.div(DEV_FEE_DENOMINATOR);
            amount = amount.sub(devFee);
            _mint(developer, devFee);
        }

        // Determine new allocation, less departing dai
        // We do this by getting the pro-rata share of the contents,
        //   and subtracting it from the total contents
        Ratio memory packed = _packedAllocation();
        uint256 totalContents = packed.cdai.add(packed.chai);
        uint256 contents = amount.mul(totalContents).div(supply);
        uint256 newDAITotal = totalContents.sub(contents);

        Ratio memory newAllocation = _allocate(newDAITotal);

        // Redeem first, then get more, then mint.
        if (newAllocation.cdai < packed.cdai) {
            _redeemCDAI(packed.cdai.sub(newAllocation.cdai));
        }
        if (newAllocation.chai < packed.chai) {
            _redeemCHAI(packed.chai.sub(newAllocation.chai));
        }
        if (newAllocation.cdai > packed.cdai) {
            _getCDAI(newAllocation.cdai.sub(packed.cdai));
        }
        if (newAllocation.chai > packed.chai) {
            _getCHAI(newAllocation.chai.sub(packed.chai));
        }

        // Send the contents to msg.sender. Any remainder to developer
        DAI.transfer(msg.sender, contents);
        uint256 remainder = DAI.balanceOf(address(this));
        if (remainder > 0) {
            DAI.transfer(developer, remainder);
        }

        emit Unpacked(msg.sender, contents, amount);
    }

    function crate() external view returns (uint256) {
        uint256 _c;
        uint256 _cDAIRate;
        uint256 _chaiRate;
        (_c, _cDAIRate, _chaiRate) = _crate();
        return _c;
    }

    function target() external returns (uint256, uint256) {
        uint256 chaiRate = _CHAIPerBlockRate();
        uint256 cDAIRate = _cDAIPerBlockRate();
        Ratio memory t = _target(cDAIRate, chaiRate);
        return (t.cdai, t.chai);
    }

    function packedInCDAI() external returns (uint256) {
        return CHAI.dai(address(this));
    }

    function packedInCHAI() external returns (uint256) {
        return cDAI.balanceOfUnderlying(address(this));
    }

    function packedDAI() external returns (uint256) {
        return _packedDAI();
    }

    function daiShare(address whose) external returns (uint256) {
        return _daiShare(whose);
    }

    function packable(address byWhom) external view returns (uint256) {
        return _packable(byWhom);
    }

    // current cr8 weighted payout rate
    function _crate() internal view returns (uint256, uint256, uint256) {
        uint256 chaiBal = _CHAIBalance();
        uint256 cDAIBal = _cDAIBalance();
        uint256 chaiRate = _CHAIPerBlockRate();
        uint256 cDAIRate = _cDAIPerBlockRate();

        uint256 weightedSum = chaiBal.mul(chaiRate);
        weightedSum = weightedSum.add(cDAIBal.mul(cDAIRate));
        uint256 totalWeight = chaiBal.add(cDAIBal);
        if (totalWeight == 0) {
            return (chaiRate.add(cDAIRate).div(2), cDAIRate, chaiRate); // default
        }
        return (weightedSum.div(totalWeight), cDAIRate, chaiRate);
    }

    function _packedInCDAI() internal returns (uint256) {
        return cDAI.balanceOfUnderlying(address(this));
    }

    function _packedInCHAI() internal returns (uint256) {
        return CHAI.dai(address(this));
    }

    function _packedDAI() internal returns (uint256) {
        Ratio memory rat = _packedAllocation();
        return rat.cdai.add(rat.chai);
    }

    function _packedAllocation() internal returns (Ratio memory packed) {
        packed.cdai = _packedInCDAI();
        packed.chai = _packedInCHAI();
    }

    function _daiShare(address whose) internal returns (uint256) {
        return balanceOf(whose).mul(_packedDAI()).div(totalSupply());
    }

    function _packable(address byWhom) internal view returns (uint256) {
        return _min(DAI.balanceOf(byWhom), DAI.allowance(byWhom, address(this)));
    }

    function _allocate(uint256 totalDai) internal returns (Ratio memory newAllocation) {
        uint256 cDAIRate = _cDAIPerBlockRate();
        uint256 chaiRate = _CHAIPerBlockRate();
        Ratio memory t = _target(cDAIRate, chaiRate);

        t.cdai = t.cdai == 0 ? 1 : t.cdai;
        t.chai = t.chai == 0 ? 1 : t.chai;

        // cdai / (total_dai) * new_total
        newAllocation.cdai = totalDai.mul(t.cdai).div(t.cdai.add(t.chai));
        newAllocation.chai = totalDai.sub(newAllocation.cdai);
    }
}
