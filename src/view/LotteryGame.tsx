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
  LotteryGameIcon,
  ParticipateGameIcon,
  ReservePoolIcon,
  SmallOutLinkIcon,
  ZeroStrokeIcon,
} from "../assets/image/homeBox";

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
  color: #ffffff;
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
    color: #ffffff;
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
      color: #ffffff;
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
  border-top: 1px solid rgba(213, 104, 25, 0.2);
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
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
const NodeInfo_Top_ReservePool = styled(NodeInfo_Top_LotteryGame_Info)`
  > div {
    &:first-child {
      margin-top: 0px;
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
        <NodeInfo_Top>
          <ModalContainer_Title_Container>
            <img src={LotteryGameIcon} />
            <ModalContainer_Title>My Profit and loss</ModalContainer_Title>
          </ModalContainer_Title_Container>

          <NodeInfo_Top_Item>
            <div>Amount participated</div>
            100000 MBK
          </NodeInfo_Top_Item>
          <NodeInfo_Top_Item>
            <div>Profit And Loss Amount</div>
            10000 MBK
          </NodeInfo_Top_Item>
          <NodeInfo_Top_Item>
            <div>Profit and Loss Ratio</div>
            +20%
          </NodeInfo_Top_Item>
        </NodeInfo_Top>
      </NodeInfo>

      <NodeInfo>
        <NodeInfo_Top_LotteryGame>
          <ModalContainer_Title_Container_Participate>
            <img src={ParticipateGameIcon} />
            <ModalContainer_Title>Participate in the game</ModalContainer_Title>
            <FinancialRecords>
              Financial records <SmallOutLinkIconBox />
            </FinancialRecords>
          </ModalContainer_Title_Container_Participate>
          <NodeInfo_Top_LotteryGame_Info>
            <InputContainer>
              Purchase lottery entry
              <InputBox>
                <div>
                  <input type="" /> MBK
                </div>{" "}
                <div>Buy now</div>
              </InputBox>
              <BalanceBox_InputContainer>
                wallet balance{" "}
                <div>
                  100,000.00 <span>mbk</span>
                </div>
              </BalanceBox_InputContainer>
            </InputContainer>

            <NodeInfo_Top_Item>
              <div>Today's new jackpot amount</div>
              120000 MBK
            </NodeInfo_Top_Item>
            <NodeInfo_Top_Item>
              <div>total jackpot amount for this round</div>
              10000 MBK
            </NodeInfo_Top_Item>
            <NodeInfo_Top_Item>
              <div>Pending Reward</div>
              <div>
                01 <span>HR</span>20 <span>MIN</span>29 <span>SEC</span>
              </div>
            </NodeInfo_Top_Item>
          </NodeInfo_Top_LotteryGame_Info>
          <NodeInfo_Top_LotteryGame_Reward>
            Pending Reward
            <div>
              0 <span>mbk</span>
            </div>
          </NodeInfo_Top_LotteryGame_Reward>
          <GetRewardBtn>reward</GetRewardBtn>
        </NodeInfo_Top_LotteryGame>
      </NodeInfo>
      <Goto>Announcement of lottery results &gt;&gt; </Goto>
      <NodeInfo>
        <NodeInfo_Top_LotteryGame>
          <ModalContainer_Title_Container_Participate>
            <img src={ReservePoolIcon} />
            <ModalContainer_Title>Reserve pool</ModalContainer_Title>
          </ModalContainer_Title_Container_Participate>
          <NodeInfo_Top_ReservePool>
            <NodeInfo_Top_Item>
              <div>Today's reserve pool addition</div>
              120000 MBK
            </NodeInfo_Top_Item>
            <NodeInfo_Top_Item>
              <div>Total reserve pool amount</div>
              10000 MBK
            </NodeInfo_Top_Item>
          </NodeInfo_Top_ReservePool>
        </NodeInfo_Top_LotteryGame>
      </NodeInfo>

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
