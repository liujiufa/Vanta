import styled, { keyframes } from "styled-components";
import lodingimg from "../assets/image/loding.png";
import { FlexBox } from "./FlexBox";
const turn = keyframes`
    0%{-webkit-transform:rotate(0deg);}
    25%{-webkit-transform:rotate(90deg);}
    50%{-webkit-transform:rotate(180deg);}
    75%{-webkit-transform:rotate(270deg);}
    100%{-webkit-transform:rotate(360deg);}
`;
const LodingMode = styled.div`
  width: 100%;
  height: 100%;
  /* background: rgba(0, 0, 0, 0.3); */
  /* background: #ccc; */
  display: flex;
  align-items: center;
  justify-content: center;
  & img {
    width: 50px;
    animation: ${turn} 3s linear infinite;
  }
`;
const LodingModeContainer = styled(FlexBox)`
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: #d56819;
  min-height: 226px;
`;
export default function PageLoding() {
  return (
    <LodingModeContainer>
      <LodingMode>
        <img src={lodingimg} alt="" />
      </LodingMode>
      登录中
    </LodingModeContainer>
  );
}
