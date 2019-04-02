import * as React from "react";

import { OctopusErrorIcon } from "../icons";

import { StyledErrorIconContainer, StyledLargeModalText } from "./styledComponents";

export const ErrorNotFound: React.FunctionComponent = props => {
  const defaultCopy = "This page could not be found";
  return (
    <>
      <StyledErrorIconContainer>
        <OctopusErrorIcon />
      </StyledErrorIconContainer>

      <StyledLargeModalText>
        <b>Oops.</b> {props.children || defaultCopy}
      </StyledLargeModalText>
    </>
  );
};
