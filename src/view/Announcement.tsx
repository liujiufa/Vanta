import React, { useState, useEffect } from "react";
import { getRobotRankRecord, hitRecord, userInfo } from "../API/index";
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
import { Button, DatePicker, Space, Toast } from "antd-mobile";
import { useSelectDate } from "../hooks/useSelectDate";
import {
  Award_Record_Content_Record_Box,
  Award_Record_Content_Title_Content,
} from "./RankRecord";
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

const NodeRecord_Content = styled.div`
  width: 100%;
`;

const AllModal = styled(Modal)`
  z-index: 10000;

  .ant-modal-content {
    overflow: hidden;
    border-radius: 10px;
    background: #101010;
    border: 1px solid rgba(213, 104, 25, 0.2);
    .ant-modal-body {
      border-radius: 20px;
      position: relative;
      min-height: 124px;
      padding: 24px 15px;
    }
  }
`;

const ModalContainer = styled(FlexBox)`
  /* position: relative; */
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ModalContainer_Close = styled(FlexCCBox)`
  position: absolute;
  z-index: 100;
  top: 10px;
  right: 10px;
`;

const ModalContainer_Content = styled.div`
  width: 100%;
  margin-top: 20px;
  font-family: "PingFang SC";
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;

  display: flex;
  flex-direction: column;
  align-items: center;
  > span {
    font-family: "PingFang SC";
    font-size: 18px;
    font-weight: normal;
    line-height: normal;
    text-transform: uppercase;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;
    margin: 5px 0px 20px;
  }
`;

const HomeContainerBox_Content_Bg3 = styled.div`
  position: absolute;
  bottom: -15px;
  right: -101px;
  width: 261px;
  height: 261px;
  flex-shrink: 0;
  border-radius: 261px;
  opacity: 0.4;
  background: linear-gradient(
    131deg,
    rgba(113, 112, 242, 0.4) 35.38%,
    rgba(152, 102, 234, 0.4) 85.25%
  );
  filter: blur(99.5px);
  z-index: -1;
`;

const Award_Record_Content = styled.div`
  width: 100%;
`;
const Award_Record_Content_Tab_Content = styled(FlexSCBox)`
  width: 100%;
  padding: 10px 15px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 10px;
    height: 1px;
    /**/
  }
  &::-webkit-scrollbar-track {
    background: rgba(213, 104, 25, 0.2);
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d56819;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #333;
  }
  > div {
    white-space: nowrap;
    font-family: "PingFang SC";
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #999999;
    padding: 5px 20px;

    background: rgba(213, 104, 25, 0.2);

    box-sizing: border-box;
    border: 1px solid #d56819;

    z-index: 1;
    border-radius: 234px;
    margin-right: 10px;
  }
  .activeSubTab {
    font-family: "PingFang SC";
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;

    z-index: 0;
    padding: 5px 20px;

    background: rgba(213, 104, 25, 0.8);

    box-sizing: border-box;
    border: 1px solid #d56819;

    z-index: 0;
  }
`;

const Award_Record_Content_Tab_Item = styled(FlexCCBox)``;

const Award_Record_Content_Record_Content = styled.div`
  > div {
    border-bottom: 1px solid rgba(213, 104, 25, 0.2);
  }
