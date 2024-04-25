import React, { useState, useEffect } from "react";
import { Modal, Tooltip, ConfigProvider } from "antd";
import { getNoticeList } from "../API/index";
import "../assets/style/Notice.scss";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { stateType } from "../store/reducer";
import styled, { keyframes } from "styled-components";
import { useViewport } from "../components/viewportContext";
import { AddrHandle, dateFormat } from "../utils/tool";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import returnIcon from "../assets/image/returnIcon.svg";
import TruncateMarkup from "react-truncate-markup";

export default function Notice() {
  const { t, i18n } = useTranslation();
  const [NoticeList, setNoticeList] = useState([]);
  const state = useSelector<stateType, stateType>((state) => state);
  const { width } = useViewport();
  const Navigate = useNavigate();

  useEffect(() => {
    if (state.token) {
      getNoticeList().then((res: any) => {
        if (res.code === 200) {
          setNoticeList(res?.data);
        }
      });
    }
  }, [state.token]);

  return (
    <div className="NPCContainer Notice" style={{ padding: "0px" }}>
      <div className="contentBox">
        <div className="textContent">
          {NoticeList?.map((item: any, index: any) => (
            <div
              key={index}
              className="item"
              onClick={() => {
                Navigate("/View/NoticeDetail", { state: { id: item?.id } });
              }}
            >
              {/* <TruncateMarkup lines={1}> */}
              <div className="title">{item?.title}</div>
              {/* </TruncateMarkup> */}
              <TruncateMarkup lines={2}>
                <div className="value">
                  <p dangerouslySetInnerHTML={{ __html: item?.content }}></p>
                </div>
              </TruncateMarkup>
              <div className="value">
                <p>
                  {dateFormat(
                    "YYYY-mm-dd HH:MM:SS",
                    new Date(item?.createTime)
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
