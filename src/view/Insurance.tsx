import React, { useState, useEffect } from "react";
import { getInsureStatus, userInfo } from "../API/index";
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
  const [RecordList, setRecordList] = useState<any>([]);
  const [InsureStatus, setInsureStatus] = useState<any>({});
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
              100000 MBK
            </Pool_Amount>
            <NodeInfo_Top_Message>
              12:24:46 0x12ds....fdee pledge value 3000USDT
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
                  3,000.00 <span>mbk</span>
                </div>
              </NodeInfo_Bottom_Box_Tip>
              <ReceiveBtn>receive</ReceiveBtn>
            </NodeInfo_Bottom_Box>
            <NodeInfo_Bottom_Bottom_Box>
              <Pool_Amount>
                <div>Insurance Pool Amount</div>
                100000 MBK
              </Pool_Amount>
              <NodeInfo_Top_Message>
                12:24:46 0x12ds....fdee pledge value 3000USDT
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
            Current <div>pledge</div>{" "}
          </div>
          <div>
            Compensation <div>multiple</div>
          </div>
        </DirectPush_Content_Container_Header>
        <DirectPush_Content_Container_Content>
          <DirectPush_Content_Container_Content_Item>
            <div>1</div>
            <div></div>
            <div></div>
            <div></div>
          </DirectPush_Content_Container_Content_Item>
          <DirectPush_Content_Container_Content_Item>
            <div>2</div>
            <div></div>
            <div></div>
            <div></div>
          </DirectPush_Content_Container_Content_Item>
          <DirectPush_Content_Container_Content_Item>
            <div>3</div>
            <div></div>
            <div></div>
            <div></div>
          </DirectPush_Content_Container_Content_Item>
        </DirectPush_Content_Container_Content>
      </DirectPush_Content_Container>
    </NodeContainerBox>
  );
}
