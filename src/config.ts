import Token from "./ABI/ERC20Token.json";
import IDO from "./ABI/IDO.json";
import Entrance from "./ABI/Entrance.json";
import PioneerDistribute from "./ABI/PioneerDistribute.json";

// 正式
export const LOCAL_KEY = "MBAS_LANG";
export const isMain = true;
// 自己
// export let baseUrl: string = isMain ? 'http://120.79.67.226:16088/' : 'http://192.168.2.114:16088/';
export let baseUrl: string = isMain
  ? "https://shenlong88.com/user/"
  : "https://shenlong88.com/user/";
// export let baseUrl: string = isMain ? window.location.origin + '/user/' : 'http://120.79.67.226:13777/';
export let ContractUrl: string = isMain
  ? "https://bscscan.com/address/"
  : "https://testnet.bscscan.com/address/";
export let SwapUrl: string =
  "https://pancakeswap.finance/swap";
export let SuShiSwapUrl: string =
  "https://www.sushi.com/swap";
export let RewardType: any = { "1": "16", "2": "17" };
export const BitNumber = 8;

interface abiObjType {
  [propName: string]: any;
}

interface contractAddressType {
  [propName: string]: string;
}

export const abiObj: abiObjType = {
  USDT: Token,
  LPToken: Token,
  IDO: IDO,
  Entrance: Entrance,
  PioneerDistribute: PioneerDistribute,
  Distribute: PioneerDistribute,
};

export const Main: contractAddressType = {
  USDT: "0x0546FA2C783811c971076B9B9036847Bf56ceE9A",
  LPToken: "0xC47352beadC8E354877AD6FAe5a84e924d68A7dE",
  IDO: "0x756Cc8CBAa2aB885d4A31A80f157Fe16267b4196",
  Entrance: "0x481D073a7C77Cc7149b99f92dd735eA9dFA5f841",
  Distribute: "0x2948bd8f76EC69F07F2847aFFfAE77adcF996788",
  PioneerDistribute: "0xC65a62EEC96C38da938c9365731eB8B2E057D7Ac",
};

const Test = {
  USDT: "0x2b11640f31b84dc727841FE6B5a905D366A00e78",
  LPToken: "0x1a6E3a363094cfe0c8D639390A8004ebA21Ba360",
  IDO: "0xd91F6E8C3e7Ccb2c47d92a65A7cAC1C406039191",
  Entrance: "0x1566C96079B373CEb9F2Ac40E9D4eb53e813a690",
  Distribute: "0x81963D2045c11Cb5083525Fe2a2E1e362e3a7910",
  PioneerDistribute: "0x628Aa962Cc0283847646E70f546237804D83D87f",
};

export const contractAddress: contractAddressType = isMain ? Main : Test;
// Test
