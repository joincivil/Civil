import * as React from "react";
import gql from "graphql-tag";
import { AuthApplicationEnum } from "../index";
import { Mutation, MutationFn } from "react-apollo";
import { Link } from "react-router-dom";
import { Checkbox, CheckboxSizes } from "../../input/Checkbox";
import { Button, buttonSizes } from "../../Button";
import { TextInput } from "../../input";
import { CheckboxSection, CheckboxContainer, CheckboxLabel, ConfirmButtonContainer } from "./AuthStyledComponents";

const signupMutation = gql`
  mutation($emailAddress: String!) {
    authSignupEmailSend(emailAddress: $emailAddress)
  }
`;

const loginMutation = gql`
  mutation($emailAddress: String!) {
    authLoginEmailSend(emailAddress: $emailAddress)
  }
`;

export interface AuthSignupEmailSendResult {
  data: {
    authSignupEmailSend: string;
  };
}

export interface AccountEmailAuthProps {
  applicationType: AuthApplicationEnum;
  isNewUser: boolean;
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export interface AccountEmailAuthState {
  emailAddress: string;
  errorMessage: string | null;
  hasAgreedToTOS: boolean;
  hasSelectedToAddToNewsletter: boolean;
}

// TODO(jorgelo): Is there a more official way to do this?

function validateEmail(email: string): boolean {
  return !!email.match(/^\w+@+?\.$/);
}

export class AccountEmailAuth extends React.Component<AccountEmailAuthProps, AccountEmailAuthState> {
  constructor(props: AccountEmailAuthProps) {
    super(props);
    this.state = {
      emailAddress: "",
      errorMessage: null,
      hasAgreedToTOS: false,
      hasSelectedToAddToNewsletter: false,
    };
  }

  public render(): JSX.Element {
    const { isNewUser } = this.props;
    const { errorMessage, hasAgreedToTOS, hasSelectedToAddToNewsletter } = this.state;

    const emailMutation = isNewUser ? signupMutation : loginMutation;

    return (
      <Mutation mutation={emailMutation}>
        {(sendEmail, { loading, error, data }) => {
          return (
            <>
              {errorMessage && <span>Error: {errorMessage}</span>}
              <TextInput
                placeholder="Email address"
                noLabel
                type="text"
                name="email"
                value={this.state.emailAddress}
                onChange={(_, value) => this.setState({ emailAddress: value })}
              />

              <CheckboxContainer>
                <CheckboxSection>
                  <Checkbox size={CheckboxSizes.SMALL} checked={hasAgreedToTOS} onClick={this.toggleHasAgreedToTOS} />
                  <CheckboxLabel>
                    I agree to Civil's {}
                    <Link to="https://civil.co/terms/">Privacy Policy and Terms of Use</Link>
                  </CheckboxLabel>
                </CheckboxSection>

                <CheckboxSection>
                  <Checkbox
                    size={CheckboxSizes.SMALL}
                    checked={hasSelectedToAddToNewsletter}
                    onClick={this.toggleHasSelectedToAddToNewsletter}
                  />
                  <CheckboxLabel>Get notified of news and announcements from Civil.</CheckboxLabel>
                </CheckboxSection>
              </CheckboxContainer>
              <ConfirmButtonContainer>
                <Button
                  size={buttonSizes.SMALL_WIDE}
                  textTransform="none"
                  disabled={!hasAgreedToTOS}
                  onClick={async event => this.handleSubmit(event, sendEmail)}
                >
                  Confirm
                </Button>
              </ConfirmButtonContainer>
              {loading && <span>loading...</span>}
            </>
          );
        }}
      </Mutation>
    );
  }

  public toggleHasAgreedToTOS = (): void => {
    const { hasAgreedToTOS } = this.state;
    this.setState({ hasAgreedToTOS: !hasAgreedToTOS });
  };

  public toggleHasSelectedToAddToNewsletter = (): void => {
    const { hasSelectedToAddToNewsletter } = this.state;
    this.setState({ hasSelectedToAddToNewsletter: !hasSelectedToAddToNewsletter });
  };

  private async handleSubmit(event: Event, mutation: MutationFn): Promise<void> {
    event.preventDefault();

    this.setState({ errorMessage: null });

    const { emailAddress, hasAgreedToTOS, hasSelectedToAddToNewsletter } = this.state;
    const { applicationType, onEmailSend, isNewUser } = this.props;

    if (!validateEmail(emailAddress)) {
      // TODO(jorge): What should the real error message be?
      this.setState({ errorMessage: "Please enter a valid email" });
      return;
    }

    const resultKey = isNewUser ? "authSignupEmailSend" : "authLoginEmailSend";

    const res: any = await mutation({
      variables: { emailAddress, application: applicationType },
    });

    const authResponse: string = res.data[resultKey];

    if (authResponse === "ok") {
      onEmailSend(isNewUser, emailAddress);
      if (hasSelectedToAddToNewsletter) {
        // TODO(jorge): Add to the email newsletter
        console.log(emailAddress + " wants to be on the newsletter");
      }
      return;
    }

    this.setState({ errorMessage: authResponse });

    return;
  }
}
