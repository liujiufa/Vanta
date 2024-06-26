import React, { useState, useEffect } from "react";
import { getCardBase, userInfo } from "../API/index";
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
import { Carousel, Tooltip } from "antd";
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
import useUSDTGroup from "../hooks/useUSDTGroup";
import { contractAddress } from "../config";
import { useInputValue } from "../hooks/useInputValue";
import { NFTIcon } from "../assets/image/NFTBox";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { GameTooltip } from "./Home";

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
  > div {
    &:first-child {
      margin-top: 0;
    }
  }
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
  margin: 0px 0px 10px 0px !important;
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

export default function Rank() {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const state = useSelector<stateType, stateType>((state) => state);
  const [RecordList, setRecordList] = useState<any>([]);
  const [CardBase, setCardBase] = useState<any>({});
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [NFTPrice, setNFTPrice] = useState<any>({});
  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.nftContract, "MBK");
  const {
    Price,
    InputValueAmountValue,
    InputValueAmount,
    MaxFun,
    InputValueFun,
  } = useInputValue();

  const getInitData = () => {
    getCardBase().then((res: any) => {
      if (res.code === 200) {
        setCardBase(res?.data);
      }
    });
  };

  const getContractsData = async () => {
    let data = await Contracts.example?.queryPrice(web3ModalAccount as string);
    let nftBuyed = await Contracts.example?.totalSupply(
      web3ModalAccount as string
    );

    setNFTPrice({ ...data, supply: nftBuyed });
  };

  const mintFun = (value: string) => {
    if (Number(value) <= 0) return;
    handleTransaction(value, async (call: any) => {
      let res: any;
      try {
        showLoding(true);
        res = await Contracts.example?.mint(web3ModalAccount as string);
      } catch (error: any) {
        showLoding(false);
        return addMessage("mint失败");
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        Navigate("/View/NFT");
        addMessage("mint成功");
      } else {
        addMessage("mint失败");
      }
    });
  };

  useEffect(() => {
    // if (state.token) {
    // }
    getInitData();
  }, []);

  useEffect(() => {
    if (web3ModalAccount) {
      getContractsData();
    }
  }, [web3ModalAccount]);

  return (
    <NodeContainerBox>
      <NodeInfo>
        <NodeInfo_Top>
          <ModalContainer_Title_Container>
            <img src={NFTIcon} />
            <ModalContainer_Title>{t("83")}</ModalContainer_Title>
          </ModalContainer_Title_Container>
          <NodeInfo_Bottom_Item>
            {t("84")}
            <span>{t("86", { num: 8000 })}</span>
            {/* <span>8000 PCS</span> */}
          </NodeInfo_Bottom_Item>
          <NodeInfo_Bottom_Item_First>
            {t("85")}
            <span>
              {t("86", { num: 8000 - Number(NFTPrice?.supply ?? 0) })}
            </span>
            {/* <span>{8000 - Number(NFTPrice?.supply ?? 0)} PCS</span> */}
          </NodeInfo_Bottom_Item_First>
        </NodeInfo_Top>

        <NodeInfo_Top>
          <NodeInfo_Bottom_Item_First>
            {t("87")}
            <span>{t("88", { num: CardBase?.roundNum ?? "-" })}</span>
            {/* <span>Round{CardBase?.roundNum ?? "-"}</span> */}
          </NodeInfo_Bottom_Item_First>
          <NodeInfo_Bottom_Item_First>
            {t("89")}
            <span>{t("86", { num: CardBase?.roundSupplyNum ?? 0 })}</span>
            {/* <span>{CardBase?.roundSupplyNum ?? 0} PCS</span> */}
          </NodeInfo_Bottom_Item_First>
          <NodeInfo_Bottom_Item_First>
            {t("90")}
            <span>
              {t("86", {
                num:
                  Number(CardBase?.roundSupplyNum ?? 0) -
                  Number(CardBase?.roundSoldNum ?? 0),
              })}
            </span>
            {/* <span>
              {Number(CardBase?.roundSupplyNum ?? 0) -
                Number(CardBase?.roundSoldNum ?? 0)}{" "}
              PCS
            </span> */}
          </NodeInfo_Bottom_Item_First>
        </NodeInfo_Top>

        <NodeInfo_Mid>
          <NodeInfo_Mid_Item_First>
            {t("91")}
            <span>1VTB={Price ?? "--"}USDT</span>
          </NodeInfo_Mid_Item_First>
          <NodeInfo_Mid_Title>{t("92")}</NodeInfo_Mid_Title>
          <NodeInfo_Mid_Price>
            <div>
              {decimalNum(EthertoWei(NFTPrice?.mbkAmount ?? "0"), 2)}{" "}
              <span>VTB</span>
            </div>
            <div>
              {" "}
              <span> = {EthertoWei(NFTPrice?.usdtAmount ?? "0")}USDT</span>
            </div>
          </NodeInfo_Mid_Price>
          <NodeInfo_Mid_Rule>
            <Tooltip
              title={
                <GameTooltip>
                  <div>{t("388")}</div>
                  <div style={{ fontWeight: 500, marginTop: "8px" }}>
                    {t("389")}
                  </div>
                  <div>{t("442")}</div>
                  {/* <div>{t("391")}</div>
                  <div>{t("392")}</div>
                  <div>{t("393")}</div>
                  <div>{t("394")}</div> */}
                  <div style={{ marginTop: "8px" }}>{t("395")}</div>
                </GameTooltip>
              }
              autoAdjustOverflow
              showArrow={false}
            >
              <img src={helpIcon} alt="" />
              {t("12")}
            </Tooltip>
          </NodeInfo_Mid_Rule>

          {/* {Number(CardBase?.roundNum) === 1 && (
            <NodeInfo_Mid_Conditions>
              {t("93")}
              <div>{t("94")}</div>
              <div>{t("95")}</div>
            </NodeInfo_Mid_Conditions>
          )} */}
        </NodeInfo_Mid>
        <NodeInfo_Bottom
          onClick={() => {
            mintFun(EthertoWei(NFTPrice?.mbkAmount ?? "0"));
          }}
        >
          {t("77")}
        </NodeInfo_Bottom>
      </NodeInfo>
    </NodeContainerBox>
  );
}
