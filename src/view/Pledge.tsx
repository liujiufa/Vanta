import React, { useState, useEffect } from "react";
import {
  getHomePrice,
  refereeUserList,
  teamUserList,
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
import { AddrHandle, EthertoWei, NumSplic, addMessage } from "../utils/tool";
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
import { Carousel, Modal, Switch, Tooltip } from "antd";
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
import { DemonIcon, MyQuotaIcon } from "../assets/image/RobotBox";
import { NodeInfo_Mid_Rule } from "./SubscriptionNode";

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
const NodeInfo_Top_Management_Info_Bottom = styled(
  NodeInfo_Top_LotteryGame_Info
)`
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
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
  margin-right: 12px;
`;

const InputContainer_Bottom = styled(FlexSBCBox)`
  width: 100%;
`;

const NodeInfo_Mid_Rule_Robot = styled(NodeInfo_Mid_Rule)`
  width: fit-content;
`;

const Receive_Record_Container = styled(FlexSBCBox)`
  width: 100%;
  > div {
    flex: 1;
    display: flex;
    text-align: center;
    justify-content: center;
    padding: 12px;
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
const PledgeValue_Container = styled.div`
  width: 100%;
  border-top: 1px solid rgba(213, 104, 25, 0.2);
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
  > div {
    margin-bottom: 15px;
    &:last-child {
      margin-bottom: 15px;
    }
  }
`;

const PledgeValue = styled(FlexSBCBox)`
  width: 100%;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  > div {
    > span {
      font-family: PingFang SC;
      font-size: 18px;
      font-weight: normal;
      line-height: normal;
      text-transform: capitalize;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: #d56819;
    }
  }

  .ant-switch {
    background: #333333;
  }
  .ant-switch-checked {
    background: #d56819;
  }
`;

export default function Rank() {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const state = useSelector<stateType, stateType>((state) => state);
  const [RecordList, setRecordList] = useState<any>([]);
  const [UserInfo, setUserInfo] = useState<any>({});
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const [SubTab, setSubTab] = useState<any>(1);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Balance, setBalance] = useState<any>("");
  const [InputValueAmount, setInputValueAmount] = useState<any>("0");
  const [ActivationModal, setActivationModal] = useState(false);
  const getInitData = () => {
    userInfo({}).then((res: any) => {
      if (res.code === 200) {
        setUserInfo(res?.data);
      }
    });
  };
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  useEffect(() => {
    if (state.token) {
      getInitData();
    }
  }, [state.token, ActiveTab]);

  useEffect(() => {
    if (account) {
      Contracts.example
        .balanceOf(account as string, "LPToken")
        .then((res: any) => {
          setBalance(EthertoWei(res ?? "0"));
          Contracts.example
            .queryUsdtAmountByLPAmount(
              account as string,
              EthertoWei(res ?? "0") + ""
            )
            .then((res: any) => {
              console.log(res, "er");
              setInputValueAmount(EthertoWei(res ?? "0"));
            });
        });
    }
  }, [account]);

  const StateObj = (type: number) => {
    if (type === 1) {
      return <span style={{ color: "#D56819" }}>Confirming</span>;
    } else if (type === 2) {
      return <span style={{ color: "#0256FF" }}>successful</span>;
    }
  };

  return (
    <NodeContainerBox>
      <NodeInfo>
        <MyQuota>
          <MyQuota_Box>
            <MyQuota_Box_Left>
              <MyQuota_ModalContainer_Title_Container>
                <MyQuotaIconBox />
                <ModalContainer_Title>my pledge</ModalContainer_Title>
              </MyQuota_ModalContainer_Title_Container>
              <AvailableBox>
                In Pledge(MBK)
                <div>
                  3,000.00 <span>MBK</span>
                </div>
              </AvailableBox>
            </MyQuota_Box_Left>
            <MyQuota_BoxDevider />
            <MyQuota_Box_Right>
              grade
              <div>
                <DemonIconBox />
                V5
              </div>
            </MyQuota_Box_Right>
          </MyQuota_Box>
          <NodeInfo_Top_Item_Box>
            <NodeInfo_Top_Item>
              <div>Current stake value</div>
              100000 USDT
            </NodeInfo_Top_Item>
            <NodeInfo_Top_Item>
              <div>Historical pledge quantity</div>
              3000 MBK
            </NodeInfo_Top_Item>
            <NodeInfo_Top_Item>
              <div>Historical pledge value</div>
              3000 USDT
            </NodeInfo_Top_Item>
            <NodeInfo_Top_Item>
              <div>Cumulative static income</div>
              3000 MBK
            </NodeInfo_Top_Item>
          </NodeInfo_Top_Item_Box>
          <NodeInfo_Top_Management_Reward>
            To Be Collected
            <div>
              0 <span>MBK</span>
            </div>
          </NodeInfo_Top_Management_Reward>

          <Receive_Record_Container>
            <div>Receive</div>
            <div>Record</div>
          </Receive_Record_Container>
        </MyQuota>
      </NodeInfo>

      <NodeInfo>
        <NodeInfo_Top_LotteryGame>
          <ModalContainer_Title_Container_Participate>
            <QuotaSubscriptionIconBox />
            <ModalContainer_Title>Principal redemption</ModalContainer_Title>
            <FinancialRecords>
              redemption record
              <SmallOutLinkIconBox />
            </FinancialRecords>
          </ModalContainer_Title_Container_Participate>
          <NodeInfo_Top_Management_Info_Bottom>
            <InputContainer>
              <NodeInfo_Top_Item>
                <div>Accumulated redemption principal</div>
                3000 MBK
              </NodeInfo_Top_Item>
              <NodeInfo_Top_Item style={{ color: "#D56819" }}>
                <div>Waiting for redemption (MBK)</div>
                3000 MBK
              </NodeInfo_Top_Item>
            </InputContainer>
          </NodeInfo_Top_Management_Info_Bottom>

          <GetRewardBtn>redemption</GetRewardBtn>
        </NodeInfo_Top_LotteryGame>
      </NodeInfo>

      <NodeInfo>
        <NodeInfo_Top_LotteryGame>
          <ModalContainer_Title_Container_Participate>
            <QuotaSubscriptionIconBox />
            <ModalContainer_Title>Staking mining</ModalContainer_Title>
            <FinancialRecords>
              Pledge record <SmallOutLinkIconBox />
            </FinancialRecords>
          </ModalContainer_Title_Container_Participate>
          <NodeInfo_Top_LotteryGame_Info>
            <InputContainer>
              <NodeInfo_Top_Item>
                <div>Available robot quota x4</div>
                3000USDT
              </NodeInfo_Top_Item>
              <NodeInfo_Top_Item>
                <div>Current price</div>
                1MBK=30.00USDT
              </NodeInfo_Top_Item>
              <NodeInfo_Top_Item style={{ marginBottom: "18px" }}>
                <div>Pledge cycle</div>7 days
              </NodeInfo_Top_Item>

              <InputBox>
                <div>
                  <input type="" /> MBK
                </div>{" "}
                <div>MAX</div>
              </InputBox>
              <InputContainer_Bottom>
                <BalanceBox_InputContainer>
                  wallet balance{" "}
                  <div>
                    100,000.00 <span>mbk</span>
                  </div>
                </BalanceBox_InputContainer>

                <NodeInfo_Mid_Rule_Robot>
                  <HelpIcon />
                  rule
                </NodeInfo_Mid_Rule_Robot>
              </InputContainer_Bottom>
            </InputContainer>
          </NodeInfo_Top_LotteryGame_Info>
          <PledgeValue_Container>
            <PledgeValue>
              Pledge value{" "}
              <div>
                <span> 3000</span> USDT
              </div>
            </PledgeValue>
            <PledgeValue>
              Reinvestment at maturity
              <div>
                <Switch defaultChecked onChange={onChange} />
              </div>
            </PledgeValue>
          </PledgeValue_Container>

          <GetRewardBtn>pledge</GetRewardBtn>
        </NodeInfo_Top_LotteryGame>
      </NodeInfo>

      <NodeInfo>
        <NodeInfo_Top_LotteryGame>
          <ModalContainer_Title_Container_Participate>
            <QuotaSubscriptionIconBox />
            <ModalContainer_Title>Management rewards</ModalContainer_Title>
            <FinancialRecords>
              Award record
              <SmallOutLinkIconBox />
            </FinancialRecords>
          </ModalContainer_Title_Container_Participate>
          <NodeInfo_Top_LotteryGame_Info>
            <InputContainer>
              <NodeInfo_Top_Item>
                <div>Team performance</div>
                3000 MBK(6000USDT)
              </NodeInfo_Top_Item>
              <NodeInfo_Top_Item>
                <div>Community performance</div>
                3000 MBK(6000USDT)
              </NodeInfo_Top_Item>
            </InputContainer>
          </NodeInfo_Top_LotteryGame_Info>
          <NodeInfo_Top_Management_Info>
            <InputContainer>
              <NodeInfo_Top_Item>
                <div>Referral rewards</div>
                3000 MBK
              </NodeInfo_Top_Item>
              <NodeInfo_Top_Item>
                <div>Management rewards</div>
                3000 MBK
              </NodeInfo_Top_Item>
            </InputContainer>
          </NodeInfo_Top_Management_Info>
          <NodeInfo_Top_Management_Reward>
            To Be Collected(MBK)
            <div>
              0 <span>MBK</span>
            </div>
          </NodeInfo_Top_Management_Reward>
          <GetRewardBtn>receive</GetRewardBtn>
        </NodeInfo_Top_LotteryGame>
      </NodeInfo>

      <NodeInfo>
        <NodeInfo_Top_LotteryGame>
          <ModalContainer_Title_Container_Participate>
            <QuotaSubscriptionIconBox />
            <ModalContainer_Title>Performance rewards</ModalContainer_Title>
            <FinancialRecords>
              Award record
              <SmallOutLinkIconBox />
            </FinancialRecords>
          </ModalContainer_Title_Container_Participate>
          <NodeInfo_Top_LotteryGame_Info>
            <InputContainer>
              <NodeInfo_Top_Item>
                <div>Performance star rewards</div>
                3000 MBK
              </NodeInfo_Top_Item>
              <NodeInfo_Top_Item>
                <div>Direct promotion star rewards</div>
                3000 MBK
              </NodeInfo_Top_Item>
            </InputContainer>
          </NodeInfo_Top_LotteryGame_Info>
          <NodeInfo_Top_Management_Reward>
            To Be Collected(MBK)
            <div>
              0 <span>MBK</span>
            </div>
          </NodeInfo_Top_Management_Reward>
          <GetRewardBtn>receive</GetRewardBtn>
        </NodeInfo_Top_LotteryGame>
      </NodeInfo>
      <Goto>Performance star ranking &gt;&gt; </Goto>
      <Goto>Directly recommend star ranking &gt;&gt; </Goto>
      <Goto>NFT team star &gt;&gt; </Goto>

      <AllModal
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
        <ModalContainer>
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
            <img src={logo} alt="" />
            <ModalContainer_Title>{t("Node activation")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <ModalContainer_Content>
            Activation requires destroying MBK
            <span>100</span>
            <UpBtn
              onClick={() => {
                // BindFun();
              }}
            >
              {t("Activation")}
            </UpBtn>
            <BalanceBox>
              wallet balance: <span>100,000.00</span>MBK
            </BalanceBox>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>
    </NodeContainerBox>
  );
}
