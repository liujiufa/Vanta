import React, { useState, useEffect } from "react";
import {
  getPledgeOrderRecord,
  getPledgeUserAwardRecord,
  updateReinvest,
  userInfo,
} from "../API/index";
import "../assets/style/Home.scss";
import NoData from "../components/NoData";
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
import { Carousel, Modal, Switch, Tooltip } from "antd";
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
  overflow-x: auto;
  width: 100%;
  padding: 10px 15px;
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
    .ant-switch {
      background: #333333;
    }
    .ant-switch-checked {
      background: #d56819;
    }
  }
`;
const Get_Record_Content_Record_Content_Item = styled(
  Award_Record_Content_Record_Content_Item
)<{ type: any }>`
  > div {
    &:last-child {
      > span {
        font-family: "PingFang SC";
        font-size: 14px;
        font-weight: normal;
        line-height: normal;
        text-transform: capitalize;
        letter-spacing: 0em;
        text-decoration: underline;

        font-variation-settings: "opsz" auto;
        color: #f7e1d1;
      }
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

const MySwitch = styled(Switch)``;

export default function Rank() {
  const { t, i18n } = useTranslation();
  const state = useSelector<stateType, stateType>((state) => state);
  const [RecordList, setRecordList] = useState<any>([]);
  const [ReRecordList, setReRecordList] = useState<any>([]);

  const { state: stateObj } = useLocation();
  const [ActiveTab, setActiveTab] = useState<any>(
    Number((stateObj as any)?.type) ?? 1
  );
  const [SubTab, setSubTab] = useState<any>(-1);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Balance, setBalance] = useState<any>("");
  const [dataLoding, setDataLoding] = useState<any>(true);

  //1:质押记录 2:赎回记录
  const recordType: number = Number((stateObj as any)?.type) ?? 1;
  const onChange = (checked: boolean, id: any) => {
    updateReinvest({ id: id, isReinvest: !!checked ? 1 : 0, num: 0 }).then(
      (res: any) => {
        // getInitData(SubTab);
        setDataLoding(true);

        getPledgeOrderRecord(SubTab).then((res: any) => {
          if (res.code === 200) {
            setDataLoding(false);

            setRecordList(res?.data);
          }
        });
      }
    );
  };

  const subTabArr = {
    1: [
      { key: -1, name: "189" },
      { key: 0, name: "302" },
      { key: 1, name: "303" },
      { key: 2, name: "304" },
    ],
  };
  const getInitData = (type: number) => {
    setDataLoding(true);

    setRecordList([]);
    if (Number(ActiveTab) === 1) {
      getPledgeOrderRecord(type).then((res: any) => {
        if (res.code === 200) {
          setDataLoding(false);

          setRecordList(res?.data);
        }
      });
    } else if (Number(ActiveTab) === 2) {
      getPledgeUserAwardRecord(50).then((res: any) => {
        if (res.code === 200) {
          setDataLoding(false);

          setReRecordList(res?.data);
        }
      });
    }
  };

  useEffect(() => {
    if (state.token) {
      getInitData(SubTab);
    }
  }, [state.token, ActiveTab, SubTab]);

  const StateObj = (type: number) => {
    if (type === 0) {
      return <span style={{ color: "#D56819" }}>{t("302")}</span>;
    } else if (type === 1) {
      return <span style={{ color: "#D56819" }}>{t("303")}</span>;
    } else if (type === 2) {
      return <span style={{ color: "#0256FF" }}>{t("304")}</span>;
    }
  };

  return (
    <NodeContainerBox>
      <NodeRecord>
        <NodeRecord_Tab>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 1 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(1);
            }}
          >
            {t("319")}
          </NodeRecord_Tab_Item>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 2 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(2);
            }}
          >
            {t("320")}
          </NodeRecord_Tab_Item>
        </NodeRecord_Tab>
        <NodeRecord_Content>
          {Number(ActiveTab) === 1 && (
            <Award_Record_Content>
              <Award_Record_Content_Tab_Content>
                {subTabArr[recordType ?? 1]?.map((item: any, index: any) => (
                  <Award_Record_Content_Tab_Item
                    key={index}
                    className={
                      Number(SubTab) === item?.key ? "activeSubTab" : ""
                    }
                    onClick={() => {
                      setSubTab(item?.key);
                    }}
                  >
                    {t(item?.name)}
                  </Award_Record_Content_Tab_Item>
                ))}
              </Award_Record_Content_Tab_Content>
              <Award_Record_Content_Record_Content>
                {!dataLoding ? (
                  RecordList?.length > 0 ? (
                    RecordList?.map((item: any, index: any) => (
                      <Award_Record_Content_Record_Content_Item key={index}>
                        <div>
                          {t("305")} <span>{item?.orderNo}</span>
                        </div>
                        <div>
                          {t("306")}{" "}
                          <span>
                            {dateFormat(
                              "YYYY-mm-dd HH:MM",
                              new Date(item?.pledgeTime)
                            )}
                          </span>
                        </div>
                        <div>
                          {t("307")}{" "}
                          <span>{decimalNum(item?.pledgeNum ?? 0, 6)}</span>
                        </div>
                        <div>
                          {t("308")}
                          <span>{decimalNum(item?.pledgeAmount ?? 0, 6)}</span>
                        </div>
                        <div>
                          {t("309")}
                          <span>{decimalNum(item?.coinPrice ?? 0, 6)}</span>
                        </div>
                        <div>
                          {t("310")}
                          <span>{t("48", { num: item?.cycle ?? 0 })}</span>
                        </div>
                        {/* {Number(index) === 0 && ( */}
                        <div>
                          {t("53")}
                          <span>
                            {" "}
                            <MySwitch
                              defaultChecked
                              checked={!!item?.isReinvest}
                              onChange={(item1: any) =>
                                onChange(item1, item?.id)
                              }
                            />
                          </span>
                        </div>
                        {/* )} */}
                        <div>
                          {t("311")}
                          <span>
                            {dateFormat(
                              "YYYY-mm-dd HH:MM",
                              new Date(item?.endTime)
                            )}
                          </span>
                        </div>

                        <div>
                          {t("198")}
                          {StateObj(item?.status)}
                        </div>
                        <div>
                          {t("199")}
                          <span>{AddrHandle(item?.pledgeHash, 6, 6)}</span>
                        </div>
                      </Award_Record_Content_Record_Content_Item>
                    ))
                  ) : (
                    <NoData></NoData>
                  )
                ) : (
                  <PageLoding></PageLoding>
                )}
              </Award_Record_Content_Record_Content>
            </Award_Record_Content>
          )}
          {Number(ActiveTab) === 2 && (
            <Award_Record_Content>
              <Award_Record_Content_Record_Content>
                {!dataLoding ? (
                  ReRecordList?.length > 0 ? (
                    ReRecordList?.map((item: any, index: any) => (
                      <Get_Record_Content_Record_Content_Item
                        key={index}
                        type={1}
                      >
                        <div>
                          {t("324")}
                          <span>2023-12-23 12:23</span>
                        </div>
                        <div>
                          {t("325")}
                          <span>{decimalNum(item?.amount ?? 0, 6)}</span>
                        </div>
                        <div>
                          {t("326")}
                          <span>{item?.pledgeOrderNo}</span>
                        </div>
                        <div>
                          {t("198")}
                          {StateObj(2)}
                        </div>
                        <div>
                          {t("199")}
                          <span>{AddrHandle(item?.redemptionHash, 6, 6)}</span>
                        </div>
                      </Get_Record_Content_Record_Content_Item>
                    ))
                  ) : (
                    <NoData></NoData>
                  )
                ) : (
                  <PageLoding></PageLoding>
                )}
              </Award_Record_Content_Record_Content>
            </Award_Record_Content>
          )}
        </NodeRecord_Content>
      </NodeRecord>
    </NodeContainerBox>
  );
}
