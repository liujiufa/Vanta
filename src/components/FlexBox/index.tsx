import styled from "styled-components";

export const FlexBox = styled.div`
  display: flex;
`;
export const FlexSSBox = styled(FlexBox)`
  justify-content: flex-start;
  align-items: flex-start;
`;

export const FlexSCBox = styled(FlexBox)`
  justify-content: flex-start;
  align-items: center;
`;
export const FlexECBox = styled(FlexBox)`
  justify-content: flex-end;
  align-items: center;
`;

export const FlexSASBox = styled(FlexBox)`
  justify-content: space-around;
  align-items: center;
`;

export const FlexSACBox = styled(FlexBox)`
  justify-content: space-around;
  align-items: center;
`;

export const FlexSBSBox = styled(FlexBox)`
  justify-content: space-between;
  align-items: flex-start;
`;

export const FlexSBCBox = styled(FlexBox)`
  justify-content: space-between;
  align-items: center;
`;

export const FlexCCBox = styled(FlexBox)`
  justify-content: center;
  align-items: center;
  text-align: center;

`;

export const FlexSECBox = styled(FlexBox)`
  justify-content: space-evenly;
  align-items: center;
`;

export const FlexSESBox = styled(FlexBox)`
  justify-content: space-evenly;
  align-items: flex-start;
`;

export const ClaimBtn = styled(FlexCCBox)<{ isClaim?: boolean }>`
  padding: 8px 16px;
  font-size: ${({ theme }) => theme.size14};
  cursor: ${({ isClaim }) => (isClaim ? "pointer" : "default")};
  opacity: ${({ isClaim }) => (isClaim ? 1 : ".3")};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  white-space: nowrap;
`;

export const LinearBox = styled(FlexCCBox)`
  padding: 6px 16px;
  border-radius: 32px;
  font-size: 12px;
  font-weight: 700;
  color: #fd0c5d;
  border: 1px solid #fd0c5d46;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
  -ms-text-fill-color: transparent;
  -o-text-fill-color: transparent;
  background-image: linear-gradient(180deg, #fd0c5d 0%, #f446ff 100%);
  background-position-x: initial;
  background-position-y: initial;
  background-size: initial;
  background-repeat-x: initial;
  background-repeat-y: initial;
  background-attachment: initial;
  background-origin: initial;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -ms-background-clip: text;
  -o-background-clip: text;
  background-color: initial;
`;

export const ContainerBox = styled(FlexSCBox)`
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 15px;
`;
