import React from "react";
import { useTranslation } from "react-i18next";
import noDataImg from "../assets/image/nodata.png";

export default function NoData() {
  const { t } = useTranslation();
  return (
    <div className="NoData flexCenter" style={{ width: "100%" }}>
      <div className="box">
        <img src={noDataImg} alt="" />
        <div className="title">{t("Not yet")}</div>
      </div>
    </div>
  );
}
