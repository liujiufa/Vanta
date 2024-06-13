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

import { addMessage, startWord } from "../utils/tool";
import PageLoding from "../components/PageLoding";
import UserPageLoding from "../components/UserPageLoding";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
// import { UIKitProvider } from "easemob-chat-uikit";
// import "easemob-chat-uikit/style.css";

const NodeContainerBox = styled(ContainerBox)`
  width: 100%;
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
      {/* <UserPageLoding></UserPageLoding> */}
    </NodeContainerBox>
  );
}
