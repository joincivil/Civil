import * as React from "react";

import { OctopusErrorIcon } from "../icons";

import { StyledErrorIconContainer, StyledLargeModalText } from "./styledComponents";

export interface ErrorNotFoundProps {
  className?: string;
}

export const ErrorNotFound: React.FunctionComponent<ErrorNotFoundProps> = props => {
  const defaultCopy = "This page could not be found.";
  return (
    <div className={props.className}>
      <StyledErrorIconContainer>
        <OctopusErrorIcon />
      </StyledErrorIconContainer>

      <StyledLargeModalText>
        <b>Oops.</b> {props.children || defaultCopy}
      </StyledLargeModalText>
    </div>
  );
};
