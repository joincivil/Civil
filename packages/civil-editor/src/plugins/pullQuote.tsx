import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import { PullQuote } from "./components/PullQuote";

export const pullQuote = (options: any): Plugin => {
  return {
    renderMark(props: any): JSX.Element | void {
      if (props.mark.type === "pull_quote") {
        return <PullQuote {...props}/>;
      }
    },
  };
};
