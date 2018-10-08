import * as React from "react";
import { MetaMaskSideIcon, Button, buttonSizes, TransactionButtonInnerProps } from ".";
import styled from "styled-components";

const B = Button.extend`
  position: relative;
  display: flex;
  align-items: center;
  height: 46px;
  padding-left: 75px;
`;

const ImgWrapper = styled.div`
  width: 44px;
  height: 44px;
  background-color: #ffffff;
  position: absolute;
  top: 1px;
  left: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MetaMaskLogoButton = (props: TransactionButtonInnerProps): JSX.Element => {
  return (
    <B onClick={props.onClick} size={buttonSizes.MEDIUM_WIDE}>
      <ImgWrapper>
        <MetaMaskSideIcon />
      </ImgWrapper>
      {props.children}
    </B>
  );
};
