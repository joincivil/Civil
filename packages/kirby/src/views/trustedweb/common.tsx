import * as React from "react";
import styled from "styled-components";
import { colors, BorderlessButton, CloseXIcon, buttonSizes } from "@joincivil/elements";

export const WindowContainer = styled.div`
  margin: 0 10px 15px 10px;
`;

const WindowHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-align: center;
  > :nth-child(2) {
    flex-grow: 1;
  }
  > button {
    margin: 0;
    margin-left: -10px;
    padding: 0;
  }
`;

export interface WindowHeaderProps {
  title: string;
  onCloseSelected(): void;
}
export const WindowHeader: React.FunctionComponent<WindowHeaderProps> = ({ onCloseSelected, title }) => {
  return (
    <WindowHeaderContainer>
      <BorderlessButton onClick={onCloseSelected} size={buttonSizes.SMALL}>
        <CloseXIcon color={colors.accent.CIVIL_GRAY_2} width={32} height={32} />
      </BorderlessButton>
      <span>{title}</span>
    </WindowHeaderContainer>
  );
};

export const SectionHeading = styled.h3`
  color: ${colors.accent.CIVIL_BLUE};
  font-size: 16px;
  font-weight: bold;
  line-height: 25px;
`;

export const StrongText = styled.strong`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 13px;
  letter-spacing: 0px;
  line-height: 18px;
`;

export const SmallerText = styled.span`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 13px;
  letter-spacing: 0px;
  line-height: 18px;
`;
