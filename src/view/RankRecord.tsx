import React, { useState, useEffect } from "react";
import { getRobotRankRecord, userInfo } from "../API/index";
import "../assets/style/Home.scss";
import NoData from "../components/NoData";
import { useSelector } from "react-redux";
import { stateType } from "../store/reducer";
import styled, { keyframes } from "styled-components";
import { useViewport } from "../components/viewportContext";
import { AddrHandle, EthertoWei, NumSplic, addMessage } from "../utils/tool";
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
import { Carousel, Modal, Tooltip } from "antd";
import { useGetReward } from "../hooks/useGetReward";
import { Contracts } from "../web3";
import logo from "../assets/image/logo.png";
import {
  ModalContainer_Title,
  ModalContainer_Title_Container,
} from "../Layout/MainLayout";
import closeIcon from "../assets/image/closeIcon.svg";
import { ZeroStrokeIcon } from "../assets/image/homeBox";
import { HelpIconAuto, NodeInfo_Top_Rule } from "./Insurance";
import { LodingMode } from "../components/loding";
import { lodingModal } from "../assets/image/layoutBox";
import { NodeRecord_Date_Select } from "./Announcement";
import { useSelectDate } from "../hooks/useSelectDate";
import PageLoding from "../components/PageLoding";

const NodeContainerBox = styled(ContainerBox)`
  width: 100%;
  padding: 0px;
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

const NodeRecord = styled.div`
  width: 100%;
  border-radius: 10px;
  /* border: 1px solid rgba(213, 104, 25, 0.2); */
`;

const NodeRecord_Tab = styled(FlexSBCBox)`
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 19px 14px;
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #666666;
    border-bottom: 1px solid transparent;
  }
  .activeTab {
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;
    border-bottom: 1px solid #d56819;
  }
`;

const NodeRecord_Tab_Item = styled.div`
  width: fit-content;
  white-space: nowrap;
`;

const NodeRecord_Content = styled.div`
  width: 100%;
`;

const Award_Record_Content = styled.div`
  width: 100%;
`;
export const Award_Record_Content_Record_Content = styled.div`
  > div {
    /* border-bottom: 1px solid rgba(213, 104, 25, 0.2); */
  }
`;
const Award_Record_Content_Title_Content = styled(FlexSBCBox)`
  padding: 10px 15px;
  > div {
    flex: 1;
    text-align: center;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;
    &:first-child {
      flex: auto;
      width: 100%;
      max-width: 25%;
    }
    &:last-child {
      flex: auto;
      width: 100%;
      max-width: 20%;
    }
  }
`;

export const Award_Record_Content_Record_Box = styled.div`
  width: 100%;
  padding: 10px 0px;
`;

const Award_Record_Content_Record_Content_Item = styled(
  Award_Record_Content_Title_Content
)`
  > div {
    padding: 10px 0px;
    border-bottom: 1px solid rgba(213, 104, 25, 0.2);
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: rgba(255, 255, 255, 0.8);
  }
