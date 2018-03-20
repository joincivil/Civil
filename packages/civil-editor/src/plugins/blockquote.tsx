import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import { CHILD_TYPE_INVALID } from "slate-schema-violations";

export const Blockquote = styled.blockquote`
  max-width: 450px;
  border-left: 1px solid #30E8BD;
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
    }
  };
};
