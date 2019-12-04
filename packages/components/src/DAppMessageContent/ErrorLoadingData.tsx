import * as React from "react";

import { OctopusErrorIcon } from "../icons";

import { StyledErrorIconContainer, StyledLargeModalText } from "./styledComponents";

export interface ErrorLoadingDataProps {
  toggleGraphQL?(): void | Promise<any>;
}

export const ErrorLoadingData: React.FunctionComponent<ErrorLoadingDataProps> = props => {
  return (
    <>
      <StyledErrorIconContainer>
        <OctopusErrorIcon />
      </StyledErrorIconContainer>

      <StyledLargeModalText>
        <b>Oops.</b> Looks like we're having trouble loading what you're looking for.
      </StyledLargeModalText>

      <SuggestedAction {...props} />
    </>
  );
};

const SuggestedAction: React.FunctionComponent<ErrorLoadingDataProps> = () => {
  return <></>;
};
