pragma solidity >=0.5.15;

import {IChai, IPot} from "../Interfaces.sol";
import {BaseToken} from "./BaseToken.sol";

contract TestingPot is IPot {
    uint256 _dsr;
    uint256 public Pie = 3;

    function setPie(uint256 _new) public {
        Pie = _new;
    }

    function setDSR(uint256 _new) public {
        _dsr = _new;
    }

    function dsr() external view returns (uint256) {
        return _dsr;
    }
}

contract TestingChai is IChai, BaseToken {

    uint256 public _dai = 3;
    IPot public _pot;

    constructor() public {
        _pot = new TestingPot();
        init(msg.sender);
    }

    function setDAI(uint256 _amnt) public {
        _dai = _amnt;
    }

    // get the underlying Pot
    function pot() external view returns (IPot) {
        return _pot;
    }

    // Add `wad` DAI
    function join(address, uint) external {
        return;
    }

    // Redeem `wad` CHAI
    function exit(address, uint) external {
        return;
    }

    // Redeem `wad` DAI
    function draw(address, uint) external {
        return;
    }

    // How much DAI does the user own
    function dai(address) external returns (uint) {
        return _dai;
    }
}
