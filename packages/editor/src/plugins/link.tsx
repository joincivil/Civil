import * as React from "react";
// @ts-ignore
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import { Link } from "./components/Link";

export const LINK = "link";

export const link = (options: any): Plugin => {
  return {
    name: LINK,
    renderMark(props: any): JSX.Element | void {
      if (props.mark.type === LINK) {
        return <Link {...props}/>;
      }
    },
  };
};
