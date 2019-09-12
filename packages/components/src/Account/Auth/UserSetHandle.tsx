import * as React from "react";
import gql from "graphql-tag";
import { Mutation, MutationFn } from "react-apollo";
import { Button, buttonSizes } from "../../Button";
import { TextInput } from "../../input";
import { ConfirmButtonContainer, AuthErrorMessage } from "./AuthStyledComponents";
import { isValidHandle, getCurrentUserQuery } from "@joincivil/utils";
import { AuthTextUnknownError } from "./AuthTextComponents";

const setHandleMutation = gql`
  mutation($input: ChannelsSetHandleInput!) {
    channelsSetHandle(input: $input) {
      id
    }
  }
`;

export interface UserSetHandleAuthProps {
  headerComponent?: JSX.Element;
  channelID: string;
  onSetHandleComplete?(): void;
}

export type UserSetHandleError = "unknown" | undefined;

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
    const { handle } = this.state;

    const isValid = isValidHandle(handle);
    return (
      <TextInput
        placeholder="username"
        noLabel
        type="text"
        name="username"
        value={handle}
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
    const { headerComponent, channelID } = this.props;
    const isButtonDisabled = !this.state.isValid;

    return (
      <>
        {this.renderAuthError()}
        {headerComponent}
        <Mutation mutation={setHandleMutation}>
          {setHandle => {
            return (
              <form onSubmit={async event => this.handleSubmit(event, setHandle, channelID)}>
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

  private async handleSubmit(event: React.FormEvent, mutation: MutationFn, channelID: string): Promise<void> {
    event.preventDefault();

    this.setState({ errorMessage: undefined, hasBlurred: true });

    const { handle } = this.state;

    if (!isValidHandle(handle)) {
      return;
    }

    try {
      const res: any = await mutation({
        variables: {
          input: { channelID, handle },
        },
        refetchQueries: [
          {
            query: getCurrentUserQuery,
          },
        ],
      });

      if (res.data && res.data.channelsSetHandle && res.data.channelsSetHandle.id === channelID) {
        if (this.props.onSetHandleComplete) {
          this.props.onSetHandleComplete();
        }
      }
      if (res.error) {
        console.log("res.error: ", res.error);
      }

      return;
    } catch (err) {
      this.setState({ errorMessage: "unknown" });
    }
  }
}
