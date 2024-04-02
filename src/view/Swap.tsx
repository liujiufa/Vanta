import React, { useState, useEffect } from "react";
import { getExchangeRecord, userInfo } from "../API/index";
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
  decimalNum,
  showLoding,
} from "../utils/tool";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
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
import { useInputValue } from "../hooks/useInputValue";
import useUSDTGroup from "../hooks/useUSDTGroup";
import { contractAddress } from "../config";
import { throttle } from "lodash";
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
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Price, setPrice] = useState<any>("0");
  const [InputValue1, setInputValue1] = useState<any>("");
  const [InputValue2, setInputValue2] = useState<any>("");
  const [swapType, setSwapType] = useState<any>(1);
  const location = useLocation();
  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(
    contractAddress?.IPancakeRouter02,
    Number(swapType) === 1 ? "USDT" : "MBK"
  );
  const SwapObj = {
    1: [contractAddress?.USDT, contractAddress?.MBK],
    2: [contractAddress?.MBK, contractAddress?.USDT],
  };

  const getInitData = () => {
    getExchangeRecord().then((res: any) => {
      if (res.code === 200) {
        setRecordList(res?.data);
      }
    });
  };

  // 1:USDT=>MBK 2:MBK=>USDT
  const SwapFun = (value: string) => {
    if (!account) return;
    if (Number(value) <= 0) return;
    handleTransaction(value, async (call: any) => {
      let res: any;
      try {
        showLoding(true);
        res =
          await Contracts.example?.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            account as string,
            value,
            0,
            SwapObj[swapType ?? 1],
            Number(new Date().valueOf()) + 1000
          );
      } catch (error: any) {
        showLoding(false);
        return addMessage(t("238"));
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        addMessage(t("239"));
      } else {
        addMessage(t("238"));
      }
    });
  };

  const StateObj = (type: number) => {
    if (type === 1) {
      return <span style={{ color: "#D56819" }}>{t("203")}</span>;
    } else if (type === 2) {
      return <span style={{ color: "#0256FF" }}>{t("204")}</span>;
    }
  };

  const getVilifyState = throttle(async (value: string) => {
    if (!account) return;
    return Contracts.example.getAmountsOut(
      account as string,
      value,
      SwapObj[swapType ?? 1]
    );
  }, 1000);

  const InputValueFun = async (e: any) => {
    let value = e.target.value.replace(/^[^1-9]+|[^0-9]/g, "");
    if (Number(swapType) === 1) {
      setInputValue1(value);
      if (Number(value) > 0) {
        getVilifyState(value)?.then((res: any) => {
          setInputValue2(decimalNum(EthertoWei(res[1] ?? "0"), 2));
        });
      }
    } else if (Number(swapType) === 2) {
      setInputValue2(value);
      if (Number(value) > 0) {
        getVilifyState(value)?.then((res: any) => {
          setInputValue1(decimalNum(EthertoWei(res[1] ?? "0"), 2));
        });
      }
    }
  };

  const SelectPrice = () => {
    Contracts.example
      .getAmountsOut(account as string, "1", SwapObj[swapType])
      ?.then((res: any) => {
        console.log(res, "price");
        setPrice(decimalNum(EthertoWei(res[1] ?? "0"), 2));
      });
  };

  const CoinTopBox = (type: number) => {
    if (type === 1) {
      return (
        <CoinBox_Item>
          <img src={logo} />
          <div>USDT</div>
          <input
            type="number"
            placeholder={t("240")}
            value={InputValue1}
            onChange={InputValueFun}
          />
        </CoinBox_Item>
      );
    } else if (type === 2) {
      return (
        <CoinBox_Item>
          <img src={logo} />
          <div>MBK</div>
          <input
            type="number"
            value={InputValue2}
            placeholder={t("240")}
            onChange={InputValueFun}
          />
        </CoinBox_Item>
      );
    }
  };

  useEffect(() => {
    if (state.token) {
      getInitData();
    }
  }, [state.token]);

  useEffect(() => {
    if (account) {
      SelectPrice();
    }
  }, [account, swapType]);

  return (
    <NodeContainerBox>
      {location.pathname === "/View/Swap" && (
        <NodeInfo>
          <NodeInfo_Top>
            <CoinBox>
              {/* <CoinBox_Item>
              <img src={logo} />
              <div>USDT</div>
              <input
                type="number"
                placeholder={t("240")}
                onClick={InputValueFun}
              />
            </CoinBox_Item> */}
              {CoinTopBox(Number(swapType))}
              <CoinBox_Transfer>
                <img
                  src={transferIcon}
                  alt=""
                  onClick={() => {
                    setSwapType(Number(swapType) === 1 ? 2 : 1);
                  }}
                />
                {Number(swapType) === 1
                  ? `1USDT=${Price ?? "--"}MBK`
                  : `1MBK=${Price ?? "--"}USDT`}
              </CoinBox_Transfer>
              {CoinTopBox(Number(swapType) === 1 ? 2 : 1)}

              {/* <CoinBox_Item>
              <img src={logo} />
              <div>MBK</div>
              <input
                type="number"
                readOnly={true}
                placeholder={t("240")}
              />
            </CoinBox_Item> */}
            </CoinBox>
          </NodeInfo_Top>

          <NodeInfo_Bottom
            onClick={() => {
              let amount = Number(swapType) === 1 ? InputValue1 : InputValue2;
              SwapFun(String(amount));
            }}
          >
            {t("241")}
          </NodeInfo_Bottom>
        </NodeInfo>
      )}
    </NodeContainerBox>
  );
}
