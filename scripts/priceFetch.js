const ethers = require('ethers');
const dotenv = require('dotenv');
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.IFURA_ARB_MAINNET_URL);

// LBQuoter
const LBQuoterAddress = '0xd76019A16606FDa4651f636D9751f500Ed776250';
const LBQuoterAbi = require('./LBQuoter.json');

// Uniswap V3 Quoter config
const quoter2Abi = require('@uniswap/v3-periphery/artifacts/contracts/lesn);
const quoter2Address = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e';
// 0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6
// amount of ether
const amount = 5;
const amountIn = ethers.parseEther(`${amount}`);
const GMXPrice = 1;
const ARB = 1;
//$LINK&WETH
const token0Address = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'; //WETH
const token1Address = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'; //GMX
// const token1Address = '0x912CE59144191C1204E64559FE8253a0e49E6548'//ARB
// const token1Address = '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f'//ARB
const erc20Abi = require('./IERC20.json');
// initialising contracts
const quoter2 = new ethers.Contract(quoter2Address, quoter2Abi.abi, provider);
const LBQuoter = new ethers.Contract(LBQuoterAddress, LBQuoterAbi.abi, provider);
const token0 = new ethers.Contract(token0Address, erc20Abi.abi, provider);
const token1 = new ethers.Contract(token1Address, erc20Abi.abi, provider);
// Dex1 and Dex2 quotes
const getDex1Price = async () => {
  try {
    const route = [token0Address, token1Address];
    console.log('***Route******', route);
    const quote = await LBQuoter.findBestPathFromAmountIn.staticCall(route, amountIn);
    console.log('***JOE-Quote*****', quote);
    const price = ethers.formatUnits((quote.amounts[1]).toString(), 18);
    return price;
  } catch (error) {
    console.log(error);
  }
};

// v3 price
const getDex2Price = async () => {
  try {
    const params = {
      tokenIn: token0Address,
      tokenOut: token1Address,
      fee: '500',
      amountIn: amountIn,
      sqrtPriceLimitX96: '0',
    };
    const output = await quoter2.quoteExactInputSingle.staticCall(params);
    console.log('*******UNISWAP-QUOTE*****', output)
    const price = ethers.formatUnits(output.amountOut.toString(), 18);
    return price;
  } catch (error) {
    console.log(error);
  }
};

// Compare price
const priceFetch = async () => {
  const dex1Price = await getDex1Price();
  const dex2Price = await getDex2Price();

  //####################################################################################
  const profit = calculateProfit(dex2Price, dex1Price);
  const [sell, buy] = dex2Price > dex1Price ? ['uniswap', 'joe'] : ['joe', 'uniswap'];
  console.log('-----------------------------------------------------------------------');
  console.log(`COIN: ${token1Address}`);
  console.log(`Profit : ${profit} | Buy : ${buy} | Sell : ${sell}`);
  console.log(`joe price : ${dex1Price / amount}`);
  console.log(`uniswap price : ${dex2Price / amount}`);

  const fees = amount*0.0005*1850;
  const profitReal = profit - fees;
  console.log(`########## EXPECTED PROFIT:$ ${profitReal}###########`)
  //####################################################################################
  return {
    sellDex: dex2Price > dex1Price ? 'uniswap' : 'joe',
    buyDex: dex2Price < dex1Price ? 'uniswap' : 'joe',
    
  }
};

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
  console.log('sellPrice', sellPrice);
  console.log('buyPrice', buyPrice);
  const profitInNumberOfTokens = sellPrice-buyPrice;
  const profit = profitInNumberOfTokens*GMXPrice;
  return profit;
}

// module.exports = {priceFetch};
priceFetch();