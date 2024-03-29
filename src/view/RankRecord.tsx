import React, { useState, useEffect } from "react";
import { getRobotRankRecord, userInfo } from "../API/index";
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
const Award_Record_Content_Record_Content = styled.div`
  > div {
    /* border-bottom: 1px solid rgba(213, 104, 25, 0.2); */
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

const Award_Record_Content_Title_Content = styled(FlexSBCBox)`
  padding: 0px 15px;
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

const Award_Record_Content_Record_Box = styled.div`
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
  const { account } = useWeb3React();
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
  const [Balance, setBalance] = useState<any>("");
  const [InputValueAmount, setInputValueAmount] = useState<any>("0");
  const [ActivationModal, setActivationModal] = useState(false);
  const { DatePickerComponent, DateString, setDateString } = useSelectDate();
  const recordType: number = Number((typeObj as any)?.recordType);
  // 1机器人业绩明星 2机器人-直推明星 3机器人-NFT团队明星 4-质押业绩明星 5-质押直推明星 6-质押NFT团队明星 7NFT-先锋排名
  const getInitData = () => {
    getRobotRankRecord({
      month: DateString?.getMonth(),
      type: recordType === 1 ? ActiveTab : Number(ActiveTab) + 3,
      year: DateString?.getFullYear(),
    }).then((res: any) => {
      if (res.code === 200) {
        setRecordList(res?.data);
      }
    });
  };

  useEffect(() => {
    if (state.token) {
      getInitData();
    }
  }, [state.token, ActiveTab, DateString, recordType]);

  useEffect(() => {
    if (account) {
      // Contracts.example
      //   .balanceOf(account as string, "LPToken")
      //   .then((res: any) => {
      //     setBalance(EthertoWei(res ?? "0"));
      //     Contracts.example
      //       .queryUsdtAmountByLPAmount(
      //         account as string,
      //         EthertoWei(res ?? "0") + ""
      //       )
      //       .then((res: any) => {
      //         console.log(res, "er");
      //         setInputValueAmount(EthertoWei(res ?? "0"));
      //       });
      //   });
    }
  }, [account]);

  const StateObj = (type: number) => {
    if (type === 1) {
      return <span style={{ color: "#D56819" }}>Confirming</span>;
    } else if (type === 2) {
      return <span style={{ color: "#0256FF" }}>successful</span>;
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
              setDateString(new Date());
            }}
          >
            performance
          </NodeRecord_Tab_Item>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 2 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(2);
              setDateString(new Date());
            }}
          >
            direct push
          </NodeRecord_Tab_Item>
          <NodeRecord_Tab_Item
            className={Number(ActiveTab) === 3 ? "activeTab" : "tab"}
            onClick={() => {
              setActiveTab(3);
              setDateString(new Date());
            }}
          >
            NFT team
          </NodeRecord_Tab_Item>
        </NodeRecord_Tab>
        <NodeRecord_Content>
          <NodeRecord_Date_Select>
            <DatePickerComponent />
          </NodeRecord_Date_Select>
          {Number(ActiveTab) === 1 && (
            <Award_Record_Content>
              <Award_Record_Content_Title_Content>
                <div>address</div>
                <div>Community(USDT)</div>
                <div>Ranking</div>
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
          )}
          {Number(ActiveTab) === 2 && (
            <Award_Record_Content>
              <Award_Record_Content_Title_Content>
                <div>address</div>
                <div>Direct Push(USDT)</div>
                <div>Ranking</div>
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
          )}
          {Number(ActiveTab) === 3 && (
            <Award_Record_Content>
              <Award_Record_Content_Title_Content>
                <div>address</div>
                <div>Team(USDT)</div>
                <div>Ranking</div>
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
          )}
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
                  Congratulations <span>First Prize 3000MBK</span>
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
