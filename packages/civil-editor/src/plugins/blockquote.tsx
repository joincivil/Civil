import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

export const Blockquote = styled.blockquote`
  max-width: 450px;
  border-left: 1px solid #30E8BD;
  padding-left: 20px;
`;

export const blockquote = (options: any): Plugin => {
  return {
    renderNode(props: any): JSX.Element | void {
      if (props.node.type === "blockquote") {
        return <Blockquote cite={props.node.data.get("cite")} {...props}/>;
      }
    },
  };
};
