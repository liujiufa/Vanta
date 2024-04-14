// @ts-nocheck
import React, { useState, useEffect } from "react";
import { getExchangeRecord, userInfo } from "../API/index";
import "../assets/style/Home.scss";
import NoData from "../components/NoData";
import Table from "../components/Table";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { stateType } from "../store/reducer";
import styled, { keyframes } from "styled-components";
import { useViewport } from "../components/viewportContext";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ContainerBox,
  FlexBox,
  FlexCCBox,
  FlexECBox,
  FlexSACBox,
  FlexSBCBox,
  FlexSCBox,
} from "../components/FlexBox";
import { contractAddress } from "../config";
import { throttle } from "lodash";

import * as QB from "quickblox/quickblox";
import {
  QuickBloxUIKitProvider,
  qbDataContext,
  QuickBloxUIKitDesktopLayout,
  LoginData,
  AuthorizationData,
  QBDataContextType,
} from "quickblox-react-ui-kit";

import { QBConfig } from "../QBconfig";

const NodeContainerBox = styled(ContainerBox)`
  width: 100%;
`;

export default function Rank() {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const state = useSelector<stateType, stateType>((state) => state);
  const qbToken = useSelector<stateType, stateType>((state) => state?.qbToken);
  const qbUIKitContext: QBDataContextType = React.useContext(qbDataContext);

  const [isUserAuthorized, setUserAuthorized] = React.useState(false);
  const [isSDKInitialized, setSDKInitialized] = React.useState(false);
  console.log(qbToken, "qbToken");

  const getInitData = () => {
    // getExchangeRecord().then((res: any) => {
    //   if (res.code === 200) {
    //     setRecordList(res?.data);
    //   }
    // });
  };

  useEffect(() => {
    if (state.token) {
      getInitData();
    }
  }, [state.token]);

  const prepareSDK = async (): Promise<void> => {
    // check if we have installed SDK
    if ((window as any).QB === undefined) {
      if (QB !== undefined) {
        (window as any).QB = QB;
      } else {
        let QBLib = require("quickblox/quickblox.min");
        (window as any).QB = QBLib;
      }
    }

    const APPLICATION_ID = QBConfig.credentials.appId;
    const AUTH_KEY = QBConfig.credentials.authKey;
    const AUTH_SECRET = QBConfig.credentials.authSecret;
    const ACCOUNT_KEY = QBConfig.credentials.accountKey;
    const CONFIG = QBConfig.appConfig;

    QB.init(APPLICATION_ID, AUTH_KEY, AUTH_SECRET, ACCOUNT_KEY, CONFIG);
  };

  var provider = "facebook";
  var accessToken = qbToken;

  var accessTokenSecret = null;

  var params = { login: "garry", password: "garry5santos" };
  // QB.createSession(
  //   {
  //     provider: provider,
  //     keys: {
  //       token: accessToken,
  //       secret: accessTokenSecret,
  //     },
  //   },
  //   function (error, result) {
  //     if (error) {
  //     } else {
  //     }
  //   }
  // );

  useEffect(() => {
    if (!isSDKInitialized) {
      prepareSDK()
        .then((result) => {
          QB.createSession(
            // {
            //   provider: provider,
            //   keys: {
            //     token: accessToken,
            //     secret: accessTokenSecret,
            //   },
            // },
            params,
            async function (errorCreateSession: any, session: any) {
              if (errorCreateSession) {
                console.log(
                  "Create User Session has error:",
                  JSON.stringify(errorCreateSession)
                );
              } else {
                const userId: number = session.user_id;
                const password: string = session.token;
                const paramsConnect = { userId, password };

                QB.chat.connect(
                  paramsConnect,
                  async function (errorConnect: any, resultConnect: any) {
                    if (errorConnect) {
                      console.log(
                        "Can not connect to chat server: ",
                        errorConnect
                      );
                    } else {
                      const authData: AuthorizationData = {
                        userId: userId,
                        password: password,
                        userName: currentUser.login,
                        sessionToken: session.token,
                      };
                      await qbUIKitContext.authorize(authData);
                      setSDKInitialized(true);
                      setUserAuthorized(true);
                    }
                  }
                );
              }
            }
          );
        })
        .catch((e) => {
          console.log("init SDK has error: ", e, isSDKInitialized);
        });
    }
  }, []);

  return (
    <NodeContainerBox>
      {
        // React states indicating the ability to render UI
        isSDKInitialized && isUserAuthorized ? (
          <QuickBloxUIKitDesktopLayout />
        ) : (
          <div>wait while SDK is initializing...</div>
        )
      }
    </NodeContainerBox>
  );
}
