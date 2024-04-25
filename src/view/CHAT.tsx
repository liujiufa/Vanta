// @ts-nocheck
import React, { useState, useEffect, forwardRef } from "react";
import { getExchangeRecord, userInfo } from "../API/index";
import "../assets/style/Home.scss";
import "../App.scss";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { stateType } from "../store/reducer";
import styled, { keyframes } from "styled-components";
import { useViewport } from "../components/viewportContext";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ContainerBox } from "../components/FlexBox";
import { contractAddress } from "../config";
import { throttle } from "lodash";

// @ts-ignore
import * as QB from "quickblox/quickblox";
import {
  QuickBloxUIKitDesktopLayout,
  LoginData,
  AuthorizationData,
  QBDataContextType,
  useQbUIKitDataContext,
  DefaultTheme,
} from "quickblox-react-ui-kit";

import { QBConfig } from "../QBconfig";
import {
  createUserSession,
  connectToChatServer,
  UserCreationStatus,
  UserData,
} from "../QBHeplers";
import { Btn } from "./NFT";
import { addMessage, startWord } from "../utils/tool";
import PageLoding from "../components/PageLoding";
import UserPageLoding from "../components/UserPageLoding";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
const NodeContainerBox = styled(ContainerBox)`
  width: 100%;
  padding: 0px;
  .message-view-container {
    /* max-height: calc(100vh - 56px) !important;
    min-height: calc(100vh - 56px) !important; */
  }
  .desktop-layout-main-container {
    max-width: 450px !important;
    @media (min-width: 450px) {
      display: block;
    }
  }
  .column-container {
    width: 100% !important;
    max-width: 450px !important;
  }
  > div {
    width: 100%;
  }
`;
const LoginBtn = styled(Btn)`
  width: 100%;
`;

//DefaultTheme implements UiKitTheme
class CustomTheme extends DefaultTheme {
  divider = (): string => "var(--divider)";
  mainText = (): string => "#FFFFFF";
  fontFamily = (): string => "Roboto";
  chatInput = (): string => "var(--chat-input)";
  /*
The DefaultTheme contains other theme methods :
caption = (): string => 'var(--caption)';
disabledElements = (): string => 'var(--disabled-elements)';
dropdownBackground = (): string => 'var(--dropdown-background)';
error = (): string => 'var(--error)';
fieldBorder = (): string => 'var(--field-border)';
hightlight = (): string => 'var(--hightlight)';
incomingBackground = (): string => 'var(--incoming-background)';
inputElements = (): string => 'var(--input-elements)';
mainBackground = (): string => 'var(--main-background)';
mainElements = (): string => 'var(--main-elements)';
outgoingBackground = (): string => 'var(--outgoing-background)';
secondaryBackground = (): string => 'var(--secondary-background)';
secondaryElements = (): string => 'var(--secondary-elements)';
secondaryText = (): string => 'var(--secondary-text)';
*/
}

export default function Rank() {
  const { t, i18n } = useTranslation();
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const state = useSelector<stateType, stateType>((state) => state);
  const qbToken = useSelector<stateType, stateType>((state) => state?.qbToken);
  const [theme, setTheme] = useState("mydark");

  const qbUIKitContext: QBDataContextType = useQbUIKitDataContext();

  const [isUserAuthorized, setUserAuthorized] = React.useState(false);
  const [isSDKInitialized, setSDKInitialized] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState({
    login: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();

  const pathname = startWord(location.pathname);

  console.log(qbToken, web3ModalAccount, "qbToken");
  const Navigate = useNavigate();
  const getInitData = () => {
    // getExchangeRecord().then((res: any) => {
    //   if (res.code === 200) {
    //     setRecordList(res?.data);
    //   }
    // });
  };

  // var params = {
  //   login: web3ModalAccount,
  //   password: qbToken,
  //   nameTheme: theme,
  // };
  var params = {
    login: String(web3ModalAccount).toLowerCase(),
    password: qbToken,
    web3ModalAccount,
    nameTheme: theme,
  };

  const loginHandler = async (data: any): Promise<void> => {
    setErrorMessage("");
    const loginData: LoginData = {
      login: data.login,
      password: data.password,
    };
    setCurrentUser(loginData);
    setTheme(data.nameTheme);
    await loginAction(loginData);
  };

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

    QB?.init(APPLICATION_ID, AUTH_KEY, AUTH_SECRET, ACCOUNT_KEY, CONFIG);
  };
  const logoutUIKitHandler = async () => {
    qbUIKitContext.release();
    setCurrentUser({ login: "", password: "" });
    setUserAuthorized(false);
  };

  const loginAction = async (loginData: LoginData): Promise<void> => {
    console.log(loginData, "loginData");

    if (isSDKInitialized && !isUserAuthorized) {
      if (loginData.login.length > 0 && loginData.password.length > 0) {
        await createUserSession(loginData)
          .then(async (resultUserSession) => {
            console.log(resultUserSession, "resultUserSession");

            await connectToChatServer(resultUserSession, currentUser.login)
              .then(async (authData) => {
                await qbUIKitContext.authorize(authData);
                qbUIKitContext.setSubscribeOnSessionExpiredListener(() => {
                  console.timeLog("call OnSessionExpiredListener ... start");
                  logoutUIKitHandler();

                  console.log("OnSessionExpiredListener ... end");
                });
                setSDKInitialized(true);
                setUserAuthorized(true);
                document.documentElement.setAttribute("data-theme", theme);
              })
              .catch((errorChatConnection) => {
                handleError(errorChatConnection);
              });
          })
          .catch((errorUserSession) => {
            handleError(errorUserSession);
          });
      }
    }
  };
  const handleError = (error: any): void => {
    console.log("error:", JSON.stringify(error));
    const errorToShow = error.message.errors[0] || "Unexpected error";
    setErrorMessage(errorToShow);
    setUserAuthorized(false);
  };

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

                QB?.chat.connect(
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

  useEffect(() => {
    if (state.token) {
      getInitData();
    }
  }, [state.token]);

  useEffect(() => {
    if (isSDKInitialized) {
      if (
        currentUser &&
        currentUser.login.length > 0 &&
        currentUser.password.length > 0
      ) {
        loginAction(currentUser);
      } else {
        console.log("auth flow has canceled ...");
      }
    }
  }, [isSDKInitialized]);

  useEffect(() => {
    if (!!qbToken && !!web3ModalAccount) {
      console.log("12");

      loginHandler(params);
    } else {
      addMessage("请重新登录账号");
      return Navigate("/View/");
    }
  }, [qbToken]);

  const CustomLink = forwardRef((props: any, ref: any) => (
    <QuickBloxUIKitDesktopLayout
      ref={ref}
      AIAssist={{
        enabled: true,
        default: false,
      }}
      theme={new CustomTheme()}
    />
  ));

  return (
    <NodeContainerBox>
      {
        // React states indicating the ability to render UI
        isSDKInitialized && isUserAuthorized ? (
          // <QuickBloxUIKitDesktopLayout />
          <CustomLink />
        ) : (
          // <LoginBtn
          //   onClick={() => {
          //     loginHandler(params);
          //   }}
          // >
          //   登陆
          // </LoginBtn>
          <UserPageLoding></UserPageLoding>
        )
      }
    </NodeContainerBox>
  );
}
