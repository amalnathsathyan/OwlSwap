// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
pragma abicoder v2;

import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";


contract OwlSwap is FlashLoanSimpleReceiverBase {
    address payable owner;
    address public constant USDC = 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8; //USDC
    // address public constant USDC = 0x912CE59144191C1204E64559FE8253a0e49E6548; //ARB
    // address public constant USDC = 0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a; //GMX
    
    address public constant WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;

    IPoolAddressesProvider private constant PROVIDER_ADDRESS =
        IPoolAddressesProvider(0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb);


    constructor(
        address _addressProvider
    ) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) {
        owner = payable(msg.sender);
    }


    function requestFlashLoan(address _token, uint256 _amount) public {
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
        

        //repay
        uint256 totalAmount = amount + premium;
        require(totalAmount < IERC20(asset).balanceOf(address(this)),'Not WETH Enough To Repay');
        IERC20(asset).approve(address(POOL), totalAmount);
        return true;
    }

    //uniswapv3 swap
    receive() external payable {}
}
