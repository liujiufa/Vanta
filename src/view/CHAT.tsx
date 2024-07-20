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
import { ContainerBox, FlexCCBox, FlexSBCBox } from "../components/FlexBox";
import { contractAddress, isMain } from "../config";
import { throttle } from "lodash";
import { observer } from "mobx-react-lite";

import { addMessage, startWord } from "../utils/tool";
import PageLoding from "../components/PageLoding";
import UserPageLoding from "../components/UserPageLoding";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import {
  UIKitProvider,
  Chat,
  ConversationList,
  MessageList,
  TextMessage,
  ContactList,
  ContactDetail,
  Header,
  Icon,
  Modal,
  Input,
  rootStore,
} from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";
import ConversationListBox from "../components/ConversationListBox";
import ContactListBox from "../components/ContactListBox";

const ChatContainerBox = styled(ContainerBox)`
  width: 100%;
  height: calc(100vh - 56px);
  padding: 0px;
`;

const TabBox = styled(FlexSBCBox)`
  width: 100%;
  > div {
    flex: 1;
  }
`;
const TabItem = styled(FlexCCBox)`
  width: 100%;
  padding: 12px;
  .active {
    fill: #d56819;
  }
`;
function CHAT() {
  const { t, i18n } = useTranslation();
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const [userId, setUserId] = useState("");
  const [Timeout, setTimeout] = useState(0);
  const [TabActive, setTabActive] = useState(0);
  const [ConversationTabActive, setConversationTabActive] = useState(0);

  const qbToken = useSelector<stateType, stateType>(
    (state: any) => state?.qbToken
  );

  const chatConfig = isMain
    ? {
        appKey: "1100240607161186#vanta",
        userId: web3ModalAccount,
        token: qbToken,
        translationTargetLanguage: "zh-Hans", // 翻译功能的目标语言
        useUserInfo: true, // 是否使用用户属性功能展示头像昵称（UIKit 内部会获取用户属性，需要用户自己设置）
      }
    : {
        appKey: "1100240607161186#demo",
        userId: web3ModalAccount,
        token: qbToken,
        translationTargetLanguage: "zh-Hans", // 翻译功能的目标语言
        useUserInfo: true, // 是否使用用户属性功能展示头像昵称（UIKit 内部会获取用户属性，需要用户自己设置）
      };

  const Navigate = useNavigate();

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setUserId(e.target.value);
  };
  // 联系人跳转到聊天界面
  const ContactToConversation = () => {
    setTabActive(0);
    setConversationTabActive(1);
  };

  useEffect(() => {
    console.log(Timeout, "Timeout");
    setTimeout(new Date().valueOf());
  }, [i18n.language]);

  useEffect(() => {
    if (!web3ModalAccount && !qbToken) {
      Navigate("/View/");
      return addMessage(t("please login in again"));
    } else {
      // window.onload();
    }
  }, [web3ModalAccount, qbToken]);

  console.log(chatConfig, "chatConfig");

  return (
    <UIKitProvider
      initConfig={chatConfig}
      // 查看所有 UI 文本: https://github.com/easemob/Easemob-UIKit-web/tree/dev/local
      local={{
        lng: i18n.language === "zh" ? "zh" : "en",
      }}
      // key={Timeout}
      theme={{
        primaryColor: "#d56819",
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
          search: true,
          item: {
            moreAction: true,
            deleteConversation: true,
            presence: true,
          },
        },
        chat: {
          header: {
            threadList: true,
            moreAction: true,
            clearMessage: true,
            deleteConversation: true,
            audioCall: false,
          },
          message: {
            status: true,
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
      {!!qbToken && !!web3ModalAccount ? (
        <ChatContainerBox>
          <TabBox>
            <TabItem
              onClick={() => {
                setTabActive(0);
                setConversationTabActive(0);
              }}
            >
              <Icon
                type="BUBBLE_FILL"
                width={28}
                height={28}
                className={Number(TabActive) === 0 ? "active" : ""}
              ></Icon>
            </TabItem>
            <TabItem
              onClick={() => {
                setTabActive(1);
              }}
            >
              <Icon
                type="PERSON_DOUBLE_FILL"
                width={28}
                height={28}
                className={Number(TabActive) === 1 ? "active" : ""}
              ></Icon>
            </TabItem>
          </TabBox>

          {Number(TabActive) === 0 && (
            <ConversationListBox
              index={ConversationTabActive}
            ></ConversationListBox>
          )}

          {Number(TabActive) === 1 && (
            <ContactListBox
              fun={() => {
                ContactToConversation();
              }}
            ></ContactListBox>
          )}
        </ChatContainerBox>
      ) : (
        <PageLoding></PageLoding>
      )}
    </UIKitProvider>
  );
}

export default observer(CHAT);
