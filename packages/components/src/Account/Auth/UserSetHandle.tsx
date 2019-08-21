import * as React from "react";
import gql from "graphql-tag";
import { Mutation, MutationFn, Query } from "react-apollo";
import { Button, buttonSizes } from "../../Button";
import { TextInput } from "../../input";
import { ConfirmButtonContainer, AuthErrorMessage } from "./AuthStyledComponents";
import { isValidHandle } from "@joincivil/utils";
import { AuthTextEmailNotFoundError, AuthTextEmailExistsError, AuthTextUnknownError } from "./AuthTextComponents";
import { LoadUser } from "../LoadUser";

export interface UserSetHandleMutationVariables {
  Handle: string;
  UserID: string;
}

const setHandleMutation = gql`
  mutation($input: UserChannelSetHandleInput!) {
    userChannelSetHandle(input: $input) {
      id
    }
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
  Handle: string;
  errorMessage: UserSetHandleError;
  hasBlurred: boolean;
}

export class UserSetHandle extends React.Component<UserSetHandleAuthProps, UserSetHandleAuthState> {
  constructor(props: UserSetHandleAuthProps) {
    super(props);
    console.log("constructor 1");
    this.state = {
      Handle: "",
      errorMessage: undefined,
      hasBlurred: false,
    };
  }

  public renderHandleInput(): JSX.Element {
    const { Handle, hasBlurred } = this.state;

    const isValid = !hasBlurred || isValidHandle(Handle);
    console.log("render email input 1");
    return (
      <TextInput
        placeholder="username"
        noLabel
        type="text"
        name="username"
        value={Handle}
        invalidMessage={isValid ? undefined : "Please enter a valid username."}
        invalid={!isValid}
        onChange={(_, value) => this.setState({ Handle: value, hasBlurred: false })}
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
      <LoadUser>
        {({ loading, user }) => {
          if (loading) {
            return <></>;
          }
          console.log("user: ", user);
          return (
            <>
              {this.renderAuthError()}
              {headerComponent}
              <Mutation mutation={setHandleMutation}>
                {setHandle => {
                  return (
                    <form onSubmit={async event => this.handleSubmit(event, setHandle, user.uid)}>
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
        }}
      </LoadUser>
    );
  }

  private async handleSubmit(event: React.FormEvent, mutation: MutationFn, UserID: string): Promise<void> {
    event.preventDefault();

    this.setState({ errorMessage: undefined, hasBlurred: true });

    const { Handle } = this.state;

    if (!isValidHandle(Handle)) {
      return;
    }

    try {
      // const variables: UserSetHandleMutationVariables = { UserID, Handle };

      const res: any = await mutation({
        variables: {
          input: { userID: UserID, handle: Handle },
        },
      });

      console.log("good job. res: ", res);
      return;
    } catch (err) {
      this.setState({ errorMessage: "unknown" });
    }
  }
}
