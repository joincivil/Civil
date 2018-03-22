import * as React from "react";
// @ts-ignore
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import {colorConstants} from "../colorConstants";

export const Header = styled.h2`
  font-family: 'Spectral', serif;
  font-weight: 800;
  font-size: 27px;
  line-height: 51px;
  margin-top: 25px;
  margin-bottom: 5px;
  color: ${colorConstants.BLACK};
`;

export const PlaceholderHeader = styled.span`
  color: #E9E9EA;
`;

export const HEADER = "header";

export const header = (options: any): Plugin => {
  return {
    name: HEADER,
    renderNode(props: any): JSX.Element | void {
      if (props.node.type === HEADER) {
        return <Header {...props}/>;
      }
    },
  };
};
