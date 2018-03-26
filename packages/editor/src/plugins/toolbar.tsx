import * as React from "react";
import { Plugin } from "../plugins";
import { ToolBar } from "./components/ToolBar";

export const TOOL_BAR = "tool_bar";

export const toolbar = (options: any): Plugin => {
  return {
    name: TOOL_BAR,
    renderEditor(props: any): JSX.Element | void {
      return <ToolBar {...props} />;
    },
  };
};
