const ethers = require('ethers');
const v3RouterArtifact = require('../artifacts/@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json')
const v2RouterArtifact = require('../artifacts/@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol/IUniswapV2Router02.json');
const v3QuoterArtifact = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoterV2.sol/IQuoterV2.json');


const token1 = '0xe9c4393a23246293a8D31BF7ab68c17d4CF90A29';
const token2 = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
const v2RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const v3RouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564';


const provider = new ethers.getDefaultProvider();

const v3Router = new ethers.Contract(v3RouterAddress, v3RouterArtifact.abi, provider);
const v2Router = new ethers.Contract(v2RouterAddress, v2RouterArtifact.abi, provider);

const amountIn = ethers.parseEther('1000')
const PATH = [token1, token2];

async function main() {
    const v2Price = await v2Router.getAmountsOut(amountIn, PATH);
    console.log(v2Price);
    // const v3Price = await 
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
