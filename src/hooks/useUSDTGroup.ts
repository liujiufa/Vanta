import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { addMessage, showLoding, decimalNum } from "../utils/tool";
import { t } from "i18next";
import { Contracts } from "../web3";

type AddressType = string;
type CoinAddressType = string;

export default function useUSDTGroup(
  contractAddress: AddressType,
  coinName: CoinAddressType
) {
  const { account } = useWeb3React();
  const [hash, setHash] = useState(0);
  const [TOKENBalance, setTOKENBalance] = useState("0");
  const [TOKENAllowance, setTOKENAllowance] = useState("0");
  const [symbol, setSymbol] = useState("");

  /**
   *  TOKENBalance 余额
   */
  const initTOKENBalance = useCallback(async () => {
    if (!!account) {
      const balance = await Contracts.example?.balanceOf(account, coinName);

      setTOKENBalance(decimalNum(Web3.utils.fromWei(balance.toString()), 2));
    }
  }, [account, coinName]);

  /**
   *  授权USDT
   */
  const handleApprove = useCallback(
    async (num: string, fun: any) => {
      if (account) {
        showLoding(true);
        try {
          const res = await Contracts.example?.approve(
            account,
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
    [showLoding, coinName, account]
  );

  /**
   *  TOKENBalance 授权额度
   */
  const initTOKENAllowance = useCallback(async () => {
    if (!!account) {
      const allowance = await Contracts.example?.Tokenapprove(
        account,
        contractAddress,
        coinName
      );
      setTOKENAllowance(Web3.utils.fromWei(allowance.toString(), "ether"));
    }
  }, [account, contractAddress, coinName]);

  /**
   *  TOKENBalance 授权额度
   */
  const initSymbol = useCallback(async () => {
    if (!!account) {
      const symbol = await Contracts.example?.symbol(account, coinName);
      setSymbol(symbol);
    }
  }, [account, contractAddress, coinName]);

  /**
   *  TOKENBalance 授权额度
   */
  const handleUSDTRefresh = useCallback(() => {
    setHash(+new Date());
  }, [coinName]);

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
        addMessage(`${symbol} ${t("Insufficient balance")}`);
      }
    },
    [
      account,
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
    if (account) {
      initTOKENAllowance();
      initTOKENBalance();
      initSymbol();
    }
  }, [account, hash, coinName]);

  return {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  };
}
