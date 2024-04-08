import { useWeb3React } from "@web3-react/core";
import { t } from "i18next";
import { addMessage, showLoding } from "../utils/tool";
import { Contracts } from "../web3";
import { useEffect } from "react";
import useConnectWallet from "./useConnectWallet";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
export const useSign = () => {
  const { account } = useWeb3React();
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  function signFun(callback: any, msg: string) {
    if (!web3ModalAccount) return addMessage(t("Please link wallet"));
    let time = new Date().valueOf();
    showLoding(true);
    Contracts.example
      .Sign(web3ModalAccount as string, `${msg}&timestamp=${time}`)
      .then((res: string) => {
        callback({
          sign: res,
          timestamp: time,
          msg: `${msg}&timestamp=${time}`,
        });
      })
      .catch((res: any) => {
        if (res.code === 4001) {
          addMessage(t("failed"));
          showLoding(false);
        }
      })
      .finally(() => {
        showLoding(false);
      });
  }
  return { signFun };
};
