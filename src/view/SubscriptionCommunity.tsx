import React, { useState, useEffect } from "react";
import {
  activationCommunity,
  getCommunitySoldBase,
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
import helpIcon from "../assets/image/Home/helpIcon.svg";
import errorIcon from "../assets/image/Subscription/errorIcon.svg";
import yesIcon from "../assets/image/Subscription/yesIcon.svg";
import { useInputValue } from "../hooks/useInputValue";
import closeIcon from "../assets/image/closeIcon.svg";
import { contractAddress } from "../config";
import useUSDTGroup from "../hooks/useUSDTGroup";
import { menuIcon3 } from "../assets/image/homeBox";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

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
const NodeInfo_Bottom_Item_First = styled(NodeInfo_Bottom_Item)`
  margin-top: 18px;
`;
const NodeInfo_Mid_Item_First = styled(NodeInfo_Bottom_Item_First)`
  margin: 0px 0px 5px 0px !important;
`;

const NodeInfo_Mid = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 15px;
  border-bottom: 1px solid rgba(213, 104, 25, 0.2);
  > div {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
`;
const NodeInfo_Mid_Title = styled(FlexCCBox)`
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: uppercase;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
`;
// const NodeInfo_Mid_Price = styled(FlexCCBox)`
//   width: 100%;
//   font-family: PingFang SC;
//   font-size: 18px;
//   font-weight: normal;
//   line-height: normal;
//   text-transform: capitalize;
//   letter-spacing: 0em;

//   font-variation-settings: "opsz" auto;
//   color: #d56819;

//   z-index: 0;
//   > span {
//     font-family: PingFang SC;
//     font-size: 12px;
//     font-weight: normal;
//     line-height: normal;
//     text-transform: uppercase;
//     letter-spacing: 0em;

//     font-variation-settings: "opsz" auto;
//     color: rgba(255, 255, 255, 0.8);
//     margin-left: 5px;
//   }
// `;
const NodeInfo_Mid_Price = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-family: PingFang SC;
    font-size: 18px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;

    z-index: 0;
    > span {
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: normal;
      line-height: normal;
      text-transform: uppercase;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: rgba(255, 255, 255, 0.8);
      margin-left: 5px;
    }
  }
`;
const NodeInfo_Mid_Rule = styled(FlexECBox)`
  width: 100%;
  font-family: PingFang SC;
  font-size: 10px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #666666;
  /* margin-bottom: 15px !important; */
  > img {
    margin-right: 5px;
  }
`;

const NodeInfo_Mid_Conditions = styled.div`
  margin-top: 15px;
  width: 100%;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #d56819;
  > div {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 5px;
    > img {
      margin-right: 5px;
    }
    &:first-child {
      margin-top: 10px;
    }
  }
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

export default function Rank() {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const token = useSelector<any, any>((state) => state.token);
  const [CommunitySoldBase, setCommunitySoldBase] = useState<any>({});
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const {
    Price,
    InputValueAmountValue,
    InputValueAmount,
    MaxFun,
    InputValueFun,
  } = useInputValue();
  const [ActivationModal, setActivationModal] = useState(false);
  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.communityContract, "MBK");

  const getInitData = () => {
    getCommunitySoldBase().then((res: any) => {
      if (res.code === 200) {
        setCommunitySoldBase(res?.data);
      }
    });
  };

  const activationFun = async (value: string) => {
    console.log("item");
    if (!token) return;
    if (Number(value) <= 0) return;
    handleTransaction(Number(value) + 50000 + "", async (call: any) => {
      let res: any;
      try {
        showLoding(true);

        let item: any = await activationCommunity({});
        if (item?.code === 200 && item?.data) {
          console.log(item?.data, "1212");

          res = await Contracts.example?.activeCommunity(
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
        Navigate("/View/Community");
        addMessage(t("70"));
      } else {
        addMessage(t("69"));
      }
    });
  };

  useEffect(() => {
    if (token) {
      getInitData();
    }
  }, [token]);

  return (
    <NodeContainerBox>
      <NodeInfo>
        <NodeInfo_Top>
          <ModalContainer_Title_Container>
            <img src={menuIcon3} />
            <ModalContainer_Title>{t("207")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <NodeInfo_Bottom_Item>
            {t("212")}
            <span>{CommunitySoldBase?.totalSupply ?? 0} PCS</span>
          </NodeInfo_Bottom_Item>
          <NodeInfo_Bottom_Item_First>
            {t("213")}
            <span>{CommunitySoldBase?.remainSupply ?? 0} PCS</span>
          </NodeInfo_Bottom_Item_First>
        </NodeInfo_Top>

        <NodeInfo_Mid>
          <NodeInfo_Mid_Title>{t("215")}</NodeInfo_Mid_Title>
          {/* <NodeInfo_Mid_Price>
            {CommunitySoldBase?.currentPrice ?? 0} <span>USDT</span>
          </NodeInfo_Mid_Price> */}
          <NodeInfo_Mid_Price>
            <div>
              {decimalNum(
                Number(CommunitySoldBase?.currentPrice) / Number(Price),
                2
              ) ?? 0}{" "}
              <span>MBK</span>
            </div>
            <div>
              {" "}
              <span> = {CommunitySoldBase?.currentPrice ?? 0}USDT</span>
            </div>
          </NodeInfo_Mid_Price>
          <NodeInfo_Mid_Rule>
            <img src={helpIcon} alt="" />
            {t("12")}
          </NodeInfo_Mid_Rule>
          <NodeInfo_Mid_Item_First>
            {t("91")}
            <span>1MBK={Price ?? "--"}USDT</span>
          </NodeInfo_Mid_Item_First>
          {/* <NodeInfo_Mid_Item_First>
            Equivalent MBK quantity
            <span>3000 MBK</span>
          </NodeInfo_Mid_Item_First> */}
          <NodeInfo_Mid_Conditions>
            {t("216")}
            <div>
              <img
                src={
                  !!CommunitySoldBase?.CommunitySoldBase ? yesIcon : errorIcon
                }
                alt=""
              />
              {t("217")}
            </div>
            <div>
              <img
                src={!!CommunitySoldBase?.isSatisfy ? yesIcon : errorIcon}
                alt=""
              />
              {t("218")}
            </div>
          </NodeInfo_Mid_Conditions>
        </NodeInfo_Mid>
        <NodeInfo_Bottom
          onClick={() => {
            // if (
            //   !!CommunitySoldBase?.isSatisfy &&
            //   !!CommunitySoldBase?.CommunitySoldBase
            // ) {
            setActivationModal(true);
            // } else {
            //   return addMessage(t("220"));
            // }
          }}
        >
          {t("152")}
        </NodeInfo_Bottom>
      </NodeInfo>

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
            <img src={menuIcon3} alt="" />
            <ModalContainer_Title>{t("207")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <ModalContainer_Content>
            {t("188")}
            <span>
              {decimalNum(
                Number(CommunitySoldBase?.currentPrice) / Number(Price),
                2
              ) ?? 0}
            </span>
            <UpBtn
              onClick={() => {
                // BindFun();
                activationFun(
                  decimalNum(
                    Number(CommunitySoldBase?.currentPrice) / Number(Price),
                    2
                  ) + ""
                );
              }}
            >
              {t("97")}
            </UpBtn>
            <BalanceBox>
              {t("50")}: <span>{TOKENBalance}</span>MBK
            </BalanceBox>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>
    </NodeContainerBox>
  );
}
