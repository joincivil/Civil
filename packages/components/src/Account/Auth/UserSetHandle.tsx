import * as React from "react";
import gql from "graphql-tag";
import { Mutation, MutationFn } from "react-apollo";
import { Button, buttonSizes } from "../../Button";
import { TextInput } from "../../input";
import { ConfirmButtonContainer, AuthErrorMessage } from "./AuthStyledComponents";
import { isValidEmail } from "@joincivil/utils";
import { AuthTextEmailNotFoundError, AuthTextEmailExistsError, AuthTextUnknownError } from "./AuthTextComponents";

export interface UserSetHandleMutationVariables {
  handle: string;
  userID: string;
}

const setHandleMutation = gql`
  mutation($setHandleInput: UserChannelSetHandleInput!) {
    userChannelSetHandle(userID: $userID, handle: $handle)
  }
`;

export interface UserSetHandleSendResult {
  data: {
    id: string;
    handle: string;
  };
}

export interface UserSetHandleAuthProps {
  headerComponent?: JSX.Element;
  userID: string;
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export type UserSetHandleError = "unknown" | "emailexists" | "emailnotfound" | undefined;

export interface UserSetHandleAuthState {
  handle: string;
  errorMessage: UserSetHandleError;
  hasBlurred: boolean;
}

export class UserSetHandle extends React.Component<UserSetHandleAuthProps, UserSetHandleAuthState> {
  constructor(props: UserSetHandleAuthProps) {
    super(props);
    console.log("constructor 1");
    this.state = {
      handle: "",
      errorMessage: undefined,
      hasBlurred: false,
    };
  }

  public renderHandleInput(): JSX.Element {
    const { handle, hasBlurred } = this.state;

    const isValid = !hasBlurred || isValidEmail(handle);
    console.log("render email input 1");
    return (
      <TextInput
        placeholder="username"
        noLabel
        type="text"
        name="username"
        value={handle}
        invalidMessage={isValid ? undefined : "Please enter a valid username."}
        invalid={!isValid}
        onChange={(_, value) => this.setState({ handle: value, hasBlurred: false })}
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
        <>errorMessage</>
      </AuthErrorMessage>
    );
  }

  public render(): JSX.Element {
    console.log("RENDER 1");
    const { headerComponent } = this.props;

    const isButtonDisabled = false; // TODO (validate)

    return (
      <>
        {this.renderAuthError()}
        {headerComponent}
        <Mutation mutation={setHandleMutation}>
          {sendEmail => {
            return (
              <form onSubmit={async event => this.handleSubmit(event, sendEmail)}>
                {this.renderHandleInput()}
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

  private async handleSubmit(event: React.FormEvent, mutation: MutationFn): Promise<void> {
    event.preventDefault();

    this.setState({ errorMessage: undefined, hasBlurred: true });

    const { handle } = this.state;

    if (!isValidEmail(handle)) {
      return;
    }

    try {
      const variables: UserSetHandleMutationVariables = { userID: this.props.userID, handle };

      const res: any = await mutation({
        variables,
      });

      console.log("good job. res: ", res);
      return;
    } catch (err) {
      this.setState({ errorMessage: "unknown" });
    }
  }
}
