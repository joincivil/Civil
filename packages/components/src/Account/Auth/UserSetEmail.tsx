import * as React from "react";
import gql from "graphql-tag";
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
  SkipForNowButtonContainer,
} from "./AuthStyledComponents";
import { isValidEmail, getCurrentUserQuery } from "@joincivil/utils";
import { AuthTextUnknownError } from "./AuthTextComponents";
import styled from "styled-components";
import { fonts } from "../../styleConstants";

const HeaderDiv = styled.div`
  color: #000000;
  font-family: ${fonts.SANS_SERIF};
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  width: 298px;
  text-align: left;
`;

const SubHeaderDiv = styled.div`
  color: #3f3c39;
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  width: 298px;
  text-align: left;
`;

const SkipButton = styled.button`
  color: #2b56ff;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: 400;
  line-height: 26px;
  width: 82px;
  text-align: left;
  background-color: #ffffff;
`;

export interface SetEmailMutationVariables {
  emailAddress: string;
  channelID: string;
  addToMailing: boolean;
}

export interface UserSetEmailSendResult {
  data: {
    authSignupEmailSend: string;
  };
}

const setEmailMutation = gql`
  mutation($input: ChannelsSetEmailInput!) {
    userChannelSetEmail(input: $input) {
      id
    }
  }
`;

const skipSetEmailMutation = gql`
  mutation {
    skipUserChannelEmailPrompt {
      uid
    }
  }
`;

export interface UserSetEmailProps {
  channelID: string;
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export type UserSetEmailError = "unknown" | "emailexists" | "emailnotfound" | undefined;

export interface UserSetEmailState {
  emailAddress: string;
  errorMessage: UserSetEmailError;
  hasSelectedToAddToNewsletter: boolean;
  hasBlurred: boolean;
}

export class UserSetEmail extends React.Component<UserSetEmailProps, UserSetEmailState> {
  constructor(props: UserSetEmailProps) {
    super(props);
    this.state = {
      emailAddress: "",
      errorMessage: undefined,
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
    return (
      <>
        {this.renderAuthError()}
        <HeaderDiv>Get email notifications from Civil</HeaderDiv>
        <SubHeaderDiv>
          Get notified when a Newsroom has joined the Registry, or when a challenge requires your vote, and more.
        </SubHeaderDiv>
        <Mutation mutation={setEmailMutation}>
          {sendEmail => {
            return (
              <form onSubmit={async event => this.handleSubmit(event, sendEmail)}>
                {this.renderEmailInput()}
                {this.renderCheckboxes()}
                <ConfirmButtonContainer>
                  <Button size={buttonSizes.SMALL_WIDE} textTransform={"none"} type={"submit"}>
                    Sign up
                  </Button>
                </ConfirmButtonContainer>
              </form>
            );
          }}
        </Mutation>
        <Mutation mutation={skipSetEmailMutation}>
          {skipEmail => {
            return (
              <form onSubmit={async event => this.onSkipForNowClicked(event, skipEmail)}>
                <SkipForNowButtonContainer>
                  <SkipButton type={"submit"}>Skip for now</SkipButton>
                </SkipForNowButtonContainer>
              </form>
            );
          }}
        </Mutation>
      </>
    );
  }

  public renderCheckboxes(): JSX.Element {
    const { hasSelectedToAddToNewsletter } = this.state;

    return (
      <CheckboxContainer>
        <CheckboxSection>
          <label>
            <Checkbox
              size={CheckboxSizes.SMALL}
              checked={hasSelectedToAddToNewsletter}
              onClick={this.toggleHasSelectedToAddToNewsletter}
            />
            <CheckboxLabel>Yes, I'd like to receive notifications.</CheckboxLabel>
          </label>
        </CheckboxSection>
      </CheckboxContainer>
    );
  }

  public toggleHasSelectedToAddToNewsletter = (): void => {
    const { hasSelectedToAddToNewsletter } = this.state;
    this.setState({ hasSelectedToAddToNewsletter: !hasSelectedToAddToNewsletter });
  };

  private async onSkipForNowClicked(event: React.FormEvent, mutation: MutationFn): Promise<void> {
    // const res: await mutation
    console.log("onSkipForNow.");
    console.log("onSkipForNow. mutation: ", mutation);
    event.preventDefault();

    try {
      const variables = {};
      const res: any = await mutation({
        variables,
        refetchQueries: [
          {
            query: getCurrentUserQuery,
          },
        ],
      });
      console.log("res: ", res);
    } catch (err) {
      this.setState({ errorMessage: "unknown" });
    }
  }

  private async handleSubmit(event: React.FormEvent, mutation: MutationFn): Promise<void> {
    event.preventDefault();

    this.setState({ errorMessage: undefined, hasBlurred: true });

    const { emailAddress, hasSelectedToAddToNewsletter } = this.state;
    const { /*onEmailSend,*/ channelID } = this.props;

    if (!isValidEmail(emailAddress)) {
      return;
    }

    // const resultKey = isNewUser ? "authSignupEmailSendForApplication" : "authLoginEmailSendForApplication";

    try {
      const variables = {
        input: {
          emailAddress,
          channelID,
          addToMailing: hasSelectedToAddToNewsletter,
        },
      };

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

      console.log("111 res: ", res);
      // const authResponse: string = res.data[resultKey];

      // if (authResponse === "ok") {
      //   onEmailSend(isNewUser, emailAddress);
      // }

      // this.setState({ errorMessage: authResponse as UserSetEmailError });

      return;
    } catch (err) {
      this.setState({ errorMessage: "unknown" });
    }
  }
}
