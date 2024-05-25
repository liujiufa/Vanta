import { useWeb3React } from "@web3-react/core";
import { t } from "i18next";
import { EthertoWei, addMessage, decimalNum, showLoding } from "../utils/tool";
import { Contracts } from "../web3";
import { useEffect, useState } from "react";
import useConnectWallet from "./useConnectWallet";
import { throttle } from "lodash";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
export const useInputValue = () => {
  const { account } = useWeb3React();
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const [InputValueAmount, setInputValueAmount] = useState<any>("");
  const [InputValueAmountValue, setInputValueAmountValue] = useState<any>("0");
  const [Price, setPrice] = useState<any>("");

  const getVilifyState = throttle(async (value: string) => {
    if (!web3ModalAccount) return;
    return Contracts.example?.queryUsdtByMbk(web3ModalAccount as string, value);
  }, 2000);

  const InputValueFun = async (e: any) => {
    let value = e.target.value.replace(/^[^1-9]+|[^0-9]/g, "");
    setInputValueAmount(value);
    if (Number(value) > 0) {
      getVilifyState(value)?.then((res: any) => {
        setInputValueAmountValue(decimalNum(EthertoWei(res ?? "0"), 2));
      });
    } else {
      setInputValueAmountValue("0");
    }
  };

  const MaxFun = (value: string) => {
    setInputValueAmount(value);

    if (Number(value) > 0) {
      getVilifyState(value)?.then((res: any) => {
        setInputValueAmountValue(decimalNum(EthertoWei(res ?? "0"), 2));
      });
    }
  };

  useEffect(() => {
    if (web3ModalAccount) {
      console.log("ethi1");

      Contracts.example
        ?.queryUsdtByMbk(web3ModalAccount as string, 1 + "")
        ?.then((res: any) => {
          console.log(res, "ethi2");

          setPrice(decimalNum(EthertoWei(res ?? "0"), 2));
        });
    }
  }, [web3ModalAccount]);
  return {
    Price,
    InputValueAmountValue,
    InputValueAmount,
    MaxFun,
    InputValueFun,
  };
};
