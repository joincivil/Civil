import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { InfoNotification } from "../icons";

export enum NoticeTypes {
  INFO,
  ERROR,
}

export interface NoticeContainerProps {
  type: NoticeTypes;
}

const typeColors = {
  [NoticeTypes.INFO]: {
    border: "rgb(208,237,237)",
    background: "rgb(208,237,237)",
  },
  [NoticeTypes.ERROR]: {
    border: "#FBF9F6",
    background: "rgb(208,237,237)",
  },
};

export const NoticeContainer = styled<NoticeContainerProps, "div">("div")`
  display: flex;
  flex-direction: row;
  background-position: 10px center;
  background-size: 30px;
  background-repeat: no-repeat;
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  padding: 18px 0;
  text-align: center;
  border: 1px solid ${props => typeColors[props.type].border};
  border-radius: 4px;
  background-color: #fff;
  background-color: ${props => typeColors[props.type].background};
  align-items: center;
`;

export const NoticeIconContainer = styled("div")`
  padding-left: 24px;
  width: 52px;
`;

export const NoticeMessageContainer = styled.div`
  flex-grow: 1;
  margin-right: 80px;
  margin-left: 28px;
`;

export interface NoticeProps {
  type: NoticeTypes;
}

export const Notice: React.SFC<NoticeProps> = ({ children, type }): JSX.Element => {
  return (
    <NoticeContainer type={type}>
      <NoticeIconContainer>{type !== NoticeTypes.INFO && <InfoNotification />}</NoticeIconContainer>
      <NoticeMessageContainer>{children}</NoticeMessageContainer>
    </NoticeContainer>
  );
};
