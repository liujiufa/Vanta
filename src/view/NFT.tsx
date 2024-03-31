import React, { useState, useEffect } from "react";
import {
  getFirstRoundAccountInfo,
  getLpUserInfo,
  getMyCardInfo,
  getPioneerInfo,
  getSubscriptionAccountInfo,
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

const Btn = styled(FlexCCBox)`
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
  const state = useSelector<stateType, stateType>((state) => state);
  const [RecordList, setRecordList] = useState<any>([]);
  const [MyCardInfo, setMyCardInfo] = useState<any>({});
  const [PioneerInfo, setPioneerInfo] = useState<any>({});
  const [LpUserInfo, setLpUserInfo] = useState<any>({});
  const [FirstRoundAccountInfo, setFirstRoundAccountInfo] = useState<any>({});
  const [SubscriptionAccountInfo, setSubscriptionAccountInfo] = useState<any>(
    {}
  );
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Balance, setBalance] = useState<any>("");
  const [Days, setDays] = useState<any>(20);
  const [InputValueAmount, setInputValueAmount] = useState<any>("");
  const [ActivationModal, setActivationModal] = useState(false);
  const [ActiveNFTModal, setActiveNFTModal] = useState(false);
  const [isDropDownShow, setIsDropDownShow] = useState(false);
  const [PledgeLPModal, setPledgeLPModal] = useState(false);
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

  const items = [
    { key: "20", label: <div>20DAY</div> },
    { key: "28", label: <div>28DAY</div> },
    { key: "56", label: <div>56DAY</div> },
    { key: "84", label: <div>84DAY</div> },
  ];
  const menu = <Menu onClick={changeTime} items={items} />;

  const getInitData = () => {
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
        res = await Contracts.example?.active(account as string, tokenId);
      } catch (error: any) {
        showLoding(false);
        return addMessage("激活失败");
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        setActiveNFTModal(false);
        getInitData();
        addMessage("激活成功");
      } else {
        addMessage("激活失败");
      }
    });
  };

  const stakeLPFun = (value: string, period: number) => {
    if (Number(value) <= 0) return;
    MBK_USDT_handleTransaction(value, async (call: any) => {
      let res: any;
      try {
        showLoding(true);
        res = await Contracts.example?.stakeLP(
          account as string,
          value,
          period
        );
      } catch (error: any) {
        showLoding(false);
        return addMessage("质押LP失败");
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        setPledgeLPModal(false);
        addMessage("质押LP成功");
      } else {
        addMessage("质押LP失败");
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
        res = await Contracts.example?.unStake(account as string, item?.data);
      }
    } catch (error: any) {
      showLoding(false);
      return addMessage("赎回失败");
    }

    showLoding(false);
    if (!!res?.status) {
      Navigate("/View/Node");
      addMessage("赎回成功");
    } else {
      addMessage("赎回失败");
    }
  };

  const InputValueFun = async (e: any) => {
    let value = e.target.value.replace(/^[^1-9]+|[^0-9]/g, "");
    setInputValueAmount(value);
  };

  useEffect(() => {
    if (state.token) {
      getInitData();
    }
  }, [state.token]);

  useEffect(() => {
    if (account) {
    }
  }, [account]);

  const StateObj = (type: number) => {
    if (type === 1) {
      return <span style={{ color: "#D56819" }}>Confirming</span>;
    } else if (type === 2) {
      return <span style={{ color: "#0256FF" }}>Confirming</span>;
    }
  };

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
                    <ModalContainer_Title>My NFT </ModalContainer_Title>
                  </ModalContainer_Title_Container>
                  <ModalContainer_SubTitle>
                    You have purchased a node and are waiting to be activated
                  </ModalContainer_SubTitle>
                </ModalContainer_Title_Container_Box_Left>
                <NFTContainer>
                  <img src={NFTImg} alt="" />
                </NFTContainer>
              </ModalContainer_Title_Container_Box>
            </Active_NodeInfo_Top>

            <Active_NodeInfo_BtnBox>
              <div
              // onClick={() => {
              //   setActiveNFTModal(true);
              // }}
              >
                receive
              </div>
              <div
                onClick={() => {
                  Navigate("/View/NFTAwardRecord", {
                    state: { recordType: 1 },
                  });
                }}
              >
                Record
              </div>
            </Active_NodeInfo_BtnBox>
            <NodeInfo_Bottom_NFT>
              <NodeInfo_Bottom_Item>
                Prize pool funds
                <span>{MyCardInfo?.poolNum ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                My LP quantity
                <span>{MyCardInfo?.myLpNum ?? 0} LP</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                Community subscription performance
                <span>{MyCardInfo?.communityPerformance ?? 0} USDT</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                Accumulated NFT equity rewards
                <span>{MyCardInfo?.totalAmount ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
            </NodeInfo_Bottom_NFT>
          </NodeInfo>
          {!!PioneerInfo?.isHoldNft && !!PioneerInfo?.isSatisfyNftCommunity ? (
            <NodeInfo>
              <NodeInfo_Top_LotteryGame>
                <ModalContainer_Title_Container_Participate>
                  <img src={MyCardInfo?.imgUrl ?? ParticipateGameIcon} />
                  <ModalContainer_Title>NFT Pioneer</ModalContainer_Title>
                  <FinancialRecords
                    onClick={() => {
                      Navigate("/View/Announcement", {
                        state: { recordType: 2 },
                      });
                    }}
                  >
                    小区新增业绩排名 <SmallOutLinkIconBox />
                  </FinancialRecords>
                </ModalContainer_Title_Container_Participate>
                <NodeInfo_Bottom_NFT>
                  <NodeInfo_Bottom_Item>
                    New subscription results
                    <span>
                      {PioneerInfo?.thisMonthAddPerformance ?? 0} USDT
                    </span>
                  </NodeInfo_Bottom_Item>
                  <NodeInfo_Bottom_Item>
                    Community performance
                    <span>{PioneerInfo?.totalAmount ?? 0} MBK</span>
                  </NodeInfo_Bottom_Item>
                </NodeInfo_Bottom_NFT>
                <To_Be_Collected>
                  Released and pending for claim
                  <div>
                    {PioneerInfo?.amount ?? 0} <span>MBK</span>
                  </div>
                </To_Be_Collected>
              </NodeInfo_Top_LotteryGame>
              <BtnBox>
                <div>receive</div>
                <div
                  onClick={() => {
                    Navigate("/View/SubscriptionQuotaAwardRecord", {
                      state: { type: 3 },
                    });
                  }}
                >
                  Record
                </div>
              </BtnBox>
            </NodeInfo>
          ) : (
            <NodeInfo>
              <NodeInfo_Top_LotteryGame>
                <ModalContainer_Title_Container>
                  <img src={MyCardInfo?.imgUrl ?? ParticipateGameIcon} />
                  <ModalContainer_Title>NFT Pioneer</ModalContainer_Title>
                </ModalContainer_Title_Container>
                <NodeInfo_Top_Tip_NodeInfo_Top_LotteryGame>
                  Upgrade conditions not met
                </NodeInfo_Top_Tip_NodeInfo_Top_LotteryGame>
                <NodeInfo_Mid_Conditions>
                  Conditions for becoming an NFT pioneer
                  <div>
                    <img
                      src={!!PioneerInfo?.isHoldNft ? yesIcon : errorIcon}
                      alt=""
                    />
                    Hold NFT yourself
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
                    The community subscribed for more than 30 NFTs
                  </div>
                </NodeInfo_Mid_Conditions>
              </NodeInfo_Top_LotteryGame>
            </NodeInfo>
          )}
          <NodeInfo>
            <NodeInfo_Top>
              <NodeInfo_Top_Rule>
                <HelpIconAuto /> Rule
              </NodeInfo_Top_Rule>
              <ModalContainer_Title_Container>
                <img src={LPPledgeIcon} />
                <ModalContainer_Title>LP pledge dividends</ModalContainer_Title>
              </ModalContainer_Title_Container>

              <Purchase_Lottery_Entry>
                Purchase lottery entry
                <Purchase_Lottery_Entry_Content>
                  <Purchase_Lottery_Entry_Item>
                    28Days 10000LP
                  </Purchase_Lottery_Entry_Item>
                  <Purchase_Lottery_Entry_Item>
                    56Days 10000LP
                  </Purchase_Lottery_Entry_Item>
                  <Purchase_Lottery_Entry_Item>
                    84Days 10000LP
                  </Purchase_Lottery_Entry_Item>
                </Purchase_Lottery_Entry_Content>
              </Purchase_Lottery_Entry>
            </NodeInfo_Top>
            <NodeInfo_Bottom>
              <NodeInfo_Bottom_Item>
                Cumulative dividends
                <span>{LpUserInfo?.totalDrawAmount ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                Dividends to be received
                <span>{LpUserInfo?.amount ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                Looking forward to redeeming LP
                <span>{LpUserInfo?.maturityRedemptionNum ?? 0} LP</span>
              </NodeInfo_Bottom_Item>
            </NodeInfo_Bottom>
            <BtnBox>
              <div
                onClick={() => {
                  setPledgeLPModal(true);
                }}
              >
                Pledge
              </div>
              <div
                onClick={() => {
                  unStakeLPFun(LpUserInfo?.maturityRedemptionNum ?? 0);
                }}
              >
                Redeem
              </div>
              <div onClick={() => {}}>receive</div>
              <div
                onClick={() => {
                  Navigate("/View/LPPledgeAwardRecord");
                }}
              >
                Record
              </div>
            </BtnBox>
          </NodeInfo>
          <NodeInfo>
            <NodeInfo_Top_NFT_Pioneer>
              <ModalContainer_Title_Container>
                <img src={SubscriptionRewardsIcon} />
                <ModalContainer_Title>
                  Subscription Rewards
                </ModalContainer_Title>
              </ModalContainer_Title_Container>
            </NodeInfo_Top_NFT_Pioneer>
            <NodeInfo_Bottom_Subscription_Rewards>
              Initial subscription rewards
              <NodeInfo_Bottom_Item>
                Rewards to be Unlocked
                <span>{SubscriptionAccountInfo?.freezeAmount ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                Unlocking Rewards
                <span>{SubscriptionAccountInfo?.totalAmount ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                Unlocked To be Collected
                <span>{SubscriptionAccountInfo?.amount ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
            </NodeInfo_Bottom_Subscription_Rewards>
            <BtnBox>
              <div
                onClick={() => {
                  Navigate("/View/Pledge");
                }}
              >
                Staking
              </div>
              <div>extract</div>
              <div
                onClick={() => {
                  Navigate("/View/InitialSubscriptionRewards", {
                    state: { recordType: 1 },
                  });
                }}
              >
                Record
              </div>
            </BtnBox>
            <NodeInfo_Bottom_Subscription_Rewards1>
              Initial subscription rewards
              <NodeInfo_Bottom_Item>
                Rewards to be Unlocked
                <span>{FirstRoundAccountInfo?.unLockNum ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                Unlock Deadline
                <span>
                  {dateFormat(
                    "YYYY-mm-dd HH:MM:SS",
                    new Date(FirstRoundAccountInfo?.unlockEndTime)
                  )}
                </span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                Add new robot performance
                <span>
                  {FirstRoundAccountInfo?.communityAddPerformance ?? 0} MBK
                </span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                Expiration unlock quantity
                <span>{FirstRoundAccountInfo?.maturityUnlockNum ?? 0} MBK</span>
              </NodeInfo_Bottom_Item>
            </NodeInfo_Bottom_Subscription_Rewards1>
            <To_Be_Collected>
              To Be Collected(MBK)
              <div>
                {FirstRoundAccountInfo?.amount ?? 0} <span>MBK</span>
              </div>
            </To_Be_Collected>
            <BtnBox>
              <div>extract Unlocked</div>
              <div
                onClick={() => {
                  Navigate("/View/InitialSubscriptionRewards", {
                    state: { recordType: 2 },
                  });
                }}
              >
                Record
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
                  <ModalContainer_Title>My NFT </ModalContainer_Title>
                </ModalContainer_Title_Container>
                <ModalContainer_SubTitle>
                  You have purchased a node and are waiting to be activated
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
                setActiveNFTModal(true);
              }}
            >
              Active
            </div>
            <div
              onClick={() => {
                Navigate("/View/NFTAwardRecord");
              }}
            >
              Record
            </div>
          </Active_NodeInfo_BtnBox>
          <NodeInfo_Bottom_NFT>
            <NodeInfo_Bottom_Item>
              Prize pool funds
              <span>{MyCardInfo?.poolNum ?? 0} MBK</span>
            </NodeInfo_Bottom_Item>
            <NodeInfo_Bottom_Item>
              My LP quantity
              <span>{MyCardInfo?.myLpNum ?? 0} LP</span>
            </NodeInfo_Bottom_Item>
            <NodeInfo_Bottom_Item>
              Community subscription performance
              <span>{MyCardInfo?.communityPerformance ?? 0} USDT</span>
            </NodeInfo_Bottom_Item>
            <NodeInfo_Bottom_Item>
              Accumulated NFT equity rewards
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
              <ModalContainer_Title>My NFT </ModalContainer_Title>
            </ModalContainer_Title_Container>
            <NodeInfo_Top_Tip>No node yet</NodeInfo_Top_Tip>
            <NodeInfo_Top_Btn
              onClick={() => {
                Navigate("/View/SubscriptionNFT");
              }}
            >
              Subscription
            </NodeInfo_Top_Btn>
          </NodeInfo_Top>
          <NodeInfo_Bottom>
            <NodeInfo_Bottom_Item>
              Prize pool funds
              <span>{MyCardInfo?.poolNum ?? 0} MBK</span>
            </NodeInfo_Bottom_Item>
            <NodeInfo_Bottom_Item>
              My LP quantity
              <span>{MyCardInfo?.myLpNum ?? 0} LP</span>
            </NodeInfo_Bottom_Item>
            <NodeInfo_Bottom_Item>
              Community subscription performance
              <span>{MyCardInfo?.communityPerformance ?? 0} USDT</span>
            </NodeInfo_Bottom_Item>
            <NodeInfo_Bottom_Item>
              Accumulated NFT equity rewards
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
            <ModalContainer_Title>{t("Pledge LP")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <ModalContainer_Content>
            <InputBox_Item_First>
              Pledge cycle
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
                    <input type="" value={Days + "DAY"} readOnly={true} />
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
              Pledge quantity
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
                  MAX
                </div>
              </InputBox>
            </InputBox_Item_Last>
            <BalanceBox>
              wallet balance: <span>{MBK_USDT_TOKENBalance ?? 0}</span>MBK
            </BalanceBox>
            <UpBtn
              onClick={() => {
                stakeLPFun(String(InputValueAmount), Number(Days));
              }}
            >
              Sure
            </UpBtn>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>

      <Staking_Mining_Modal
        visible={false}
        className="Modal"
        centered
        width={"345px"}
        closable={false}
        footer={null}
        onCancel={() => {
          setActivationModal(false);
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
                setActivationModal(false);
              }}
            />
          </ModalContainer_Close>
          <ModalContainer_Title_Container>
            <StakingMiningIcon />
            <ModalContainer_Title>{t("Staking Mining")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <ModalContainer_Content>
            <Staking_Mining_Container>
              <NodeInfo_Bottom_Item>
                Available robot quota x4
                <span>3000 USDT</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                Current Price
                <span>1MBK=30.00USDT</span>
              </NodeInfo_Bottom_Item>
              <NodeInfo_Bottom_Item>
                Pledge Cycle
                <span>3000 Day</span>
              </NodeInfo_Bottom_Item>
            </Staking_Mining_Container>

            <InputBox_Item_Last>
              Pledge quantity
              <InputBox>
                <div>
                  <input type="" /> MBK_USDT_LP
                </div>{" "}
                <div>MAX</div>
              </InputBox>
            </InputBox_Item_Last>
            <BalanceBox>
              wallet balance: <span>100,000.00</span>MBK
              <NodeInfo_Top_Rule_Staking_Mining>
                <HelpIconAuto /> Rule
              </NodeInfo_Top_Rule_Staking_Mining>
            </BalanceBox>
          </ModalContainer_Content>
        </Staking_Mining_Modal_ModalContainer>
        <Staking_Mining_Modal_Bottom>
          <Released_For_Claim>
            Released and pending for claim
            <div>
              3000 <span>USDT</span>
            </div>
          </Released_For_Claim>
        </Staking_Mining_Modal_Bottom>
        <UpBtn_Container>
          <UpBtn>pledge</UpBtn>
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
            <ModalContainer_Title>{t("NFT Activation")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <ModalContainer_Content>
            Activation requires destroying MBK
            <span>10</span>
            <UpBtn
              onClick={() => {
                activeFun("10", MyCardInfo?.tokenId);
              }}
            >
              {t("activation")}
            </UpBtn>
            <BalanceBox>
              wallet balance: <span>{decimalNum(TOKENBalance, 2)}</span>MBK
            </BalanceBox>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>
    </NodeContainerBox>
  );
}
