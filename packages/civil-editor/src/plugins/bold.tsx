import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

export const Bold = styled.span`
  font-weight: 800;
`;

export const BOLD = "bold";

export const bold = (options: any): Plugin => {
  return {
    name: BOLD,
    renderMark(props: any): JSX.Element | void {
      if (props.mark.type === BOLD) {
        return <Bold {...props}/>;
      }
    },
  };
};
