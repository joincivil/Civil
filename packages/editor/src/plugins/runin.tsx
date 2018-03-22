import * as React from "react";
// @ts-ignore
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import {colorConstants} from "../colorConstants";

export const RunIn = styled.span`
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 700;
  font-size: 19px;
  color: ${colorConstants.BLACK};
`;

export const RUN_IN = "run_in";

export const runIn = (options: any): Plugin => {
  return {
    name: RUN_IN,
    renderMark(props: any): JSX.Element | void {
      if (props.mark.type === RUN_IN) {
        return <RunIn {...props}/>;
      }
    },
  };
};
