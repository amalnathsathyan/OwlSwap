pragma solidity 0.8.10;

import {ILBRouter} from "./interfaces/ILBRouter.sol";
import {ILBPair} from "./interfaces/ILBPair.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract JoeSwap {
    address payable public owner;
    address public constant USDC = 0xb3482A25a12e5261b02E0acc5b96c656358a4086; // USDC-goerli
    address public constant WETH = 0xaE4EC9901c3076D0DdBe76A520F9E90a6227aCB7; // WETH-goerli

    IERC20 public usdc = IERC20(USDC);
    IERC20 public weth = IERC20(WETH);
    ILBRouter public router;
    ILBPair public pair;

    constructor() {
        owner = payable(msg.sender);
        router = ILBRouter(0x095EEe81B0eC73797424d67e24adab20D5A5D307);
        pair = ILBPair(0x5a46C8Ac7a2F617312cDF7BB0467A0C2d93d5cb5);
    }

    function joeSwap(uint128 _amountIn) external returns (uint256) {
        uint128 amountIn = _amountIn;
        weth.approve(address(router), amountIn);

        IERC20[] memory tokenPath = new IERC20[](2);
        tokenPath[0] = weth;
        tokenPath[1] = usdc;

        uint256[] memory pairBinSteps = new uint256[](1); // pairBinSteps[i] refers to the bin step for the market (x, y) where tokenPath[i] = x and tokenPath[i+1] = y
        pairBinSteps[0] = 1;

        ILBRouter.Version[] memory versions = new ILBRouter.Version[](1);
        versions[0] = ILBRouter.Version.V2_1; // add the version of the Dex to perform the swap on

        ILBRouter.Path memory path; // instanciate and populate the path to perform the swap.
        path.pairBinSteps = pairBinSteps;
        path.versions = versions;
        path.tokenPath = tokenPath;

        (, uint128 amountOut, ) = router.getSwapOut(pair, amountIn, true);
        uint256 amountOutWithSlippage = (amountOut * 99) / 100; // We allow for 1% slippage
        uint256 amountOutReal = router.swapExactTokensForTokens(
            amountIn,
            amountOutWithSlippage,
            path,
            address(this),
            block.timestamp + 1
        );
    }

    receive() external payable {}
}
