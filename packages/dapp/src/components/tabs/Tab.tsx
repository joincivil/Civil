import * as React from "react";
import styled from "styled-components";

const StyledLI = styled.li`
  display: inline-block;
  border: 1px solid transparent;
  border-bottom: none;
  bottom: -1px;
  position: relative;
  list-style: none;
  padding: 6px 12px;
  cursor: pointer;
`;

export interface StyledSpanProps {
  active: boolean;
}

const StyledSpan = styled<StyledSpanProps, "span">("span")`
  ${(props: StyledSpanProps): string => (props.active ? "text-decoration: underline" : "")};
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
