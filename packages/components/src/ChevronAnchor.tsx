import * as React from "react";
import styled from "styled-components";
import { Chevron } from "@joincivil/elements";

// @NOTE: See also `DisclosureArrowIcon` - slightly thicker version, we could maybe make an anchor tag helper for that too.

export interface ChevronAnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Defaults to <a> tag. */
  component?: React.ComponentType<any>;
  to?: string;
}

export const ChevronAnchor: React.FunctionComponent<ChevronAnchorProps> = props =>
  React.createElement(
    props.component || "a",
    {
      ...props,
      // passing prop with name `component` breaks some components
      component: undefined,
    },
    <>
      {props.children}
      <Chevron />
    </>,
  );
