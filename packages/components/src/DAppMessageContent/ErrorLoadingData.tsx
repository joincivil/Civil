import * as React from "react";

import { OctopusErrorIcon } from "../icons";
import { Button, buttonSizes } from "../Button";

import { StyledErrorIconContainer, StyledLargeModalText, StyledSmallModalText } from "./styledComponents";

export interface ErrorLoadingDataProps {
  useGraphQL: boolean;
  toggleGraphQL?(): void | Promise<any>;
}

export const ErrorLoadingData: React.SFC<ErrorLoadingDataProps> = props => {
  return (
    <>
      <StyledErrorIconContainer>
        <OctopusErrorIcon />
      </StyledErrorIconContainer>

      <StyledLargeModalText>
        <b>Oops.</b> Looks like we're having trouble loading what you're looking for
      </StyledLargeModalText>

      <SuggestedAction {...props} />
    </>
  );
};

const SuggestedAction: React.SFC<ErrorLoadingDataProps> = props => {
  if (props.useGraphQL) {
    return (
      <>
        <StyledSmallModalText>
          The Civil Registry uses a tool called GraphQL as a caching layer that can improve load times, but can
          sometimes cause loading errors like this. Turning off GraphQL can sometimes solve loading errors
        </StyledSmallModalText>
        <Button size={buttonSizes.SMALL} onClick={props.toggleGraphQL}>
          Turn off GraphQL
        </Button>
      </>
    );
  }

  return <></>;
};
