import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

export const Header = styled.h2`
  font-family: 'Spectral', serif;
  font-weight: 800;
  font-size: 27px;
  line-height: 51px;
  margin-top: 25px;
  margin-bottom: 5px;
  color: #000000;
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
