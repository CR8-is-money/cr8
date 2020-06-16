pragma solidity >=0.5.15;

import {CR8} from "../CR8.sol";
import {ICToken, IChai} from "../Interfaces.sol";
import {ERC20} from "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract TestingCR8 is CR8 {
    uint256 targetResult = 7;

    // assumes all CTokens use the same divisibility
    constructor (ICToken _cDAI, IChai _CHAI, ERC20 _DAI, address _developer)
    CR8(_cDAI, _CHAI, _DAI, _developer) public {}

    function setTarget(uint256 result) public {
        targetResult = result;
    }

    function _target(uint256, uint256) internal returns (Ratio memory t) {
        t.chai = targetResult;
        t.cdai = targetResult;
    }

    function mint(address who, uint256 howMuch) public {
        _mint(who, howMuch);
    }

    function burn(address who, uint256 howMuch) public {
        _burn(who, howMuch);
    }
}
