import * as React from "react";
import styled from "styled-components";
import { colors } from "@joincivil/components";

const StyledLI = styled.li`
  display: inline-block;
  border: 1px solid transparent;
  border-bottom: none;
  bottom: -6px;
  position: relative;
  list-style: none;
  padding: 6px 12px;
  cursor: pointer;
`;

export interface StyledSpanProps {
  active: boolean;
}

const StyledSpan = styled<StyledSpanProps, "span">("span")`
  display: inline-block;
  border-bottom: 2px solid;
  border-bottom-color: ${(props: StyledSpanProps): string => (props.active ? colors.accent.CIVIL_BLUE : "transparent")}
  color: ${(props: StyledSpanProps): string => (props.active ? colors.primary.BLACK : colors.primary.CIVIL_GRAY_2)}
  font-size: 18px;
  line-height: 21px;
  padding: 11px 0;
  margin-right: 32px;
`;

export interface TabProps {
  tabIndex?: number;
  isActive?: boolean;
  tabText: string;
  onClick?(index: number): () => any;
}

export const Tab = (props: TabProps) => {
  return (
    <StyledLI
      onClick={(event: any) => {
        event.preventDefault();
        props.onClick!(props.tabIndex!);
      }}
    >
      <StyledSpan active={props.isActive ? true : false}>{props.tabText}</StyledSpan>
    </StyledLI>
  );
};
