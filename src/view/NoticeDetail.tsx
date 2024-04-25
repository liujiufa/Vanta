import React, { useState, useEffect } from "react";
import { getNoticeInfo, getNoticeList } from "../API/index";
import "../assets/style/Notice.scss";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { stateType } from "../store/reducer";
import styled, { keyframes } from "styled-components";
import { useViewport } from "../components/viewportContext";
import { AddrHandle } from "../utils/tool";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import returnIcon from "../assets/image/returnIcon.svg";
import TruncateMarkup from "react-truncate-markup";

export default function NoticeDetail() {
  const { state } = useLocation();
  const { t, i18n } = useTranslation();
  const [NoticeInfo, setNoticeInfo] = useState<any>({});
  const { account } = useWeb3React();
  const { token } = useSelector<stateType, stateType>((state) => state);
  const { width } = useViewport();
  const Navigate = useNavigate();
  let id = (state as any)?.id;

  useEffect(() => {
    if (token && id) {
      getNoticeInfo(id).then((res: any) => {
        if (res?.code === 200) {
          setNoticeInfo(res?.data);
        }
      });
    }
  }, [token, id]);

  return (
    <div className="NPCContainer Notice">
      <div className="noticeTop">
        {/* <div className="returnBtn">
          {" "}
          <div
            className="returnImg"
            onClick={() => {
              Navigate(-1);
            }}
          >
            <img src={returnIcon} alt="" />
          </div>{" "}
        </div> */}
        {/* <TruncateMarkup lines={1}></TruncateMarkup> */}
        <div className="noticeTip">{NoticeInfo?.title}</div>
      </div>

      <div className="contentBox">
        {/* <TruncateMarkup lines={2}> */}
        <div className="textDetailContentTime">{"2023-12-23 12:23"}</div>
        <div
          className="textDetailContent"
          dangerouslySetInnerHTML={{ __html: NoticeInfo?.content }}
        ></div>
        {/* <div
          className="textDetailContent"
          dangerouslySetInnerHTML={{ __html: NoticeList?.content }}
        ></div> */}
        {/* </TruncateMarkup> */}
      </div>
    </div>
  );
}
