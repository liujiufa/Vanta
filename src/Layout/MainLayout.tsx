import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "antd";
import type { MenuProps } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
// import { useConnectWallet, injected, ChainId } from "../web3";
import {
  AddrHandle,
  addMessage,
  GetQueryString,
  showLoding,
  NumSplic,
  getFullNum,
  startWord,
  NumSplic1,
} from "../utils/tool";
import { Login, getUserInfo, isRefereeAddress } from "../API/index";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import { stateType } from "../store/reducer";
import { Contracts } from "../web3";
import { useThrottleFn } from "@umijs/hooks";
import { createLoginSuccessAction, savePriceAction } from "../store/actions";
import BigNumber from "big.js";
import copy from "copy-to-clipboard";
import logo from "../assets/image/logo.png";
import Lang from "../assets/image/layout/Lang.svg";
import HomeIcon from "../assets/image/layout/HomeIcon.svg";
import HomeActiveIcon from "../assets/image/layout/HomeActiveIcon.svg";
import PledgeIcon from "../assets/image/layout/PledgeIcon.svg";
import PledgeActiveIcon from "../assets/image/layout/PledgeActiveIcon.svg";
import NFTIcon from "../assets/image/layout/NFTIcon.svg";
import NFTActiveIcon from "../assets/image/layout/NFTActiveIcon.svg";
import ChatActiveIcon from "../assets/image/layout/ChatActiveIcon.svg";
import ChatIcon from "../assets/image/layout/ChatIcon.svg";

import walletIcon from "../assets/image/layout/walletIcon.svg";
import activeWalletIcon from "../assets/image/layout/activeWalletIcon.svg";
import closeIcon from "../assets/image/closeIcon.svg";

import "../assets/style/layout.scss";
import { Menu, Dropdown, Modal } from "antd";
import useConnectWallet from "../hooks/useConnectWallet";
import { contractAddress, LOCAL_KEY } from "../config";
import { useViewport } from "../components/viewportContext";
import Web3 from "web3";
import styled from "styled-components";
import { FlexBox, FlexCCBox, FlexSBCBox } from "../components/FlexBox";
import { useSign } from "../hooks/useSign";
import {
  BgIcon,
  MetaMaskIcon,
  OkxIcon,
  TpIcon,
} from "../assets/image/layoutBox";
const { Header, Content, Footer, Sider } = Layout;

let refereeUserAddress: any;
let langObj = { zh: "简", en: "EN", kr: "한국인" };

const LogoContainer = styled.img`
  width: 30px;
  height: 30px;
`;

const HeaderContainer = styled(Header)`
  background: rgba(16, 16, 16, 0.8);

  backdrop-filter: blur(10px);
  max-width: 450px;
  padding: 0;
  position: fixed;
  top: 0;
  z-index: 999999;
  width: 100%;
  height: 56px;
`;

const SetBox = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  .priceBox {
    font-family: "DIN";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    /* identical to box height */
    color: #4baf73;
    display: flex;
    align-items: center;
    margin-right: 20px;
  }

  .Connect {
    display: flex;
    align-items: center;
    padding: 8px 8.4px;
    line-height: 1.2;
    border-radius: 1000px;
    border: 1px solid #000;
    color: #fff;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.3px;
    text-transform: uppercase;
    margin-left: 20px;
    color: #4263eb;
    font-family: Manrope;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%;
    > img {
      margin-right: 5px;
    }
    /* 18px */
  }

  .activeConnect {
    border-radius: 5px;
    opacity: 1;

    box-sizing: border-box;
    border: 1px solid #d56819;

    box-shadow: 0px 3.39px 33.87px -17px #633800;
    font-family: "PingFang SC";
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;
  }
`;

const DropdownContainer = styled(Dropdown)`
  z-index: 999999999;
  margin-left: 12px;
  .LangDropDown {
    top: 56px !important;
  }
  > .ant-dropdown-menu {
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 0px 15px 0px rgba(66, 99, 235, 0.2);

    .activeLangItem {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: rgba(66, 99, 235, 0.11);
      min-height: 37px;
      white-space: nowrap;
      color: #000;
      font-family: Source Han Sans CN;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      letter-spacing: 0.112px;
    }

    .LangItem {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 37px;
      white-space: nowrap;
      color: #7681aa;
      font-family: Source Han Sans CN;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      letter-spacing: 0.112px;
    }
  }
  .Lang {
    display: flex;
    align-items: center;
    font-family: "DIN";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: rgba(0, 0, 0, 0.6);
    white-space: nowrap;
    > img {
      width: 24px;
      height: 24px;
    }
  }
`;

const MyLayout = styled(Layout)`
  position: relative;
