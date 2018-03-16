import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

export const StrikeThrough = styled.span`
  text-decoration: line-through;
`;

export const strikeThrough = (options: any): Plugin => {
  return {
    renderMark(props: any): JSX.Element | void {
      if (props.mark.type === "strike_through") {
        return <StrikeThrough {...props}/>;
      }
    },
  };
};
