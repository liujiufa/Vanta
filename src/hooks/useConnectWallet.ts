import { useCallback, useEffect } from "react";

import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ChainId } from "../web3";
import { networkConf } from "../web3";
import { chain } from "lodash";
import { WalletConnect } from "@web3-react/walletconnect-v2";

export const connector = new InjectedConnector({
  supportedChainIds: [Number(ChainId.BSC)],
});
const bscTestnet = {
  rpc: {
    97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  chainId: 97,
};
// export const walletConnectConnector = new WalletConnect({
//   rpc: bscTestnet.rpc,
//   chainId: bscTestnet.chainId,
//   bridge: "https://bridge.walletconnect.org",
//   qrcode: true,
//   pollingInterval: 12000,
// });

// 连接 metamask
// export const tryConnect = async (activateFun: any, selectedConnector: any) => {
//   return await activateFun(
//     selectedConnector,
//     (err: any) => {
//       console.log(err);
//     },
//     true
//   );
// };

export default function useConnectWallet() {
  const { activate, deactivate, active, account } = useWeb3React();

  const tryConnect = async (activateFun: any, selectedConnectorFun: any) => {
    return activateFun(
      selectedConnectorFun,
      (err: any) => {
        console.log(err);
      },
      true
    );
  };

  const connectWallet = useCallback(
    (selectedConnector: any) => {
      tryConnect(activate, selectedConnector)
        .then(async () => {
          // console.log("CONNECT WALLET");
        })
        .catch(() => {
          if (
            Number((window as any)?.ethereum.networkVersion) !==
            Number(ChainId.BSC)
          ) {
            (window as any)?.ethereum
              .request({
                method: "wallet_switchEthereumChain",
                params: [
                  {
                    chainId: ChainId.BSC,
                  },
                ],
              })
              .then((res: any) => {
                // window.location.reload()
                console.log("res");
              })
              .catch((error: any) => {
                if (error.code !== 4001) {
                  (window as any)?.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                      // {
                      //     chainId: '0x38',
                      //     chainName: "Ethereum Mainnet",
                      //     rpcUrls: ["https://bsc-dataseed.binance.org/"],
                      //     nativeCurrency: {
                      //         symbol: "BNB",
                      //         name: 'BNB',
                      //         decimals: 18
                      //     },
                      //     blockExplorerUrls: ["https://etherscan.io/"]
                      // }
                      {
                        ...networkConf[ChainId.BSC],
                      },
                    ],
                  });
                }
              });
          }
        });
    },
    [tryConnect, activate]
  );
  return {
    connectWallet,
    activate,
    deactivate,
    active,
    tryConnect,
  };
}
