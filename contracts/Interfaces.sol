pragma solidity >=0.5.15;

interface IPot {
    function Pie() external view returns (uint256);
    function dsr() external view returns (uint256);
}

interface IChai {
    // ERC20
    function transfer(address dst, uint amount) external returns (bool);
    function transferFrom(address src, address dst, uint amount) external returns (bool);
    function approve(address spender, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function totalSupply() external view returns (uint256);
    // get the underlying Pot
    function pot() external view returns (IPot);

    // Add `wad` DAI
    function join(address dst, uint wad) external;

    // Redeem `wad` CHAI
    function exit(address src, uint wad) external;

    // Redeem `wad` DAI
    function draw(address src, uint wad) external;

    // How much DAI does the user own
    function dai(address usr) external returns (uint wad);
}

interface ICToken {
    // ERC20
    function transfer(address dst, uint amount) external returns (bool);
    function transferFrom(address src, address dst, uint amount) external returns (bool);
    function approve(address spender, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function totalSupply() external view returns (uint256);

    // redeems `redeemAmount` DAI
    function redeemUnderlying(uint redeemAmount) external returns (uint);

    // commented out functions are unused and therefore useless
    function balanceOfUnderlying(address owner) external returns (uint);
    /* function getAccountSnapshot(address account) external view returns (uint, uint, uint, uint); */
    /* function borrowRatePerBlock() external view returns (uint); */
    function mint(uint mintAmount) external returns (uint);
    /* function underlying() external view returns (address); */
    function supplyRatePerBlock() external view returns (uint);
    /* function totalBorrowsCurrent() external returns (uint); */
    /* function borrowBalanceCurrent(address account) external returns (uint); */
    /* function borrowBalanceStored(address account) external view returns (uint); */
    function exchangeRateCurrent() external returns (uint);
    /* function exchangeRateStored() external view returns (uint); */
    function getCash() external view returns (uint);
    /* function accrueInterest() external returns (uint); */
    /* function seize(address liquidator, address borrower, uint seizeTokens) external returns (uint); */
}
