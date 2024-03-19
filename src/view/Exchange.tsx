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
import { Carousel, Tooltip } from "antd";
import { useGetReward } from "../hooks/useGetReward";
import { Contracts } from "../web3";
import logo from "../assets/image/logo.png";
import {
  ModalContainer_Title,
  ModalContainer_Title_Container,
} from "../Layout/MainLayout";
import transferIcon from "../assets/image/Exchange/transferIcon.svg";
import exchangeIcon from "../assets/image/Exchange/exchangeIcon.svg";
import { DirectPush_Title_Container } from "./Invite";
import {
  Award_Record_Content,
  Award_Record_Content_Record_Content,
  Get_Record_Content_Record_Content_Item,
} from "./Community";
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
const CoinBox = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
`;
const CoinBox_Item = styled(FlexSBCBox)`
  width: 100%;
  > img {
    width: 30px;
  }
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 63px;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;

    z-index: 1;
  }
  > input {
    flex: 1;
    border-radius: 8px;
    opacity: 1;

    background: rgba(213, 104, 25, 0.2);

    box-sizing: border-box;
    border: 1px solid rgba(213, 104, 25, 0.2);
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #999999;
    padding: 10px 15px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const CoinBox_Transfer = styled(FlexBox)`
  justify-content: space-evenly;
  width: 100%;
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  margin: 12px 0px;
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

  const StateObj = (type: number) => {
    if (type === 1) {
      return <span style={{ color: "#D56819" }}>Confirming</span>;
    } else if (type === 2) {
      return <span style={{ color: "#0256FF" }}>Confirming</span>;
    }
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

  return (
    <NodeContainerBox>
      <NodeInfo>
        <NodeInfo_Top>
          <CoinBox>
            <CoinBox_Item>
              <img src={logo} />
              <div>USDT</div>
              <input type="number" placeholder="Please enter quantity" />
            </CoinBox_Item>

            <CoinBox_Transfer>
              <img src={transferIcon} alt="" />
              1MBK=30.00USDT
            </CoinBox_Transfer>
            <CoinBox_Item>
              <img src={logo} />
              <div>MBK</div>
              <input type="number" placeholder="Please enter quantity" />
            </CoinBox_Item>
          </CoinBox>
        </NodeInfo_Top>

        <NodeInfo_Bottom>exchange</NodeInfo_Bottom>
      </NodeInfo>
      <DirectPush_Title_Container>
        <img src={exchangeIcon} alt="" />
        <ModalContainer_Title>Exchange record</ModalContainer_Title>
      </DirectPush_Title_Container>
      <Award_Record_Content>
        <Award_Record_Content_Record_Content>
          {true ? (
            [1, 2, 3, 4, 5].map((item: any, index: any) => (
              <Get_Record_Content_Record_Content_Item key={index} type={1}>
                <div>
                  Type <span>Subscription</span>
                </div>
                <div>
                  Time <span>2023-12-23 12:23</span>
                </div>
                <div>
                  Payment amount(USDT) <span>2000.00</span>
                </div>
                <div>State{StateObj(1)}</div>
                <div>
                  Transaction hash<span>0x085.....f350f1c3</span>
                </div>
              </Get_Record_Content_Record_Content_Item>
            ))
          ) : (
            <NoData></NoData>
          )}
        </Award_Record_Content_Record_Content>
      </Award_Record_Content>
    </NodeContainerBox>
  );
}
