import React, { useState, useEffect } from "react";
import {
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
import { AddrHandle, EthertoWei, NumSplic, addMessage } from "../utils/tool";
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
import { Button, DatePicker, Space, Toast } from "antd-mobile";
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
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const [SubTab, setSubTab] = useState<any>(0);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Balance, setBalance] = useState<any>("");
  const [InputValueAmount, setInputValueAmount] = useState<any>("0");
  const [ActivationModal, setActivationModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const CustomRender = useSelectDate();

  const getInitData = () => {
    userInfo({}).then((res: any) => {
      if (res.code === 200) {
        setUserInfo(res?.data);
      }
    });
  };

  useEffect(() => {
    if (state.token) {
       //getInitData();
    }
  }, [state.token, ActiveTab]);

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
  return (
    <NodeContainerBox>
      <NodeRecord>
        <NodeRecord_Date_Select>
          <CustomRender />
        </NodeRecord_Date_Select>
        <NodeRecord_Content>
          <Award_Record_Content>
            <Award_Record_Content_Tab_Content>
              <Award_Record_Content_Tab_Item
                className={Number(SubTab) === 0 ? "activeSubTab" : ""}
                onClick={() => {
                  setSubTab(0);
                }}
              >
                All
              </Award_Record_Content_Tab_Item>
              <Award_Record_Content_Tab_Item
                className={Number(SubTab) === 1 ? "activeSubTab" : ""}
                onClick={() => {
                  setSubTab(1);
                }}
              >
                First prize
              </Award_Record_Content_Tab_Item>
              <Award_Record_Content_Tab_Item
                className={Number(SubTab) === 2 ? "activeSubTab" : ""}
                onClick={() => {
                  setSubTab(2);
                }}
              >
                Second prize
              </Award_Record_Content_Tab_Item>
              <Award_Record_Content_Tab_Item
                className={Number(SubTab) === 3 ? "activeSubTab" : ""}
                onClick={() => {
                  setSubTab(3);
                }}
              >
                Third prize
              </Award_Record_Content_Tab_Item>
            </Award_Record_Content_Tab_Content>
            <Award_Record_Content_Record_Content>
              {true ? (
                [1, 2, 3, 4, 5].map((item: any, index: any) => (
                  <Award_Record_Content_Record_Content_Item key={index}>
                    <div>
                      Reward type <span>LP weighted</span>
                    </div>
                    <div>
                      Time <span>2023-12-23 12:23</span>
                    </div>
                    <div>
                      Quantity Issued (MBK) <span>2000.00</span>
                    </div>
                  </Award_Record_Content_Record_Content_Item>
                ))
              ) : (
                <NoData></NoData>
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
