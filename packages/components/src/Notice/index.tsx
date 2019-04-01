import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { InfoNotification } from "../icons";

export enum NoticeTypes {
  INFO,
  ERROR,
  ALERT,
  ATTENTION,
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
    border: "rgb(242, 82, 74,1)",
    background: "rgb(242, 82, 74,0.1)",
  },
  [NoticeTypes.ALERT]: {
    border: "rgba(94,94,94,0.12)",
    background: "#FFFDE9",
  },
  [NoticeTypes.ATTENTION]: {
    border: "rgba(255,00,0,1)",
    background: "#FBF9F6",
  },
};

export const NoticeContainer = styled<NoticeContainerProps, "div">("div")`
  display: flex;
  flex-direction: row;
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 20px;
  padding: 30px 0;
  text-align: center;
  border: 1px solid ${props => typeColors[props.type].border};
  border-radius: 4px;
  background-color: ${props => typeColors[props.type].background};
  align-items: center;
  font-weight: 400;
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
  className?: string;
}

export const Notice: React.SFC<NoticeProps> = ({ className, children, type }): JSX.Element => {
  return (
    <NoticeContainer type={type} className={className}>
      <NoticeIconContainer>{type === NoticeTypes.ERROR && <InfoNotification />}</NoticeIconContainer>
      <NoticeMessageContainer>{children}</NoticeMessageContainer>
    </NoticeContainer>
  );
};
