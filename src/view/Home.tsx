import React, { useState, useEffect } from "react";
import {
  getHomePrice,
  refereeUserList,
  teamUserList,
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
  FlexECBox,
  FlexSACBox,
  FlexSBCBox,
  FlexSCBox,
} from "../components/FlexBox";
import { Carousel, Tooltip } from "antd";
import { useGetReward } from "../hooks/useGetReward";
import { Contracts } from "../web3";
import bannerImg1 from "../assets/image/Home/bannerImg1.png";
import announcementIcon from "../assets/image/Home/announcementIcon.svg";
import outLinkIcon from "../assets/image/Home/outLinkIcon.svg";
import menuIcon1 from "../assets/image/Home/menuIcon1.png";
import helpIcon from "../assets/image/Home/helpIcon.svg";
import coinIcon from "../assets/image/Home/coinIcon.svg";

const HomeContainerBox = styled(ContainerBox)`
  width: 100%;
`;
const MyCarousel = styled.div`
  width: 100%;
  border-radius: 10px;
  .ant-carousel {
    .item {
      width: 100%;
      > img {
        width: 100%;
      }
    }
    .slick-dots li,
    li > button {
      width: 12px;
      height: 12px;
      background: #bfbfbf;
      border-radius: 50%;
      &.slick-active {
        background: #000000;
      }
    }
    button {
      width: 12px;
      height: 12px;
      background: #bfbfbf;
      border-radius: 50%;
    }
  }
`;
const HomeContainerBox_Top = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Announcement = styled(FlexSBCBox)`
  margin: 15px 0px;
  width: 100%;
  padding: 12px 15px;
  border-radius: 10px;
  background: #d56819;
`;

const Announcement_Left = styled.div``;
const Announcement_Mid = styled.div`
  flex: 1;
  margin: 0px 10px;
  font-family: "PingFang SC";
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #333333;
`;
const Announcement_Right = styled.div``;

const MenuList = styled(FlexSBCBox)`
  width: 100%;
  flex-wrap: wrap;
  margin: 15px 0px 0px;
  > div {
    width: 25%;
  }
`;

const MenuList_Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  font-family: "PingFang SC";
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  margin-bottom: 15px;
  > img {
    width: 100%;
    max-width: 36px;
    margin-bottom: 5px;
  }
`;

const ActionList = styled(FlexBox)`
  width: 100%;
  border-radius: 10px;
  background: #101010;
  padding: 12px 15px;
  > div {
    font-family: "PingFang SC";
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #d56819;
    white-space: nowrap;
  }
`;

const RewardContainer = styled.div`
  width: 100%;
  > div {
    margin: 15px 0px;
  }
`;
const RewardItem = styled.div`
  position: relative;
  width: 100%;
  border-radius: 10px;
  padding: 10px 15px;
  gap: 15px;
  background: #101010;
  padding: 10px 15px;
`;
const RewardItem_Rule = styled(FlexECBox)`
  position: absolute;
  top: 5px;
  right: 5px;

  font-family: "PingFang SC";
  font-size: 10px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #666666;
  > img {
    margin-right: 5px;
  }
`;

const RewardItem_Title = styled.div`
  font-family: "PingFang SC";
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;
  text-align: start;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
`;
const RewardItem_Subtitle = styled.div`
  margin: 5px 0px 15px;
  text-align: start;
  font-family: "PingFang SC";
  font-size: 10px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #666666;
`;

const RewardItem_Info = styled(FlexSBCBox)`
  width: 100%;
`;

const RewardItem_Info_Item = styled.div`
  flex: 1;
  font-family: "PingFang SC";
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
`;

const RewardItem_Info_Item_Value = styled(FlexSCBox)`
  margin-top: 5px;
  font-family: "PingFang SC";
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  > span {
    margin-left: 5px;
    font-family: "PingFang SC";
    font-size: 10px;
    font-weight: normal;
    line-height: normal;
    text-transform: capitalize;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;
  }
`;

const HotQuotes = styled.div`
  width: 100%;
  border-radius: 10px;
  opacity: 1;
  background: #101010;
  padding: 10px 15px;
`;
const HotQuotes_Title = styled.div`
  width: 100%;

  font-family: "PingFang SC";
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-transform: capitalize;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;

  z-index: 0;
  margin-bottom: 16px;
