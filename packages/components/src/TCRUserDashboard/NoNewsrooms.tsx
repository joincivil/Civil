import * as React from "react";
import { urlConstants as links } from "@joincivil/utils";

import { DashboardNewsroomApplicationIcon } from "../icons";
import { buttonSizes, InvertedButton } from "../Button";

import {
  StyledDashboardNoContent,
  StyledDashboardNoContentHdr,
  StyledDashboardNoContentCopy,
  StyledDashboardNoContentButtonContainer,
} from "./DashboardStyledComponents";

export interface NoNewsroomsProps {
  hasInProgressApplication: boolean;
  applyToRegistryURL: string;
}

export const NoNewsrooms: React.FunctionComponent<NoNewsroomsProps> = props => {
  const { hasInProgressApplication, applyToRegistryURL } = props;

  let hdrText = "You don't have any Newsrooms on the Registry";
  let buttonText = "Apply to the Registry";
  if (hasInProgressApplication) {
    hdrText = "You have an application in progress";
    buttonText = "Continue your application";
  }

  return (
    <StyledDashboardNoContent>
      <DashboardNewsroomApplicationIcon />

      <StyledDashboardNoContentHdr>{hdrText}</StyledDashboardNoContentHdr>
      <StyledDashboardNoContentCopy>
        <a href={links.FAQ_APPLY_TO_REGISTRY_SECTION} target="_blank">
          Learn how to join as a Newsroom
        </a>{" "}
        or apply to our network of community-approved Newsrooms on Civil.
      </StyledDashboardNoContentCopy>
      <StyledDashboardNoContentButtonContainer>
        <InvertedButton to={applyToRegistryURL}>{buttonText}</InvertedButton>
      </StyledDashboardNoContentButtonContainer>
    </StyledDashboardNoContent>
  );
};
