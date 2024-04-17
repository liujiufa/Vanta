import React, { useState, useEffect } from "react";
import {
  getGamePoolInfo,
  getGameProfit,
  joinGame,
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
  LotteryGameIcon,
  ParticipateGameIcon,
  ReservePoolIcon,
  SmallOutLinkIcon,
  ZeroStrokeIcon,
} from "../assets/image/homeBox";
import useUSDTGroup from "../hooks/useUSDTGroup";
import { contractAddress } from "../config";
import useTime from "../hooks/useTime";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
dayjs.extend(duration);
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
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const token = useSelector<any>((state) => state.token);
  const [RecordList, setRecordList] = useState<any>([]);
  const [GameProfit, setGameProfit] = useState<any>({});
  const [GamePoolInfo, setGamePoolInfo] = useState<any>({});
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const [SubTab, setSubTab] = useState<any>(1);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Balance, setBalance] = useState<any>("");
  const [InputValueAmount, setInputValueAmount] = useState<any>(
    GamePoolInfo?.gameJoinNum ?? 0
  );
  const [ActivationModal, setActivationModal] = useState(false);
  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.gameContract, "MBK");
  const [diffTime, status, initDiffTime, setDiffTime] = useTime({
    initDiffTime: 0,
  });
  const getInitData = () => {
    getGameProfit().then((res: any) => {
      if (res.code === 200) {
        setGameProfit(res?.data);
      }
    });
    getGamePoolInfo().then((res: any) => {
      if (res.code === 200) {
        setGamePoolInfo(res?.data);
        setInputValueAmount(res?.data?.gameJoinNum);
      }
    });
  };

  const joinInGameFun = (value: string) => {
    if (!token) return;
    if (Number(value) <= 0) return;
    handleTransaction(value, async (call: any) => {
      let res: any;
      try {
        showLoding(true);

        let item: any = await joinGame({ gameId: 0, num: value });
        if (item?.code === 200 && item?.data) {
          console.log(item?.data, "1212");

          res = await Contracts.example?.participate(
            web3ModalAccount as string,
            item?.data
          );
        }
      } catch (error: any) {
        showLoding(false);
        return addMessage(t("69"));
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        addMessage(t("70"));
      } else {
        addMessage(t("69"));
      }
    });
  };
  const InputValueFun = async (e: any) => {
    let value = e.target.value.replace(/^[^1-9]+|[^0-9]/g, "");
    setInputValueAmount(value);
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
      "gameContract"
    );
  };

  useEffect(() => {
    if (token) {
      // 获取当前日期和时间
      const now = new Date();
      // 创建一个新的日期对象表示今天结束的时刻（即下一个午夜12点）
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      // 计算当前时间到今天结束的毫秒数
      const millisecondsLeft = Number(endOfDay) - Number(now);
      // 将毫秒数转换为秒数
      const secondsLeft = Math.floor(millisecondsLeft / 1000);
      setDiffTime(secondsLeft);
      getInitData();
    }
  }, [token]);

  const StateObj = (type: number) => {
    if (type === 1) {
      return <span style={{ color: "#D56819" }}>{t("203")}</span>;
    } else if (type === 2) {
      return <span style={{ color: "#0256FF" }}>{t("204")}</span>;
    }
  };

  return (
    <NodeContainerBox>
      <NodeInfo>
        <NodeInfo_Top>
          <ModalContainer_Title_Container>
            <img src={LotteryGameIcon} />
            <ModalContainer_Title>{t("267")}</ModalContainer_Title>
          </ModalContainer_Title_Container>

          <NodeInfo_Top_Item>
            <div>{t("268")}</div>
            {GameProfit?.useAmount ?? 0} VTB
          </NodeInfo_Top_Item>
          <NodeInfo_Top_Item>
            <div>{t("269")}</div>
            {GameProfit?.profitAmount ?? 0} VTB
          </NodeInfo_Top_Item>
          <NodeInfo_Top_Item>
            <div>{t("270")}</div>
            {GameProfit?.profitRate ?? 0}%
          </NodeInfo_Top_Item>
        </NodeInfo_Top>
      </NodeInfo>

      <NodeInfo>
        <NodeInfo_Top_LotteryGame>
          <ModalContainer_Title_Container_Participate>
            <img src={ParticipateGameIcon} />
            <ModalContainer_Title>{t("271")}</ModalContainer_Title>
            <FinancialRecords
              onClick={() => {
                Navigate("/View/FinancialRecord");
              }}
            >
              {t("272")} <SmallOutLinkIconBox />
            </FinancialRecords>
          </ModalContainer_Title_Container_Participate>
          <NodeInfo_Top_LotteryGame_Info>
            <InputContainer>
              {t("273")}
              <InputBox>
                <div>
                  <input
                    type=""
                    value={InputValueAmount}
                    readOnly={true}
                    // onChange={InputValueFun}
                  />{" "}
                  VTB
                </div>{" "}
                <div
                  onClick={() => {
                    joinInGameFun(String(InputValueAmount));
                  }}
                >
                  {t("274")}
                </div>
              </InputBox>
              <BalanceBox_InputContainer>
                {t("50")}{" "}
                <div>
                  {TOKENBalance} <span>VTB</span>
                </div>
              </BalanceBox_InputContainer>
            </InputContainer>

            <NodeInfo_Top_Item>
              <div>{t("275")}</div>
              {GamePoolInfo?.todayAddPoolAmount ?? 0} VTB
            </NodeInfo_Top_Item>
            <NodeInfo_Top_Item>
              <div>{t("276")}</div>
              {GamePoolInfo?.todayGamePoolAmount ?? 0} VTB
            </NodeInfo_Top_Item>
            <NodeInfo_Top_Item>
              <div>{t("277")}</div>
              {Number(diffTime) > 0 ? (
                <div>
                  {dayjs?.duration(diffTime, "seconds").format("HH")}{" "}
                  <span>{t("283")}</span>
                  {dayjs?.duration(diffTime, "seconds").format("mm")}{" "}
                  <span>{t("284")}</span>
                  {dayjs?.duration(diffTime, "seconds").format("ss")}{" "}
                  <span>{t("285")}</span>
                </div>
              ) : (
                <div>
                  00 <span>{t("283")}</span>00 <span>{t("284")}</span>00{" "}
                  <span>{t("285")}</span>
                </div>
              )}
            </NodeInfo_Top_Item>
          </NodeInfo_Top_LotteryGame_Info>
          <NodeInfo_Top_LotteryGame_Reward>
            {t("278")}
            <div>
              {GameProfit?.waitReceiveAmount ?? 0} <span>VTB</span>
            </div>
          </NodeInfo_Top_LotteryGame_Reward>
          <GetRewardBtn
            onClick={() => {
              getRewardFun(GameProfit?.waitReceiveAmount ?? 0, 13);
            }}
          >
            {t("266")}
          </GetRewardBtn>
        </NodeInfo_Top_LotteryGame>
      </NodeInfo>
      <Goto
        onClick={() => {
          Navigate("/View/Announcement", { state: { recordType: 1 } });
        }}
      >
        {t("279")} &gt;&gt;{" "}
      </Goto>
      <NodeInfo>
        <NodeInfo_Top_LotteryGame>
          <ModalContainer_Title_Container_Participate>
            <img src={ReservePoolIcon} />
            <ModalContainer_Title>{t("280")}</ModalContainer_Title>
          </ModalContainer_Title_Container_Participate>
          <NodeInfo_Top_ReservePool>
            <NodeInfo_Top_Item>
              <div>{t("281")}</div>
              {GamePoolInfo?.todayAddReadyPoolAmount ?? 0} VTB
            </NodeInfo_Top_Item>
            <NodeInfo_Top_Item>
              <div>{t("282")}</div>
              {GamePoolInfo?.readyPoolTotalAmount ?? 0} VTB
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
            <ModalContainer_Title>{t("187")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <ModalContainer_Content>
            Activation requires destroying VTB
            <span>100</span>
            <UpBtn
              onClick={() => {
                // BindFun();
              }}
            >
              {t("97")}
            </UpBtn>
            <BalanceBox>
              {t("50")}: <span>100,000.00</span>VTB
            </BalanceBox>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>
    </NodeContainerBox>
  );
}
