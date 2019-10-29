import * as React from "react";
import styled from "styled-components";
import { colors } from "../colors/index";
import { ShareIcon } from "../icons/index";

export interface ShareBtnStyleProps {
  textBottom?: boolean;
}

export const ShareBtnStyled = styled.button`
  align-items: center;
  background-color: ${colors.basic.WHITE};
  border: none;
  color: ${colors.accent.CIVIL_GRAY_2};
  cursor: pointer;
  display: flex;
  flex-direction: ${(props: ShareBtnStyleProps) => (props.textBottom ? "column" : "row")};
  font-size: 12px;
  justify-content: center;
  line-height: 1;
  outline: none;
  padding: 0;
  transition: color 0.2s ease;

  svg {
    margin: ${(props: ShareBtnStyleProps) => (props.textBottom ? "0" : "0 2px 0 0")};

    path {
      fill: ${colors.accent.CIVIL_GRAY_0};
      transition: fill 0.2s ease;
    }
  }

  &:hover {
    color: ${colors.accent.CIVIL_BLUE};

    svg path {
      fill: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

export interface ShareButtonProps {
  textBottom?: boolean;
  onClick(ev: any): void;
}

export const ShareButton: React.FunctionComponent<ShareButtonProps> = props => {
  return (
    <ShareBtnStyled onClick={props.onClick} textBottom={props.textBottom}>
      <ShareIcon />
      Share
    </ShareBtnStyled>
  );
};
