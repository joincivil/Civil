import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

export const DropCap = styled.span`
  float: left;
  font-size: 250%;
  margin-right: 10px;
  line-height: 100%;
  padding-top: 5px;
  color: #000000;
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
