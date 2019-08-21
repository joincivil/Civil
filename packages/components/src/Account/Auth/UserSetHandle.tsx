import * as React from "react";
import gql from "graphql-tag";
import { Mutation, MutationFn, Query } from "react-apollo";
import { Button, buttonSizes } from "../../Button";
import { TextInput } from "../../input";
import { ConfirmButtonContainer, AuthErrorMessage } from "./AuthStyledComponents";
import { isValidHandle, getCurrentUserQuery } from "@joincivil/utils";
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
}

export type UserSetHandleError = "unknown" | "emailexists" | "emailnotfound" | undefined;

export interface UserSetHandleAuthState {
  handle: string;
  errorMessage: UserSetHandleError;
  hasBlurred: boolean;
  isValid: boolean;
}

export class UserSetHandle extends React.Component<UserSetHandleAuthProps, UserSetHandleAuthState> {
  constructor(props: UserSetHandleAuthProps) {
    super(props);
    this.state = {
      handle: "",
      errorMessage: undefined,
      hasBlurred: false,
      isValid: false,
    };
  }

  public renderHandleInput(): JSX.Element {
    const { Handle } = this.state;

    const isValid = isValidHandle(Handle);
    return (
      <TextInput
        placeholder="username"
        noLabel
        type="text"
        name="username"
        value={Handle}
        invalidMessage={isValid ? undefined : "Please enter a valid username."}
        invalid={!isValid}
        onChange={(_, value) => this.setState({ handle: value, hasBlurred: false, isValid })}
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
        <>{errorMessage}</>
      </AuthErrorMessage>
    );
  }

  public render(): JSX.Element {
    const { headerComponent } = this.props;

    const isButtonDisabled = !this.state.isValid; // TODO (validate)

    return (
      <LoadUser>
        {({ loading, user }) => {
          if (loading) {
            return <></>;
          }
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

  private async handleSubmit(event: React.FormEvent, mutation: MutationFn, userID: string): Promise<void> {
    event.preventDefault();

    this.setState({ errorMessage: undefined, hasBlurred: true });

    const { handle } = this.state;

    if (!isValidHandle(handle)) {
      return;
    }

    try {
      // const variables: UserSetHandleMutationVariables = { UserID, Handle };

      const res: any = await mutation({
        variables: {
          input: { userID, handle },
        },
        refetchQueries: [
          {
            query: getCurrentUserQuery,
          },
        ],
      });

      console.log("good job. res: ", res);
      return;
    } catch (err) {
      this.setState({ errorMessage: "unknown" });
    }
  }
}
