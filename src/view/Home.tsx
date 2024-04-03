import React, { useState, useEffect, useRef } from "react";
import {
  getBannerList,
  getCoinPriceList,
  getMyFreeInfo,
  getNoticeList,
  homePoolInfo,
  latestRecord,
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
} from "../utils/tool";
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

import helpIcon from "../assets/image/Home/helpIcon.svg";
import coinIcon from "../assets/image/Home/coinIcon.svg";
import {
  menuIcon1,
  menuIcon2,
  menuIcon3,
  menuIcon4,
  menuIcon5,
  menuIcon6,
  menuIcon7,
  menuIcon8,
} from "../assets/image/homeBox";

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
        max-height: 128px;
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
  .announcement-container {
    width: 100%;
    overflow: hidden;
  }

  .announcement-list {
    display: flex;
    animation: scroll 10s linear infinite;
    margin-bottom: 0px;
    > li {
      min-width: 342px;
      width: 100%;
    }
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
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
  overflow: hidden;

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
  text-align: center;
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
  > img {
    max-width: 32px;
  }
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
  const [BannerList, setBannerList] = useState<any>([]);
  const [NoticeList, setNoticeList] = useState<any>([]);
  const [CoinPriceList, setCoinPriceList] = useState<any>([]);
  const { width } = useViewport();
  const Navigate = useNavigate();
  const { getReward } = useGetReward();
  const [LatestRecord, setLatestRecord] = useState<any>({});
  const [MyFreeInfo, setMyFreeInfo] = useState<any>({});
  const [PoolInfo, setPoolInfo] = useState<any>({});
  const containerRef = useRef<any>(null);
  const listRef = useRef<any>(null);

  useEffect(() => {
    const containerWidth = containerRef.current.offsetWidth;
    const listWidth = listRef.current.offsetWidth;

    if (listWidth > containerWidth) {
      listRef.current.style.width = `${listWidth}px`;
    } else {
      listRef.current.style.width = "100%";
    }
  }, []);

  const MenuListArr = [
    { img: menuIcon1, name: "4", route: "Robot" },
    { img: menuIcon2, name: "5", route: "Node" },
    { img: menuIcon3, name: "6", route: "Community" },
    { img: menuIcon4, name: "7", route: "Invite" },
    { img: menuIcon5, name: "8", route: "Exchange" },
    { img: menuIcon6, name: "Swap", route: "Swap" },
    { img: menuIcon7, name: "9", route: "Insurance" },
    { img: menuIcon8, name: "10", route: "More" },
  ];

  const getInitData = () => {
    getBannerList().then((res: any) => {
      if (res.code === 200) {
        setBannerList(res?.data);
      }
    });
    getNoticeList().then((res: any) => {
      if (res.code === 200) {
        setNoticeList(res?.data);
      }
    });
    getCoinPriceList().then((res: any) => {
      if (res.code === 200) {
        setCoinPriceList(res?.data);
      }
    });
    latestRecord({}).then((res: any) => {
      if (res.code === 200) {
        setLatestRecord(res?.data);
      }
    });
  };

  const getInitTokenData = () => {
    getMyFreeInfo().then((res: any) => {
      if (res.code === 200) {
        setMyFreeInfo(res?.data);
      }
    });
    homePoolInfo().then((res: any) => {
      if (res.code === 200) {
        setPoolInfo(res?.data);
      }
    });
  };

  useEffect(() => {
    getInitData();
    if (state.token) {
      getInitTokenData();
    }
  }, [state.token]);

  return (
    <HomeContainerBox>
      <MyCarousel>
        <Carousel autoplay>
          {BannerList?.map((item: any, index: any) => (
            <div key={index} className="item">
              <img src={item?.bannerUrl} alt="" />
            </div>
          ))}
        </Carousel>
      </MyCarousel>
      <Announcement>
        <Announcement_Left>
          {" "}
          <img src={announcementIcon} alt="" />{" "}
        </Announcement_Left>
        <Announcement_Mid ref={containerRef}>
          <ul className="announcement-list" ref={listRef}>
            {NoticeList?.map((item: any, index: any) => (
              <li key={index}>{item?.content}</li>
            ))}
          </ul>
        </Announcement_Mid>
        <Announcement_Right>
          <img src={outLinkIcon} alt="" />
        </Announcement_Right>
      </Announcement>
      <MenuList>
        {MenuListArr?.map((item: any, index: any) => (
          <MenuList_Item
            key={index}
            onClick={() => {
              Navigate("/View/" + item?.route);
            }}
          >
            <img src={item?.img} alt="" />
            {t(item?.name)}
          </MenuList_Item>
        ))}
      </MenuList>
      {LatestRecord?.createTime && (
        <ActionList>
          <div>
            {t("21", {
              time: dateFormat("HH:MM:SS", new Date(LatestRecord?.createTime)),
              address: AddrHandle(LatestRecord?.userAddress, 6, 6),
              num: LatestRecord?.pledgeNum,
            })}
          </div>
          {/* <div>12:24:46 0x12ds....fdee pledge value 3000USDT</div> */}
        </ActionList>
      )}

      <RewardContainer>
        <RewardItem
          onClick={() => {
            Navigate("/View/ZeroStroke");
          }}
        >
          <RewardItem_Rule>
            <img src={helpIcon} alt="" />
            {t("12")}
          </RewardItem_Rule>
          <RewardItem_Title>{t("11")} MBK</RewardItem_Title>
          <RewardItem_Subtitle>{t("13")}</RewardItem_Subtitle>
          <RewardItem_Info>
            <RewardItem_Info_Item>
              {t("14")}
              <RewardItem_Info_Item_Value>
                {decimalNum(MyFreeInfo?.refereeAmount, 2) ?? 0} <span>MBK</span>
              </RewardItem_Info_Item_Value>
            </RewardItem_Info_Item>
            <RewardItem_Info_Item>
              {t("15")}
              <RewardItem_Info_Item_Value>
                {decimalNum(MyFreeInfo?.shareAmount, 2) ?? 0} <span>MBK</span>
              </RewardItem_Info_Item_Value>
            </RewardItem_Info_Item>
          </RewardItem_Info>
        </RewardItem>

        <RewardItem
          onClick={() => {
            Navigate("/View/LotteryGame");
          }}
        >
          <RewardItem_Rule>
            <img src={helpIcon} alt="" />
            {t("12")}
          </RewardItem_Rule>
          <RewardItem_Title>{t("16")}</RewardItem_Title>
          <RewardItem_Subtitle>{t("17")}</RewardItem_Subtitle>
          <RewardItem_Info>
            <RewardItem_Info_Item>
              {t("18")}
              <RewardItem_Info_Item_Value>
                {decimalNum(MyFreeInfo?.yesterdayLotteryAmount, 2) ?? 0}{" "}
                <span>MBK</span>
              </RewardItem_Info_Item_Value>
            </RewardItem_Info_Item>
            <RewardItem_Info_Item>
              {t("19")}
              <RewardItem_Info_Item_Value>
                {decimalNum(MyFreeInfo?.todayPoolAmount, 2) ?? 0}{" "}
                <span>MBK</span>
              </RewardItem_Info_Item_Value>
            </RewardItem_Info_Item>
          </RewardItem_Info>
        </RewardItem>
      </RewardContainer>

      <HotQuotes>
        <HotQuotes_Title>{t("20")}</HotQuotes_Title>
        {CoinPriceList?.length > 0 ? (
          <HotQuotes_Content>
            {CoinPriceList?.map((item: any, index: any) => (
              <HotQuotes_Content_Item>
                <img src={item?.icon} alt="" />
                <HotQuotes_Content_Item_Right>
                  <HotQuotes_Content_Item_Right_Top>
                    {item?.coinName}
                    <div>${item?.price}</div>
                  </HotQuotes_Content_Item_Right_Top>
                  <HotQuotes_Content_Item_Right_Buttom add={true}>
                    {item?.apiSymbol ?? "-"}
                    <div>{item?.changeRate}%</div>
                  </HotQuotes_Content_Item_Right_Buttom>
                </HotQuotes_Content_Item_Right>
              </HotQuotes_Content_Item>
            ))}
          </HotQuotes_Content>
        ) : (
          <HotQuotes_Content>
            <NoData />
          </HotQuotes_Content>
        )}
      </HotQuotes>
    </HomeContainerBox>
  );
}
