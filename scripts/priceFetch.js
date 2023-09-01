const ethers = require('ethers');
const dotenv = require('dotenv');
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_ARB_MAINNET_URL);


// LBQuoter
const LBQuoterAddress = '0xd76019A16606FDa4651f636D9751f500Ed776250'
const LBQuoterAbi = require('./LBQuoter.json')


// Uniswap V3 Quoter config
const quoter2Abi = require('@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json')
const quoter2Address = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e'

// amount of ether
const amountIn = ethers.parseEther("0.5");
//$LINK&WETH
const token0Address = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' //WETH
const token1Address = '0x371c7ec6D8039ff7933a2AA28EB827Ffe1F52f07' //JOE
const erc20Abi = require('./IERC20.json')
// initialising contracts
const quoter2 = new ethers.Contract(quoter2Address, quoter2Abi.abi, provider)
const LBQuoter = new ethers.Contract(LBQuoterAddress, LBQuoterAbi.abi, provider)
const token0 = new ethers.Contract(token0Address, erc20Abi.abi, provider)
const token1 = new ethers.Contract(token1Address, erc20Abi.abi, provider)
// Dex1 and Dex2 quotes
const getDex1Price = async () => {
    const route = [token0Address, token1Address]
    console.log('***Route******', route, '***routeEND******')
    const quote = await LBQuoter.findBestPathFromAmountIn.staticCall(route, amountIn);
    console.log('***LBQuoter******', quote, '***LBQuoterEND******')
    const price = ethers.formatUnits(((quote.amounts[1])/amountIn).toString(),18);
    return price;
}

// v3 price
const getDex2Price = async () => {
    const params = {
        token0Address,
        token1Address,
        fee: '10000',
        amountIn: amountIn,
        sqrtPriceLimitX96: '0'
    }
    const output = await quoter2.quoteExactInputSingle.staticCall(params)
    const price = ethers.formatUnits(output.amountOut.toString(), 6);
    return price
}


// Compare price
const comparePrice = async () => {
    const dex1Price = await getDex1Price();
    const dex2Price = await getDex2Price();

    //####################################################################################
    const profit = calculateProfit(dex2Price, dex1Price);
    const [sell, buy] = dex2Price > dex1Price ? ['v3', 'v2'] : ['v2', 'v3']
    console.log('-----------------------------------------------------------------------')
    console.log(`COIN: ${token0Address}`)
    console.log(`Amount : ${amount} | Profit : ${profit} | Buy : ${buy} | Sell : ${sell}`)
    console.log(`v2 price : ${dex1Price / amount}`)
    console.log(`v3 price : ${dex2Price / amount}`)
    //####################################################################################
}

//Calculate profit
function calculateProfit(dex2Price, dex1Price) {
    let sellPrice, buyPrice;
    if (dex2Price > dex1Price) {
        sellPrice = dex2Price;
        buyPrice = dex1Price;
    } else if (dex1Price > dex2Price) {
        sellPrice = dex1Price;
        buyPrice = dex2Price;
    }
    const profit = (sellPrice / buyPrice - 1) * amount;
    return profit;
}

comparePrice()



