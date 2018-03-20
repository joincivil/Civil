import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

export const StrikeThrough = styled.span`
  text-decoration: line-through;
`;

export const STRIKE_THROUGH = "strike_through";

export const strikeThrough = (options: any): Plugin => {
  return {
    name: STRIKE_THROUGH,
    renderMark(props: any): JSX.Element | void {
      if (props.mark.type === STRIKE_THROUGH) {
        return <StrikeThrough {...props}/>;
      }
    },
  };
};
