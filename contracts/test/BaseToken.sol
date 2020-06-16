pragma solidity >=0.5.15;

import {ERC20} from "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract BaseToken is ERC20 {
    address internal _owner;

    function init(address _own) public {
        require(_owner == address(0), "BaseToken/init --- already init");
        _owner = _own;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "BaseToken/onlyOwner --- not owner");
        _;
    }

    function mint(address account, uint256 amount) public onlyOwner {
        ERC20._mint(account, amount);
    }

    function burn(address account, uint256 value) public onlyOwner {
        ERC20._burn(account, value);
    }
}
