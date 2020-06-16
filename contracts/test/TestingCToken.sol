pragma solidity >=0.5.15;

import {ICToken} from "../Interfaces.sol";
import {BaseToken} from "./BaseToken.sol";

contract TestingCToken is ICToken, BaseToken {
    uint256 supplyRate;
    uint256 _balanceOfUnderlying;
    uint256 _mintResult;
    uint256 _redeemResult;
    uint256 _exchangeRate;
    uint256 _cash = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

    constructor () public {
        init(msg.sender);
    }

    function setMint(uint _new) public {
        _mintResult = _new;
    }

    function mint(uint) external returns (uint) {
        return _mintResult;
    }

    function setBalanceOfUnderlying(uint256 _amnt) public {
        _balanceOfUnderlying = _amnt;
    }

    function balanceOfUnderlying(address) external returns (uint) {
        return _balanceOfUnderlying;
    }

    function setSupplyRatePerBlock(uint256 rate) public {
        supplyRate = rate;
    }

    function supplyRatePerBlock() external view returns (uint) {
        return supplyRate;
    }

    function setRedeemUnderlying(uint _new) public {
        _redeemResult = _new;
    }

    function redeemUnderlying(uint) external returns (uint) {
        return _redeemResult;
    }

    function setExchangeRateCurrent(uint _new) public {
        _exchangeRate = _new;
    }

    function exchangeRateCurrent() external returns (uint) {
        return _exchangeRate;
    }

    function setCash(uint _new) public {
        _cash = _new;
    }

    function getCash() external view returns (uint) {
        return _cash;
    }
}
