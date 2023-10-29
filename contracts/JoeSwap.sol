// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {ILBRouter} from "./interfaces/ILBRouter.sol";
// import {ILBPair} from "./interfaces/ILBPair.sol";
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20, ILBPair} from "./interfaces/ILBPair.sol";

interface IWETH is IERC20 {
    function deposit() external payable;
    function transfer(address to, uint value) external returns (bool);
    function withdraw(uint) external;
}

contract JoeSwap {
    address payable public owner;
    address public constant USDC = 0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a; // GMX
    address public constant WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1 ; // WETH

    IERC20 public usdc = IERC20(USDC);
    IERC20 public weth = IWETH(WETH);
    ILBRouter public router;
    ILBPair public pair;

    constructor() {
        owner = payable(msg.sender);
        router = ILBRouter(0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30);
        pair = ILBPair(0x94d53BE52706a155d27440C4a2434BEa772a6f7C);
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function harvest(address _token) external onlyOwner {
        uint256 tokenBalance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).transfer(owner,tokenBalance);
    }

    function recoverEth() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function joeSwap(uint128 _amountIn) external returns (uint256) {
        uint128 amountIn = _amountIn;
        
        weth.approve(address(this), amountIn);
        weth.approve(address(router), amountIn);

        IERC20[] memory tokenPath = new IERC20[](2);
        tokenPath[0] = IERC20(WETH);
        tokenPath[1] = IERC20(USDC);

        uint256[] memory pairBinSteps = new uint256[](1); // pairBinSteps[i] refers to the bin step for the market (x, y) where tokenPath[i] = x and tokenPath[i+1] = y
        pairBinSteps[0] = 1;

        ILBRouter.Version[] memory versions = new ILBRouter.Version[](1);
        versions[0] = ILBRouter.Version.V2_1; // add the version of the Dex to perform the swap on

        ILBRouter.Path memory path; // instanciate and populate the path to perform the swap.
        path.pairBinSteps = pairBinSteps;
        path.versions = versions;
        path.tokenPath = tokenPath;

        (, uint128 amountOut,) = router.getSwapOut(pair, amountIn, true);
        uint256 amountOutWithSlippage = (amountOut * 99) / 100; // We allow for 1% slippage
        uint256 amountOutReal = router.swapExactTokensForTokens(
            amountIn,
            amountOutWithSlippage,
            path,
            address(this),
            block.timestamp + 1
        );

        return amountOutReal;
    }

    receive() external payable {}
}
