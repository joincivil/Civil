import * as React from "react";
// @ts-ignore
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import { CHILD_TYPE_INVALID } from "slate-schema-violations";
import { colorConstants } from "../colorConstants";

export const Blockquote = styled.blockquote`
  max-width: 450px;
  border-left: 2px solid ${colorConstants.ACCENT_GREEN};
  padding-left: 20px;
`;

export const BLOCKQUOTE = "blockquote";

export const blockquote = (options: any): Plugin => {
  return {
    name: BLOCKQUOTE,
    renderNode(props: any): JSX.Element | void {
      if (props.node.type === "blockquote") {
        return <Blockquote cite={props.node.data.get("cite")} {...props}/>;
      }
    },
    schema: {
      blocks: {
        [BLOCKQUOTE]: {
          nodes: [{types: ["paragraph"]}],
          normalize: (change: any, violation: string, context: any): void => {
            if (violation === CHILD_TYPE_INVALID) {
              change.unwrapBlockByKey(context.child.key, "blockquote");
            }
          },
        },
      },
    },
  };
};
