import { useWeb3React } from "@web3-react/core";
import { t } from "i18next";
import { drawAward, receive } from "../API";
import { addMessage, showLoding } from "../utils/tool";
import { Contracts } from "../web3";
import { useSelector } from "react-redux";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
export const useGetReward = () => {
  const token = useSelector<any>((state) => state?.token);
  const { account } = useWeb3React();
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  function getReward(incomeType: any, callbackFun: any, contractName: string) {
    if (!web3ModalAccount) return addMessage(t("Please link wallet"));
    if (!token) return addMessage(t("请先登录"));
    if (!incomeType) return addMessage(t("failed"));
    drawAward({
      type: incomeType,
    }).then(async (res: any) => {
      showLoding(true);
      if (res?.code === 200) {
        let value: any;
        try {
          value = await Contracts.example.withdrawReward(
            web3ModalAccount as string,
            res?.data,
            contractName
          );
        } catch (error: any) {
          showLoding(false);
        }
        showLoding(false);
        if (value?.status) {
          addMessage(t("Received successfully"));
          callbackFun();
        } else {
          showLoding(false);
          addMessage(t("failed"));
        }
        //   .then((res: string) => {
        //     showLoding(false);
        //     addMessage(t("Received successfully"));
        //     callbackFun();
        // setTimeout(() =>
        //     , 5000)
        //   })
        //   .catch((res: any) => {
        // if (res.code === 4001) {
        // addMessage(t("failed"));
        // showLoding(false);
        // }
        //   });
      } else {
        showLoding(false);
        addMessage(res.msg);
      }
    });
  }
  return { getReward };
};
