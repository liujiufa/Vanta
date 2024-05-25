import { useCallback, useMemo } from "react";
import { Contract } from "web3-eth-contract";
import { provider } from "web3-core";
import Web3 from "web3";
import { abiObj, contractAddress, isMain } from "./config";
import BigNumber from "big.js";
import { log } from "console";
declare let window: any;
interface contractType {
  [propName: string]: Contract;
}
export const ChainId = {
  // BSC: "0x61",
  BSC: isMain ? "0x38" : "0x61",
};

//切换链
const SCAN_ADDRESS = {
  [ChainId.BSC]: "https://scan.demonchain.io/",
};
//配置连接链的信息
export const networkConf = {
  [ChainId.BSC]: {
    // chainId: '0x61',
    chainId: isMain ? "0x38" : "0x61",
    chainName: "BSC",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: isMain
      ? ["https://bsc-dataseed.binance.org/"]
      : ["https://data-seed-prebsc-2-s1.bnbchain.org:8545"],
    blockExplorerUrls: [SCAN_ADDRESS[ChainId.BSC]],
  },
};
//切换链
// export const changeNetwork = (chainId: number) => {
//   return new Promise<void>((reslove) => {
//     const { ethereum } = window;
//     if (ethereum && ethereum.isMetaMask && networkConf[chainId]) {
//       ethereum
//         .request({
//           method: "wallet_addEthereumChain",
//           params: [
//             {
//               ...networkConf[chainId],
//             },
//           ],
//         })
//         .then(() => {
//           setTimeout(reslove, 500);
//         });
//     } else {
//       reslove();
//     }
//   });
// };

export class Contracts {
  //单例
  static example: Contracts;
  web3: Web3;
  contract: contractType = {};
  constructor(library: any) {
    console.log(library, "library");

    this.web3 = new Web3(library);
    //保存实例到静态属性
    Contracts.example = this;
  }
  //判断合约是否实例化
  verification(contractName: string) {
    if (!this.contract[contractName]) {
      this.contract[contractName] = new this.web3.eth.Contract(
        abiObj[contractName],
        contractAddress[contractName]
      );
    }
  }
  //合约的方法

