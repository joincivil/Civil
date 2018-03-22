import * as React from "react";
// @ts-ignore
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import { LAST_CHILD_TYPE_INVALID } from "slate-schema-violations";
import { Block } from "slate";
import { colorConstants } from "../colorConstants";

export interface ParagraphProps {
  [key: string]: any;
}

export const P = styled<ParagraphProps, "p">("p")`
  font-family: 'Spectral', serif;
  font-weight: 400;
  font-size: ${(props) => props.blockquote ? "16px" : "21px"};
  line-height: ${(props) => props.blockquote ? "20px" : "33px"};
  margin-top: 0;
  margin-bottom: 13px;
  font-variant-numeric: oldstyle-nums;
  font-feature-settings: onum;
  color: ${colorConstants.PRIMARY_DARK_GREY};
`;

export const PARAGRAPH = "paragraph";

export const paragraph = (options: any): Plugin => {
  return {
    name: PARAGRAPH,
    renderNode(props: any): JSX.Element | void {
      if (props.node.type === PARAGRAPH) {
        const parentType = props.parent.type;
        return <P blockquote={parentType === "blockquote"} {...props}/>;
      }
    },
    schema: {
      document: {
        last: { types: [PARAGRAPH] },
        normalize: (change: any, reason: string, { node, child }: { node: any, child: any}): void => {
          switch (reason) {
            case LAST_CHILD_TYPE_INVALID: {
              const p = Block.create(PARAGRAPH);
              return change.insertNodeByKey(node.key, node.nodes.size, p);
            }
          }
        },
      },
    },
  };
};
