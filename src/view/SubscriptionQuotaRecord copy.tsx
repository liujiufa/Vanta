import React, { useState, useEffect } from "react";
import { getRobotBuyRecord, userInfo } from "../API/index";
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
import PageLoding from "../components/PageLoding";

const NodeContainerBox = styled(ContainerBox)`
  width: 100%;
  padding: 0px;
`;

const NodeInfo = styled.div`
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(213, 104, 25, 0.2);
`;

const NodeInfo_Top = styled(FlexBox)`
  position: relative;
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

const NodeRecord = styled.div`
  width: 100%;
  border-radius: 10px;
  /* border: 1px solid rgba(213, 104, 25, 0.2); */
`;

const NodeRecord_Tab = styled(FlexSBCBox)`
  overflow-x: auto;
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
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
  width: 100%;
  padding: 10px 15px;
  overflow: auto;

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

export default function Rank() {
  const { t, i18n } = useTranslation();
  const state = useSelector<stateType, stateType>((state) => state);
  const [RecordList, setRecordList] = useState<any>([]);
  const [SubTab, setSubTab] = useState<any>(0);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [dataLoding, setDataLoding] = useState<any>(true);

  const [ActivationModal, setActivationModal] = useState(false);
  // 1确认中 2认购成功 3认购失败 4交易取消
  const getInitData = (type: any) => {
    setDataLoding(true);

    setRecordList([]);
    getRobotBuyRecord(type).then((res: any) => {
      if (res.code === 200) {
        setDataLoding(false);

        setRecordList(res?.data);
      }
    });
  };

  useEffect(() => {
    if (state.token) {
      getInitData(SubTab);
    }
  }, [state.token, SubTab]);

  const StateObj = (type: number) => {
    if (type === 1) {
      return <span style={{ color: "#D56819" }}>{t("203")}</span>;
    } else if (type === 2) {
      return <span style={{ color: "#0256FF" }}>{t("328")}</span>;
    } else if (type === 3) {
      return <span style={{ color: "#EA0000" }}>{t("329")}</span>;
    } else if (type === 4) {
      return <span>{t("330")}</span>;
    }
  };

  return (
    <NodeContainerBox>
      <NodeRecord>
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
                {t("203")}
              </Award_Record_Content_Tab_Item>
              <Award_Record_Content_Tab_Item
                className={Number(SubTab) === 2 ? "activeSubTab" : ""}
                onClick={() => {
                  setSubTab(2);
                }}
              >
                {t("328")}
              </Award_Record_Content_Tab_Item>
              <Award_Record_Content_Tab_Item
                className={Number(SubTab) === 3 ? "activeSubTab" : ""}
                onClick={() => {
                  setSubTab(3);
                }}
              >
                {t("329")}
              </Award_Record_Content_Tab_Item>
              <Award_Record_Content_Tab_Item
                className={Number(SubTab) === 4 ? "activeSubTab" : ""}
                onClick={() => {
                  setSubTab(4);
                }}
              >
                {t("330")}
              </Award_Record_Content_Tab_Item>
            </Award_Record_Content_Tab_Content>
            <Award_Record_Content_Record_Content>
              {!dataLoding ? (
                RecordList?.length > 0 ? (
                  RecordList?.map((item: any, index: any) => (
                    <Get_Record_Content_Record_Content_Item
                      key={index}
                      type={1}
                    >
                      <div>
                        {t("315")}
                        <span>
                          {dateFormat(
                            "YYYY-mm-dd HH:MM",
                            new Date(item?.createTime)
                          )}
                        </span>
                      </div>
                      <div>
                        {t("316")}
                        <span>{decimalNum(item?.subscriptionValue, 6)}</span>
                      </div>
                      <div>
                        {t("317")}
                        <span>{decimalNum(item?.subscriptionNum, 6)}</span>
                      </div>
                      <div>
                        {t("375")}
                        <span>{decimalNum(item?.robotUser?.useValue, 6)}</span>
                      </div>
                      <div>
                        {t("376")}
                        <span>
                          {decimalNum(item?.giveSubscriptionValue, 6)}
                        </span>
                      </div>
                      <div>
                        {t("309")}
                        <span>{decimalNum(item?.coinPrice, 6)}</span>
                      </div>
                      <div>
                        {t("198")}
                        {StateObj(item?.status)}
                      </div>
                      <div>
                        {t("199")}
                        <span>{AddrHandle(item?.txId, 6, 6)}</span>
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
        </NodeRecord_Content>
      </NodeRecord>

      <AllModal
        visible={false}
        className="Modal"
        centered
        width={"345px"}
        closable={false}
        footer={null}
        onCancel={() => {
          setActivationModal(false);
        }}
      >
        <ModalContainer>
          {/* <HomeContainerBox_Content_Bg3></HomeContainerBox_Content_Bg3> */}

          <ModalContainer_Close>
            {" "}
            <img
              src={closeIcon}
              alt=""
              onClick={() => {
                setActivationModal(false);
              }}
            />
          </ModalContainer_Close>
          <ModalContainer_Title_Container>
            <img src={logo} alt="" />
            <ModalContainer_Title>
              {t("Lottery is being drawn")}
            </ModalContainer_Title>
          </ModalContainer_Title_Container>

          <ModalContainer_Content>
            <LotteryContainer>
              <LodingModeBox>
                <img src={lodingModal} alt="" />
              </LodingModeBox>
              {true ? (
                <div>
                  Congratulations <span>First Prize 3000VTB</span>
                </div>
              ) : (
                "The lottery is in progress, please wait."
              )}
              <LotteryContainer_Btn>
                View the list of winners
              </LotteryContainer_Btn>
            </LotteryContainer>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>
    </NodeContainerBox>
  );
}
