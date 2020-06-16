pragma solidity >=0.5.15;

import {CR8} from "./CR8.sol";
import {ICToken, IChai} from "./Interfaces.sol";
import {ERC20} from "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract SupplyWeightedCR8 is CR8 {

    string public name = "Supply Weighted CR8";
    string public symbol = "CR8-SW";

    constructor (ICToken _cDAI, IChai _CHAI, ERC20 _DAI, address _developer)
    CR8(_cDAI, _CHAI, _DAI, _developer) public {}

    function _target(uint256, uint256) internal returns (Ratio memory t) {
        t.cdai = _daiInCDAI();
        t.chai = _daiInCHAI();
    }

    function _daiInCHAI() internal view returns (uint256) {
        return CHAI.pot().Pie();
    }

    function _daiInCDAI() internal returns (uint256) {
        return cDAI.totalSupply().mul(cDAI.exchangeRateCurrent()).div(10 ** 18);
    }
}


contract BestRateCR8 is CR8 {
    string public name = "Supply Weighted CR8";
    string public symbol = "CR8-BR";

    constructor (ICToken _cDAI, IChai _CHAI, ERC20 _DAI, address _developer)
    CR8(_cDAI, _CHAI, _DAI, _developer) public {}

    function _target(uint256, uint256) internal returns (Ratio memory t) {
        uint256 _chaiRate = _CHAIPerBlockRate();
        uint256 _cDAIRate = _cDAIPerBlockRate();

        // If rates are equal, it'll allocate all to CHAI
        t.cdai = _cDAIRate > _chaiRate ? 10 ** 18 : 0;
        t.chai = _chaiRate >= _cDAIRate ? 10 ** 18 : 0;
    }
}
