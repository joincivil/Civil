import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

export interface ParagraphProps {
  [key: string]: any;
}

export const P = styled<ParagraphProps, "p">("p")`
  font-family: 'Spectral', serif;
  font-weight: 400;
  font-size: ${(props) => props.blockquote ? "15px" : "21px"};
  line-height: ${(props) => props.blockquote ? "20px" : "34px"};
  margin-top: 0;
  margin-bottom: 13px;
  color: #5a5653;
`;

export const paragraph = (options: any): Plugin => {
  return {
    renderNode(props: any): JSX.Element | void {
      if (props.node.type === "paragraph") {
        const parentType = props.parent.type;
        return <P blockquote={parentType === "blockquote"} {...props}/>;
      }
    },
  };
};
