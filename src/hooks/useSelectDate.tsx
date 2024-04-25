import React, { useState, useCallback } from "react";
import { DatePicker, Button, Toast } from "antd-mobile";
import styled from "styled-components";
import { CalendarIcon } from "../assets/image/AnnouncementBox";
import { FlexSBCBox } from "../components/FlexBox";
const now = new Date();

const InputContainer = styled(FlexSBCBox)`
  width: 100%;
  padding: 8px 12px;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  display: flex;
  align-items: center;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #333333;

  background: #ffffff;

  box-sizing: border-box;
  border: 1px solid #d56819;
  border-radius: 5px;
  > input {
    background: transparent;
    border: none;
  }
`;
const MyCalendarIcon = styled(CalendarIcon)``;
const MyDatePicker = styled(DatePicker)`
  .adm-picker-header {
    /* border-radius: 10px 10px 0px 0px; */
    opacity: 1;

    background: #101010;
    .adm-picker-header-button {
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: normal;
      line-height: 24px;
      letter-spacing: 0px;

      font-variation-settings: "opsz" auto;
      &:first-child {
        color: rgba(102, 102, 102, 0.6);
      }
    }
  }
  .adm-picker-header-title {
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: normal;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0px;

    font-variation-settings: "opsz" auto;
    color: rgba(255, 255, 255, 0.9);
  }
`;
export function useSelectDate() {
  const [visible, setVisible] = useState(false);
  const [DateString, setDateString] = useState<any>(new Date());
  const [Precision, setPrecision] = useState<any>("month");
  // const [];
  const labelRenderer = useCallback((type: any, data: any) => {
    switch (type) {
      case "year":
        return `${data}年`;
      case "month":
        return `${data}月`;
      case "day":
        return `${data}日`;
      case "hour":
        return `${data}时`;
      case "minute":
        return `${data}分`;
      case "second":
        return `${data}秒`;
      default:
        return data;
    }
  }, []);

  const DatePickerComponent = () => (
    <>
      <InputContainer>
        <input
          type="text"
          readOnly={true}
          value={DateString.toLocaleDateString()}
        />{" "}
        <MyCalendarIcon onClick={() => setVisible(true)} />
      </InputContainer>
      <MyDatePicker
        title="时间选择"
        visible={visible}
        onClose={() => setVisible(false)}
        defaultValue={now}
        max={now}
        precision={Precision}
        onConfirm={(val) => {
          Toast.show(val.toLocaleDateString());
          setDateString(val);
          setVisible(false); // 如果需要在确认后关闭 DatePicker
        }}
        renderLabel={labelRenderer}
        className="MyDatePicker"
      />
    </>
  );

  return { DatePickerComponent, DateString, setDateString, setPrecision };
}