`;

const Btn = styled(FlexCCBox)`
  padding: 10px;

  font-family: "Raleway";
  font-size: 14px;
  font-weight: bold;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-feature-settings: "kern" on;
  color: #333333;

  border-radius: 8px;
  background: #d56819;
  box-sizing: border-box;
  border: 0.39px solid #f58c00;
  box-shadow: 0px 3.85px 38.5px -17px #633800;
`;

const BuyBtn = styled(Btn)``;

const FooterContainer = styled.div`
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  padding: 18px 26px 24px;
  height: 83px;
  width: 100%;
  max-width: 450px;
  z-index: 999;
  background: #000000;
  .tabBox {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tabItem {
      > div {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .MenuItem {
        font-family: "PingFang SC";
        font-size: 12px;
        font-weight: normal;
        line-height: normal;
        text-transform: uppercase;
        letter-spacing: 0em;

        color: #999999;
        /* 18px */
      }

      .active {
        font-family: "PingFang SC";
        font-size: 12px;
        font-weight: normal;
        line-height: normal;
        text-transform: uppercase;
        letter-spacing: 0em;
        color: #d56819;

        /* 18px */
      }
    }
  }

  @media (max-width: 375px) {
    padding: 8px 24px 14px;
  }
`;

const AllModal = styled(Modal)`
  z-index: 10000;

  .ant-modal-content {
    overflow: hidden;
    border-radius: 10px;
    background: #101010;
    border: 1px solid rgba(213, 104, 25, 0.2);
    .ant-modal-body {
      border-radius: 20px;
      position: relative;
      min-height: 124px;
      padding: 24px 15px;
    }
  }
`;

const ModalContainer = styled(FlexBox)`
  /* position: relative; */
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ModalContainer_Close = styled(FlexCCBox)`
  position: absolute;
  z-index: 100;
  top: 10px;
  right: 10px;
  z-index: 100;
`;

export const ModalContainer_Title_Container = styled(FlexBox)`
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  > img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
`;

export const ModalContainer_Title = styled(FlexCCBox)`
  font-family: "PingFang SC";
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
`;

const ModalContainer_Content = styled.div`
  width: 100%;
  margin-top: 20px;
  font-family: "PingFang SC";
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  padding: 15px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  > input {
    margin: 7px 0px 15px;
    width: 100%;

    box-sizing: border-box;
    border: 1px solid rgba(213, 104, 25, 0.2);
    text-align: left;

    font-family: "PingFang SC";
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0px;

    font-variation-settings: "opsz" auto;
    color: #999999;

    border-radius: 8px;
    padding: 8px 11px;
    background: #ffffff;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const UpBtn = styled(BuyBtn)`
  width: 100%;
  /* margin-top: 27px; */
`;

const HomeContainerBox_Content_Bg3 = styled.div`
  position: absolute;
  bottom: -15px;
  right: -101px;
  width: 261px;
  height: 261px;
  flex-shrink: 0;
  border-radius: 261px;
  opacity: 0.4;
  background: linear-gradient(
    131deg,
    rgba(113, 112, 242, 0.4) 35.38%,
    rgba(152, 102, 234, 0.4) 85.25%
  );
  filter: blur(99.5px);
  z-index: -1;
  z-index: -1;
  z-index: -1;
`;

const WalletItem = styled(FlexCCBox)`
  width: 100%;
  padding: 12px;
  border: 1px solid #f7e1d1;
  border-radius: 5px;
  box-shadow: 0px 3.55px 35.49px -17px #633800;
  margin-bottom: 15px;
  font-family: PingFang SC;
  font-size: 17.14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  > svg {
    margin-right: 5px;
  }
  &:last-child {
    margin-bottom: 0px;
  }
`;

const MainLayout: React.FC = () => {
  const web3 = new Web3();
  let dispatch = useDispatch();
  let token = useSelector<any>((state) => state.token);
  let address = useSelector<any>((state) => state.address);
  let { t, i18n } = useTranslation();
  let [ItemActive, setItemActive] = useState("/");
  const [InputValue, setInputValue] = useState<any>("");
  const Navigate = useNavigate();
  const { connectWallet } = useConnectWallet();
  const web3React = useWeb3React();
  const { width } = useViewport();
  const [BindModal, setBindModal] = useState(false);
  const [SelectWallet, setSelectWallet] = useState(false);
  const { signFun } = useSign();

  useEffect(() => {
    connectWallet && connectWallet();
  }, [connectWallet]);

  let tag = web3.utils.isAddress(window.location.pathname.slice(1));
  if (tag) {
    refereeUserAddress = window.location.pathname.slice(1);
  } else {
    refereeUserAddress = "";
  }
  function changeLanguage(lang: any) {
    window.localStorage.setItem(LOCAL_KEY, lang.key);
    i18n.changeLanguage(lang.key);
  }

  const langArr = [
    { key: "zh", label: "简体中文" },
    // { key: "en", label: "English" },
    // { key: "ja", label: "JA 日本語" },
    // { key: "ko", label: "KO 한국어" },
    // { key: "vi", label: "VI Tiếng" },
    // { key: "th", label: "TH ภาษาไทย" },
  ];

  const item = langArr.map((item: any) => {
    return {
      label: (
        <div
          className={
            String(i18n.language) === String(item?.key)
              ? "activeLangItem"
              : "LangItem"
          }
        >
          {item?.label}
        </div>
      ),
      key: item?.key,
    };
  });

  const menu = <Menu onClick={changeLanguage} items={item} />;

  const location = useLocation();
  const pathname = startWord(location.pathname);

  const inputFun = (e: any) => {
    // let value = e.target.value
    // let value = e.target.value.replace(/^[^1-9]+|[^0-9]/g, '')
    let str = e.target.value.trim();
    setInputValue(str);
  };

  const headerIconObj: any = {
    "/": {
      Icon: HomeIcon,
      activeIcon: HomeActiveIcon,
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/PLEDGE": {
      Icon: PledgeIcon,
      activeIcon: PledgeActiveIcon,
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/NFT": {
      Icon: NFTIcon,
      activeIcon: NFTActiveIcon,
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/CHAT": {
      Icon: ChatIcon,
      activeIcon: ChatActiveIcon,
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
  };

  // 导航
  const navigateFun = (path: string) => {
    Navigate("/View" + path);
  };

  function menuActive(path: string) {
    if (
      ItemActive === path ||
      (path === "/" && String(ItemActive) === "/HomeBuy")
    ) {
      return headerIconObj[path]?.menuActive;
    } else {
      return headerIconObj[path]?.menu;
    }
  }

  function iconActive(path: string) {
    if (
      ItemActive === path ||
      (path === "/" && String(ItemActive) === "/HomeBuy")
    ) {
      return headerIconObj[path]?.activeIcon;
    } else {
      return headerIconObj[path]?.Icon;
    }
  }

  const LoginFun = useCallback(async () => {
    if (web3React.account) {
      let tag = await web3.utils.isAddress(window.location.pathname.slice(1));
      if (tag) {
        refereeUserAddress = window.location.pathname.slice(1);
      } else {
        refereeUserAddress = "";
      }
      console.log(1);
      await signFun((res: any) => {
        Login({
          ...res,
          userAddress: web3React.account as string,
          refereeUserAddress,
        }).then((res: any) => {
          if (res.code === 200) {
            showLoding(false);
            setSelectWallet(false);
            dispatch(
              createLoginSuccessAction(
                res.data.token,
                web3React.account as string
              )
            );
          } else {
            showLoding(false);
            addMessage(res.msg);
          }
        });
      }, `userAddress=${web3React.account as string}&refereeUserAddress=${refereeUserAddress}`);
    } else {
      addMessage("Please link wallet");
    }
  }, [web3React.account, refereeUserAddress]);

  const BindFun = useCallback(async () => {
    if (web3React.account) {
      let tag = await web3.utils.isAddress(InputValue);
      if (!tag) return addMessage("请输入正确的钱包地址");
      let res: any = await isRefereeAddress({ userAddress: InputValue });
      if (!(res?.code === 200)) return addMessage(res.msg);
      let isSuccessBind: any;
      try {
        showLoding(true);
        console.log("isSuccessBind", "isSuccessBind");
        isSuccessBind = await Contracts.example?.bind(
          web3React.account as string,
          InputValue as string
        );
      } catch (error: any) {
        addMessage("失败");
      }
      showLoding(false);
      if (!!isSuccessBind?.status) {
        setBindModal(false);
        return addMessage("绑定成功");
      } else {
        addMessage("失败");
      }
    } else {
      addMessage("Please link wallet");
    }
  }, [web3React.account, InputValue]);

  const ConnectWalletFun = async (type: 1) => {
    await LoginFun();
  };

  useEffect(() => {
    if (!web3React?.account) return;
    Contracts.example
      .isBind(web3React?.account as string, "Referrer")
      .then((res: any) => {
        if (res) {
          setBindModal(false);
        } else {
          setBindModal(true);
        }
      });
  }, [web3React?.account, BindModal]);

  useEffect(() => {
    console.log(pathname, location.pathname, "pathname");
    if (pathname) {
      setItemActive(pathname);
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, [pathname]);

  useEffect(() => {
    if (!!refereeUserAddress) {
      setInputValue(refereeUserAddress);
    }
  }, [refereeUserAddress]);

  return (
    <MyLayout>
      {/* <BgBox2></BgBox2> */}
      <HeaderContainer>
        <div className="HeaderNav">
          <LogoContainer
            onClick={() => {
              Navigate("/View/");
            }}
          ></LogoContainer>

          <SetBox>
            {address ? (
              <>
                <div className="Connect  pointer activeConnect">
                  <img src={activeWalletIcon} alt="" />{" "}
                  {AddrHandle(address as string, 6, 4)}
                </div>
              </>
            ) : (
              // <>
              //   <img
              //     src={walletIcon}
              //     onClick={() => {
              //       connectWallet && connectWallet();
              //     }}
              //   />
              // </>
              <div
                className="Connect  pointer activeConnect"
                onClick={() => {
                  setSelectWallet(true);
                }}
              >
                Connect Wallet
              </div>
            )}

            <DropdownContainer
              overlay={menu}
              placement="bottomCenter"
              overlayClassName="LangDropDown"
              trigger={["click"]}
              getPopupContainer={(triggerNode) => triggerNode}
              overlayStyle={{ zIndex: "999" }}
              // arrow={true}
            >
              <div className="Lang">
                <img style={{ width: "24px" }} src={Lang} alt="" />
              </div>
            </DropdownContainer>
          </SetBox>
        </div>
      </HeaderContainer>
      <Content
        className="MainContent"
        style={{ position: "relative", zIndex: 99 }}
      >
        <Outlet />
        {/* {!collapsed && <div className="Mask"></div>}setBindModal */}
      </Content>

      <FooterContainer
        className="app-footer"
        style={{ position: "fixed", bottom: 0 }}
      >
        <div className="tabBox">
          <div
            className="tabItem"
            onClick={() => {
              navigateFun("/");
            }}
          >
            <div className={menuActive("/")}>
              <div className="menuTop">
                <img src={iconActive("/")} alt="" />
              </div>
              {t("HOME")}
            </div>
          </div>
          <div
            className="tabItem"
            onClick={() => {
              // return addMessage(t("Open soon"));
              navigateFun("/PLEDGE");
            }}
          >
            <div className={menuActive("/PLEDGE")}>
              <div className="menuTop">
                <img src={iconActive("/PLEDGE")} alt="" />
              </div>
              {t("PLEDGE")}
            </div>
          </div>
          <div
            className="tabItem"
            onClick={() => {
              // return addMessage(t("Open soon"));
              navigateFun("/NFT");
            }}
          >
            <div className={menuActive("/NFT")}>
              <div className="menuTop">
                <img src={iconActive("/NFT")} alt="" />
              </div>
              {t("NFT")}
            </div>
          </div>
          <div
            className="tabItem"
            onClick={() => {
              // return addMessage(t("Open soon"));
              navigateFun("/CHAT");
            }}
          >
            <div className={menuActive("/CHAT")}>
              <div className="menuTop">
                <img src={iconActive("/CHAT")} alt="" />
              </div>
              {t("CHAT")}
            </div>
          </div>
        </div>
      </FooterContainer>
      <AllModal
        visible={BindModal}
        className="Modal"
        centered
        width={"345px"}
        closable={false}
        footer={null}
        onCancel={() => {
          setBindModal(false);
        }}
      >
        <ModalContainer>
          <HomeContainerBox_Content_Bg3></HomeContainerBox_Content_Bg3>

          <ModalContainer_Close>
            {" "}
            <img
              src={closeIcon}
              alt=""
              onClick={() => {
                setBindModal(false);
              }}
            />
          </ModalContainer_Close>
          <ModalContainer_Title_Container>
            <img src={logo} alt="" />
            <ModalContainer_Title>
              {t("Binding relationship")}
            </ModalContainer_Title>
          </ModalContainer_Title_Container>
          <ModalContainer_Content>
            Please confirm your superior address, enter and bind
            <input
              value={InputValue}
              type="text"
              placeholder="请输入上级地址"
              onChange={inputFun}
            />
            <UpBtn
              onClick={() => {
                BindFun();
              }}
            >
              {t("Sure")}
            </UpBtn>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>
      <AllModal
        visible={SelectWallet}
        className="Modal"
        centered
        width={"345px"}
        closable={false}
        footer={null}
        onCancel={() => {
          setSelectWallet(false);
        }}
      >
        <ModalContainer>
          <HomeContainerBox_Content_Bg3></HomeContainerBox_Content_Bg3>

          <ModalContainer_Close>
            {" "}
            <img
              src={closeIcon}
              alt=""
              onClick={() => {
                setSelectWallet(false);
              }}
            />
          </ModalContainer_Close>
          <ModalContainer_Content>
            <WalletItem
              onClick={() => {
                ConnectWalletFun(1);
              }}
            >
              <MetaMaskIcon />
              MetaMask
            </WalletItem>
            <WalletItem>
              <OkxIcon />
              OKX
            </WalletItem>
            <WalletItem>
              <BgIcon />
              Bitget Wallet
            </WalletItem>
            <WalletItem>
              <TpIcon />
              TP wallet
            </WalletItem>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>
    </MyLayout>
  );
};
export default MainLayout;
