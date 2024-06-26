// @ts-nocheck
import { useEffect, useState, FC } from "react";
import "./index.css";
import { observer } from "mobx-react-lite";
import { Toaster } from "react-hot-toast";
import { rootStore, UIKitProvider, useClient } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";
import "./App.css";
import { store } from "../../store/store";
import listener from "../../UIKit/uikitListener";
import { useSelector } from "react-redux";
import i18next from "../../lang/i18n";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { updateAppConfig } from "../../store/appConfigSlice";
import { Outlet, useNavigate } from "react-router-dom";
import Login from "../../pages/login/login";
// import Dev from "../pages/dev";
import ChatApp from "../../pages/main/main";
import { loginWithToken } from "../../store/loginSlice";
// import AuthCheck from "./authCheck";
window.rootStore = rootStore;

const ChatAppContainer: FC<any> = () => {
  const navigate = useNavigate();

  const state = useAppSelector((state) => state.appConfig);
  const loginState = useAppSelector((state) => state.login);

  // useEffect(() => {
  //   dispatch(
  //     loginWithToken({
  //       userId: "YXA681QzsHqOTy2D8oNTfzc3CA",
  //       chatToken:
  //         "YWMtkdRc7CruEe-KxAdk3aAXKvNUM7B6jk8tg_KDU383NwilnqywKu0R77cPk_UZPaKEAwMAAAGQGvGfAQAAAABlVo4F4Zma8vInuYH25maPZZFGawlbcGy1xkR_ZoI6bw",
  //     })
  //   );
  // }, []);

  useEffect(() => {
    console.log(store, "store");

    listener(store);
  }, [loginState.appKey, loginState.useDNS]);

  useEffect(() => {
    console.log(loginState, "loginState");

    if (loginState.loggedIn) {
      navigate("/main");
    }
  }, [loginState.loggedIn]);

  const [config, setConfig] = useState({
    conversationList: {
      search: true,
      item: {
        moreAction: true,
        deleteConversation: true,
        presence: false,
      },
    },
    chat: {
      header: {
        threadList: state.thread,
        audioCall: true,
        videoCall: true,
      },
      message: {
        status: true,
        reaction: state.reaction,
        thread: state.thread,
        recall: false,
        translate: state.translation,
        edit: true,
        delete: true,
        report: true,
      },
      messageInput: {
        typing: state.typing,
      },
    },
  });

  const dispatch = useAppDispatch();
  useEffect(() => {
    const localGeneralConfig = localStorage.getItem("generalConfig");
    if (localGeneralConfig) {
      const config = JSON.parse(localGeneralConfig);
      dispatch(updateAppConfig(config));
      i18next.changeLanguage(config.language);
    }
  }, []);

  useEffect(() => {
    setConfig({
      conversationList: {
        search: true,
        item: {
          moreAction: true,
          deleteConversation: true,
          presence: false,
        },
      },

      chat: {
        header: {
          threadList: state.thread,
          audioCall: true,
          videoCall: true,
        },
        message: {
          status: true,
          reaction: state.reaction,
          thread: state.thread,
          recall: true,
          translate: state.translation,
          edit: true,
          delete: true,
          report: true,
        },
        messageInput: {
          typing: state.typing,
        },
      },
    });
  }, [state]);

  const serverConfig = JSON.parse(localStorage.getItem("serverConfig") || "{}");
  console.log("app", loginState.useDNS, serverConfig);
  return (
    <UIKitProvider
      initConfig={{
        appKey: "easemob#easeim",
        userId: "74faac750a", // 用户 ID
        token:
          "YWMtx_nRJirGEe-A1qnMI4bXYFzzvlQ7sUrSpVuQGlyIzFStWgQgJ7sR77xyqwfxYq6OAwMAAAGQGezc_jeeSACVU99JVB746VOVf5NS6ZWxV-OuEEqv0NRTq2NxfjsRlw",
        useUserInfo: true,
        translationTargetLanguage: window.navigator.language,
      }}
      features={config}
      theme={{
        primaryColor: state.color.h,
        mode: state.dark ? "dark" : "light",
        bubbleShape: state.theme == "classic" ? "square" : "ground",
        avatarShape: state.theme == "classic" ? "square" : "circle",
        componentsShape: state.theme == "classic" ? "square" : "ground",
      }}
      local={{
        lng: state.language || "zh",
      }}
    >
      {/* <AuthCheck>
      </AuthCheck> */}
      <ChatApp></ChatApp>
      <Toaster></Toaster>
    </UIKitProvider>
  );
};

export default observer(ChatAppContainer);
