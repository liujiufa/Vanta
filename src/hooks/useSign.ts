
import { useWeb3React } from "@web3-react/core";
import { t } from "i18next";
import { addMessage, showLoding } from "../utils/tool";
import { Contracts } from "../web3";
export const useSign = () => {
    const { account } = useWeb3React();
    function signFun(callback: any, msg: string) {
        if (!account) return addMessage(t("Please link wallet"))
        let time = (new Date()).valueOf();
        showLoding(true)
        Contracts.example.Sign(account as string, `${msg}&timestamp=${time}`).then((res: string) => {
            callback({ "sign": res, "timestamp": time })
        }).catch((res: any) => {
            if (res.code === 4001) {
                addMessage(t("failed"))
                showLoding(false)
            }
        }).finally(() => {
            showLoding(false)
        })
    }
    return { signFun }
}