  //查询gas
  getGasPrice(addr: string) {
    return this.web3.eth.getGasPrice();
  }
  //查询BNB余额
  getBalance(addr: string) {
    return this.web3.eth.getBalance(addr);
  }
  //查询余额
  balanceOf(addr: string, contractName: string) {
    this.verification(contractName);
    let obj = new this.web3.eth.Contract(
      abiObj[contractName],
      contractAddress[contractName]
    );
    return obj?.methods.balanceOf(addr).call({ from: addr });
  }
  //查询授权
  Tokenapprove(addr: string, toaddr: string, contractName: string) {
    this.verification(contractName);
    let obj = new this.web3.eth.Contract(
      abiObj[contractName],
      contractAddress[contractName]
    );
    return obj?.methods.allowance(addr, toaddr).call({ from: addr });
  }
  symbol(addr: string, contractName: string) {
    this.verification(contractName);
    let obj = new this.web3.eth.Contract(
      abiObj[contractName],
      contractAddress[contractName]
    );
    return obj?.methods.symbol().call({ from: addr });
  }
  //授权1
  approve(addr: string, toaddr: string, contractName: string, value: string) {
    this.verification(contractName);
    let obj = new this.web3.eth.Contract(
      abiObj[contractName],
      contractAddress[contractName]
    );
    var amount = Web3.utils.toWei(String(Number(value) + 10000));
    console.log(toaddr, amount, "########", obj, "*******");
    return obj?.methods
      .approve(toaddr, amount)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  //签名数据
  Sign(addr: string, msg: string) {
    console.log(msg, "msg");
    return this.web3.eth.personal.sign(
      this.web3.utils.utf8ToHex(msg) as string,
      addr,
      "123"
    );
  }
  //除开拓者奖励领取
  withdrawReward(addr: string, data: string, contractName: string) {
    // this.verification("Distribute");
    let obj = new this.web3.eth.Contract(
      abiObj[contractName],
      contractAddress[contractName]
    );
    console.log(data, "data");

    return obj?.methods
      .withdrawReward(data)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  //查询绑定
  isBind(addr: string, contractName: string) {
    this.verification(contractName);

    let obj = new this.web3.eth.Contract(
      abiObj[contractName],
      contractAddress[contractName]
    );
    return obj?.methods.isBind(addr).call({ from: addr });
  }
  bind(addr: string, address: string) {
    this.verification("Referrer");
    return this.contract.Referrer?.methods
      .bind(address)
      .send({ from: addr, gasPrice: "5000000000" });
  }

  buyBot(addr: string, value: string) {
    this.verification("Bot");
    var amount = Web3.utils.toWei(value);

    return this.contract.Bot?.methods
      .buyBot(amount)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  queryUsdtByMbk(addr: string, value: string) {
    this.verification("Bot");
    let amount = Web3.utils.toWei(value + "", "ether");
    return this.contract.Bot?.methods
      .queryUsdtByMbk(amount)
      .call({ from: addr });
  }

  // queryWethByUsdt(addr: string, amount: string) {
  //   this.verification("Inscription");
  //   var amounted = Web3.utils.toWei(amount + "", "ether");
  //   return this.contract?.Inscription.methods
  //     ?.queryWethByUsdt(amounted)
  //     .call({ from: addr });
  // }
  queryMbkByUsdt(addr: string, value: string) {
    this.verification("Bot");
    let amount = Web3.utils.toWei(value);
    return this.contract.Bot?.methods
      .queryMbkByUsdt(amount)
      .call({ from: addr });
  }
  stake(addr: string, value: string) {
    this.verification("pledgeContract");

    return this.contract.pledgeContract?.methods
      .stake(value)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  mint(addr: string) {
    this.verification("nftContract");

    return this.contract.nftContract?.methods
      .mint()
      .send({ from: addr, gasPrice: "5000000000" });
  }
  queryPrice(addr: string) {
    this.verification("nftContract");
    return this.contract.nftContract?.methods.queryPrice().call({ from: addr });
  }
  totalSupply(addr: string) {
    this.verification("nftContract");
    return this.contract.nftContract?.methods
      .totalSupply()
      .call({ from: addr });
  }
  active(addr: string, tokenId: number) {
    this.verification("nftContract");
    return this.contract.nftContract?.methods
      .active(tokenId)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  stakeLP(addr: string, amount: string, period: number) {
    this.verification("lpContract");
    let amounted = Web3.utils.toWei(amount);
    return this.contract.lpContract?.methods
      .stake(amounted, period)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  buyNode(addr: string, data: any) {
    this.verification("nodeContract");

    return this.contract.nodeContract?.methods
      .buyNode(data)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  avtiveNode(addr: string, data: any) {
    this.verification("nodeContract");

    return this.contract.nodeContract?.methods
      .avtiveNode(data)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  activeCommunity(addr: string, data: any) {
    this.verification("communityContract");

    return this.contract.communityContract?.methods
      .activeCommunity(data)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  participate(addr: string, data: any) {
    this.verification("gameContract");

    return this.contract.gameContract?.methods
      .participate(data)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  //   uint amountIn,   ／／兑换代币数量
  // uint amountOutMin, ／／ ０
  // address[] calldata path,  ／／  ［ｔｏｋｅｎＩｎ，ｔｏｋｅｎＯｕｔ］
  // address to, ／／用户地址
  // uint deadline ／／当前时间 （秒）＋360
  swapExactTokensForTokensSupportingFeeOnTransferTokens(
    addr: string,
    amountIn: string,
    amountOutMin: 0,
    addressArr: [string, string],
    deadline: number
  ) {
    this.verification("IPancakeRouter02");
    let amountIned = Web3.utils.toWei(amountIn);
    console.log(deadline, "deadline");

    return this.contract.IPancakeRouter02?.methods
      .swapExactTokensForTokensSupportingFeeOnTransferTokens(
        amountIned,
        amountOutMin,
        addressArr,
        addr,
        deadline
      )
      .send({ from: addr, gasPrice: "5000000000" });
  }
  // swap 查询代币价格
  getAmountsOut(addr: string, amountIn: string, addressArr: Array<string>) {
    this.verification("IPancakeRouter02");
    let amountIned = Web3.utils.toWei(amountIn);
    return this.contract.IPancakeRouter02?.methods
      .getAmountsOut(amountIned, addressArr)
      .call({ from: addr });
  }
  unStake(addr: string, data: string) {
    this.verification("lpContract");
    return this.contract.lpContract?.methods
      .unStake(data)
      .send({ from: addr, gasPrice: "5000000000" });
  }

  queryUserBuyBotInfo(addr: string) {
    this.verification("Bot");
    console.log(this.contract.Bot, "this.contract.Bot");

    return this.contract.Bot?.methods
      .queryUserBuyBotInfo(addr)
      .call({ from: addr });
  }
  queryMbkByUsdt1(addr: string, amount: any) {
    this.verification("Bot");
    return this.contract.Bot?.methods
      .queryMbkByUsdt1(amount)
      .call({ from: addr });
  }
}
