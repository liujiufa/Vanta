import React, { useState, useEffect } from "react";
import {
  getRobotInfo,
  getRobotManageAward,
  getRobotPerformanceAwardInfo,
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
import { Carousel, Modal, Tooltip } from "antd";
import { useGetReward } from "../hooks/useGetReward";
import { Contracts } from "../web3";
import logo from "../assets/image/logo.png";
import {
  ModalContainer_Title,
  ModalContainer_Title_Container,
} from "../Layout/MainLayout";
import closeIcon from "../assets/image/closeIcon.svg";
import {
  HelpIcon,
  LotteryGameIcon,
  ParticipateGameIcon,
  QuotaSubscriptionIcon,
  ReservePoolIcon,
  SmallOutLinkIcon,
  ZeroStrokeIcon,
} from "../assets/image/homeBox";
import {
  DemonIcon,
  ManagementRewardsIcon,
  MyQuotaIcon,
  PerformanceRewardsIcon,
} from "../assets/image/RobotBox";
import { NodeInfo_Mid_Rule } from "./SubscriptionNode";
import { contractAddress } from "../config";
import useUSDTGroup from "../hooks/useUSDTGroup";
import { throttle } from "lodash";
import { log } from "console";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

const NodeContainerBox = styled(ContainerBox)`
  width: 100%;
  > div {
    margin-bottom: 15px;
  }
`;

const NodeInfo = styled.div`
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(213, 104, 25, 0.2);
`;

const NodeInfo_Top = styled(FlexBox)`
  position: relative;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  /* border-bottom: 1px solid rgba(213, 104, 25, 0.2); */
`;
const MyQuota = styled(NodeInfo_Top)`
  padding: 0px;
`;
const NodeInfo_Top_LotteryGame = styled(NodeInfo_Top)`
  width: 100%;
  padding: 0;
  > div {
    padding: 15px;
  }
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
  /* margin-top: 27px; */
`;

const BalanceBox = styled(FlexBox)`
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
  margin-top: 10px;
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
`;

const NodeInfo_Top_Item = styled(FlexSBCBox)`
  width: 100%;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  margin-top: 18px;
  > div {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: rgba(255, 255, 255, 0.8);
    &:nth-child(2) {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      font-family: PingFang SC;
      font-size: 16px;
      font-weight: normal;
      line-height: normal;
      text-transform: capitalize;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: #d56819;
      span {
        margin: 0px 5px;
        font-family: PingFang SC;
        font-size: 10px;
        font-weight: normal;
        line-height: normal;
        text-transform: capitalize;
        letter-spacing: 0em;

        font-variation-settings: "opsz" auto;
        color: #ffffff;
      }
    }
  }
`;

const SmallOutLinkIconBox = styled(SmallOutLinkIcon)`
  margin-left: 5px;
`;

const ModalContainer_Title_Container_Participate = styled(
  ModalContainer_Title_Container
)`
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
  > svg {
    margin-right: 12px;
  }
`;

const NodeInfo_Top_LotteryGame_Info = styled.div`
  width: 100%;
`;

const InputContainer = styled.div`
  width: 100%;
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
      margin-top: 0px;
      margin-bottom: 18px;
    }
  }
`;

const InputBox = styled(FlexSBCBox)`
  width: 100%;
  border-radius: 8px;
  background: #ffffff;

  box-sizing: content-box;
  border: 1px solid rgba(213, 104, 25, 0.2);
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
        &::-webkit-outer-spin-button {
          -webkit-appearance: textfield;
        }
        &::-webkit-inner-spin-button {
          -webkit-appearance: textfield;
        }
      }
      input[type="number"] {
        -moz-appearance: textfield;
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

const BalanceBox_InputContainer = styled(FlexSCBox)`
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #999999;
  > div {
    display: flex;
    align-items: center;

    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;
    margin: 0px 0px 0px 10px;
    > span {
      font-family: PingFang SC;
      font-size: 10px;
      font-weight: normal;
      line-height: normal;
      text-transform: uppercase;
      letter-spacing: 0em;
      margin-left: 5px;

      font-variation-settings: "opsz" auto;
      color: #999999;
    }
  }
`;

const NodeInfo_Top_LotteryGame_Reward = styled(FlexSBCBox)`
  width: 100%;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  /* border-top: 1px solid rgba(213, 104, 25, 0.2); */
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
  padding: 0 15px 15px !important;
  > div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: PingFang SC;
    font-size: 18px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;
    > span {
      font-family: PingFang SC;
      font-size: 10px;
      font-weight: normal;
      line-height: normal;
      text-transform: uppercase;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: #ffffff;
      margin-left: 5px;
    }
  }
