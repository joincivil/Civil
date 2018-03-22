import * as React from "react";
// @ts-ignore
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import {colorConstants} from "../colorConstants";

export const DropCap = styled.span`
  float: left;
  font-family: "Libre Franklin", sans-serif;
  font-weight: 800;
  font-size: 63px;
  margin-right: 10px;
  line-height: 100%;
  padding-top: 5px;
  color: ${colorConstants.BLACK};
  text-transform: uppercase;
`;

export const DROP_CAP = "drop_cap";

export const dropCap = (options: any): Plugin => {
  return {
    name: DROP_CAP,
    renderMark(props: any): JSX.Element | void {
      if (props.mark.type === DROP_CAP) {
        return <DropCap {...props}/>;
      }
    },
  };
};
