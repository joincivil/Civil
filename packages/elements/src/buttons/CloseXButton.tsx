import * as React from "react";
import styled from "styled-components";
import { colors } from "../colors/index";
import { CloseXIcon } from "../icons/index";

export const CloseXBtnStyled = styled.button`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 50%;
  padding: 0;
  height: 32px;
  width: 32px;

  svg path {
    transition: fill 0.2s ease;
  }

  &:hover {
    svg path {
      fill: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

export interface CloseXButtonProps {
  onClick(ev: any): void;
}

export const CloseXButton: React.FunctionComponent<CloseXButtonProps> = props => {
  return (
    <CloseXBtnStyled onClick={props.onClick}>
      <CloseXIcon color={colors.accent.CIVIL_GRAY_2} width={32} height={32} />
    </CloseXBtnStyled>
  );
};
