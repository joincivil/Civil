import * as React from "react";
import styled from "styled-components";
import { Chevron } from "@joincivil/elements";

const ChevronLeft = styled(Chevron)`
  transform: scaleX(-1);
`;

export interface ChevronAnchorLeftProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Defaults to <a> tag. */
  component?: React.ComponentType<any>;
  to?: string;
}

export const ChevronAnchorLeft: React.FunctionComponent<ChevronAnchorLeftProps> = props =>
  React.createElement(
    props.component || "a",
    props,
    <>
      <ChevronLeft />
      {props.children}
    </>,
  );
