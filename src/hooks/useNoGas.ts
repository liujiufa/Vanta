import { useWeb3React } from "@web3-react/core";
import { addMessage, showLoding } from "../utils/tool";
import { Contracts } from "../web3";
import { useEffect } from "react";
import useConnectWallet from "./useConnectWallet";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useTranslation } from "react-i18next";
export const useNoGas = () => {
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const { t } = useTranslation();
  async function isNoGasFun() {
    if (!web3ModalAccount) return addMessage(t("Please link wallet"));

    let BNBBalance = await Contracts?.example?.getBalance(web3ModalAccount);
    let gasPrice = await Contracts?.example?.getGasPrice(web3ModalAccount);
    if (Number(BNBBalance) < Number(gasPrice)) {
      addMessage(t("429"));
      showLoding(false);

      return true;
    } else {
      return false;
    }
  }
  return { isNoGasFun };
};