`;

const HotQuotes_Content = styled.div`
  width: 100%;
  > div {
    margin-bottom: 15px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const HotQuotes_Content_Item = styled(FlexSBCBox)`
  width: 100%;
`;
const HotQuotes_Content_Item_Right = styled(FlexSBCBox)`
  width: 100%;
  flex: 1;
  margin-left: 10px;
  flex-direction: column;
  align-items: center;
  > div {
    width: 100%;
  }
`;

const HotQuotes_Content_Item_Right_Top = styled(FlexSBCBox)`
  font-family: "PingFang SC";
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  margin-bottom: 5px;
  > div {
    font-family: "PingFang SC";
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: #ffffff;
  }
`;
const HotQuotes_Content_Item_Right_Buttom = styled(FlexSBCBox)<{ add: any }>`
  font-family: "PingFang SC";
  font-size: 10px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #666666;
  > div {
    font-family: "PingFang SC";
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;

    font-variation-settings: "opsz" auto;
    color: ${(add: any) => (add ? "#d56819" : "#FFFFFF")};
  }
`;

const BannerListArr = [
  { img: bannerImg1 },
  { img: bannerImg1 },
  { img: bannerImg1 },
];

export default function Rank() {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const state = useSelector<stateType, stateType>((state) => state);
  const [RecordList, setRecordList] = useState<any>([]);
  const [UserInfo, setUserInfo] = useState<any>({});
  const [ActiveTab, setActiveTab] = useState<any>(1);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [Balance, setBalance] = useState<any>("");
  const [InputValueAmount, setInputValueAmount] = useState<any>("0");

  const MenuListArr = [
    { img: menuIcon1, name: "Subscription" },
    { img: menuIcon1, name: "Node" },
    { img: menuIcon1, name: "Community" },
    { img: menuIcon1, name: "Invite" },
    { img: menuIcon1, name: "Exchange" },
    { img: menuIcon1, name: "Swap" },
    { img: menuIcon1, name: "Insurance" },
    { img: menuIcon1, name: "More" },
  ];

  const getInitData = () => {
    userInfo({}).then((res: any) => {
      if (res.code === 200) {
        setUserInfo(res?.data);
      }
    });
  };

  useEffect(() => {
    if (state.token) {
      getInitData();
    }
  }, [state.token, ActiveTab]);

  useEffect(() => {
    if (account) {
      Contracts.example
        .balanceOf(account as string, "LPToken")
        .then((res: any) => {
          setBalance(EthertoWei(res ?? "0"));
          Contracts.example
            .queryUsdtAmountByLPAmount(
              account as string,
              EthertoWei(res ?? "0") + ""
            )
            .then((res: any) => {
              console.log(res, "er");
              setInputValueAmount(EthertoWei(res ?? "0"));
            });
        });
    }
  }, [account]);

  return (
    <HomeContainerBox>
      <MyCarousel>
        <Carousel autoplay>
          {BannerListArr?.map((item: any, index: any) => (
            <div key={index} className="item">
              <img src={item?.img} alt="" />
            </div>
          ))}
        </Carousel>
      </MyCarousel>
      <Announcement>
        <Announcement_Left>
          {" "}
          <img src={announcementIcon} alt="" />{" "}
        </Announcement_Left>
        <Announcement_Mid>announcement announcement</Announcement_Mid>
        <Announcement_Right>
          <img src={outLinkIcon} alt="" />
        </Announcement_Right>
      </Announcement>
      <MenuList>
        {MenuListArr?.map((item: any, index: any) => (
          <MenuList_Item
            key={index}
            onClick={() => {
              Navigate("/View/" + item?.name);
            }}
          >
            <img src={item?.img} alt="" />
            {item?.name}
          </MenuList_Item>
        ))}
      </MenuList>
      <ActionList>
        <div>12:24:46 0x12ds....fdee pledge value 3000USDT</div>
      </ActionList>

      <RewardContainer>
        <RewardItem>
          <RewardItem_Rule>
            <img src={helpIcon} alt="" />
            Rule
          </RewardItem_Rule>
          <RewardItem_Title>Zero Lu MBK</RewardItem_Title>
          <RewardItem_Subtitle>
            Register to participate, and you can enjoy rewards even if you
            haven’t activated it.
          </RewardItem_Subtitle>
          <RewardItem_Info>
            <RewardItem_Info_Item>
              Zero referral rewards
              <RewardItem_Info_Item_Value>
                0.0000 <span>MBK</span>
              </RewardItem_Info_Item_Value>
            </RewardItem_Info_Item>
            <RewardItem_Info_Item>
              Zero dynamic rewards
              <RewardItem_Info_Item_Value>
                0.0000 <span>MBK</span>
              </RewardItem_Info_Item_Value>
            </RewardItem_Info_Item>
          </RewardItem_Info>
        </RewardItem>
        <RewardItem>
          <RewardItem_Rule>
            <img src={helpIcon} alt="" />
            Rule
          </RewardItem_Rule>
          <RewardItem_Title>Lottery game</RewardItem_Title>
          <RewardItem_Subtitle>
            Lottery is drawn every day, and the fund pool is accumulated on a
            rolling basis
          </RewardItem_Subtitle>
          <RewardItem_Info>
            <RewardItem_Info_Item>
              Prize distribution yesterday
              <RewardItem_Info_Item_Value>
                0.0000 <span>MBK</span>
              </RewardItem_Info_Item_Value>
            </RewardItem_Info_Item>
            <RewardItem_Info_Item>
              Prize pool funds
              <RewardItem_Info_Item_Value>
                0.0000 <span>MBK</span>
              </RewardItem_Info_Item_Value>
            </RewardItem_Info_Item>
          </RewardItem_Info>
        </RewardItem>
      </RewardContainer>

      <HotQuotes>
        <HotQuotes_Title>Hot Quotes</HotQuotes_Title>
        <HotQuotes_Content>
          <HotQuotes_Content_Item>
            <img src={coinIcon} alt="" />
            <HotQuotes_Content_Item_Right>
              <HotQuotes_Content_Item_Right_Top>
                BTC<div>$35,306.69</div>
              </HotQuotes_Content_Item_Right_Top>
              <HotQuotes_Content_Item_Right_Buttom add={true}>
                Bitcoin<div>+1.21%</div>
              </HotQuotes_Content_Item_Right_Buttom>
            </HotQuotes_Content_Item_Right>
          </HotQuotes_Content_Item>
        </HotQuotes_Content>
      </HotQuotes>
    </HomeContainerBox>
  );
}
