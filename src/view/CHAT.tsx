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
import { UIKitProvider } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

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
      <UIKitProvider
        initConfig={{
          appKey: "your app key",
          userId: "userId",
          token: "token",
          translationTargetLanguage: "zh-Hans", // 翻译功能的目标语言
          useUserInfo: true, // 是否使用用户属性功能展示头像昵称（UIKit 内部会获取用户属性，需要用户自己设置）
        }}
        // 查看所有 UI 文本: https://github.com/easemob/Easemob-UIKit-web/tree/dev/local
        local={{
          fallbackLng: "en",
          lng: "en",
          resources: {
            en: {
              translation: {
                conversationTitle: "Conversation List",
                deleteCvs: "Delete Conversation",
                // ...
              },
            },
          },
        }}
        theme={{
          primaryColor: "#33ffaa",
          mode: "light",
          componentsShape: "square",
        }}
        reactionConfig={{
          map: {
            emoji_1: <img src={"customIcon"} alt={"emoji_1"} />,
            emoji_2: <img src={"customIcon"} alt={"emoji_2"} />,
          },
        }}
        features={{
          conversationList: {
            // search: false,
            item: {
              moreAction: false,
              deleteConversation: false,
            },
          },
          chat: {
            header: {
              threadList: true,
              moreAction: true,
              clearMessage: true,
              deleteConversation: false,
              audioCall: false,
            },
            message: {
              status: false,
              reaction: true,
              thread: true,
              recall: true,
              translate: false,
              edit: false,
            },
            messageEditor: {
              mention: false,
              typing: false,
              record: true,
              emoji: false,
              moreAction: true,
              picture: true,
            },
          },
        }}
      >
        {/* <ChatApp></ChatApp> */}
      </UIKitProvider>

      {/* <UserPageLoding></UserPageLoding> */}
    </NodeContainerBox>
  );
}
