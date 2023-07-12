pragma solidity =0.7.6;

interface ISwap {
    function swapExactInputSingle(uint256 amountIn) external returns (uint256 amountOut);
}