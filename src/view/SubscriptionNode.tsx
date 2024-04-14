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
  margin-bottom: 0px !important;
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
  const [Balance, setBalance] = useState<any>("");
  const [InputValueAmount, setInputValueAmount] = useState<any>("0");
  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.nodeContract, "USDT");

  // const {
  //   TOKENBalance,
  //   TOKENAllowance,
  //   handleApprove,
  //   handleTransaction,
  //   handleUSDTRefresh,
  // } = useUSDTGroup(contractAddress?.nftContract, "MBK");

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

    handleTransaction(value, async (call: any) => {
      let res: any;
      try {
        showLoding(true);
        let item: any = await buyNode({});
        if (item?.code === 200 && item?.data) {
          console.log(item?.data, "1212");
          res = await Contracts.example?.buyNode(
            web3ModalAccount as string,
            item?.data
          );
        }
      } catch (error: any) {
        showLoding(false);
        return addMessage(t("25"));
      }

      showLoding(false);
      if (!!res?.status) {
        call();
        Navigate("/View/Node");
        addMessage(t("26"));
      } else {
        addMessage(t("25"));
      }
    });
  };

  useEffect(() => {
    if (state.token) {
      getInitData();
    }
  }, [state.token]);

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
            {NodeBaseInfo?.price ?? 0} <span>USDT</span>
          </NodeInfo_Mid_Price>
          <NodeInfo_Mid_Rule>
            <HelpIcon />
            {t("12")}
          </NodeInfo_Mid_Rule>
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
              {t("181")}
            </div>
          </NodeInfo_Mid_Conditions>
        </NodeInfo_Mid>
        <NodeInfo_Bottom
          onClick={() => {
            buyNodeFun(NodeBaseInfo?.price + "");
          }}
        >
          {t("152")}
        </NodeInfo_Bottom>
      </NodeInfo>
    </NodeContainerBox>
  );
}
