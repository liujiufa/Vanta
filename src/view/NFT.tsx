// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  getFirstRoundAccountInfo,
  getLpBase,
  getLpUserInfo,
  getMyCardInfo,
  getPioneerInfo,
  getPledgeUserInfo,
  getSubscriptionAccountInfo,
  getUserInfo,
  joinUnlockNftAwardPledge,
  redemptionLp,
  userInfo,
} from "../API/index";
import "../assets/style/Home.scss";
import NoData from "../components/NoData";
import Table from "../components/Table";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { stateType } from "../store/reducer";
import styled, { keyframes } from "styled-components";
import { useViewport } from "../components/viewportContext";
import {
  AddrHandle,
  EthertoWei,
  NumSplic,
  addMessage,
  dateFormat,
  decimalNum,
  showLoding,
} from "../utils/tool";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ContainerBox,
  FlexBox,
  FlexCCBox,
  FlexECBox,
  FlexSACBox,
  FlexSBCBox,
  FlexSCBox,
} from "../components/FlexBox";
import { Carousel, Dropdown, Menu, Modal, Tooltip } from "antd";
import { useGetReward } from "../hooks/useGetReward";
import { Contracts } from "../web3";
import logo from "../assets/image/logo.png";
import {
  ModalContainer_Title,
  ModalContainer_Title_Container,
} from "../Layout/MainLayout";
import closeIcon from "../assets/image/closeIcon.svg";
import {
  LPPledgeIcon,
  NFTIcon,
  NFTImg,
  PledgeLPIcon,
  SubscriptionRewardsIcon,
} from "../assets/image/NFTBox";
import { NodeInfo_Mid_Conditions } from "./SubscriptionNode";
import { ErrorIcon, YesIcon } from "../assets/image/SubscriptionBox";
import { HelpIconAuto, NodeInfo_Top_Rule } from "./Insurance";
import {
  ParticipateGameIcon,
  SmallOutLinkIcon,
  StakingMiningIcon,
} from "../assets/image/homeBox";
import { DropDownIcon } from "../assets/image/commonBox";
import useUSDTGroup from "../hooks/useUSDTGroup";
import { contractAddress } from "../config";
import errorIcon from "../assets/image/Subscription/errorIcon.svg";
import yesIcon from "../assets/image/Subscription/yesIcon.svg";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useInputValue } from "../hooks/useInputValue";
const NodeContainerBox = styled(ContainerBox)`
  width: 100%;
`;

const NodeInfo = styled.div`
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(213, 104, 25, 0.2);
  margin-bottom: 15px;
`;

const NodeInfo_Top = styled(FlexBox)`
  width: 100%;
  position: relative;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
`;

const Active_NodeInfo_Top = styled(NodeInfo_Top)`
  padding: 4px;
`;
const NodeInfo_Top_NFT_Pioneer = styled(NodeInfo_Top)`
  border: none;
`;

const NodeInfo_Top_Tip = styled.div`
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #d56819;
  margin: 20px 0px 24px;
`;

const NodeInfo_Top_Tip_NodeInfo_Top_LotteryGame = styled(NodeInfo_Top_Tip)`
  margin: 0px;
`;

export const Btn = styled(FlexCCBox)`
  padding: 10px 15px;
  font-family: "PingFang SC";
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;
  border-radius: 10px;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  background: #d56819;
`;

const NodeInfo_Top_Btn = styled(Btn)`
  width: fit-content;
  margin: auto;
`;

const NodeInfo_Bottom = styled.div`
  padding: 15px;
  > div {
    margin-bottom: 13px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
`;
const NodeInfo_Bottom_NFT = styled(NodeInfo_Bottom)`
  width: 100%;
  padding: 15px;
  border-top: 1px solid rgba(213, 104, 25, 0.2);
`;
const NodeInfo_Bottom_Subscription_Rewards = styled(NodeInfo_Bottom)`
  width: 100%;
  padding: 0px 15px 15px;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  > div {
    &:first-child {
      margin-top: 15px;
    }
  }
`;
const NodeInfo_Bottom_Subscription_Rewards1 = styled(
  NodeInfo_Bottom_Subscription_Rewards
)`
  padding-top: 10px;
  border-top: 1px solid rgba(213, 104, 25, 0.2);
`;

