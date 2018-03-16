import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

export const Header = styled.h1`
  font-family: 'Spectral', serif;
  font-weight: 800;
  font-size: 27px;
  line-height: 51px;
  margin-top: 25px;
  margin-bottom: 5px;
  color: #000000;
`;

export const header = (options: any): Plugin => {
  return {
    renderNode(props: any): JSX.Element | void {
      if (props.node.type === "header") {
        return <Header {...props}/>;
      }
    },
  };
};
