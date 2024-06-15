// @ts-nocheck
import React, { useState, useEffect, forwardRef } from "react";
import { Provider as ReduxProvider } from "react-redux";

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
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import "easemob-chat-uikit/style.css";
import { store } from "../store/store";
import App from "./Chat/App";

const NodeContainerBox = styled(ContainerBox)`
  width: 100%;
  height: calc(100vh - 56px);
  padding: 0px;
`;
export default function Rank() {
  const { t, i18n } = useTranslation();
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const state = useSelector<stateType, stateType>((state) => state);
  const qbToken = useSelector<stateType, stateType>(
    (state: any) => state?.qbToken
  );
  const Navigate = useNavigate();
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

  return (
    <NodeContainerBox>
      <ReduxProvider store={store}>
        <App></App>
      </ReduxProvider>
    </NodeContainerBox>
  );
}