const NodeInfo_Bottom_Item = styled(FlexSBCBox)`
  width: 100%;
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: rgba(255, 255, 255, 0.8);
  > span {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    text-transform: uppercase;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;
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

const Staking_Mining_Modal = styled(AllModal)`
  .ant-modal-content {
    .ant-modal-body {
      padding: 24px 0px;
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
const Staking_Mining_Modal_ModalContainer = styled(ModalContainer)`
  padding: 0px 15px;
`;

const ModalContainer_Close = styled(FlexCCBox)`
  position: absolute;
  z-index: 100;
  top: 10px;
  right: 10px;
`;

const ModalContainer_Content = styled.div`
  width: 100%;
  margin-top: 20px;
  font-family: "PingFang SC";
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;

  display: flex;
  flex-direction: column;
  align-items: center;
  > span {
    font-family: "PingFang SC";
    font-size: 18px;
    font-weight: normal;
    line-height: normal;
    text-transform: uppercase;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;
    margin: 5px 0px 20px;
  }
`;

const UpBtn = styled(Btn)`
  width: 100%;
  font-family: "Raleway";
  font-size: 14px;
  font-weight: bold;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-feature-settings: "kern" on;
  color: #ffffff;
  margin-top: 15px;
`;

const BalanceBox = styled(FlexBox)`
  flex: 1;
  white-space: nowrap;
  width: 100%;
  align-items: center;
  font-family: PingFang SC;
  font-size: 10px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #999999;
  margin-top: 5px;
  > span {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    text-transform: uppercase;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;
    margin: 0px 5px;
  }
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
`;

const ModalContainer_SubTitle = styled.div`
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  max-width: 182px;
  margin: 15px 0px;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
`;

const ModalContainer_Title_Container_Box = styled(FlexSCBox)`
  width: 100%;
`;

const ModalContainer_Title_Container_Box_Left = styled.div`
  width: 100%;
  padding: 8px;
`;
const NFTContainer = styled(FlexCCBox)`
  width: 100%;
  max-width: 91px;
  > img {
    width: 100%;
    object-fit: contain;
  }
`;

const Active_NodeInfo_BtnBox = styled(FlexSBCBox)`
  width: 100%;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    flex: 1;

    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    text-transform: uppercase;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;
    &:last-child {
      color: #f7e1d1;
      border-left: 1px solid rgba(213, 104, 25, 0.2);
    }
  }
`;

const Purchase_Lottery_Entry = styled.div`
  width: 100%;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  margin-top: 15px;
`;

const Purchase_Lottery_Entry_Content = styled(FlexSBCBox)`
  margin-top: 10px;
  width: 100%;
  > div {
    width: 32%;
  }
`;

const Purchase_Lottery_Entry_Item = styled(FlexCCBox)`
  border-radius: 5px;
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid rgba(213, 104, 25, 0.6);
  font-family: PingFang SC;
  font-size: 10px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  text-align: center;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
`;

const BtnBox = styled(FlexSBCBox)`
  border-top: 1px solid rgba(213, 104, 25, 0.2);
  width: 100%;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    text-transform: uppercase;
    letter-spacing: 0em;
    padding: 12px;
    font-variation-settings: "opsz" auto;
    color: #d56819;
    border-right: 1px solid rgba(213, 104, 25, 0.2);
    &:last-child {
      color: #f7e1d1;
      border-right: none;
    }
  }
`;

const To_Be_Collected = styled(FlexSBCBox)`
  padding: 15px;
  border-top: 1px solid rgba(213, 104, 25, 0.2);
  width: 100%;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  > div {
    font-family: PingFang SC;
    font-size: 18px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;
    > span {
      margin-left: 5px;
      font-family: PingFang SC;
      font-size: 10px;
      font-weight: normal;
      line-height: normal;
      text-transform: uppercase;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
  }
`;

const NodeInfo_Top_LotteryGame = styled(NodeInfo_Top)`
  width: 100%;
  padding: 0;
  border: none;
  > div {
    padding: 15px;
  }
`;

const ModalContainer_Title_Container_Participate = styled(
  ModalContainer_Title_Container
)`
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
`;

const NodeInfo_Top_LotteryGame_Info = styled.div`
  width: 100%;
`;

const FinancialRecords = styled(FlexECBox)`
  flex: 1;
  font-family: "PingFang SC";
  font-size: 10px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #999999;
`;

const SmallOutLinkIconBox = styled(SmallOutLinkIcon)`
  margin-left: 5px;
`;

const InputBox = styled(FlexSBCBox)`
  width: 100%;
  border-radius: 8px;
  background: #ffffff;

  box-sizing: content-box;
  /* border: 1px solid rgba(213, 104, 25, 0.2); */
  margin: 5px 0px;
  > div {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:first-child {
      flex: 1;
      box-sizing: content-box;

      padding: 9px 13px;
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: normal;
      line-height: normal;
      text-transform: uppercase;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: #999999;
      > input {
        width: 100%;
        border: none;
        background: transparent;
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: normal;
        line-height: normal;
        text-transform: capitalize;
        letter-spacing: 0em;

        font-variation-settings: "opsz" auto;
        color: rgba(51, 51, 51, 0.8);
      }
    }
    &:last-child {
      border-radius: 0px 8px 8px 0px;
      height: 100%;
      width: fit-content;

      padding: 10px 9px;
      background: rgba(213, 104, 25, 0.2);

      box-sizing: border-box;
      border: 1px solid rgba(213, 104, 25, 0.2);
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: normal;
      line-height: normal;
      text-transform: uppercase;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: #d56819;
    }
  }
`;

const InputBox_Item = styled.div`
  width: 100%;
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;

  > div {
    margin-top: 5px;
  }
`;
const InputBox_Item_Last = styled(InputBox_Item)`
  margin-top: 15px;
`;
const InputBox_Item_First = styled(InputBox_Item)`
  > div {
    > div {
      &:last-child {
        background: transparent;
        border: none;
        width: 40px;
      }
    }
  }
`;
const Staking_Mining_Container = styled.div`
  width: 100%;
  > div {
    width: 100%;
    margin-top: 15px;
    &:first-child {
      margin-top: 0px;
    }
  }
`;
const NodeInfo_Top_Rule_Staking_Mining = styled(NodeInfo_Top_Rule)`
  width: 100%;
  position: relative;
  top: 0px;
  right: 0px;
`;

const Staking_Mining_Modal_Bottom = styled.div`
  width: 100%;
  padding: 10px 15px;
  border-top: 1px solid rgba(213, 104, 25, 0.2);
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
  margin-top: 10px;
`;
const Released_For_Claim = styled(FlexSBCBox)`
  width: 100%;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;

  > div {
    display: flex;
    align-items: center;
    font-family: PingFang SC;
    font-size: 18px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;
    > span {
      margin-left: 5px;
      font-family: PingFang SC;
      font-size: 10px;
      font-weight: normal;
      line-height: normal;
      text-transform: uppercase;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
  }
`;

const UpBtn_Container = styled.div`
  width: 100%;
  padding: 0 15px;
`;

export default function Rank() {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const state = useSelector<stateType, stateType>((state) => state);
  const [UserInfo, setUserInfo] = useState<any>({});
  const [MyCardInfo, setMyCardInfo] = useState<any>({});
  const [PioneerInfo, setPioneerInfo] = useState<any>({});
  const [LpUserInfo, setLpUserInfo] = useState<any>({});
  const [FirstRoundAccountInfo, setFirstRoundAccountInfo] = useState<any>({});
  const [SubscriptionAccountInfo, setSubscriptionAccountInfo] = useState<any>(
    {}
  );

  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Days, setDays] = useState<any>(28);
  const [InputValueAmount, setInputValueAmount] = useState<any>("");
  const [PledgeNFTModal, setPledgeNFTModal] = useState(false);
  const [ActiveNFTModal, setActiveNFTModal] = useState(false);
  const [isDropDownShow, setIsDropDownShow] = useState(false);
  const [PledgeLPModal, setPledgeLPModal] = useState(false);
  const [PledgeUserInfo, setPledgeUserInfo] = useState<any>({});
  const [LpBase, setLpBase] = useState<any>([]);

  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.nftContract, "MBK");
  const {
    TOKENBalance: MBK_USDT_TOKENBalance,
    TOKENAllowance: MBK_USDT_TOKENAllowance,
    handleApprove: MBK_USDT_handleApprove,
    handleTransaction: MBK_USDT_handleTransaction,
    handleUSDTRefresh: MBK_USDT_handleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.lpContract, "MBK_USDT");
  const changeTime = (item: any) => {
    setDays(item?.key);
  };

  const {
    Price,
    InputValueAmountValue,
    InputValueAmount: PledgeNFTInputValueAmount,
    MaxFun,
    InputValueFun: PledgeNFTInputValueFun,
  } = useInputValue();

  const items = [
    // { key: "20", label: <div>20DAY</div> },
    { key: "28", label: <div>{t("48", { num: 28 })}</div> },
    { key: "56", label: <div>{t("48", { num: 56 })}</div> },
    { key: "84", label: <div>{t("48", { num: 84 })}</div> },
  ];
  const menu = <Menu onClick={changeTime} items={items} />;

  const getInitData = () => {
    getUserInfo().then((res: any) => {
      if (res.code === 200) {
        setUserInfo(res?.data);
      }
    });
    getLpBase().then((res: any) => {
      if (res.code === 200) {
        setLpBase(res?.data);
      }
    });
    getPledgeUserInfo().then((res: any) => {
      if (res.code === 200) {
        setPledgeUserInfo(res?.data);
      }
    });
    getMyCardInfo().then((res: any) => {
      if (res.code === 200) {
        setMyCardInfo(res?.data);
      }
    });
    getPioneerInfo().then((res: any) => {
      if (res.code === 200) {
        setPioneerInfo(res?.data);
      }
    });
    getLpUserInfo().then((res: any) => {
      if (res.code === 200) {
        setLpUserInfo(res?.data);
      }
    });
    getFirstRoundAccountInfo().then((res: any) => {
      if (res.code === 200) {
        setFirstRoundAccountInfo(res?.data);
      }
    });
    getSubscriptionAccountInfo().then((res: any) => {
      if (res.code === 200) {
        setSubscriptionAccountInfo(res?.data);
      }
    });
  };

  const activeFun = (value: string, tokenId: number) => {
    if (Number(value) <= 0) return;
    handleTransaction(value, async (call: any) => {
      let res: any;
      try {
        showLoding(true);
        res = await Contracts.example?.active(
          web3ModalAccount as string,
          tokenId
        );
      } catch (error: any) {
        showLoding(false);
        return addMessage(t("69"));
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        setActiveNFTModal(false);
        getInitData();
        addMessage(t("70"));
      } else {
        addMessage(t("69"));
      }
    });
  };

  const stakeLPFun = (value: string, period: number) => {
    if (Number(value) <= 0) return;
    if (!UserInfo?.isNft && UserInfo?.teamLevel <= 5)
      return addMessage(t("365"));
    MBK_USDT_handleTransaction(value, async (call: any) => {
      let res: any;
      try {
        showLoding(true);
        res = await Contracts.example?.stakeLP(
          web3ModalAccount as string,
          value,
          period
        );
      } catch (error: any) {
        showLoding(false);
        return addMessage(t("71"));
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        setPledgeLPModal(false);
        addMessage(t("72"));
      } else {
        addMessage(t("71"));
      }
    });
  };

  const unStakeLPFun = async (value: number) => {
    // if (!NodeBaseInfo?.isCommunityNftNum || !NodeBaseInfo?.isHoldNft)
    //   return addMessage("未满足认购条件");
    if (Number(value) <= 0) return;
    if (!state.token) return;

    let res: any;
    try {
      showLoding(true);
      let item: any = await redemptionLp({});
      if (item?.code === 200 && item?.data) {
        console.log(item?.data, "1212");
        res = await Contracts.example?.unStake(
          web3ModalAccount as string,
          item?.data
        );
      }
    } catch (error: any) {
      showLoding(false);
      return addMessage(t("73"));
    }

    showLoding(false);
    if (!!res?.status) {
      Navigate("/View/Node");
      addMessage(t("74"));
    } else {
      addMessage(t("73"));
    }
  };

  // 账户类型 1机器人-管理奖账户 2机器人-业绩奖励账户
  // * 3-质押奖励账户 4-质押赎回账户 5-质押管理奖励账户 6质押业绩账户
  // * 7NFT-分红账户 8NFT-先峰账户 9NFT-认购奖励 10NFT-首轮在认购奖励 11LP分红账户
  // * 12-社区奖励账户
  // * 13-游戏账户
  // * 14-零撸账户
  // * 15-节点奖励账户
  // * 16-保险池赔付账户
  const getRewardFun = async (value: any, type: any) => {
    console.log(value, "value");

    if (Number(value) <= 0)
      return addMessage(Number(type) === 10 ? t("378") : t("27"));
    await getReward(
      type,
      () => {
        getInitData();
      },
      "awardPoolContract"
    );
  };

  const InputValueFun = async (e: any) => {
    let value = e.target.value.replace(/^[^1-9]+|[^0-9]/g, "");
    setInputValueAmount(value);
  };

  const pledgeFun = (value: string = "20") => {
    if (Number(value) < 20 || Number(value) % 20 !== 0)
      return addMessage(t("22"));
    if (Number(PledgeUserInfo?.lastPledgeNum) > Number(value))
      return addMessage(t("23"));
    if (
      Number(value) * Number(Price) +
        Number(PledgeUserInfo?.totalPledgeAmount) >
      Number(PledgeUserInfo?.robotAmount)
    )
      return addMessage(t("24"));

    handleTransaction(value, async (call: any) => {
      let res: any;
      try {
        showLoding(true);

        let item: any = await joinUnlockNftAwardPledge({
          num: value,
        });
        if (item?.code === 200 && item?.data) {
          res = await Contracts.example?.stake(
            web3ModalAccount as string,
            item?.data
          );
        } else {
          showLoding(false);
          return addMessage(res?.msg);
        }
      } catch (error: any) {
        showLoding(false);
        return addMessage(t("361"));
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        setPledgeNFTModal(false);
        addMessage(t("360"));
      } else {
        addMessage(t("361"));
      }
    });
  };

  useEffect(() => {
    if (state.token) {
      getInitData();
    }
  }, [state.token]);

  const NFTBox = (isHoldNft: boolean, isLockNft: boolean) => {
    if (!!isLockNft) {
      return (
        <>
          {" "}
          <NodeInfo>
            <Active_NodeInfo_Top>
              <ModalContainer_Title_Container_Box>
                <ModalContainer_Title_Container_Box_Left>
                  <ModalContainer_Title_Container>
                    <img src={NFTIcon} />
                    <ModalContainer_Title>{t("75")} </ModalContainer_Title>
                  </ModalContainer_Title_Container>
                  <ModalContainer_SubTitle>
                    {t("102")}:{MyCardInfo?.amount ?? 0}
                  </ModalContainer_SubTitle>
                </ModalContainer_Title_Container_Box_Left>
                <NFTContainer>
                  <img src={NFTImg} alt="" />
                </NFTContainer>
              </ModalContainer_Title_Container_Box>
            </Active_NodeInfo_Top>

            <Active_NodeInfo_BtnBox>
              <div
                onClick={() => {
                  getRewardFun(MyCardInfo?.amount ?? 0, 7);
                }}
              >
                {t("103")}
              </div>
              <div
                onClick={() => {
                  Navigate("/View/NFTAwardRecord", {
                    state: { recordType: 1 },
                  });
                }}
              >
                {t("98")}
              </div>
            </Active_NodeInfo_BtnBox>
            <NodeInfo_Bottom_NFT>
              <NodeInfo_Bottom_Item>
                {t("78")}
                <span>{MyCardInfo?.poolNum ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                {t("79")}
                <span>{MyCardInfo?.myLpNum ?? 0} LP</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                {t("80")}
                <span>{MyCardInfo?.communityPerformance ?? 0} USDT</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                {t("81")}
                <span>{MyCardInfo?.totalAmount ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
            </NodeInfo_Bottom_NFT>
          </NodeInfo>
          {!!PioneerInfo?.isHoldNft && !!PioneerInfo?.isSatisfyNftCommunity ? (
            <NodeInfo>
              <NodeInfo_Top_LotteryGame>
                <ModalContainer_Title_Container_Participate>
                  <img src={MyCardInfo?.imgUrl ?? ParticipateGameIcon} />
                  <ModalContainer_Title>{t("104")}</ModalContainer_Title>
                  <FinancialRecords
                    onClick={() => {
                      Navigate("/View/Announcement", {
                        state: { recordType: 2 },
                      });
                    }}
                  >
                    {t("131")} <SmallOutLinkIconBox />
                  </FinancialRecords>
                </ModalContainer_Title_Container_Participate>
                <NodeInfo_Bottom_NFT>
                  <NodeInfo_Bottom_Item>
                    {t("132")}
                    <span>
                      {PioneerInfo?.thisMonthAddPerformance ?? 0} USDT
                    </span>
                  </NodeInfo_Bottom_Item>
                  <NodeInfo_Bottom_Item>
                    {t("133")}
                    <span>{PioneerInfo?.totalAmount ?? 0} MBK</span>
                  </NodeInfo_Bottom_Item>
                </NodeInfo_Bottom_NFT>
                <To_Be_Collected>
                  {t("102")}
                  <div>
                    {PioneerInfo?.amount ?? 0} <span>MBK</span>
                  </div>
                </To_Be_Collected>
              </NodeInfo_Top_LotteryGame>
              <BtnBox>
                <div
                  onClick={() => {
                    getRewardFun(PioneerInfo?.amount ?? 0 ?? 0, 8);
                  }}
                >
                  {t("103")}
                </div>
                <div
                  onClick={() => {
                    Navigate("/View/SubscriptionQuotaAwardRecord", {
                      state: { type: 3 },
                    });
                  }}
                >
                  {t("98")}
                </div>
              </BtnBox>
            </NodeInfo>
          ) : (
            <NodeInfo>
              <NodeInfo_Top_LotteryGame>
                <ModalContainer_Title_Container>
                  <img src={MyCardInfo?.imgUrl ?? ParticipateGameIcon} />
                  <ModalContainer_Title>{t("104")}</ModalContainer_Title>
                </ModalContainer_Title_Container>
                <NodeInfo_Top_Tip_NodeInfo_Top_LotteryGame>
                  {t("105")}
                </NodeInfo_Top_Tip_NodeInfo_Top_LotteryGame>
                <NodeInfo_Mid_Conditions>
                  {t("106")}
                  <div>
                    <img
                      src={!!PioneerInfo?.isHoldNft ? yesIcon : errorIcon}
                      alt=""
                    />
                    {t("107")}
                  </div>
                  <div>
                    <img
                      src={
                        !!PioneerInfo?.isSatisfyNftCommunity
                          ? yesIcon
                          : errorIcon
                      }
                      alt=""
                    />
                    {t("108")}
                  </div>
                </NodeInfo_Mid_Conditions>
              </NodeInfo_Top_LotteryGame>
            </NodeInfo>
          )}
          <NodeInfo>
            <NodeInfo_Top>
              <NodeInfo_Top_Rule>
                <HelpIconAuto /> {t("12")}
              </NodeInfo_Top_Rule>
              <ModalContainer_Title_Container>
                <img src={LPPledgeIcon} />
                <ModalContainer_Title>{t("109")}</ModalContainer_Title>
              </ModalContainer_Title_Container>

              <Purchase_Lottery_Entry>
                {t("110")}
                <Purchase_Lottery_Entry_Content>
                  {LpBase?.map((item: any) => (
                    <Purchase_Lottery_Entry_Item>
                      {t("48", { num: item?.cycle })} {item?.pledgeNum}LP
                    </Purchase_Lottery_Entry_Item>
                  ))}
                  {/* <Purchase_Lottery_Entry_Item>
                    {t("48", { num: 56 })} 10000LP
                  </Purchase_Lottery_Entry_Item>
                  <Purchase_Lottery_Entry_Item>
                    {t("48", { num: 84 })} 10000LP
                  </Purchase_Lottery_Entry_Item> */}
                </Purchase_Lottery_Entry_Content>
              </Purchase_Lottery_Entry>
            </NodeInfo_Top>
            <NodeInfo_Bottom>
              <NodeInfo_Bottom_Item>
                {t("111")}
                <span>{LpUserInfo?.totalDrawAmount ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                {t("112")}
                <span>{LpUserInfo?.amount ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                {t("113")}
                <span>{LpUserInfo?.maturityRedemptionNum ?? 0} LP</span>
              </NodeInfo_Bottom_Item>
            </NodeInfo_Bottom>
            <BtnBox>
              <div
                onClick={() => {
                  setPledgeLPModal(true);
                }}
              >
                {t("114")}
              </div>
              <div
                onClick={() => {
                  unStakeLPFun(LpUserInfo?.maturityRedemptionNum ?? 0);
                }}
              >
                {t("116")}
              </div>
              <div
                onClick={() => {
                  getRewardFun(LpUserInfo?.amount ?? 0, 11);
                }}
              >
                {t("117")}
              </div>
              <div
                onClick={() => {
                  Navigate("/View/LPPledgeAwardRecord");
                }}
              >
                {t("98")}
              </div>
            </BtnBox>
          </NodeInfo>
          <NodeInfo>
            <NodeInfo_Top_NFT_Pioneer>
              <ModalContainer_Title_Container>
                <img src={SubscriptionRewardsIcon} />
                <ModalContainer_Title>{t("118")}</ModalContainer_Title>
              </ModalContainer_Title_Container>
            </NodeInfo_Top_NFT_Pioneer>
            <NodeInfo_Bottom_Subscription_Rewards>
              {t("119")}
              <NodeInfo_Bottom_Item>
                {t("120")}
                <span>{SubscriptionAccountInfo?.freezeAmount ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                {t("121")}
                <span>{SubscriptionAccountInfo?.totalAmount ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                {t("122")}
                <span>{SubscriptionAccountInfo?.amount ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
            </NodeInfo_Bottom_Subscription_Rewards>
            <BtnBox>
              <div
                onClick={() => {
                  // Navigate("/View/Pledge");
                  setPledgeNFTModal(true);
                }}
              >
                {t("123")}
              </div>
              <div
                onClick={() => {
                  getRewardFun(SubscriptionAccountInfo?.amount ?? 0, 9);
                }}
              >
                {t("124")}
              </div>
              <div
                onClick={() => {
                  Navigate("/View/InitialSubscriptionRewards", {
                    state: { recordType: 1, type: 1 },
                  });
                }}
              >
                {t("98")}
              </div>
            </BtnBox>
            <NodeInfo_Bottom_Subscription_Rewards1>
              {t("125")}
              <NodeInfo_Bottom_Item>
                {t("126")}
                <span>{FirstRoundAccountInfo?.unLockNum ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                {t("127")}
                <span>
                  {dateFormat(
                    "YYYY-mm-dd HH:MM:SS",
                    new Date(FirstRoundAccountInfo?.unlockEndTime)
                  )}
                </span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                {t("128")}
                <span>
                  {FirstRoundAccountInfo?.communityAddPerformance ?? 0} MBK
                </span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                {t("129")}
                <span>{FirstRoundAccountInfo?.maturityUnlockNum ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
            </NodeInfo_Bottom_Subscription_Rewards1>
            <To_Be_Collected>
              {t("102")}
              <div>
                {FirstRoundAccountInfo?.amount ?? 0} <span>MBK</span>
              </div>
            </To_Be_Collected>
            <BtnBox>
              <div
                onClick={() => {
                  getRewardFun(FirstRoundAccountInfo?.amount ?? 0, 10);
                }}
              >
                {t("130")}
              </div>
              <div
                onClick={() => {
                  Navigate("/View/InitialSubscriptionRewards", {
                    state: { recordType: 2 },
                  });
                }}
              >
                {t("98")}
              </div>
            </BtnBox>
          </NodeInfo>
        </>
      );
    } else if (!!isHoldNft) {
      return (
        <NodeInfo>
          <Active_NodeInfo_Top>
            <ModalContainer_Title_Container_Box>
              <ModalContainer_Title_Container_Box_Left>
                <ModalContainer_Title_Container>
                  <img src={NFTIcon} />
                  <ModalContainer_Title>{t("75")} </ModalContainer_Title>
                </ModalContainer_Title_Container>
                <ModalContainer_SubTitle>{t("96")}</ModalContainer_SubTitle>
              </ModalContainer_Title_Container_Box_Left>
              <NFTContainer>
                <img src={NFTImg} alt="" />
              </NFTContainer>
            </ModalContainer_Title_Container_Box>
          </Active_NodeInfo_Top>

          <Active_NodeInfo_BtnBox>
            <div
              onClick={() => {
                setActiveNFTModal(true);
              }}
            >
              {t("97")}
            </div>
            <div
              onClick={() => {
                Navigate("/View/NFTAwardRecord");
              }}
            >
              {t("98")}
            </div>
          </Active_NodeInfo_BtnBox>
          <NodeInfo_Bottom_NFT>
            <NodeInfo_Bottom_Item>
              {t("78")}
              <span>{MyCardInfo?.poolNum ?? 0} MBK</span>
            </NodeInfo_Bottom_Item>
            <NodeInfo_Bottom_Item>
              {t("79")}
              <span>{MyCardInfo?.myLpNum ?? 0} LP</span>
            </NodeInfo_Bottom_Item>
            <NodeInfo_Bottom_Item>
              {t("80")}
              <span>{MyCardInfo?.communityPerformance ?? 0} USDT</span>
            </NodeInfo_Bottom_Item>
            <NodeInfo_Bottom_Item>
              {t("81")}
              <span>{MyCardInfo?.totalAmount ?? 0} MBK</span>
            </NodeInfo_Bottom_Item>
          </NodeInfo_Bottom_NFT>
        </NodeInfo>
      );
    } else {
      return (
        <NodeInfo>
          <NodeInfo_Top>
            <ModalContainer_Title_Container>
              <img src={NFTIcon} />
              <ModalContainer_Title>{t("75")} </ModalContainer_Title>
            </ModalContainer_Title_Container>
            <NodeInfo_Top_Tip>{t("76")}</NodeInfo_Top_Tip>
            <NodeInfo_Top_Btn
              onClick={() => {
                Navigate("/View/SubscriptionNFT");
              }}
            >
              {t("77")}
            </NodeInfo_Top_Btn>
          </NodeInfo_Top>
          <NodeInfo_Bottom>
            <NodeInfo_Bottom_Item>
              {t("78")}
              <span>{MyCardInfo?.poolNum ?? 0} MBK</span>
            </NodeInfo_Bottom_Item>
            <NodeInfo_Bottom_Item>
              {t("79")}
              <span>{MyCardInfo?.myLpNum ?? 0} LP</span>
            </NodeInfo_Bottom_Item>
            <NodeInfo_Bottom_Item>
              {t("80")}
              <span>{MyCardInfo?.communityPerformance ?? 0} USDT</span>
            </NodeInfo_Bottom_Item>
            <NodeInfo_Bottom_Item>
              {t("81")}
              <span>{MyCardInfo?.totalAmount ?? 0} MBK</span>
            </NodeInfo_Bottom_Item>
          </NodeInfo_Bottom>
        </NodeInfo>
      );
    }
  };

  return (
    <NodeContainerBox>
      {NFTBox(MyCardInfo?.isHoldNft, MyCardInfo?.isLockNft)}

      <AllModal
        visible={PledgeLPModal}
        className="Modal"
        centered
        width={"345px"}
        closable={false}
        footer={null}
        onCancel={() => {
          setPledgeLPModal(false);
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
                setPledgeLPModal(false);
              }}
            />
          </ModalContainer_Close>
          <ModalContainer_Title_Container>
            <img src={PledgeLPIcon} alt="" />
            <ModalContainer_Title>{t("114")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <ModalContainer_Content>
            <InputBox_Item_First>
              {t("140")}
              <Dropdown
                overlay={menu}
                placement="bottom"
                onVisibleChange={(open: boolean) => {
                  setIsDropDownShow(open);
                }}
                trigger={["click"]}
              >
                <InputBox>
                  <div>
                    <input
                      type=""
                      value={t("48", { num: Days })}
                      readOnly={true}
                    />
                  </div>{" "}
                  <div>
                    <DropDownIcon
                      className={isDropDownShow ? "spanRotate" : "spanReset"}
                    />
                  </div>
                </InputBox>
              </Dropdown>
            </InputBox_Item_First>
            <InputBox_Item_Last>
              {t("141")}
              <InputBox>
                <div>
                  <input
                    type=""
                    value={InputValueAmount}
                    onChange={InputValueFun}
                  />{" "}
                  MBK_USDT_LP
                </div>{" "}
                <div
                  onClick={() => {
                    setInputValueAmount(MBK_USDT_TOKENBalance);
                  }}
                >
                  {t("49")}
                </div>
              </InputBox>
            </InputBox_Item_Last>
            <BalanceBox>
              {t("50")}: <span>{MBK_USDT_TOKENBalance ?? 0}</span>MBK_USDT
            </BalanceBox>
            <UpBtn
              onClick={() => {
                stakeLPFun(String(InputValueAmount), Number(Days));
              }}
            >
              {t("139")}
            </UpBtn>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>

      <Staking_Mining_Modal
        visible={PledgeNFTModal}
        className="Modal"
        centered
        width={"345px"}
        closable={false}
        footer={null}
        onCancel={() => {
          setPledgeNFTModal(false);
        }}
      >
        <Staking_Mining_Modal_ModalContainer>
          <HomeContainerBox_Content_Bg3></HomeContainerBox_Content_Bg3>

          <ModalContainer_Close>
            {" "}
            <img
              src={closeIcon}
              alt=""
              onClick={() => {
                setPledgeNFTModal(false);
              }}
            />
          </ModalContainer_Close>
          <ModalContainer_Title_Container>
            <StakingMiningIcon />
            <ModalContainer_Title>{t("134")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <ModalContainer_Content>
            <Staking_Mining_Container>
              <NodeInfo_Bottom_Item>
                {t("135")}
                <span>
                  {decimalNum(PledgeUserInfo?.robotAmount ?? 0, 2)}USDT
                </span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                {t("136")}
                <span>1MBK={Price ?? "-"}USDT</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                {t("137")}
                <span>{t("48", { num: PledgeUserInfo?.cycle ?? 0 })}</span>
              </NodeInfo_Bottom_Item>
            </Staking_Mining_Container>

            <InputBox_Item_Last>
              {/* Pledge quantity */}
              <InputBox>
                <div>
                  <input
                    type="number"
                    value={
                      !!PledgeNFTInputValueAmount
                        ? PledgeNFTInputValueAmount
                        : ""
                    }
                    onChange={(e) => {
                      PledgeNFTInputValueFun(e);
                    }}
                  />{" "}
                  MBK
                </div>{" "}
                <div
                  onClick={() => {
                    MaxFun(SubscriptionAccountInfo?.freezeAmount ?? 0);
                  }}
                >
                  {t("49")}
                </div>
              </InputBox>
            </InputBox_Item_Last>
            <BalanceBox>
              {t("50")}:{" "}
              <span>{SubscriptionAccountInfo?.freezeAmount ?? 0}</span>MBK
              <NodeInfo_Top_Rule_Staking_Mining>
                <HelpIconAuto /> {t("12")}
              </NodeInfo_Top_Rule_Staking_Mining>
            </BalanceBox>
          </ModalContainer_Content>
        </Staking_Mining_Modal_ModalContainer>
        <Staking_Mining_Modal_Bottom>
          <Released_For_Claim>
            {t("138")}
            <div>
              {InputValueAmountValue ?? "0"} <span>USDT</span>
            </div>
          </Released_For_Claim>
        </Staking_Mining_Modal_Bottom>
        <UpBtn_Container>
          <UpBtn
            onClick={() => {
              pledgeFun(PledgeNFTInputValueAmount);
            }}
          >
            {t("139")}
          </UpBtn>
        </UpBtn_Container>
      </Staking_Mining_Modal>

      <AllModal
        visible={ActiveNFTModal}
        className="Modal"
        centered
        width={"345px"}
        closable={false}
        footer={null}
        onCancel={() => {
          setActiveNFTModal(false);
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
                setActiveNFTModal(false);
              }}
            />
          </ModalContainer_Close>
          <ModalContainer_Title_Container>
            <img src={NFTIcon} alt="" />
            <ModalContainer_Title>{t("99")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <ModalContainer_Content>
            {t("100")}
            <span>10</span>
            <UpBtn
              onClick={() => {
                activeFun("10", MyCardInfo?.tokenId);
              }}
            >
              {t("97")}
            </UpBtn>
            <BalanceBox>
              {t("50")}: <span>{decimalNum(TOKENBalance, 2)}</span>MBK
            </BalanceBox>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>
    </NodeContainerBox>
  );
}
