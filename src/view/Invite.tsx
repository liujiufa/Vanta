import React, { useState, useEffect } from "react";
import { getTeamData, userInfo } from "../API/index";
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
import { menuIcon4 } from "../assets/image/homeBox";
import copyFun from "copy-to-clipboard";
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
  align-items: flex-start;
  padding: 10px 15px;
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
    justify-content: flex-start;
    margin-top: 5px;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    text-decoration: underline;

    font-variation-settings: "opsz" auto;
    color: #d56819;
    > img {
      margin-left: 12px;
    }
  }
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
  grid-template-columns: repeat(6, 1fr);
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
  const [TeamData, setTeamData] = useState<any>({});
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Balance, setBalance] = useState<any>("");
  const [InputValueAmount, setInputValueAmount] = useState<any>("0");

  const getInitData = () => {
    getTeamData().then((res: any) => {
      if (res.code === 200) {
        setTeamData(res?.data);
      }
    });
  };
  function invitation(value: any) {
    if (!web3ModalAccount) {
      return addMessage(t("Please link wallet"));
    } else {
      copyFun(window.location.origin + "/" + value);
      addMessage(t("Copied successfully"));
    }
  }

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
            <img src={menuIcon4} />
            <ModalContainer_Title>{t("228")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <NodeInfo_Bottom_Item>
            {t("229")}
            <span>{TeamData?.teamNum ?? 0} </span>
          </NodeInfo_Bottom_Item>
          <NodeInfo_Bottom_Item_First>
            {t("230")}
            <span>{TeamData?.refereeNum ?? 0} </span>
          </NodeInfo_Bottom_Item_First>
        </NodeInfo_Top>

        <NodeInfo_Mid>
          {t("231")}:
          <div>
            <div>
              {window.location.origin +
                "/" +
                AddrHandle(web3ModalAccount as string, 6, 6)}
            </div>
            <img src={copyIcon} alt="" onClick={() => invitation(web3ModalAccount)} />
          </div>
        </NodeInfo_Mid>
      </NodeInfo>
      <DirectPush_Title_Container>
        <img src={DirectPushListIcon} />
        <ModalContainer_Title>{t("232")}</ModalContainer_Title>
      </DirectPush_Title_Container>
      {TeamData?.list?.length > 0 ? (
        <DirectPush_Content_Container>
          <DirectPush_Content_Container_Header>
            <div>{t("233")}</div>
            <div>
              {t("234")} <div>USDT</div>
            </div>
            <div>
              {t("235")} <div>USDT</div>
            </div>
            <div>{t("236")}</div>
            <div>{t("237")}</div>
            <div>NFT</div>
          </DirectPush_Content_Container_Header>
          <DirectPush_Content_Container_Content>
            {TeamData?.list?.map((item: any, index: any) => (
              <DirectPush_Content_Container_Content_Item key={index}>
                <div>{AddrHandle(item?.userAddress, 4, 4)}</div>
                <div>{item?.personalPerformance ?? 0}</div>
                <div>{item?.communityPerformance ?? 0}</div>
                <div>{!!item?.isNode ? "yes" : "no"}</div>
                <div>{!!item?.isCommunity ? "yes" : "no"}</div>
                <div>{!!item?.isNft ? "yes" : "no"}</div>
              </DirectPush_Content_Container_Content_Item>
            ))}
          </DirectPush_Content_Container_Content>
        </DirectPush_Content_Container>
      ) : (
        <NoData />
      )}
    </NodeContainerBox>
  );
}
