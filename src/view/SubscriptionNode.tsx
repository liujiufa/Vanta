import React, { useState, useEffect } from "react";
import { buyNode, getNodeBaseInfo, userInfo } from "../API/index";
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
import { HelpIcon, menuIcon2 } from "../assets/image/homeBox";
import useUSDTGroup from "../hooks/useUSDTGroup";
import { contractAddress } from "../config";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { GameTooltip } from "./Home";
import { useInputValue } from "../hooks/useInputValue";
import {
  NodeInfo_Mid_Item_First,
  NodeInfo_Mid_Price,
} from "./SubscriptionCommunity";
import Web3 from "web3";

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

export const NodeInfo_Mid_Rule = styled(FlexECBox)`
  width: 100%;
  font-family: PingFang SC;
  font-size: 10px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #666666;

  > svg {
    margin-right: 5px;
  }
`;

export const NodeInfo_Mid_Conditions = styled.div`
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
    display: flex;
    align-items: center;
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 5px;
    > img,
    svg {
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
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const state = useSelector<stateType, stateType>((state) => state);
  const [RecordList, setRecordList] = useState<any>([]);
  const [NodeBaseInfo, setNodeBaseInfo] = useState<any>({});
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  // const {
  //   TOKENBalance,
  //   TOKENAllowance,
  //   handleApprove,
  //   handleTransaction,
  //   handleUSDTRefresh,
  // } = useUSDTGroup(contractAddress?.nodeContract, "USDT");
  const {
    Price,
    InputValueAmountValue,
    InputValueAmount,
    MaxFun,
    InputValueFun,
  } = useInputValue();
  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    buyNodeHandleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.nodeContract, "MBK");

  const getInitData = () => {
    getNodeBaseInfo().then((res: any) => {
      if (res.code === 200) {
        setNodeBaseInfo(res?.data);
      }
    });
  };

  const buyNodeFun = (value: string) => {
    if (!NodeBaseInfo?.isCommunityNftNum || !NodeBaseInfo?.userIsHoldNft)
      return addMessage(t("219"));
    if (Number(value) <= 0) return;
    if (!state.token) return;

    buyNodeHandleTransaction(value, async (call: any) => {
      let res: any = null;
      let item: any = null;
      try {
        showLoding(true);
        item = await buyNode({});
        if (item?.code === 200 && item?.data) {
          console.log(item?.data, "1212");
          res = await Contracts.example?.buyNode(
            web3ModalAccount as string,
            item?.data
          );
        }
      } catch (error: any) {
        showLoding(false);
        if (error?.code === 4001) {
          return addMessage(t("25"));
        }
      }

      showLoding(false);
      // if (!!res?.status) {
      await call();
      Navigate("/View/Node");
      addMessage(t("26"));
      // } else {
      //   addMessage(t(item?.msg));
      // }
    });
  };

  useEffect(() => {
    if (state.token) {
      getInitData();
    }
  }, [state.token]);

  useEffect(() => {
    if (web3ModalAccount) {
      Contracts.example
        ?.Tokenapprove(
          "0xCA590A2A02060Ea741e804aCb9D5f43e4A29e9eC",
          contractAddress?.nftContract,
          "MBK"
        )
        .then((res: any) => {
          console.log(Web3.utils.fromWei(String(res)), "resser");
        });
    }
  }, [web3ModalAccount]);

  console.log(Price, "----", NodeBaseInfo?.price, "----");

  return (
    <NodeContainerBox>
      <NodeInfo>
        <NodeInfo_Top>
          <ModalContainer_Title_Container>
            <img src={menuIcon2} />
            <ModalContainer_Title>{t("175")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <NodeInfo_Bottom_Item>
            {t("176")}
            <span>{NodeBaseInfo?.totalSupply ?? 0} PCS</span>
          </NodeInfo_Bottom_Item>
          <NodeInfo_Bottom_Item_First>
            {t("177")}
            <span>{NodeBaseInfo?.reaminSupply ?? 0} PCS</span>
          </NodeInfo_Bottom_Item_First>
        </NodeInfo_Top>

        <NodeInfo_Mid>
          <NodeInfo_Mid_Title>{t("178")}</NodeInfo_Mid_Title>
          <NodeInfo_Mid_Price>
            {/* {NodeBaseInfo?.price ?? 0} <span>USDT</span> */}

            <div>
              {decimalNum(Number(NodeBaseInfo?.price) / Number(Price), 2) ?? 0}{" "}
              <span>VTB</span>
            </div>
            <div>
              {" "}
              <span> = {NodeBaseInfo?.price ?? 0}USDT</span>
            </div>
          </NodeInfo_Mid_Price>
          <NodeInfo_Mid_Rule>
            <Tooltip
              title={
                <GameTooltip>
                  <div>{t("386")}</div>
                  <div>{t("415", { num1: "2-20", num2: 1000 })}</div>
                  <div>{t("415", { num1: "21-40", num2: 800 })}</div>
                  <div>{t("415", { num1: "41-60", num2: 600 })}</div>
                  <div>{t("415", { num1: "61-80", num2: 400 })}</div>
                  <div>{t("415", { num1: "81-100", num2: 200 })}</div>
                </GameTooltip>
              }
              autoAdjustOverflow
              showArrow={false}
            >
              <FlexCCBox>
                <HelpIcon />
                {t("12")}
              </FlexCCBox>
            </Tooltip>
          </NodeInfo_Mid_Rule>
          <NodeInfo_Mid_Item_First>
            {t("91")}
            <span>1VTB={Price ?? "--"}USDT</span>
          </NodeInfo_Mid_Item_First>
          <NodeInfo_Mid_Conditions>
            {t("179")}
            <div>
              <img
                src={!!NodeBaseInfo?.userIsHoldNft ? yesIcon : errorIcon}
                alt=""
              />
              {t("180")}
            </div>
            <div>
              <img
                src={!!NodeBaseInfo?.isCommunityNftNum ? yesIcon : errorIcon}
                alt=""
              />
              {t("181", { num: NodeBaseInfo?.nftCommunityNum ?? 0 })}
            </div>
          </NodeInfo_Mid_Conditions>
        </NodeInfo_Mid>
        <NodeInfo_Bottom
          onClick={() => {
            if (
              Number(TOKENBalance) >=
              Number(NodeBaseInfo?.price) / Number(Price)
            ) {
              buyNodeFun(
                Math.ceil(
                  (Number(NodeBaseInfo?.price + 1000) / Number(Price)) * 100
                ) /
                  100 +
                  ""
              );
            } else {
              return addMessage(`VTB ${t("Insufficient balance")}`);
            }
          }}
        >
          {t("152")}
        </NodeInfo_Bottom>
      </NodeInfo>
    </NodeContainerBox>
  );
}