`;
const NodeInfo_Top_Management_Reward = styled(NodeInfo_Top_LotteryGame_Reward)`
  border-top: 1px solid rgba(213, 104, 25, 0.2);
  padding: 15px !important;
`;

const GetRewardBtn = styled(FlexCCBox)`
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #d56819;
`;
const NodeInfo_Top_Management_Info = styled(NodeInfo_Top_LotteryGame_Info)`
  border-top: 1px solid rgba(213, 104, 25, 0.2);
`;
const MyQuota_Box = styled(FlexSBCBox)`
  width: 100%;
  padding: 15px;
  border-radius: 10px 10px 0px 0px;
  opacity: 1;

  background: #d56819;
`;
const MyQuota_Box_Left = styled.div``;

const MyQuota_ModalContainer_Title_Container = styled(
  ModalContainer_Title_Container
)`
  margin-bottom: 15px;
`;

const AvailableBox = styled.div`
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  > div {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;
    margin-top: 5px;
    > span {
      font-family: PingFang SC;
      font-size: 10px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
  }
`;

const MyQuota_BoxDevider = styled.div`
  height: 100%;
  min-height: 80px;
  width: 2px;
  background: radial-gradient(
    50% 50% at 50% 50%,
    #f07b26 0%,
    rgba(213, 104, 25, 0.4) 100%
  );
`;
const MyQuota_Box_Right = styled.div`
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;
  text-align: center;
  font-variation-settings: "opsz" auto;
  color: #f7e1d1;
  > div {
    display: flex;
    align-items: center;

    margin-top: 5px;
    font-family: PingFang SC;
    font-size: 18px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #f7e1d1;

    z-index: 1;
  }
`;

const NodeInfo_Top_Item_Box = styled.div`
  width: 100%;

  padding: 15px;
  > div {
    width: 100%;
    margin-bottom: 13px;
    margin-top: 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Goto = styled(FlexECBox)`
  width: 100%;
  /* margin: 15px 0px; */

  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  text-decoration: underline;

  font-variation-settings: "opsz" auto;
  color: #d56819;
`;

const DemonIconBox = styled(DemonIcon)`
  margin-right: 5px;
`;
const MyQuotaIconBox = styled(MyQuotaIcon)`
  margin: 0px 12px 0px 0px;
`;

const QuotaSubscriptionIconBox = styled(QuotaSubscriptionIcon)`
  /* margin-right: 12px; */
`;

const InputContainer_Bottom = styled(FlexSBCBox)`
  width: 100%;
`;

const NodeInfo_Mid_Rule_Robot = styled(NodeInfo_Mid_Rule)`
  width: fit-content;
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
  const token = useSelector<stateType, any>((state) => state.token);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Price, setPrice] = useState<any>("");
  const [UserBuyBotInfo, setUserBuyBotInfo] = useState<any>("-");
  const [InputValueAmount, setInputValueAmount] = useState<any>("");
  const [InputValueAmountValue, setInputValueAmountValue] = useState<any>("0");
  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.Bot, "MBK");

  const [RobotInfo, setRobotInfo] = useState<any>({});
  const [RobotManageAwardInfo, setRobotManageAwardInfo] = useState<any>({});
  const [RobotPerformanceAwardInfo, setRobotPerformanceAwardInfo] =
    useState<any>({});

  const getInitData = () => {
    getRobotInfo().then((res: any) => {
      if (res.code === 200) {
        setRobotInfo(res?.data);
      }
    });
    getRobotManageAward().then((res: any) => {
      if (res.code === 200) {
        setRobotManageAwardInfo(res?.data);
      }
    });
    getRobotPerformanceAwardInfo().then((res: any) => {
      if (res.code === 200) {
        setRobotPerformanceAwardInfo(res?.data);
      }
    });
  };

  const getVilifyState = throttle(async (value: string) => {
    if (!web3ModalAccount) return;
    return Contracts.example?.queryUsdtByMbk(web3ModalAccount as string, value);
  }, 2000);
  const getVilifyStateUSDTToMBK = throttle(async (value: string) => {
    if (!web3ModalAccount) return;
    return Contracts.example?.queryMbkByUsdt(web3ModalAccount as string, value);
  }, 2000);

  const InputValueFun = async (e: any) => {
    let value = e.target.value.replace(/^[^1-9]+|[^0-9]/g, "");
    setInputValueAmount(value);
    if (Number(value) > 0) {
      getVilifyState(value)?.then((res: any) => {
        setInputValueAmountValue(decimalNum(EthertoWei(res ?? "0"), 2));
      });
    } else {
      setInputValueAmountValue("0");
    }
  };

  const MaxFun = (value: string) => {
    setInputValueAmount(value);

    if (Number(value) > 0) {
      getVilifyState(value)?.then((res: any) => {
        setInputValueAmountValue(decimalNum(EthertoWei(res ?? "0"), 2));
      });
    } else {
      setInputValueAmountValue("0");
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
  const getRewardFun = (value: any, type: any) => {
    if (Number(value) <= 0) return addMessage(t("27"));
    getReward(
      type,
      () => {
        getInitData();
      },
      "awardPoolContract"
    );
  };

  useEffect(() => {
    if (token) {
      getInitData();
    }
  }, [token]);

  useEffect(() => {
    if (web3ModalAccount) {
      getVilifyState("1")?.then((res: any) => {
        setPrice(decimalNum(EthertoWei(res ?? "0"), 2));
      });
      console.log("rse1");

      Contracts.example
        ?.queryUserBuyBotInfo(web3ModalAccount as string)
        .then((res: any) => {
          console.log(res, "rse2");

          if (Number(EthertoWei(res[res?.length - 1] ?? "0")) > 0) {
            Contracts.example
              ?.queryMbkByUsdt1(
                web3ModalAccount as string,
                res[res?.length - 1] + ""
              )
              ?.then((res1: any) => {
                setUserBuyBotInfo(decimalNum(EthertoWei(res1 ?? "0"), 2));
              });
          }
        });
    }
  }, [web3ModalAccount]);

  const buyRobotFun = (value: string) => {
    if (Number(value) <= 0) return;
    if (Number(value) % 20 !== 0) return addMessage(t("366"));
    if (Number(value) < UserBuyBotInfo)
      return addMessage(t("367", { num: UserBuyBotInfo }));

    handleTransaction(value, async (call: any) => {
      let res: any;
      try {
        showLoding(true);
        res = await Contracts.example?.buyBot(
          web3ModalAccount as string,
          value
        );
      } catch (error: any) {
        showLoding(false);
        return addMessage(t("164"));
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        Contracts.example
          ?.queryUserBuyBotInfo(web3ModalAccount as string)
          .then((res: any) => {
            if (Number(EthertoWei(res[res?.length - 1] ?? "0")) > 0) {
              Contracts.example
                ?.queryMbkByUsdt1(
                  web3ModalAccount as string,
                  res[res?.length - 1] + ""
                )
                ?.then((res1: any) => {
                  setUserBuyBotInfo(decimalNum(EthertoWei(res1 ?? "0"), 2));
                });
            }
          });
        addMessage(t("165"));
      } else {
        addMessage(t("164"));
      }
    });
  };

  return (
    <NodeContainerBox>
      <NodeInfo>
        <MyQuota>
          <MyQuota_Box>
            <MyQuota_Box_Left>
              <MyQuota_ModalContainer_Title_Container>
                <MyQuotaIconBox />
                <ModalContainer_Title>{t("142")}</ModalContainer_Title>
              </MyQuota_ModalContainer_Title_Container>
              <AvailableBox>
                {t("144")}
                <div>
                  {Number(RobotInfo?.amount ?? 0) ?? 0} <span>USDT</span>
                </div>
              </AvailableBox>
            </MyQuota_Box_Left>
            <MyQuota_BoxDevider />
            <MyQuota_Box_Right>
              {t("143")}
              <div>
                <DemonIconBox />V{RobotInfo?.teamLevel ?? 0}
              </div>
            </MyQuota_Box_Right>
          </MyQuota_Box>
          <NodeInfo_Top_Item_Box>
            <NodeInfo_Top_Item>
              <div>{t("145")}</div>
              {RobotInfo?.totalSubscriptionNum ?? 0} VTB
            </NodeInfo_Top_Item>
            <NodeInfo_Top_Item>
              <div>{t("370")}</div>
              {RobotInfo?.realTotalSubscriptionValue ?? 0} USDT
            </NodeInfo_Top_Item>
            <NodeInfo_Top_Item>
              <div>{t("371")}</div>
              {RobotInfo?.totalSubscriptionAmount ?? 0} USDT
            </NodeInfo_Top_Item>
            <NodeInfo_Top_Item>
              <div>{t("147")}</div>
              {RobotInfo?.usedAmount ?? 0} USDT
            </NodeInfo_Top_Item>
          </NodeInfo_Top_Item_Box>
        </MyQuota>
      </NodeInfo>

      <NodeInfo>
        <NodeInfo_Top_LotteryGame>
          <ModalContainer_Title_Container_Participate>
            <QuotaSubscriptionIconBox />
            <ModalContainer_Title>{t("148")}</ModalContainer_Title>
            <FinancialRecords
              onClick={() => {
                Navigate("/View/SubscriptionQuotaRecord");
              }}
            >
              {t("149")} <SmallOutLinkIconBox />
            </FinancialRecords>
          </ModalContainer_Title_Container_Participate>
          <NodeInfo_Top_LotteryGame_Info>
            <InputContainer>
              <NodeInfo_Top_Item>
                <div>{t("91")}</div>
                1VTB={Price ?? "--"}USDT
              </NodeInfo_Top_Item>
              <InputBox>
                <div>
                  <input
                    type="number"
                    placeholder={t(`358`, {
                      num: UserBuyBotInfo ?? "-",
                    })}
                    value={!!InputValueAmount ? InputValueAmount : ""}
                    onChange={(e) => {
                      InputValueFun(e);
                    }}
                  />{" "}
                  VTB
                </div>{" "}
                <div
                  onClick={() => {
                    MaxFun(TOKENBalance);
                  }}
                >
                  {t("49")}
                </div>
              </InputBox>
              <InputContainer_Bottom>
                <BalanceBox_InputContainer>
                  {t("50")}{" "}
                  <div>
                    {TOKENBalance} <span>VTB</span>
                  </div>
                </BalanceBox_InputContainer>

                <Tooltip title={t("381")} autoAdjustOverflow showArrow={false}>
                  <NodeInfo_Mid_Rule_Robot>
                    <HelpIcon />
                    {t("12")}
                  </NodeInfo_Mid_Rule_Robot>
                </Tooltip>
              </InputContainer_Bottom>
              <InputContainer_Bottom style={{ marginTop: "10px" }}>
                <BalanceBox_InputContainer>
                  {t("368")}{" "}
                </BalanceBox_InputContainer>

                <NodeInfo_Mid_Rule_Robot>
                  {Number(InputValueAmountValue)} USDT
                </NodeInfo_Mid_Rule_Robot>
              </InputContainer_Bottom>
            </InputContainer>
          </NodeInfo_Top_LotteryGame_Info>
          <NodeInfo_Top_LotteryGame_Reward>
            {t("151")}
            <div>
              {Number(InputValueAmountValue) * 4} <span>USDT</span>
            </div>
          </NodeInfo_Top_LotteryGame_Reward>
          <GetRewardBtn
            onClick={() => {
              buyRobotFun(InputValueAmount);
            }}
          >
            {t("152")}
          </GetRewardBtn>
        </NodeInfo_Top_LotteryGame>
      </NodeInfo>

      <NodeInfo>
        <NodeInfo_Top_LotteryGame>
          <ModalContainer_Title_Container_Participate>
            <ManagementRewardsIcon />
            <ModalContainer_Title>{t("153")}</ModalContainer_Title>
            <FinancialRecords
              onClick={() => {
                Navigate("/View/SubscriptionQuotaAwardRecord", {
                  state: { type: 1 },
                });
              }}
            >
              {t("56")}
              <SmallOutLinkIconBox />
            </FinancialRecords>
          </ModalContainer_Title_Container_Participate>
          <NodeInfo_Top_LotteryGame_Info>
            <InputContainer>
              <NodeInfo_Top_Item>
                <div>{t("57")}</div>
                {RobotManageAwardInfo?.teamPerformanceNum ?? 0} VTB(
                {RobotManageAwardInfo?.teamPerformanceValue ?? 0}USDT)
              </NodeInfo_Top_Item>
              <NodeInfo_Top_Item>
                <div>{t("58")}</div>
                {RobotManageAwardInfo?.communityPerformanceNum ?? 0} VTB(
                {RobotManageAwardInfo?.communityPerformanceValue ?? 0}USDT)
              </NodeInfo_Top_Item>
            </InputContainer>
          </NodeInfo_Top_LotteryGame_Info>
          <NodeInfo_Top_Management_Info>
            <InputContainer>
              <NodeInfo_Top_Item>
                <div>{t("156")}</div>
                {RobotManageAwardInfo?.totalRefereeAward ?? 0} VTB
              </NodeInfo_Top_Item>
              <NodeInfo_Top_Item>
                <div>{t("157")}</div>
                {RobotManageAwardInfo?.totalManageAward ?? 0} VTB
              </NodeInfo_Top_Item>
            </InputContainer>
          </NodeInfo_Top_Management_Info>
          <NodeInfo_Top_Management_Reward>
            {t("102")}
            <div>
              {RobotManageAwardInfo?.amount ?? 0} <span>VTB</span>
            </div>
          </NodeInfo_Top_Management_Reward>
          <GetRewardBtn
            onClick={() => {
              getRewardFun(RobotManageAwardInfo?.amount ?? 0, 1);
            }}
          >
            {t("103")}
          </GetRewardBtn>
        </NodeInfo_Top_LotteryGame>
      </NodeInfo>

      <NodeInfo>
        <NodeInfo_Top_LotteryGame>
          <ModalContainer_Title_Container_Participate>
            <PerformanceRewardsIcon />
            <ModalContainer_Title>{t("158")}</ModalContainer_Title>
            <FinancialRecords
              onClick={() => {
                Navigate("/View/SubscriptionQuotaAwardRecord", {
                  state: { type: 2 },
                });
              }}
            >
              {t("56")}
              <SmallOutLinkIconBox />
            </FinancialRecords>
          </ModalContainer_Title_Container_Participate>
          <NodeInfo_Top_LotteryGame_Info>
            <InputContainer>
              <NodeInfo_Top_Item>
                <div>{t("159")}</div>
                {RobotPerformanceAwardInfo?.totalPerformanceStarNum ?? 0} VTB
              </NodeInfo_Top_Item>
              <NodeInfo_Top_Item>
                <div>{t("160")}</div>
                {RobotPerformanceAwardInfo?.totalPerformanceRefereeNum ?? 0} VTB
              </NodeInfo_Top_Item>
            </InputContainer>
          </NodeInfo_Top_LotteryGame_Info>
          <NodeInfo_Top_Management_Reward>
            {t("102")}
            <div>
              {RobotPerformanceAwardInfo?.amount ?? 0} <span>VTB</span>
            </div>
          </NodeInfo_Top_Management_Reward>
          <GetRewardBtn
            onClick={() => {
              getRewardFun(RobotPerformanceAwardInfo?.amount ?? 0, 2);
            }}
          >
            {t("103")}
          </GetRewardBtn>
        </NodeInfo_Top_LotteryGame>
      </NodeInfo>
      {/*recordType 1:认购机器人明星排名 2:质押明星排名*/}
      <Goto
        onClick={() => {
          Navigate("/View/RankRecord", { state: { type: 1, recordType: 1 } });
        }}
      >
        {t("161")} &gt;&gt;{" "}
      </Goto>
      <Goto
        onClick={() => {
          Navigate("/View/RankRecord", { state: { type: 2, recordType: 1 } });
        }}
      >
        {t("162")} &gt;&gt;{" "}
      </Goto>
      <Goto
        onClick={() => {
          Navigate("/View/RankRecord", { state: { type: 3, recordType: 1 } });
        }}
      >
        {t("163")} &gt;&gt;{" "}
      </Goto>
    </NodeContainerBox>
  );
}
