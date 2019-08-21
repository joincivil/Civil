import * as React from "react";
import gql from "graphql-tag";
import { AuthApplicationEnum } from "../index";
import { Mutation, MutationFn } from "react-apollo";
import { Checkbox, CheckboxSizes } from "../../input/Checkbox";
import { Button, buttonSizes } from "../../Button";
import { TextInput } from "../../input";
import {
  CheckboxSection,
  CheckboxContainer,
  CheckboxLabel,
  ConfirmButtonContainer,
  AuthErrorMessage,
} from "./AuthStyledComponents";
import { isValidEmail, getCurrentUserQuery } from "@joincivil/utils";
import { AuthTextEmailNotFoundError, AuthTextEmailExistsError, AuthTextUnknownError } from "./AuthTextComponents";

export interface SetEmailMutationVariables {
  emailAddress: string;
  channelID: string;
  // addToMailing: boolean;
}

export interface AuthSignupEmailSendResult {
  data: {
    authSignupEmailSend: string;
  };
}

const setEmailMutation = gql`
  mutation($input: UserChannelSetHandleInput!) {
    channelSetEmail(input: $input) {
      id
    }
  }
`;

export interface AccountEmailAuthProps {
  applicationType: AuthApplicationEnum;
  isNewUser: boolean;
  headerComponent?: JSX.Element;
  channelID: string;
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export type AuthEmailError = "unknown" | "emailexists" | "emailnotfound" | undefined;

export interface AccountEmailAuthState {
  emailAddress: string;
  errorMessage: AuthEmailError;
  hasAgreedToTOS: boolean;
  hasSelectedToAddToNewsletter: boolean;
  hasBlurred: boolean;
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
        type="email"
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
          <label>
            <Checkbox size={CheckboxSizes.SMALL} checked={hasAgreedToTOS} onClick={this.toggleHasAgreedToTOS} />
            <CheckboxLabel>
              I agree to Civil's {}
              <a href="https://civil.co/terms/" target="_blank">
                Privacy Policy and Terms of Use
              </a>
            </CheckboxLabel>
          </label>
        </CheckboxSection>

        <CheckboxSection>
          <label>
            <Checkbox
              size={CheckboxSizes.SMALL}
              checked={hasSelectedToAddToNewsletter}
              onClick={this.toggleHasSelectedToAddToNewsletter}
            />
            <CheckboxLabel>Get notified of news and announcements from Civil.</CheckboxLabel>
          </label>
        </CheckboxSection>
      </CheckboxContainer>
    );
  }

  public renderAuthError(): JSX.Element {
    const { errorMessage } = this.state;

    if (!errorMessage) {
      return <></>;
    }

    return (
      <AuthErrorMessage>
        <AuthTextUnknownError />
      </AuthErrorMessage>
    );
  }

  public render(): JSX.Element {
    const { isNewUser, headerComponent } = this.props;
    const { hasAgreedToTOS } = this.state;

    const isButtonDisabled = isNewUser && !hasAgreedToTOS;

    return (
      <>
        {this.renderAuthError()}
        {headerComponent}
        <Mutation mutation={setEmailMutation}>
          {sendEmail => {
            return (
              <form onSubmit={async event => this.handleSubmit(event, sendEmail)}>
                {this.renderEmailInput()}
                {isNewUser && this.renderCheckboxes()}
                <ConfirmButtonContainer>
                  <Button
                    size={buttonSizes.SMALL_WIDE}
                    textTransform={"none"}
                    disabled={isButtonDisabled}
                    type={"submit"}
                  >
                    Confirm
                  </Button>
                </ConfirmButtonContainer>
              </form>
            );
          }}
        </Mutation>
      </>
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

  private async handleSubmit(event: React.FormEvent, mutation: MutationFn): Promise<void> {
    event.preventDefault();

    this.setState({ errorMessage: undefined, hasBlurred: true });

    const { emailAddress, hasSelectedToAddToNewsletter } = this.state;
    const { onEmailSend, isNewUser, channelID } = this.props;

    if (!isValidEmail(emailAddress)) {
      return;
    }

    const resultKey = isNewUser ? "authSignupEmailSendForApplication" : "authLoginEmailSendForApplication";

    try {
      const variables: SetEmailMutationVariables = { emailAddress, channelID };

      // if (isNewUser) {
      //   variables.addToMailing = hasSelectedToAddToNewsletter;
      // }
      const res: any = await mutation({
        variables,
        refetchQueries: [
          {
            query: getCurrentUserQuery,
          },
        ],
      });

      const authResponse: string = res.data[resultKey];

      if (authResponse === "ok") {
        onEmailSend(isNewUser, emailAddress);
      }

      this.setState({ errorMessage: authResponse as AuthEmailError });

      return;
    } catch (err) {
      this.setState({ errorMessage: "unknown" });
    }
  }
}
