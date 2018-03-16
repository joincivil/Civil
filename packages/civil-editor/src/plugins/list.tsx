import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

export const Ul = styled.ul`
  list-style: square;
  color: #5a5653;
`;

export const Li = styled.li`
  margin: 11px 0;
`;

export const Ol = styled.ol`
  color: #5a5653;
  font-family: 'Spectral', serif;
  font-size: 21px;
`;

export const list = (options: any): Plugin => {
  return {
    renderNode(props: any): JSX.Element | void {
      switch (props.node.type) {
        case "ul_list": return <Ul {...props}/>;
        case "ol_list": return <Ol {...props}/>;
        case "list_item": return <Li {...props}/>;
      }
    },
  };
};
