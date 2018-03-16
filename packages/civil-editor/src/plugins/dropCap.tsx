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
`;

export const dropCap = (options: any): Plugin => {
  return {
    renderMark(props: any): JSX.Element | void {
      if (props.mark.type === "drop_cap") {
        return <DropCap {...props}/>;
      }
    },
  };
};
