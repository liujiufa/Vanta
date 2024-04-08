import React, { useState, useEffect, useCallback } from "react";
import { getFreeAwardRecord, getMyFreeInfo, userInfo } from "../API/index";
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

const NodeContainerBox = styled(ContainerBox)`
  width: 100%;
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

const NodeInfo_Top_Btn = styled(Btn)`
  width: fit-content;
  margin: auto;
`;

const NodeInfo_Bottom = styled(FlexCCBox)`
  padding: 0px 11px;
  border-top: 1px solid rgba(213, 104, 25, 0.2);

  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #d56819;
  > div {
    padding: 11px 0px;
    flex: 1;
    display: flex;
    justify-content: center;
    &:first-child {
      border-right: 1px solid rgba(213, 104, 25, 0.2);
    }
  }
`;

const NodeRecord = styled.div`
  width: 100%;
  margin-top: 15px;
  border-radius: 10px;
  border: 1px solid rgba(213, 104, 25, 0.2);
`;

const NodeRecord_Tab = styled(FlexSBCBox)`
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 13px 14px;
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;
  }
  .activeTab {
    font-family: PingFang SC;
    font-size: 12px;
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

const UpBtn = styled(Btn)`
  width: 100%;
  font-family: "Raleway";
  font-size: 14px;
  font-weight: bold;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-feature-settings: "kern" on;
  color: #ffffff;
  /* margin-top: 27px; */
`;

const BalanceBox = styled(FlexBox)`
  width: 100%;
  align-items: center;
  font-family: PingFang SC;
  font-size: 10px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #999999;
  margin-top: 10px;
  > span {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    text-transform: uppercase;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;
    margin: 0px 5px;
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

const NodeInfo_Top_Item = styled(FlexSBCBox)`
  width: 100%;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  margin-top: 18px;
  > div {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const NodeInfo_Mid = styled(FlexSBCBox)`
  width: 100%;
  padding: 10px 15px;
  > div {
    display: flex;
    align-items: center;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;
    &:last-child {
      font-family: PingFang SC;
      font-size: 18px;
      font-weight: normal;
      line-height: normal;
      text-transform: capitalize;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: #d56819;
      > span {
        font-family: PingFang SC;
        font-size: 10px;
        font-weight: normal;
        line-height: normal;
        text-transform: uppercase;
        letter-spacing: 0em;
        margin-left: 5px;
        font-variation-settings: "opsz" auto;
        color: #ffffff;
      }
    }
  }
`;

export default function Rank() {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const state = useSelector<stateType, stateType>((state) => state);
  const [RecordList, setRecordList] = useState<any>([]);
  const [MyFreeInfo, setMyFreeInfo] = useState<any>({});
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const [SubTab, setSubTab] = useState<any>(0);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Balance, setBalance] = useState<any>("");
  const [InputValueAmount, setInputValueAmount] = useState<any>("0");
  const [ActivationModal, setActivationModal] = useState(false);

  const typeObj = { 42: "260", 41: "261" };
  const getInitData = useCallback(() => {
    getMyFreeInfo().then((res: any) => {
      if (res.code === 200) {
        setMyFreeInfo(res?.data);
      }
    });
  }, [state.token]);

  const getRecordFun = () => {
    setRecordList([]);

    if (Number(ActiveTab) === 1) {
      getFreeAwardRecord(SubTab).then((res: any) => {
        if (res.code === 200) {
          setRecordList(res?.data);
        }
      });
    } else if (Number(ActiveTab) === 2) {
      getFreeAwardRecord(48).then((res: any) => {
        if (res.code === 200) {
          setRecordList(res?.data);
        }
      });
    }
  };
  // 账户类型 1机器人-管理奖账户 2机器人-业绩奖励账户
  // * 3-质押奖励账户 4-质押赎回账户 5-质押管理奖励账户 6质押业绩账户
  // * 7NFT-分红账户 8NFT-先峰账户 9NFT-认购奖励 10NFT-首轮在认购奖励 11LP分红账户
  // * 12-社区奖励账户
  // * 13-游戏账户
  // * 14-零撸账户
  // * 15-节点奖励账户
  // * 16-保险池赔付账户
  const getRewardFun = (value: any, type: any) => {
    if (Number(value) <= 0) return addMessage(t("27"));
    getReward(
      type,
      () => {
        getInitData();
      },
      "awardPoolContract"
    );
  };

  useEffect(() => {
    if (state.token) {
      getInitData();
      getRecordFun();
    }
  }, [state.token, ActiveTab, SubTab]);

  const StateObj = (type: number) => {
    if (type === 1) {
      return <span style={{ color: "#D56819" }}>{t("203")}</span>;
    } else if (type === 2) {
      return <span style={{ color: "#0256FF" }}>{t("204")}</span>;
    }
  };

  return (
    <NodeContainerBox>
      <NodeInfo>
        <NodeInfo_Top>
          <NodeInfo_Top_Rule>
            <HelpIconAuto /> {t("12")}
          </NodeInfo_Top_Rule>
          <ModalContainer_Title_Container>
            <img src={ZeroStrokeIcon} />
            <ModalContainer_Title>{t("262")}</ModalContainer_Title>
          </ModalContainer_Title_Container>

          <NodeInfo_Top_Item>
            <div>{t("263")}</div>
            {MyFreeInfo?.validUserCount ?? 0} pcs
          </NodeInfo_Top_Item>
          <NodeInfo_Top_Item>
            <div>{t("261")}</div>
            {MyFreeInfo?.shareAmount ?? 0} MBK
          </NodeInfo_Top_Item>
          <NodeInfo_Top_Item>
            <div>{t("260")}</div>
            {MyFreeInfo?.refereeAmount ?? 0} MBK
          </NodeInfo_Top_Item>
        </NodeInfo_Top>
        <NodeInfo_Mid>
          <div>{t("264")}</div>
          <div>
            {MyFreeInfo?.waitReceiveAmount ?? 0} <span>MBK</span>
          </div>
        </NodeInfo_Mid>
        <NodeInfo_Bottom>
          <div
            onClick={() => {
              Navigate("/View/Pledge");
            }}
          >
            {" "}
            {t("265")}
          </div>
          <div
            onClick={() => {
              getRewardFun(MyFreeInfo?.waitReceiveAmount ?? 0, 14);
            }}
          >
            {" "}
            {t("266")}
          </div>
        </NodeInfo_Bottom>
      </NodeInfo>

      <NodeRecord>
        <NodeRecord_Tab>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 1 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(1);
            }}
          >
            {t("172")}
          </NodeRecord_Tab_Item>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 2 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(2);
            }}
          >
            {t("173")}
          </NodeRecord_Tab_Item>
        </NodeRecord_Tab>
        <NodeRecord_Content>
          {Number(ActiveTab) === 1 && (
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
                  className={Number(SubTab) === 41 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(41);
                  }}
                >
                  {t("261")}
                </Award_Record_Content_Tab_Item>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 42 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(42);
                  }}
                >
                  {t("260")}
                </Award_Record_Content_Tab_Item>
              </Award_Record_Content_Tab_Content>
              <Award_Record_Content_Record_Content>
                {RecordList?.length > 0 ? (
                  RecordList?.map((item: any, index: any) => (
                    <Award_Record_Content_Record_Content_Item key={index}>
                      <div>
                        {t("193")} <span>{t(typeObj[item?.businessType])}</span>
                      </div>
                      <div>
                        {t("201")}{" "}
                        <span>
                          {dateFormat(
                            "YYYY-mm-dd HH:MM",
                            new Date(item?.createTime)
                          )}
                        </span>
                      </div>
                      <div>
                        {t("195")} <span>{item?.amount ?? 0}</span>
                      </div>
                    </Award_Record_Content_Record_Content_Item>
                  ))
                ) : (
                  <NoData></NoData>
                )}
              </Award_Record_Content_Record_Content>
            </Award_Record_Content>
          )}
          {Number(ActiveTab) === 2 && (
            <Award_Record_Content>
              <Award_Record_Content_Record_Content>
                {RecordList?.length > 0 ? (
                  RecordList?.map((item: any, index: any) => (
                    <Get_Record_Content_Record_Content_Item
                      key={index}
                      type={1}
                    >
                      <div>
                        {t("196")}
                        <span>
                          {dateFormat(
                            "YYYY-mm-dd HH:MM",
                            new Date(item?.createTime)
                          )}
                        </span>
                      </div>
                      <div>
                        {t("197")}
                        <span>{item?.amount ?? 0}</span>
                      </div>
                      <div>
                        {t("198")}
                        {StateObj(2)}
                      </div>
                      <div>
                        {t("199")}
                        <span>{AddrHandle(item?.userAddress, 6, 4)}</span>
                      </div>
                    </Get_Record_Content_Record_Content_Item>
                  ))
                ) : (
                  <NoData></NoData>
                )}
              </Award_Record_Content_Record_Content>
            </Award_Record_Content>
          )}
        </NodeRecord_Content>
      </NodeRecord>
    </NodeContainerBox>
  );
}
