import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

export const Italic = styled.span`
  font-style: italic;
`;

export const italic = (options: any): Plugin => {
  return {
    renderMark(props: any): JSX.Element | void {
      if (props.mark.type === "italic") {
        return <Italic {...props}/>;
      }
    },
  };
};
