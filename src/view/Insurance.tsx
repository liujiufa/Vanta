import React, { useState, useEffect } from "react";
import {
  getInsureRank,
  getInsureResult,
  getInsureStatus,
  latestRecord,
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
import { Carousel, Tooltip } from "antd";
import { useGetReward } from "../hooks/useGetReward";
import { Contracts } from "../web3";
import logo from "../assets/image/logo.png";
import {
  ModalContainer_Title,
  ModalContainer_Title_Container,
} from "../Layout/MainLayout";
import copyIcon from "../assets/image/Invite/copyIcon.svg";
import DirectPushListIcon from "../assets/image/Invite/DirectPushListIcon.svg";
import announcementIcon from "../assets/image/Home/announcementIcon.svg";
import { HelpIcon, menuIcon7 } from "../assets/image/homeBox";
import useTime from "../hooks/useTime";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const NodeContainerBox = styled(ContainerBox)`
  width: 100%;
`;

const NodeInfo = styled.div`
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(213, 104, 25, 0.2);
`;

export const NodeInfo_Top_Rule = styled(FlexECBox)`
  position: absolute;
  top: 5px;
  right: 5px;
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #999999;
  > img {
    margin-right: 5px;
  }
`;

const NodeInfo_Top = styled(FlexBox)`
  position: relative;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  /* border-bottom: 1px solid rgba(213, 104, 25, 0.2); */
`;
const NodeInfo_Bottom_Box = styled(NodeInfo_Top)`
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
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

export const DirectPush_Title_Container = styled(
  ModalContainer_Title_Container
)`
  margin: 16px 10px 16px 0px;
`;

const DirectPush_Content_Container = styled.div`
  width: 100%;
  border-radius: 10px;
`;

const DirectPush_Content_Container_Header = styled.div`
  width: 100%;
  border-radius: 10px 10px 0px 0px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  > div {
    &:first-child {
      border-radius: 10px 0px 0px 0px;
    }
    &:last-child {
      border-radius: 0px 10px 0px 0px;
    }

    display: grid;
    align-items: center;
    justify-items: center;
    background: rgba(213, 104, 25, 0.2);
    padding: 5px 0px;
    font-family: PingFang SC;
    font-size: 10px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    border: 1px solid rgba(213, 104, 25, 0.4);

    font-variation-settings: "opsz" auto;
    color: rgba(213, 104, 25, 0.8);
  }
`;
const DirectPush_Content_Container_Content = styled.div`
  width: 100%;
  > div {
    &:last-child {
      > div {
        &:first-child {
          border-radius: 0px 0px 0px 10px;
        }
        &:last-child {
          border-radius: 0px 0px 10px 0px;
        }
      }
    }
  }
`;
const DirectPush_Content_Container_Content_Item = styled(
  DirectPush_Content_Container_Header
)`
  > div {
    &:first-child {
      border-radius: 0px 0px 0px 0px;
    }
    &:last-child {
      border-radius: 0px 0px 0px 0px;
    }
    background: transparent;
    font-family: PingFang SC;
    font-size: 10px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;
  }
`;

const NodeInfo_Top_Tip = styled(FlexCCBox)`
  width: 100%;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: rgba(213, 104, 25, 0.8);
  margin: 15px 0px 10px;
  > div {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;
    margin-right: 5px;
  }
`;

const Pool_Amount = styled(FlexSBCBox)`
  width: 100%;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  margin-bottom: 10px;
  > div {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;
  }
`;
const NodeInfo_Top_Message = styled.div`
  background: rgba(213, 104, 25, 0.2);
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid rgba(213, 104, 25, 0.2);
  padding: 12px;
  width: 100%;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #d56819;
`;

export const HelpIconAuto = styled(HelpIcon)`
  margin-right: 5px;
`;

const NodeInfo_Bottom_Bottom_Box = styled.div`
  width: 100%;
  padding: 15px;
`;

const NodeInfo_Bottom_Box_Tip = styled(FlexSBCBox)`
  width: 100%;
  margin: 20px 0px;
  > div {
    display: flex;
    align-items: center;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;
    &:last-child {
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
  }
`;

const ReceiveBtn = styled(Btn)`
  width: fit-content;
`;

export default function Rank() {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const state = useSelector<stateType, stateType>((state) => state);
  const [InsureRank, setInsureRank] = useState<any>([]);
  const [InsureStatus, setInsureStatus] = useState<any>({});
  const [LastRecord, setLastRecord] = useState<any>({});
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Balance, setBalance] = useState<any>("");
  const [InputValueAmount, setInputValueAmount] = useState<any>("0");
  const [diffTime, status, initDiffTime, setDiffTime] = useTime({
    initDiffTime: 0,
  });
  const getInitData = () => {
    getInsureStatus().then((res: any) => {
      if (res.code === 200) {
        setInsureStatus(res?.data);
        setDiffTime(Number(res?.data?.timestamp));
      }
    });
    latestRecord({}).then((res: any) => {
      if (res.code === 200) {
        setLastRecord(res?.data);
      }
    });
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
    if (state.token) {
      getInitData();
    }
  }, [state.token]);

  useEffect(() => {
    if (state.token && Number(diffTime) <= 0) {
      getInitData();
    }
  }, [state.token, diffTime]);

  useEffect(() => {
    getInsureResult().then((res: any) => {
      setInsureRank(res?.data ?? []);
    });
  }, []);

  return (
    <NodeContainerBox>
      <NodeInfo>
        {Number(InsureStatus?.status) !== 3 ? (
          <NodeInfo_Top>
            <NodeInfo_Top_Rule>
              <HelpIconAuto /> Rule export{" "}
            </NodeInfo_Top_Rule>
            <ModalContainer_Title_Container>
              <img src={menuIcon7} />
              <ModalContainer_Title>Insurance Status</ModalContainer_Title>
            </ModalContainer_Title_Container>

            {Number(InsureStatus?.status) !== 2 ? (
              <NodeInfo_Top_Tip>Enter single normally</NodeInfo_Top_Tip>
            ) : (
              <NodeInfo_Top_Tip>
                <div> The allocation mechanism will start after</div>{" "}
                {dayjs?.duration(diffTime, "seconds").format("HH:mm:ss")}
              </NodeInfo_Top_Tip>
            )}

            <Pool_Amount>
              <div>Insurance Pool Amount</div>
              {InsureStatus?.poolNum ?? 0} MBK
            </Pool_Amount>
            <NodeInfo_Top_Message>
              {dateFormat(
                "YYYY-mm-dd HH:MM:SS",
                new Date(LastRecord?.createTime)
              )}{" "}
              {AddrHandle(LastRecord?.userAddress, 6, 4)} pledge value
              {LastRecord?.pledgeAmount ?? 0}USDT
            </NodeInfo_Top_Message>
          </NodeInfo_Top>
        ) : (
          <>
            <NodeInfo_Bottom_Box>
              export{" "}
              <NodeInfo_Top_Rule>
                <HelpIconAuto /> Rule export{" "}
              </NodeInfo_Top_Rule>
              <ModalContainer_Title_Container>
                <img src={menuIcon7} />
                <ModalContainer_Title>Insurance Status</ModalContainer_Title>
              </ModalContainer_Title_Container>
              <NodeInfo_Bottom_Box_Tip>
                <div> Compensated and pending</div>{" "}
                <div>
                  {InsureStatus?.waitReceiveAmount ?? 0} <span>mbk</span>
                </div>
              </NodeInfo_Bottom_Box_Tip>
              <ReceiveBtn
                onClick={() => {
                  getRewardFun(InsureStatus?.waitReceiveAmount ?? 0, 16);
                }}
              >
                receive
              </ReceiveBtn>
            </NodeInfo_Bottom_Box>
            <NodeInfo_Bottom_Bottom_Box>
              <Pool_Amount>
                <div>Insurance Pool Amount</div>
                {InsureStatus?.poolNum ?? 0} MBK
              </Pool_Amount>
              <NodeInfo_Top_Message>
                {dateFormat(
                  "YYYY-mm-dd HH:MM:SS",
                  new Date(LastRecord?.createTime)
                )}{" "}
                {AddrHandle(LastRecord?.userAddress, 6, 4)} pledge value
                {LastRecord?.pledgeAmount ?? 0}USDT
              </NodeInfo_Top_Message>
            </NodeInfo_Bottom_Bottom_Box>
          </>
        )}
      </NodeInfo>
      <DirectPush_Title_Container>
        <img src={DirectPushListIcon} />
        <ModalContainer_Title>
          Enter in reverse order 10 people
        </ModalContainer_Title>
      </DirectPush_Title_Container>
      <DirectPush_Content_Container>
        <DirectPush_Content_Container_Header>
          <div>Number</div>
          <div>Address</div>
          <div>
            Current <div>pledge（USDT）</div>{" "}
          </div>
          <div>
            Compensation <div>multiple</div>
          </div>
        </DirectPush_Content_Container_Header>
        <DirectPush_Content_Container_Content>
          {InsureRank?.map((item: any, index: any) => (
            <DirectPush_Content_Container_Content_Item key={index}>
              <div>{Number(index) + 1}</div>
              <div>{AddrHandle(item?.userAddress, 6, 4)}</div>
              <div>{item?.pledgeAmount ?? 0}</div>
              <div>{item?.multiple ?? 0}</div>
            </DirectPush_Content_Container_Content_Item>
          ))}
        </DirectPush_Content_Container_Content>
      </DirectPush_Content_Container>
    </NodeContainerBox>
  );
}
