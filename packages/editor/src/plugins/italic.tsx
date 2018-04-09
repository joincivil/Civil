import * as React from "react";
// tslint:disable-next-line
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

export const Italic = styled.span`
  font-style: italic;
`;

export const ITALIC = "italic";

export const italic = (options: any): Plugin => {
  return {
    name: ITALIC,
    renderMark(props: any): JSX.Element | void {
      if (props.mark.type === ITALIC) {
        return <Italic {...props} />;
      }
    },
  };
};
