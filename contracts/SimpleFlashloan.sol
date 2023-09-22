// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
pragma abicoder v2;

import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract SimpleFlashLoan is FlashLoanSimpleReceiverBase {
    address payable owner;
    address public constant ARB = 0x912CE59144191C1204E64559FE8253a0e49E6548;
    address public constant WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;

    IERC20 public linkToken = IERC20(ARB);
    IERC20 public wethToken = IERC20(WETH);
    address public constant routerAddressUniswap =
        0xE592427A0AEce92De3Edee1F18E0157C05861564;
    ISwapRouter public constant swapRouter = ISwapRouter(routerAddressUniswap);
    address public constant joeRouterAddress =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    // IUniswapV2Router02 public constant v2Router = IUniswapV2Router02(v2RouterAddress);

    uint24 public constant poolFee = 3000;

    IPoolAddressesProvider private constant PROVIDER_ADDRESS =
        IPoolAddressesProvider(0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb);

    constructor(
        address _addressProvider
    ) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) {}

    function fn_RequestFlashLoan(address _token, uint256 _amount) public {
        address receiverAddress = address(this);
        address asset = _token;
        uint256 amount = _amount;
        bytes memory params = "";
        uint16 referralCode = 0;

        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );
    }

    //This function is called after your contract has received the flash loaned amount

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        //logic
        IERC20(asset).approve(address(this), amount);
        // uniswapV2Swap(amount, WETH, ARB);
        swapExactInputSingle(ARB, asset, linkToken.balanceOf(address(this)));
        wethToken.approve(address(this), wethToken.balanceOf(address(this)));
        IERC20(asset).approve(
            address(this),
            IERC20(asset).balanceOf(address(this))
        );

        //repay
        uint256 totalAmount = amount + premium;
        IERC20(asset).approve(address(POOL), totalAmount);

        return true;
    }

    function swapExactInputSingle(
        address tokenInput,
        address tokenOutput,
        uint256 amountIn
    ) internal returns (uint256 amountOut) {
        // linkToken.transfer(address(this), amountIn);
        IERC20(tokenInput).approve(address(swapRouter), amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a
        //safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenInput,
                tokenOut: tokenOutput,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    /// @notice swapExactOutputSingle swaps a minimum possible amount of ARB for a fixed amount of WETH.
    /// @dev The calling address must approve this contract to spend its ARB for this function to succeed. As the amount of input ARB is variable,
    /// the calling address will need to approve for a slightly higher amount, anticipating some variance.
    /// @param amountOut The exact amount of WETH to receive from the swap.
    /// @param amountInMaximum The amount of ARB we are willing to spend to receive the specified amount of WETH.
    /// @return amountIn The amount of ARB actually spent in the swap.
    function swapExactOutputSingle(
        address tokenInput,
        address tokenOutput,
        uint256 amountOut,
        uint256 amountInMaximum
    ) internal returns (uint256 amountIn) {
        // Transfer the specified amount of ARB to this contract.
        // IERC20(tokenInput).transfer(address(this), amountInMaximum);

        // Approve the router to spend the specifed `amountInMaximum` of ARB.
        // In production, you should choose the maximum amount to spend based on oracles or other data sources to acheive a better swap.
        IERC20(tokenInput).approve(address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: tokenInput,
                tokenOut: tokenOutput,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
        amountIn = swapRouter.exactOutputSingle(params);

        // For exact output swaps, the amountInMaximum may not have all been spent.
        // If the actual amount spent (amountIn) is less than the specified maximum amount,
        //we must refund the msg.sender and approve the swapRouter to spend 0.
        if (amountIn < amountInMaximum) {
            IERC20(tokenInput).approve(address(swapRouter), 0);
            IERC20(tokenInput).transfer(
                address(this),
                amountInMaximum - amountIn
            );
        }
    }

    function joeSwap(uint _amountIn){
        wethToken.approve(address(joeRouterAddress), amountIn);

        IERC20[] memory tokenPath = new IERC20[](2);
        tokenPath[0] = WETH;
        tokenPath[1] = ARB;

        uint256[] memory pairBinSteps = new uint256[](1); // pairBinSteps[i] refers to the bin step for the market (x, y) where tokenPath[i] = x and tokenPath[i+1] = y
        pairBinSteps[0] = 1;

        ILBRouter.Version[] memory versions = new ILBRouter.Version[](1);
        versions[0] = ILBRouter.Version.V2_1; // add the version of the Dex to perform the swap on

        ILBRouter.Path memory path; // instanciate and populate the path to perform the swap.
        path.pairBinSteps = pairBinSteps;
        path.versions = versions;
        path.tokenPath = tokenPath;

        (, uint128 amountOut, ) = router.getSwapOut(pair, amountIn, true);
        uint256 amountOutWithSlippage = amountOut * 99 / 100 // We allow for 1% slippage
        uint256 amountOutReal = router.swapExactTokensForTokens(amountIn, amountOutWithSlippage, path, to, block.timestamp + 1);
    }

     receive() external payable {}
}
