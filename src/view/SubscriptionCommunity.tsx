import React, { useState, useEffect } from "react";
import {
  
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
import { Carousel, Tooltip } from "antd";
import { useGetReward } from "../hooks/useGetReward";
import { Contracts } from "../web3";
import logo from "../assets/image/logo.png";
import {
  ModalContainer_Title,
  ModalContainer_Title_Container,
} from "../Layout/MainLayout";
import helpIcon from "../assets/image/Home/helpIcon.svg";
import errorIcon from "../assets/image/Subscription/errorIcon.svg";
import yesIcon from "../assets/image/Subscription/yesIcon.svg";

const NodeContainerBox = styled(ContainerBox)`
  width: 100%;
`;

const NodeInfo = styled.div`
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(213, 104, 25, 0.2);
`;

const NodeInfo_Top = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  padding: 15px;
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

const NodeInfo_Bottom = styled(FlexCCBox)`
  padding: 12px;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #d56819;
  > div {
    margin-bottom: 13px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
`;
const NodeInfo_Bottom_Item = styled(FlexSBCBox)`
  margin-top: 30px;
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
const NodeInfo_Bottom_Item_First = styled(NodeInfo_Bottom_Item)`
  margin-top: 18px;
`;
const NodeInfo_Mid_Item_First = styled(NodeInfo_Bottom_Item_First)`
  margin: 0px 0px 5px 0px !important;
`;

const NodeInfo_Mid = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 15px;
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
  > div {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
`;
const NodeInfo_Mid_Title = styled(FlexCCBox)`
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
`;
const NodeInfo_Mid_Price = styled(FlexCCBox)`
  width: 100%;
  font-family: PingFang SC;
  font-size: 18px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #d56819;

  z-index: 0;
  > span {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    text-transform: uppercase;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: rgba(255, 255, 255, 0.8);
    margin-left: 5px;
  }
`;
const NodeInfo_Mid_Rule = styled(FlexECBox)`
  width: 100%;
  font-family: PingFang SC;
  font-size: 10px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #666666;
  /* margin-bottom: 15px !important; */
  > img {
    margin-right: 5px;
  }
`;

const NodeInfo_Mid_Conditions = styled.div`
  margin-top: 15px;
  width: 100%;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #d56819;
  > div {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 5px;
    > img {
      margin-right: 5px;
    }
    &:first-child {
      margin-top: 10px;
    }
  }
`;

export default function Rank() {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const state = useSelector<stateType, stateType>((state) => state);
  const [RecordList, setRecordList] = useState<any>([]);
  const [UserInfo, setUserInfo] = useState<any>({});
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Balance, setBalance] = useState<any>("");
  const [InputValueAmount, setInputValueAmount] = useState<any>("0");

  const getInitData = () => {
    userInfo({}).then((res: any) => {
      if (res.code === 200) {
        setUserInfo(res?.data);
      }
    });
  };

  useEffect(() => {
    if (state.token) {
       //getInitData();
    }
  }, [state.token, ActiveTab]);

  useEffect(() => {
    if (account) {
       
    }
  }, [account]);

  return (
    <NodeContainerBox>
      <NodeInfo>
        <NodeInfo_Top>
          <ModalContainer_Title_Container>
            <img src={logo} />
            <ModalContainer_Title>Subscription Node</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <NodeInfo_Bottom_Item>
            Total Community
            <span>36 PCS</span>
          </NodeInfo_Bottom_Item>
          <NodeInfo_Bottom_Item_First>
            The Remaining Amount
            <span>36 PCS</span>
          </NodeInfo_Bottom_Item_First>
        </NodeInfo_Top>

        <NodeInfo_Mid>
          <NodeInfo_Mid_Title>
            Current community activation price
          </NodeInfo_Mid_Title>
          <NodeInfo_Mid_Price>
            10000 <span>USDT</span>
          </NodeInfo_Mid_Price>
          <NodeInfo_Mid_Rule>
            <img src={helpIcon} alt="" />
            rule
          </NodeInfo_Mid_Rule>
          <NodeInfo_Mid_Item_First>
            Current price
            <span>1MBK=30.00USDT</span>
          </NodeInfo_Mid_Item_First>
          <NodeInfo_Mid_Item_First>
            Equivalent MBK quantity
            <span>3000 MBK</span>
          </NodeInfo_Mid_Item_First>
          <NodeInfo_Mid_Conditions>
            Subscription conditions
            <div>
              <img src={yesIcon} alt="" />
              You must be a node
            </div>
            <div>
              <img src={errorIcon} alt="" />
              At least two nodes in the community and the team's performance reaches 300,000 U
            </div>
          </NodeInfo_Mid_Conditions>
        </NodeInfo_Mid>
        <NodeInfo_Bottom>Subscription</NodeInfo_Bottom>
      </NodeInfo>
    </NodeContainerBox>
  );
}
