import React, { useState, useEffect, useCallback } from "react";
import {
  activationNode,
  getMyNodeInfo,
  getNodeAwardRecord,
  getNodeBuyRecord,
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
import useUSDTGroup from "../hooks/useUSDTGroup";
import { contractAddress } from "../config";
import { menuIcon2 } from "../assets/image/homeBox";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import PageLoding from "../components/PageLoding";

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

const Award_Record_Content = styled.div`
  width: 100%;
`;
const Award_Record_Content_Tab_Content = styled(FlexSCBox)`
  width: 100%;
  padding: 10px 15px;
  overflow: scroll;
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

export default function Rank() {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const token = useSelector<any>((state) => state.token);
  const [RecordList, setRecordList] = useState<any>([]);
  const [MyNodeInfo, setMyNodeInfo] = useState<any>({});
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const [SubTab, setSubTab] = useState<0 | 43 | 44 | 45 | 46>(0);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Balance, setBalance] = useState<any>("");
  const [ActivationModal, setActivationModal] = useState(false);
  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.nodeContract, "MBK");
  const [dataLoding, setDataLoding] = useState<any>(true);

  const typeObj = { 46: "190", 43: "191", 44: "192" };

  const getInitData = useCallback(() => {
    getMyNodeInfo().then((res: any) => {
      if (res.code === 200) {
        setMyNodeInfo(res?.data);
      }
    });
  }, [token]);

  const getRecordData = () => {
    setRecordList([]);
    if (Number(ActiveTab) === 3) {
      setDataLoding(true);
      return getNodeBuyRecord().then((res: any) => {
        if (res.code === 200) {
          setDataLoding(false);
          setRecordList(res?.data);
        }
      });
    } else if (Number(ActiveTab) === 2) {
      setDataLoding(true);

      return getNodeAwardRecord(45).then((res: any) => {
        if (res.code === 200) {
          setDataLoding(false);
          setRecordList(res?.data);
        }
      });
    } else if (Number(ActiveTab) === 1) {
      setDataLoding(true);
      return getNodeAwardRecord(SubTab).then((res: any) => {
        if (res.code === 200) {
          setDataLoding(false);
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
    if (token) {
      getInitData();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getRecordData();
    }
  }, [token, SubTab, ActiveTab]);

  const StateObj = (type: number) => {
    if (type === 1) {
      return <span style={{ color: "#D56819" }}>{t("203")}</span>;
    } else if (type === 2) {
      return <span style={{ color: "#0256FF" }}>{t("204")}</span>;
    }
  };

  const activationFun = (value: string) => {
    if (!token) return;
    if (Number(value) <= 0) return;
    handleTransaction(value, async (call: any) => {
      let res: any;
      try {
        showLoding(true);

        let item: any = await activationNode({});
        if (item?.code === 200 && item?.data) {
          console.log(item?.data, "1212");

          res = await Contracts.example?.avtiveNode(
            web3ModalAccount as string,
            item?.data
          );
        }
      } catch (error: any) {
        showLoding(false);
        return addMessage(t("69"));
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        getInitData();
        setActivationModal(false);

        addMessage(t("70"));
      } else {
        addMessage(t("69"));
      }
    });
  };

  const NodeInfo_Top_Box_Fun = (MyNodeInfo: any) => {
    if (!!MyNodeInfo?.unLock) {
      return (
        <NodeInfo_Top>
          <ModalContainer_Title_Container>
            <img src={menuIcon2} />
            <ModalContainer_Title>{t("166")} </ModalContainer_Title>
          </ModalContainer_Title_Container>
          <NodeInfo_Mid_Content>
            <div>{t("102")}</div>
            <div>
              {decimalNum(MyNodeInfo?.amount, 6) ?? 0} <span>VTB</span>
            </div>
          </NodeInfo_Mid_Content>
          <NodeInfo_Top_Btn
            onClick={() => {
              getRewardFun(MyNodeInfo?.amount ?? 0, 15);
            }}
          >
            {t("103")}
          </NodeInfo_Top_Btn>
        </NodeInfo_Top>
      );
    } else if (!!MyNodeInfo?.isNode) {
      return (
        <NodeInfo_Top>
          <ModalContainer_Title_Container>
            <img src={menuIcon2} />
            <ModalContainer_Title>{t("166")} </ModalContainer_Title>
          </ModalContainer_Title_Container>
          <NodeInfo_Top_Tip>{t("183")}</NodeInfo_Top_Tip>
          <NodeInfo_Top_Btn
            onClick={() => {
              setActivationModal(true);
            }}
          >
            {t("97")}
          </NodeInfo_Top_Btn>
        </NodeInfo_Top>
      );
    } else {
      return (
        <NodeInfo_Top>
          <ModalContainer_Title_Container>
            <img src={menuIcon2} />
            <ModalContainer_Title>{t("166")} </ModalContainer_Title>
          </ModalContainer_Title_Container>
          <NodeInfo_Top_Tip>{t("167")}</NodeInfo_Top_Tip>
          <NodeInfo_Top_Btn
            onClick={() => {
              Navigate("/View/SubscriptionNode");
            }}
          >
            {t("152")}
          </NodeInfo_Top_Btn>
        </NodeInfo_Top>
      );
    }
  };

  return (
    <NodeContainerBox>
      <NodeInfo>
        {NodeInfo_Top_Box_Fun(MyNodeInfo)}
        <NodeInfo_Bottom>
          <NodeInfo_Bottom_Item>
            {t("182")}
            <span>{MyNodeInfo?.awardPool ?? 0} VTB</span>
          </NodeInfo_Bottom_Item>
          <NodeInfo_Bottom_Item>
            {t("184")}
            <span>{MyNodeInfo?.lpNum ?? 0} LP</span>
          </NodeInfo_Bottom_Item>
          <NodeInfo_Bottom_Item>
            {t("185")}
            <span>{MyNodeInfo?.communityPerformance ?? 0} USDT</span>
          </NodeInfo_Bottom_Item>
          <NodeInfo_Bottom_Item>
            {t("186")}
            <span>{MyNodeInfo?.totalNodeAward ?? 0} VTB</span>
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
            {t("56")}
          </NodeRecord_Tab_Item>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 2 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(2);
            }}
          >
            {t("173")}
          </NodeRecord_Tab_Item>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 3 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(3);
            }}
          >
            {t("174")}
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
                  className={Number(SubTab) === 46 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(46);
                  }}
                >
                  {t("190")}
                </Award_Record_Content_Tab_Item>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 43 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(43);
                  }}
                >
                  {t("191")}
                </Award_Record_Content_Tab_Item>
                <Award_Record_Content_Tab_Item
                  className={Number(SubTab) === 44 ? "activeSubTab" : ""}
                  onClick={() => {
                    setSubTab(44);
                  }}
                >
                  {t("192")}
                </Award_Record_Content_Tab_Item>
              </Award_Record_Content_Tab_Content>
              <Award_Record_Content_Record_Content>
                {!dataLoding ? (
                  RecordList?.length > 0 ? (
                    RecordList?.map((item: any, index: any) => (
                      <Award_Record_Content_Record_Content_Item key={index}>
                        <div>
                          {t("193")}{" "}
                          <span>{t(typeObj[item?.businessType])}</span>
                        </div>
                        <div>
                          {t("194")}{" "}
                          <span>
                            {dateFormat(
                              "YYYY-mm-dd HH:MM:SS",
                              new Date(item?.createTime)
                            )}
                          </span>
                        </div>
                        <div>
                          {t("195")} <span>{decimalNum(item?.amount, 6)}</span>
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
                  RecordList?.length > 0 ? (
                    RecordList?.map((item: any, index: any) => (
                      <Get_Record_Content_Record_Content_Item
                        key={index}
                        type={1}
                      >
                        <div>
                          {t("196")}{" "}
                          <span>
                            {dateFormat(
                              "YYYY-mm-dd HH:MM:SS",
                              new Date(item?.createTime)
                            )}
                          </span>
                        </div>
                        <div>
                          {t("197")} <span>{decimalNum(item?.amount, 6)}</span>
                        </div>
                        <div>
                          {t("198")}
                          {StateObj(2)}
                        </div>
                        <div>
                          {t("199")}
                          <span>{AddrHandle(item?.txId)}</span>
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
          {Number(ActiveTab) === 3 && (
            <Award_Record_Content>
              <Award_Record_Content_Record_Content>
                {!dataLoding ? (
                  RecordList?.length > 0 ? (
                    RecordList?.map((item: any, index: any) => (
                      <Get_Record_Content_Record_Content_Item
                        key={index}
                        type={1}
                      >
                        <div>
                          {t("200")} <span>{t("152")}</span>
                        </div>
                        <div>
                          {t("201")}{" "}
                          <span>
                            {dateFormat(
                              "YYYY-mm-dd HH:MM:SS",
                              new Date(item?.createTime)
                            )}
                          </span>
                        </div>
                        <div>
                          {t("202")} <span>{decimalNum(item?.payNum, 6)}</span>
                        </div>
                        <div>
                          {t("198")}
                          {StateObj(2)}
                        </div>
                        <div>
                          {t("199")}
                          <span>{AddrHandle(item?.buyTxId, 6, 6)}</span>
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

      <AllModal
        visible={ActivationModal}
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
          <HomeContainerBox_Content_Bg3></HomeContainerBox_Content_Bg3>

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
            <img src={menuIcon2} alt="" />
            <ModalContainer_Title>{t("187")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <ModalContainer_Content>
            {t("188")}
            <span>100</span>
            <UpBtn
              onClick={() => {
                activationFun("100");
              }}
            >
              {t("97")}
            </UpBtn>
            <BalanceBox>
              {t("50")}: <span>{TOKENBalance ?? 0}</span>VTB
            </BalanceBox>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>
    </NodeContainerBox>
  );
}
