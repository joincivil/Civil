import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts } from "./styleConstants";

export interface MessageProps {
  className?: string;
  text?: string;
  children?: any;
}

const MessageBase = (props: MessageProps) => {
  return <div className={props.className}>{props.children}</div>;
};

export const Message = styled(MessageBase)`
  margin: 10px 0;
  padding: 15px;
  font-size: 15px;
  font-family: ${fonts.SERIF};
  color: black;
`;

export const InfoMessage = styled(Message)`
  background-color: ${colors.accent.CIVIL_BLUE_VERY_FADED};
  color: black;
`;
