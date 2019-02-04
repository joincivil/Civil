import * as React from "react";

import { GreenCheckMark } from "../icons";

import {
  StyledEmailSignupSuccessContainer,
  StyledEmailSignupTitle,
  StyledEmailSignupCopy,
} from "./EmailStyledComponents";

export const EmailSignupSuccess: React.SFC = props => {
  return (
    <StyledEmailSignupSuccessContainer>
      <GreenCheckMark width={36} height={36} />
      <StyledEmailSignupTitle>Thanks for signing up!</StyledEmailSignupTitle>

      <StyledEmailSignupCopy>Please check your email to confirm your subscription.</StyledEmailSignupCopy>

      <StyledEmailSignupCopy>
        <b>
          Follow us on twitter for alerts{" "}
          <a href="https://twitter.com/CivilTCRalerts" target="_blank">
            @CivilTCRalerts
          </a>
        </b>
      </StyledEmailSignupCopy>
    </StyledEmailSignupSuccessContainer>
  );
};
