import * as React from "react";
// @ts-ignore
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import { PullQuote } from "./components/PullQuote";

export const PULL_QUOTE = "pull_quote";

export const pullQuote = (options: any): Plugin => {
  return {
    name: PULL_QUOTE,
    renderMark(props: any): JSX.Element | void {
      if (props.mark.type === PULL_QUOTE) {
        return <PullQuote {...props}/>;
      }
    },
    schema: {
      inlines: {
        [PULL_QUOTE]: {
          data: {
            top: (v: any): boolean => typeof v === "number",
          },
        },
      },
    },
  };
};
