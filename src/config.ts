import Token from "./ABI/ERC20Token.json";
import Referrer from "./ABI/Referrer.json";
import Bot from "./ABI/Bot.json";
import pledgeContract from "./ABI/Stake.json";
import nftContract from "./ABI/MbkNft.json";
import lpContract from "./ABI/LpStake.json";
import nodeContract from "./ABI/Node.json";
import communityContract from "./ABI/Community.json";
import gameContract from "./ABI/Game.json";
import IPancakeRouter02 from "./ABI/IPancakeRouter02.json";
import awardPoolContract from "./ABI/RewardDistribute.json";

// 正式
export const LOCAL_KEY = "MBAS_LANG";
export const isMain = false;
// 自己
// export let baseUrl: string = isMain ? 'http://120.79.67.226:16088/' : 'http://192.168.2.114:16088/';
export let baseUrl: string = isMain
  ? "http://47.76.173.162:18888/"
  : // : "http://172.20.10.2:18888/";
    "https://yhhyn.com/" + "api";
// export let baseUrl: string = isMain ? window.location.origin + '/user/' : 'http://120.79.67.226:13777/';
export let ContractUrl: string = isMain
  ? "https://bscscan.com/address/"
  : "https://testnet.bscscan.com/address/";
export let SwapUrl: string =
  "https://pancakeswap.finance/swap?chain=bscTestnet&inputCurrency=0x2b11640f31b84dc727841FE6B5a905D366A00e78&outputCurrency=0xdA99fA57019FB1DFC1AAea892e5190a91236A840";
export let SuShiSwapUrl: string = "https://www.sushi.com/swap";
export let RewardType: any = { "1": "16", "2": "17" };
export const BitNumber = 8;

export const mainnet = {
  "0x1": {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  },
  "0x38": {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  },
  "0x61": {
    chainId: 97,
    name: "BSC",
    currency: "BNB",
    explorerUrl: "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
    rpcUrl: "https://bsc-testnet-rpc.publicnode.com",
  },
};

interface abiObjType {
  [propName: string]: any;
}

interface contractAddressType {
  [propName: string]: string;
}

export const abiObj: abiObjType = {
  USDT: Token,
  MBK: Token,
  MBK_USDT: Token,
  Referrer: Referrer,
  Bot: Bot,
  pledgeContract: pledgeContract,
  nftContract: nftContract,
  lpContract: lpContract,
  nodeContract: nodeContract,
  communityContract: communityContract,
  gameContract: gameContract,
  IPancakeRouter02: IPancakeRouter02,
  awardPoolContract: awardPoolContract,
};

export const Main: contractAddressType = {
  USDT: "0x0546FA2C783811c971076B9B9036847Bf56ceE9A",
  MBK: "0xC47352beadC8E354877AD6FAe5a84e924d68A7dE",
};

const Test = {
  USDT: "0x2b11640f31b84dc727841FE6B5a905D366A00e78",
  MBK: "0xdA99fA57019FB1DFC1AAea892e5190a91236A840",
  MBK_USDT: "0xE484E7d0Deb26cE25CFE9063E87F349b77DD6bFE",
  Referrer: "0xc89D894A742551Ec2878104644B22FEeDF748525",
  Bot: "0x997E86D80981Bee9Bb02661b27C19583b55A47a9",
  pledgeContract: "0xa571673D014ce338815F62A31F059a95D594Bb5a",
  nftContract: "0x74055D36589c5FdD32B8ee5315e86cF9B351BeF1",
  lpContract: "0x5f9873c7A1D9DC2fBf4643131111C4384dD3f8d4",
  nodeContract: "0x20E0Fc8B87F71627cAa8773b3FeFD21Eb1572Cc8",
  communityContract: "0x2DA540558f1e1fB972fe14d517Bc332091625FCb",
  gameContract: "0x12de9Df69B3351010BE8B5454FBe0baFC877353a",
  IPancakeRouter02: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
  awardPoolContract: "0x136Bd3d3bcc52eA3B4F7fFA7EB9f0f6a55e82AA4",
};

export const contractAddress: contractAddressType = isMain ? Main : Test;
// Test
