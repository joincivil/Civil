import * as React from "react";

import { BellIcon } from "../icons";
import { Button, buttonSizes } from "../Button";
import { InputGroup } from "../input";

import { StyledEmailSignupContainer, StyledEmailSignupTitle, StyledEmailSignupCopy } from "./EmailStyledComponents";

export interface EmailSignupProps {
  email?: string;
  errorMessage?: string;
  isRequestPending?: boolean;
  onChange(key: string, value: string): void;
  onSubmit(): void;
}

export const EmailSignup: React.FunctionComponent<EmailSignupProps> = props => {
  const SignUpButton = (
    <Button size={buttonSizes.SMALL} onClick={props.onSubmit}>
      {!!props.isRequestPending ? "Saving" : "Sign Up"}
    </Button>
  );

  const { email, errorMessage } = props;

  return (
    <StyledEmailSignupContainer>
      <StyledEmailSignupTitle>
        <BellIcon /> Get the Civil Registry Alerts
      </StyledEmailSignupTitle>

      <StyledEmailSignupCopy>
        Receive real-time email alerts when a new event occurs on the Civil Registry. These events include new
        applications, challenges, when voting begins / ends and more. By subscribing, you'll ensure you have maximum
        time to make decisions about how you will participate in Civil's governance.
      </StyledEmailSignupCopy>

      <InputGroup
        append={SignUpButton}
        noAppendPadding={true}
        noLabel={true}
        placeholder="Email address"
        onChange={props.onChange}
        name="EmailSignupTextInput"
        type="text"
        value={email}
        invalid={!!errorMessage}
        invalidMessage={errorMessage}
      />

      <StyledEmailSignupCopy>
        <b>
          Follow us on twitter for alerts{" "}
          <a href="https://twitter.com/civil_alerts" target="_blank">
            @Civil_Alerts
          </a>
        </b>
      </StyledEmailSignupCopy>
    </StyledEmailSignupContainer>
  );
};