`;

const Award_Record_Content_Record_Content_Item = styled.div`
  width: 100%;
  padding: 10px 15px;
  > div {
    display: flex;
    justify-content: space-between;
    align-content: center;
    width: 100%;

    margin-bottom: 10px;

    font-family: PingFang SC;
    font-size: 14px;
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
      text-transform: capitalize;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const LodingModeBox = styled(LodingMode)`
  position: unset;
  width: 100%;
  max-width: 77px;
  height: fit-content;
  margin-bottom: 10px;
  > img {
    width: 100%;
  }
`;

const LotteryContainer = styled(FlexBox)`
  width: 100%;
  position: relative;
  flex-direction: column;
  align-items: center;
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;
    > span {
      margin-left: 5px;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: #d56819;
    }
  }
`;

const LotteryContainer_Btn = styled(Btn)`
  width: 100%;
  margin-top: 18px;
  font-family: Raleway;
  font-size: 14px;
  font-weight: bold;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;
  border-radius: 8px;
  font-feature-settings: "kern" on;
  color: #ffffff;
`;

export const NodeRecord_Date_Select = styled(FlexCCBox)`
  padding: 15px;
`;

export default function Rank() {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const state = useSelector<stateType, stateType>((state) => state);
  const [RecordList, setRecordList] = useState<any>([]);
  const [UserInfo, setUserInfo] = useState<any>({});
  const [SubTab, setSubTab] = useState<any>(0);
  const [dataLoding, setDataLoding] = useState<any>(true);

  const { DatePickerComponent, setPrecision, DateString } = useSelectDate();
  const { state: stateObj } = useLocation();
  // 2:小区新增业绩排名 1:游戏抽奖开奖结果公示
  const recordType: number = Number((stateObj as any)?.recordType);
  const getInitData = () => {
    setDataLoding(true);
    setRecordList([]);
    if (Number(recordType) === 1) {
      hitRecord({
        date: dateFormat("YYYY-mm-dd", new Date(DateString.valueOf())),
        level: SubTab,
        myself: false,
      }).then((res: any) => {
        if (res.code === 200) {
          setDataLoding(false);

          setRecordList(res?.data);
        }
      });
    } else {
      getRobotRankRecord({
        month: DateString?.getMonth() + 1,
        type: 7,
        year: DateString?.getFullYear(),
      }).then((res: any) => {
        if (res.code === 200) {
          setDataLoding(false);

          setRecordList(res?.data);
        }
      });
    }
  };

  useEffect(() => {
    getInitData();
    if (Number(recordType) === 1) return setPrecision("day");
  }, [SubTab, recordType]);

  return (
    <NodeContainerBox>
      <NodeRecord>
        <NodeRecord_Date_Select>
          <DatePickerComponent />
        </NodeRecord_Date_Select>
        {Number(recordType) === 1 ? (
          <NodeRecord_Content>
            <Award_Record_Content>
              <Award_Record_Content_Tab_Content>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 0 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(0);
                  }}
                >
                  {t("189")}
                </Award_Record_Content_Tab_Item>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 1 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(1);
                  }}
                >
                  {t("286")}
                </Award_Record_Content_Tab_Item>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 2 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(2);
                  }}
                >
                  {t("287")}
                </Award_Record_Content_Tab_Item>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 3 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(3);
                  }}
                >
                  {t("288")}
                </Award_Record_Content_Tab_Item>
              </Award_Record_Content_Tab_Content>
              <Award_Record_Content>
                <Award_Record_Content_Title_Content>
                  <div>{t("290")}</div>
                  <div>{t("291")}</div>
                  <div>{t("292")}</div>
                </Award_Record_Content_Title_Content>
                <Award_Record_Content_Record_Content>
                  <Award_Record_Content_Record_Box>
                    {!dataLoding ? (
                      RecordList?.length > 0 ? (
                        RecordList?.map((item: any, index: any) => (
                          <Award_Record_Content_Record_Content_Item key={index}>
                            <div>{AddrHandle(item?.userAddress, 6, 6)}</div>
                            <div>{NumSplic(item?.hitAmount, 2)}</div>
                            <div>{t("293", { num: item?.level })}</div>
                            {/* <div>{item?.level}等</div> */}
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
            </Award_Record_Content>
          </NodeRecord_Content>
        ) : (
          <NodeRecord_Content>
            <Award_Record_Content>
              {/* <Award_Record_Content_Tab_Content>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 0 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(0);
                  }}
                >
                  {t("189")}
                </Award_Record_Content_Tab_Item>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 1 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(1);
                  }}
                >
                  {t("286")}
                </Award_Record_Content_Tab_Item>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 2 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(2);
                  }}
                >
                  {t("287")}
                </Award_Record_Content_Tab_Item>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 3 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(3);
                  }}
                >
                  {t("288")}
                </Award_Record_Content_Tab_Item>
              </Award_Record_Content_Tab_Content> */}
              <Award_Record_Content>
                <Award_Record_Content_Title_Content>
                  <div>{t("290")}</div>
                  <div>{t("295")}</div>
                  <div>{t("294")}</div>
                </Award_Record_Content_Title_Content>
                <Award_Record_Content_Record_Content>
                  <Award_Record_Content_Record_Box>
                    {RecordList?.length > 0 ? (
                      RecordList?.map((item: any, index: any) => (
                        <Award_Record_Content_Record_Content_Item key={index}>
                          <div>{AddrHandle(item?.userAddress, 6, 6)}</div>
                          <div>{NumSplic(item?.performance, 2)}</div>
                          <div>{item?.rankNo}</div>
                        </Award_Record_Content_Record_Content_Item>
                      ))
                    ) : (
                      <NoData></NoData>
                    )}
                  </Award_Record_Content_Record_Box>
                </Award_Record_Content_Record_Content>
              </Award_Record_Content>
            </Award_Record_Content>
          </NodeRecord_Content>
        )}
      </NodeRecord>
    </NodeContainerBox>
  );
}
