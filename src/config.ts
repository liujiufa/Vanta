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
  ? "https://www.vanta1.com/" + "api"
  : // ? "https://yhhyn.com/" + "api"
    "http://120.79.67.226:19888";
// "http://192.168.1.37:18888/";
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
    chainId: 56,
    name: "BSC",
    currency: "BNB",
    explorerUrl: "https://bscscan.com",
    rpcUrl: "https://bsc-dataseed.binance.org",
  },
  "0x61": {
    chainId: 97,
    name: "BSC",
    currency: "BNB",
    explorerUrl: "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
    rpcUrl: "https://bsc-testnet-rpc.publicnode.com",
  },
};

export const appKey = "1174240614150550#demo"; // 环信AppKey
export const APP_ID = "15cb0d28b87b425ea613fc46f7c9f974"; // 声网AppId
export const UIKIT_VERSION = "1.0.0";
export const SDK_VERSION = "4.5.1";
export const DEMO_VERSION = "2.0.0";

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
  USDT: "0x55d398326f99059fF775485246999027B3197955",
  MBK: "0xac4f7a9C9D68472A70e29Da1fbEEB3e7835b0E70",
  MBK_USDT: "0x897BA3EdC1cc42544994d4A6631e60E4744bd653",
  Referrer: "0x13aFF424B1269bBE2B5A1282C3bB2502322B48f0",
  Bot: "0xD724046aD703FF97b4Fe2ABe34F90bFEEde2e420",
  pledgeContract: "0x09D4F573B90Ea70524B4821d5A9081cD4d55126c",
  nftContract: "0x2Eb8770152a584772b7A700DE26e49634b2a54C0",
  lpContract: "0x87aa05bB464FCE5a65E75134e7397b43787c242a",
  nodeContract: "0xa94ee86f5491855fC6faCEAC427bE3EEA8Fa3d59",
  communityContract: "0x9319A6D58B574Aea99a2ce1d7196Bb40D272fa8C",
  gameContract: "0xd7bf479fcE88f4f665445c62FA3C8a25D3A79922",
  IPancakeRouter02: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  awardPoolContract: "0x706625638fc248C2BE3e1D1a7E83FCD75946B16F",
};

const Test = {
  USDT: "0x2b11640f31b84dc727841FE6B5a905D366A00e78",
  MBK: "0xdA99fA57019FB1DFC1AAea892e5190a91236A840",
  MBK_USDT: "0xE484E7d0Deb26cE25CFE9063E87F349b77DD6bFE",
  Referrer: "0xc89D894A742551Ec2878104644B22FEeDF748525",
  Bot: "0x997E86D80981Bee9Bb02661b27C19583b55A47a9",
  pledgeContract: "0xa571673D014ce338815F62A31F059a95D594Bb5a",
  nftContract: "0x0D8004f68FF08a85351bd0c9629d8E3A6501Ca4c",
  lpContract: "0x5f9873c7A1D9DC2fBf4643131111C4384dD3f8d4",
  nodeContract: "0x20E0Fc8B87F71627cAa8773b3FeFD21Eb1572Cc8",
  communityContract: "0x2DA540558f1e1fB972fe14d517Bc332091625FCb",
  gameContract: "0x12de9Df69B3351010BE8B5454FBe0baFC877353a",
  IPancakeRouter02: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
  awardPoolContract: "0x136Bd3d3bcc52eA3B4F7fFA7EB9f0f6a55e82AA4",
};

export const contractAddress: contractAddressType = isMain ? Main : Test;
// Test
