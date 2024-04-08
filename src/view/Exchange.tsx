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

  const StateObj = (type: number) => {
    if (type === 1) {
      return <span style={{ color: "#D56819" }}>{t("203")}</span>;
    } else if (type === 2) {
      return <span style={{ color: "#0256FF" }}>{t("204")}</span>;
    }
  };

  useEffect(() => {
    if (state.token) {
      getInitData();
    }
  }, [state.token]);

  return (
    <NodeContainerBox>
      <DirectPush_Title_Container>
        <img src={exchangeIcon} alt="" />
        <ModalContainer_Title>{t("242")}</ModalContainer_Title>
      </DirectPush_Title_Container>
      <Award_Record_Content>
        <Award_Record_Content_Record_Content>
          {RecordList?.length > 0 ? (
            RecordList?.map((item: any, index: any) => (
              <Get_Record_Content_Record_Content_Item key={index} type={1}>
                <div>
                  {t("201")}{" "}
                  <span>
                    {dateFormat(
                      "YYYY-mm-dd HH:MM:SS",
                      new Date(item?.createTime)
                    )}
                  </span>
                </div>
                {/* {false ? (
                  <> */}
                <div>
                  {t("243", { coinName: item?.formCoin })}{" "}
                  <span>{item?.formNum}</span>
                </div>
                <div>
                  {t("244", { coinName: item?.toCoin })}{" "}
                  <span>{item?.toNum}</span>
                </div>
                {/* </>
                ) : (
                  <>
                    <div>
                      From (USDT) <span>{item?.formNum}</span>
                    </div>
                    <div>
                      To (MBK) <span>{item?.toNum}</span>
                    </div>
                  </>
                )} */}
                <div>
                  {t("245")} <span>{item?.coinPrice}</span>
                </div>
                <div>
                  {t("198")}
                  {StateObj(2)}
                </div>
                <div>
                  {t("199")}
                  <span>{AddrHandle(item?.txId, 6, 6)}</span>
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
