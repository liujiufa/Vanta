// @ts-nocheck
import "./App.scss";
import "./App.css";
import React from "react";

import { useEffect } from "react";
import "./lang/i18n";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Routers from "./router";
import { GetQueryString, showLoding, startWord } from "./utils/tool";
// import web3 from 'web3';
import { stateType } from "./store/reducer";
import {
  createAddMessageAction,
  createLoginSuccessAction,
  createDelMessageAction,
} from "./store/actions";
import { Login } from "./API";
import Loding from "./components/loding";
import ViewportProvider from "./components/viewportContext";
// import { useNavigate } from "react-router-dom";
// import Home from './view/Home';
import prohibit from "./assets/image/prohibit.png";
import cloneIcon from "./assets/image/closeIcon.svg";

import { t } from "i18next";
import useConnectWallet, { connector } from "./hooks/useConnectWallet";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { useSign } from "./hooks/useSign";

import * as QB from "quickblox/quickblox";
import {
  QuickBloxUIKitProvider,
  qbDataContext,
  QuickBloxUIKitDesktopLayout,
  LoginData,
  AuthorizationData,
  QBDataContextType,
} from "quickblox-react-ui-kit";

import { QBConfig } from "./QBconfig";

declare let window: any;

const MessageBox = styled.div`
  position: fixed;
  z-index: 9999;
  top: 90px;
  right: 40px;
  @media screen and (max-width: 967px) {
    right: 0 !important;
  }
`;
function App() {
  const web3React = useWeb3React();
  const { connectWallet } = useConnectWallet();
  const { signFun } = useSign();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  let state = useSelector<stateType, stateType>((state) => state);

  const currentUser: LoginData = {
    login: "garry",
    password: "garry5santos",
  };

  return (
    <ViewportProvider>
      <QuickBloxUIKitProvider
        maxFileSize={100 * 1000000}
        accountData={{ ...QBConfig.credentials }}
        loginData={{
          login: currentUser.login,
          password: currentUser.password,
        }}
      >
        <div className="App">
          <MessageBox>
            {state.message.map((item, index) => (
              <div className="messageItem" key={index}>
                <div className="messageLebel">
                  <img src={prohibit} alt="" />
                </div>
                <div className="messageConter">
                  <div className="title">{t("info")}</div>
                  <div className="content">{item.message}</div>
                  <img
                    className="clone"
                    onClick={() => {
                      dispatch(createDelMessageAction(item.index));
                    }}
                    src={cloneIcon}
                    alt=""
                  />
                </div>
              </div>
            ))}
          </MessageBox>
          <Routers></Routers>
          {state.showLoding && <Loding></Loding>}
        </div>
      </QuickBloxUIKitProvider>
    </ViewportProvider>
  );
}

export default App;
