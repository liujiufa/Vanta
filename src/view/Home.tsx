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
  FlexSACBox,
  FlexSBCBox,
} from "../components/FlexBox";
import { Carousel, Tooltip } from "antd";
import { useGetReward } from "../hooks/useGetReward";
import { Contracts } from "../web3";
import bannerImg1 from "../assets/image/Home/bannerImg1.png";
import announcementIcon from "../assets/image/Home/announcementIcon.svg";
import outLinkIcon from "../assets/image/Home/outLinkIcon.svg";
import menuIcon1 from "../assets/image/Home/menuIcon1.png";

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

const BannerList = [
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
          {BannerList?.map((item: any, index: any) => (
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
        <MenuList_Item>
          <img src={menuIcon1} alt="" />
          Subscription
        </MenuList_Item>
        <MenuList_Item>
          <img src={menuIcon1} alt="" />
          Node
        </MenuList_Item>
        <MenuList_Item>
          <img src={menuIcon1} alt="" />
          Community
        </MenuList_Item>
        <MenuList_Item>
          <img src={menuIcon1} alt="" />
          Invite
        </MenuList_Item>
        <MenuList_Item>
          <img src={menuIcon1} alt="" />
          Exchange
        </MenuList_Item>
        <MenuList_Item>
          <img src={menuIcon1} alt="" />
          Swap
        </MenuList_Item>
        <MenuList_Item>
          <img src={menuIcon1} alt="" />
          Insurance
        </MenuList_Item>
        <MenuList_Item>
          <img src={menuIcon1} alt="" />
          More
        </MenuList_Item>
      </MenuList>
    </HomeContainerBox>
  );
}
ssh://git@ssh.github.com:443/liujiufa/LP_IDO.git