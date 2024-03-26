import { useCallback, useMemo } from "react";
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
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
export const changeNetwork = (chainId: number) => {
  return new Promise<void>((reslove) => {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask && networkConf[chainId]) {
      ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networkConf[chainId],
            },
          ],
        })
        .then(() => {
          setTimeout(reslove, 500);
        });
    } else {
      reslove();
    }
  });
};

export class Contracts {
  //单例
  static example: Contracts;
  web3: Web3;
  contract: contractType = {};
  constructor(library: provider) {
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

  //查询BNB余额
  getBalance(addr: string) {
    return this.web3.eth.getBalance(addr);
  }
  totalSupply(addr: string) {
    this.verification("PEX");
    return this.contract.PEX?.methods.totalSupply().call({ from: addr });
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
    var amount = Web3.utils.toWei(value);
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
    let amount = Web3.utils.toWei(value);
    return this.contract.Bot?.methods
      .queryUsdtByMbk(amount)
      .call({ from: addr });
  }
  queryMbkByUsdt(addr: string, value: string) {
    this.verification("Bot");
    let amount = Web3.utils.toWei(value);
    return this.contract.Bot?.methods
      .queryMbkByUsdt(amount)
      .call({ from: addr });
  }
}