`;

export default function Rank() {
  const { t, i18n } = useTranslation();
  const state = useSelector<stateType, stateType>((state) => state);
  const [RecordList, setRecordList] = useState<any>([]);
  const { state: typeObj } = useLocation();
  const [ActiveTab, setActiveTab] = useState<any>(
    Number((typeObj as any)?.type as any) ?? 1
  );
  const [SubTab, setSubTab] = useState<any>(0);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [dataLoding, setDataLoding] = useState<any>(true);

  const { DatePickerComponent, DateString, setDateString } = useSelectDate();
  const recordType: number = Number((typeObj as any)?.recordType);
  // 1机器人业绩明星 2机器人-直推明星 3机器人-NFT团队明星 4-质押业绩明星 5-质押直推明星 6-质押NFT团队明星 7NFT-先锋排名
  const getInitData = () => {
    setDataLoding(true);

    setRecordList([]);
    getRobotRankRecord({
      month: DateString?.getMonth() + 1,
      type: recordType === 1 ? ActiveTab : Number(ActiveTab) + 3,
      year: DateString?.getFullYear(),
    }).then((res: any) => {
      if (res.code === 200) {
        setDataLoding(false);

        setRecordList(res?.data);
      }
    });
  };

  useEffect(() => {
    if (state.token) {
      getInitData();
    }
  }, [state.token, ActiveTab, DateString, recordType]);

  return (
    <NodeContainerBox>
      <NodeRecord>
        <NodeRecord_Tab>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 1 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(1);
              setDateString(new Date());
            }}
          >
            {t("66")}
          </NodeRecord_Tab_Item>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 2 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(2);
              setDateString(new Date());
            }}
          >
            {t("67")}
          </NodeRecord_Tab_Item>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 3 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(3);
              setDateString(new Date());
            }}
          >
            {t("68")}
          </NodeRecord_Tab_Item>
        </NodeRecord_Tab>
        <NodeRecord_Content>
          <NodeRecord_Date_Select>
            <DatePickerComponent />
          </NodeRecord_Date_Select>
          {Number(ActiveTab) === 1 && (
            <Award_Record_Content>
              <Award_Record_Content_Title_Content>
                <div>{t("290")}</div>
                <div>{t("58")}(USDT)</div>
                <div>{t("294")}</div>
              </Award_Record_Content_Title_Content>
              <Award_Record_Content_Record_Content>
                <Award_Record_Content_Record_Box>
                  {!dataLoding ? (
                    RecordList?.length > 0 ? (
                      RecordList?.map((item: any, index: any) => (
                        <Award_Record_Content_Record_Content_Item key={index}>
                          <div>{AddrHandle(item?.userAddress, 6, 6)}</div>
                          <div>{NumSplic(item?.performance, 2)}</div>
                          <div>{item?.rankNo}</div>
                        </Award_Record_Content_Record_Content_Item>
                      ))
                    ) : (
                      <NoData></NoData>
                    )
                  ) : (
                    <PageLoding></PageLoding>
                  )}
                </Award_Record_Content_Record_Box>
              </Award_Record_Content_Record_Content>
            </Award_Record_Content>
          )}
          {Number(ActiveTab) === 2 && (
            <Award_Record_Content>
              <Award_Record_Content_Title_Content>
                <div>{t("290")}</div>
                <div>{t("341")}(USDT)</div>
                <div>{t("294")}</div>
              </Award_Record_Content_Title_Content>
              <Award_Record_Content_Record_Content>
                <Award_Record_Content_Record_Box>
                  {!dataLoding ? (
                    RecordList?.length > 0 ? (
                      RecordList?.map((item: any, index: any) => (
                        <Award_Record_Content_Record_Content_Item key={index}>
                          <div>{AddrHandle(item?.userAddress, 6, 6)}</div>
                          <div>{NumSplic(item?.performance, 2)}</div>
                          <div>{item?.rankNo}</div>
                        </Award_Record_Content_Record_Content_Item>
                      ))
                    ) : (
                      <NoData></NoData>
                    )
                  ) : (
                    <PageLoding></PageLoding>
                  )}
                </Award_Record_Content_Record_Box>
              </Award_Record_Content_Record_Content>
            </Award_Record_Content>
          )}
          {Number(ActiveTab) === 3 && (
            <Award_Record_Content>
              <Award_Record_Content_Title_Content>
                <div>{t("290")}</div>
                <div>{t("57")}(USDT)</div>
                <div>{t("294")}</div>
              </Award_Record_Content_Title_Content>
              <Award_Record_Content_Record_Content>
                <Award_Record_Content_Record_Box>
                  {!dataLoding ? (
                    RecordList?.length > 0 ? (
                      RecordList?.map((item: any, index: any) => (
                        <Award_Record_Content_Record_Content_Item key={index}>
                          <div>{AddrHandle(item?.userAddress, 6, 6)}</div>
                          <div>{NumSplic(item?.performance, 2)}</div>
                          <div>{item?.rankNo}</div>
                        </Award_Record_Content_Record_Content_Item>
                      ))
                    ) : (
                      <NoData></NoData>
                    )
                  ) : (
                    <PageLoding></PageLoding>
                  )}
                </Award_Record_Content_Record_Box>
              </Award_Record_Content_Record_Content>
            </Award_Record_Content>
          )}
        </NodeRecord_Content>
      </NodeRecord>
    </NodeContainerBox>
  );
}
