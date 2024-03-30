import React, { useState, useEffect, useCallback } from "react";
import {
  activationCommunity,
  activationNode,
  getCommunityAwardRecord,
  getMyCommunity,
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
import { contractAddress } from "../config";
import useUSDTGroup from "../hooks/useUSDTGroup";
import { menuIcon3 } from "../assets/image/homeBox";

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

const NodeInfo_Top_Tip = styled.div`
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #d56819;
  margin: 20px 0px 24px;
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

const NodeInfo_Mid_Content = styled(FlexBox)`
  width: 100%;
  justify-content: space-evenly;
  margin: 20px 0px 24px;
  align-items: center;
  > div {
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

        font-variation-settings: "opsz" auto;
        color: #ffffff;
      }
    }
  }
`;

const NodeInfo_Top_Btn = styled(Btn)`
  width: fit-content;
  margin: auto;
`;

const NodeInfo_Bottom = styled.div`
  padding: 15px;
  > div {
    margin-bottom: 13px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
`;
const NodeInfo_Bottom_Item = styled(FlexSBCBox)`
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

const NodeRecord = styled.div`
  width: 100%;
  margin-top: 15px;
  border-radius: 10px;
  border: 1px solid rgba(213, 104, 25, 0.2);
`;

const NodeRecord_Tab = styled(FlexSBCBox)`
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
  > div {
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

export const Award_Record_Content = styled.div`
  width: 100%;
`;
const Award_Record_Content_Tab_Content = styled(FlexSCBox)`
  width: 100%;
  padding: 10px 15px;
  overflow-x: auto;
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
    white-space: nowrap;
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

export const Award_Record_Content_Record_Content = styled.div`
  > div {
    border-bottom: 1px solid rgba(213, 104, 25, 0.2);
  }
`;

export const Award_Record_Content_Record_Content_Item = styled.div`
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
export const Get_Record_Content_Record_Content_Item = styled(
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

export default function Rank() {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const token = useSelector<any>((state) => state?.token);
  const [RecordList, setRecordList] = useState<any>([]);
  const [MyCommunity, setMyCommunity] = useState<any>({});
  const [CommunityAwardRecord, setCommunityAwardRecord] = useState<any>([]);
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const [SubTab, setSubTab] = useState<any>(1);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [InputValueAmount, setInputValueAmount] = useState<any>("0");

  const typeObj = {
    34: "社区激活记录",
    35: "社区LP加权奖励",
    36: "社区平均分配奖励",
    37: "社区小区加权奖励",
    38: "社区账户奖励领取记录",
  };

  const getInitData = useCallback(() => {
    getMyCommunity().then((res: any) => {
      if (res.code === 200) {
        setMyCommunity(res?.data);
      }
    });
  }, [token]);
  //0-All 34-社区激活记录 35-社区LP加权奖励 36-社区平均分配奖励 37-社区小区加权奖励 38-社区账户奖励领取记录

  const getInitAwardRecord = (type: 0 | 34 | 35 | 36 | 37 | 38) => {
    if (Number(ActiveTab) === 1 || Number(ActiveTab) === 3) {
      getCommunityAwardRecord(type)?.then((res: any) => {
        if (res.code === 200) {
          setCommunityAwardRecord(res?.data);
        }
      });
    } else if (Number(ActiveTab) === 2) {
      getCommunityAwardRecord(38)?.then((res: any) => {
        if (res.code === 200) {
          setCommunityAwardRecord(res?.data);
        }
      });
    }
  };

  useEffect(() => {
    if (token) {
      getInitData();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getInitAwardRecord(SubTab);
    }
  }, [token, ActiveTab, SubTab]);

  const StateObj = (type: number) => {
    if (type === 1) {
      return <span style={{ color: "#D56819" }}>Confirming</span>;
    } else if (type === 2) {
      return <span style={{ color: "#0256FF" }}>success</span>;
    }
  };

  return (
    <NodeContainerBox>
      <NodeInfo>
        {!!MyCommunity?.unlock ? (
          <NodeInfo_Top>
            <ModalContainer_Title_Container>
              <img src={menuIcon3} />
              <ModalContainer_Title>My Community</ModalContainer_Title>
            </ModalContainer_Title_Container>
            <NodeInfo_Mid_Content>
              <div>To be collected</div>
              <div>
                {decimalNum(MyCommunity?.amount ?? 0, 2)} <span>mbk</span>
              </div>
            </NodeInfo_Mid_Content>
            <NodeInfo_Top_Btn>receive</NodeInfo_Top_Btn>
          </NodeInfo_Top>
        ) : (
          <NodeInfo_Top>
            <ModalContainer_Title_Container>
              <img src={menuIcon3} />
              <ModalContainer_Title>My Community</ModalContainer_Title>
            </ModalContainer_Title_Container>
            <NodeInfo_Top_Tip>No node yet</NodeInfo_Top_Tip>
            <NodeInfo_Top_Btn
              onClick={() => {
                // setActivationModal(true);
                Navigate("/View/SubscriptionCommunity");
              }}
            >
              activation
            </NodeInfo_Top_Btn>
          </NodeInfo_Top>
        )}
        <NodeInfo_Bottom>
          <NodeInfo_Bottom_Item>
            My LP quantity
            <span>{decimalNum(MyCommunity?.lpNum ?? 0, 2)} LP</span>
          </NodeInfo_Bottom_Item>
          <NodeInfo_Bottom_Item>
            Community subscription performance
            <span>
              {decimalNum(MyCommunity?.communityPerformance ?? 0, 2)} USDT
            </span>
          </NodeInfo_Bottom_Item>
          <NodeInfo_Bottom_Item>
            Accumulated NFT equity rewards
            <span>{decimalNum(MyCommunity?.totalAmount ?? 0, 2)} MBK</span>
          </NodeInfo_Bottom_Item>
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
            Award record
          </NodeRecord_Tab_Item>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 2 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(2);
            }}
          >
            Get records
          </NodeRecord_Tab_Item>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 3 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(3);
            }}
          >
            Subscription record
          </NodeRecord_Tab_Item>
        </NodeRecord_Tab>
        <NodeRecord_Content>
          {Number(ActiveTab) === 1 && (
            <Award_Record_Content>
              <Award_Record_Content_Tab_Content>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 1 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(1);
                  }}
                >
                  All
                </Award_Record_Content_Tab_Item>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 35 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(35);
                  }}
                >
                  LP WeiAghted
                </Award_Record_Content_Tab_Item>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 36 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(36);
                  }}
                >
                  Equally Distributed
                </Award_Record_Content_Tab_Item>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 37 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(37);
                  }}
                >
                  Cell Weighting
                </Award_Record_Content_Tab_Item>
              </Award_Record_Content_Tab_Content>
              <Award_Record_Content_Record_Content>
                {CommunityAwardRecord?.length > 0 ? (
                  CommunityAwardRecord?.map((item: any, index: any) => (
                    <Award_Record_Content_Record_Content_Item key={index}>
                      <div>
                        Reward type <span>{typeObj[item?.businessType]}</span>
                      </div>
                      <div>
                        Release time{" "}
                        <span>
                          {dateFormat(
                            "YYYY-mm-dd HH:MM:SS",
                            new Date(item?.createTime)
                          )}
                        </span>
                      </div>
                      <div>
                        Quantity Issued (MBK){" "}
                        <span>{decimalNum(item?.amount ?? 0, 2)}</span>
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
                {CommunityAwardRecord?.length > 0 ? (
                  CommunityAwardRecord?.map((item: any, index: any) => (
                    <Get_Record_Content_Record_Content_Item
                      key={index}
                      type={1}
                    >
                      <div>
                        Collection time{" "}
                        <span>
                          {" "}
                          {dateFormat(
                            "YYYY-mm-dd HH:MM:SS",
                            new Date(item?.createTime)
                          )}
                        </span>
                      </div>
                      <div>
                        Receive quantity (MBK){" "}
                        <span>{decimalNum(item?.amount ?? 0, 2)}</span>
                      </div>
                      <div>State{StateObj(2)}</div>
                      <div>
                        Transaction hash
                        <span>{AddrHandle(item?.txId, 6, 6)}</span>
                      </div>
                    </Get_Record_Content_Record_Content_Item>
                  ))
                ) : (
                  <NoData></NoData>
                )}
              </Award_Record_Content_Record_Content>
            </Award_Record_Content>
          )}
          {Number(ActiveTab) === 3 && (
            <Award_Record_Content>
              <Award_Record_Content_Record_Content>
                {CommunityAwardRecord?.length > 0 ? (
                  CommunityAwardRecord?.map((item: any, index: any) => (
                    <Get_Record_Content_Record_Content_Item
                      key={index}
                      type={1}
                    >
                      <div>
                        Type <span>activation</span>
                      </div>
                      <div>
                        Time{" "}
                        <span>
                          {" "}
                          {dateFormat(
                            "YYYY-mm-dd HH:MM:SS",
                            new Date(item?.createTime)
                          )}
                        </span>
                      </div>
                      <div>
                        Payment amount(USDT){" "}
                        <span>{decimalNum(item?.amount ?? 0, 2)}</span>
                      </div>
                      <div>State{StateObj(2)}</div>
                      <div>
                        Transaction hash
                        <span>{AddrHandle(item?.txId, 6, 6)}</span>
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
