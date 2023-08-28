const ethers = require('ethers');
const dotenv = require('dotenv');
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.IFURA_MAINNET_URL)


// Uniswap V2 Router config
const v2RouterAbi = ['function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)']
const v2RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

// Uniswap V3 Quoter config
const quoter2Abi = require('@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json')
const quoter2Address = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e'

// amount of ether
const amount = 1000
const amountIn = ethers.parseEther(`${amount}`);

const token0Address = '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0'
const token1Address = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

// const token

const v2Router = new ethers.Contract(v2RouterAddress, v2RouterAbi, provider)
const quoter2 = new ethers.Contract(quoter2Address, quoter2Abi.abi, provider)


// v2 price
const getV2Price = async (tokenIn, tokenOut, amountIn) => {
    const path = [tokenIn, tokenOut]
    const amounts = await v2Router.getAmountsOut(amountIn, path);
    const price = ethers.formatUnits(amounts[1].toString(), 6);
    return price;
}

// v3 price
const getV3Price = async (tokenIn, tokenOut, amountIn) => {
    const params = {
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        fee: '500',
        amountIn: amountIn,
        sqrtPriceLimitX96: '0'
    }
    const output = await quoter2.quoteExactInputSingle.staticCall(params)
    const price = ethers.formatUnits(output.amountOut.toString(), 6);
    return price
}


// Compare price
const comparePrice = async () => {
    const v2Price = await getV2Price(token0Address, token1Address, amountIn);
    const v3Price = await getV3Price(token0Address, token1Address, amountIn);

    //####################################################################################
    const profit = calculateProfit(v3Price, v2Price);
    const [sell, buy] = v3Price > v2Price ? ['v3', 'v2'] : ['v2', 'v3']
    console.log('-----------------------------------------------------------------------')
    console.log(`${token0Address}`)
    console.log(`Amount : ${amount} | Profit : ${profit} | Buy : ${buy} | Sell : ${sell}`)
    console.log(`v2 price : ${v2Price / amount}`)
    console.log(`v3 price : ${v3Price / amount}`)
    //####################################################################################
}

//Calculate profit
function calculateProfit(v3Price, v2Price) {
    let sellPrice, buyPrice;
    if (v3Price > v2Price) {
        sellPrice = v3Price;
        buyPrice = v2Price;
    } else if (v2Price > v3Price) {
        sellPrice = v2Price;
        buyPrice = v3Price;
    }
    const profit = (sellPrice / buyPrice - 1) * amount;
    return profit;
}

comparePrice()



