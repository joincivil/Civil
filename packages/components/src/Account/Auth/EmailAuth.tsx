import * as React from "react";
import gql from "graphql-tag";
import { AuthApplicationEnum } from "../index";
import { Mutation, MutationFn } from "react-apollo";
import { Link } from "react-router-dom";
import { Checkbox, CheckboxSizes } from "../../input/Checkbox";
import { Button, buttonSizes } from "../../Button";
import { TextInput } from "../../input";
import { CheckboxSection, CheckboxContainer, CheckboxLabel, ConfirmButtonContainer } from "./AuthStyledComponents";

// TODO(jorgelo): Change these to use authLoginEmailSendForApplication and authSignupEmailSendForApplication

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
  errorMessage: string | undefined;
  hasAgreedToTOS: boolean;
  hasSelectedToAddToNewsletter: boolean;
  hasBlurred: boolean;
}

// TODO(jorgelo): Is there a more official way to do this?

function isValidEmail(email: string): boolean {
  const emailRegex = /[^@]+@[^\.]+\..+/;
  return emailRegex.test(email);
}

export class AccountEmailAuth extends React.Component<AccountEmailAuthProps, AccountEmailAuthState> {
  constructor(props: AccountEmailAuthProps) {
    super(props);
    this.state = {
      emailAddress: "",
      errorMessage: undefined,
      hasAgreedToTOS: false,
      hasSelectedToAddToNewsletter: false,
      hasBlurred: false,
    };
  }

  public renderEmailInput(): JSX.Element {
    const { emailAddress, hasBlurred } = this.state;

    const isValid = !hasBlurred || isValidEmail(emailAddress);

    return (
      <TextInput
        placeholder="Email address"
        noLabel
        type="text"
        name="email"
        value={emailAddress}
        invalidMessage={isValid ? undefined : "Please enter a valid email."}
        invalid={!isValid}
        onChange={(_, value) => this.setState({ emailAddress: value, hasBlurred: false })}
        onBlur={() => this.setState({ hasBlurred: true })}
      />
    );
  }

  public renderCheckboxes(): JSX.Element {
    const { hasAgreedToTOS, hasSelectedToAddToNewsletter } = this.state;

    return (
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
    );
  }
  public render(): JSX.Element {
    const { isNewUser } = this.props;
    const { hasAgreedToTOS } = this.state;

    const emailMutation = isNewUser ? signupMutation : loginMutation;
    const isButtonDisabled = isNewUser && !hasAgreedToTOS;

    return (
      <Mutation mutation={emailMutation}>
        {sendEmail => {
          return (
            <>
              {this.renderEmailInput()}
              {isNewUser && this.renderCheckboxes()}
              <ConfirmButtonContainer>
                <Button
                  size={buttonSizes.SMALL_WIDE}
                  textTransform="none"
                  disabled={isButtonDisabled}
                  onClick={async event => this.handleSubmit(event, sendEmail)}
                >
                  Confirm
                </Button>
              </ConfirmButtonContainer>
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

    this.setState({ errorMessage: undefined, hasBlurred: true });

    const { emailAddress, hasSelectedToAddToNewsletter } = this.state;
    const { applicationType, onEmailSend, isNewUser } = this.props;

    if (!isValidEmail(emailAddress)) {
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
