import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { addMessage, showLoding, decimalNum } from "../utils/tool";
import { t } from "i18next";
import { Contracts } from "../web3";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useNoGas } from "./useNoGas";

type AddressType = string;
type CoinAddressType = string;

export default function useUSDTGroup(
  contractAddress: AddressType,
  coinName: CoinAddressType
) {
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const { account } = useWeb3React();
  const [hash, setHash] = useState(0);
  const [TOKENBalance, setTOKENBalance] = useState("0");
  const [TOKENAllowance, setTOKENAllowance] = useState("0");
  const [symbol, setSymbol] = useState("");
  const { isNoGasFun } = useNoGas();
  /**
   *  TOKENBalance 余额
   */
  const initTOKENBalance = useCallback(async () => {
    if (!!web3ModalAccount) {
      const balance = await Contracts.example?.balanceOf(
        web3ModalAccount,
        coinName
      );
      console.log(balance, "balance");

      setTOKENBalance(
        decimalNum(Web3.utils.fromWei(!!balance ? balance.toString() : "0"), 2)
      );
    }
  }, [web3ModalAccount, coinName]);

  /**
   *  授权USDT
   */
  const handleApprove = useCallback(
    async (num: string, fun: any) => {
      if (web3ModalAccount) {
        showLoding(true);
        try {
          if (!!(await isNoGasFun())) return;
          const res = await Contracts.example?.approve(
            web3ModalAccount,
            contractAddress,
            coinName,
            num
          );
          // const info = await res.wait();
          setHash(+new Date());
          showLoding(false);
          console.log("await", res);
          await fun(handleUSDTRefresh);
        } catch (error) {
          showLoding(false);
        }
      }
    },
    [showLoding, coinName, web3ModalAccount]
  );

  /**
   *  TOKENBalance 授权额度
   */
  const initTOKENAllowance = useCallback(async () => {
    if (!!web3ModalAccount) {
      const allowance = await Contracts.example?.Tokenapprove(
        web3ModalAccount,
        contractAddress,
        coinName
      );
      setTOKENAllowance(
        Web3.utils.fromWei(!!allowance ? allowance.toString() : "0", "ether")
      );
    }
  }, [web3ModalAccount, contractAddress, coinName]);

  /**
   *  TOKENBalance 授权额度
   */
  const initSymbol = useCallback(async () => {
    if (!!web3ModalAccount) {
      const symbol = await Contracts.example?.symbol(
        web3ModalAccount,
        coinName
      );
      setSymbol(symbol);
    }
  }, [web3ModalAccount, contractAddress, coinName]);

  /**
   *  TOKENBalance 授权额度
   */
  const handleUSDTRefresh = useCallback(() => {
    setHash(+new Date());
  }, [coinName]);

  /**
   *  buyNodeTOKENBalance 授权额度
   */
  const buyNodeHandleTransaction = useCallback(
    async (
      price: string,
      transactionCallBack: (refreshCall: () => void) => void
    ) => {
      // if (Number(TOKENBalance) >= Number(price)) {
      if (Number(TOKENAllowance) >= Number(price)) {
        await transactionCallBack(handleUSDTRefresh);
      } else {
        console.log(price, transactionCallBack, "1212");

        // await handleApprove(price);
        await handleApprove(price, transactionCallBack);
      }
      // } else {
      //   addMessage(
      //     `${
      //       String(symbol) === "MBK"
      //         ? "VTB"
      //         : String(symbol) === "MBK_USDT"
      //         ? "VTB_USDT"
      //         : symbol
      //     } ${t("Insufficient balance")}`
      //   );
      // }
    },
    [
      web3ModalAccount,
      handleApprove,
      symbol,
      handleUSDTRefresh,
      coinName,
      TOKENBalance,
      TOKENAllowance,
      addMessage,
    ]
  );
  /**
   *  TOKENBalance 授权额度
   */
  const handleTransaction = useCallback(
    async (
      price: string,
      transactionCallBack: (refreshCall: () => void) => void
    ) => {
      if (Number(TOKENBalance) >= Number(price)) {
        if (Number(TOKENAllowance) >= Number(price)) {
          await transactionCallBack(handleUSDTRefresh);
        } else {
          console.log(price, transactionCallBack, "1212");
          // await handleApprove(price);
          await handleApprove(price, transactionCallBack);
        }
      } else {
        addMessage(
          `${
            String(symbol) === "MBK"
              ? "VTB"
              : String(symbol) === "MBK_USDT"
              ? "VTB_USDT"
              : symbol
          } ${t("Insufficient balance")}`
        );
      }
    },
    [
      web3ModalAccount,
      handleApprove,
      symbol,
      handleUSDTRefresh,
      coinName,
      TOKENBalance,
      TOKENAllowance,
      addMessage,
    ]
  );

  useEffect(() => {
    if (web3ModalAccount) {
      initTOKENAllowance();
      initTOKENBalance();
      initSymbol();
    }
  }, [web3ModalAccount, hash, coinName]);

  return {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    buyNodeHandleTransaction,
    handleUSDTRefresh,
  };
}
