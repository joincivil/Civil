import * as React from "react";
import gql from "graphql-tag";
import { Mutation, MutationFn, ApolloConsumer } from "react-apollo";
import { Button, buttonSizes } from "../../Button";
import { TextInput } from "../../input";
import { ConfirmButtonContainer } from "./AuthStyledComponents";
import { isValidHandle, getCurrentUserQuery } from "@joincivil/utils";
import ApolloClient from "apollo-client";
import { debounce } from "lodash";

const setHandleMutation = gql`
  mutation($input: ChannelsSetHandleInput!) {
    channelsSetHandle(input: $input) {
      id
    }
  }
`;

const checkHandleUniqueQuery = gql`
  query($handle: String!) {
    channelsIsHandleAvailable(handle: $handle)
  }
`;

export interface UserSetHandleAuthProps {
  headerComponent?: JSX.Element;
  channelID: string;
  onSetHandleComplete?(): void;
}

const ERROR_MESSAGE_INVALID_HANDLE =
  "Please enter a valid username. Usernames must be 4-15 characters, with no spaces or special characters other than underscores.";
const ERROR_MESSAGE_NOT_UNIQUE = "That username is already in use. Please try another.";

export interface UserSetHandleAuthState {
  handle: string;
  errorMessage: string | undefined;
  hasBlurred: boolean;
  isHandleUnique: boolean;
}

export class UserSetHandle extends React.Component<UserSetHandleAuthProps, UserSetHandleAuthState> {
  constructor(props: UserSetHandleAuthProps) {
    super(props);
    this.state = {
      handle: "",
      errorMessage: undefined,
      hasBlurred: false,
      isHandleUnique: true,
    };
    this.checkHandleUniqueness = debounce(this.checkHandleUniqueness.bind(this), 1000);
  }

  public renderHandleInput(): JSX.Element {
    const { handle, isHandleUnique, errorMessage } = this.state;
    let isError = false;
    if (errorMessage) {
      isError = true;
    }
    const isValid = isValidHandle(handle);

    let invalidMessage: string | undefined = errorMessage;
    if (!isValid) {
      invalidMessage = ERROR_MESSAGE_INVALID_HANDLE;
    } else if (!isHandleUnique) {
      invalidMessage = ERROR_MESSAGE_NOT_UNIQUE;
    }

    return (
      <ApolloConsumer>
        {client => (
          <TextInput
            placeholder="username"
            noLabel
            type="text"
            name="username"
            value={handle}
            invalidMessage={invalidMessage}
            invalid={!isValid || !isHandleUnique || isError}
            onChange={(_, value) => {
              this.setState({ handle: value, hasBlurred: false, errorMessage: undefined, isHandleUnique: true });
              // tslint:disable-next-line
              this.checkHandleUniqueness(value, client);
            }}
            onBlur={() => this.setState({ hasBlurred: true })}
          />
        )}
      </ApolloConsumer>
    );
  }

  public render(): JSX.Element {
    const { headerComponent, channelID } = this.props;
    const isButtonDisabled = !isValidHandle(this.state.handle) || !this.state.isHandleUnique;

    return (
      <>
        {headerComponent}
        <Mutation<any> mutation={setHandleMutation}>
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

  private checkHandleUniqueness = async (val: any, client: ApolloClient<any>): Promise<void> => {
    const result = await client.query({ query: checkHandleUniqueQuery, variables: { handle: val } });
    const isHandleUnique = result.data && result.data.channelsIsHandleAvailable;
    this.setState({ isHandleUnique });
  };

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
      let errorMessage = "Unknown Error when setting username. Please contact support@civil.co if problem persists.";
      if (err.toString().includes("invalid handle")) {
        errorMessage = ERROR_MESSAGE_INVALID_HANDLE;
      } else if (err.toString().includes("not unique")) {
        errorMessage = ERROR_MESSAGE_NOT_UNIQUE;
      }
      this.setState({ errorMessage });
    }
  }
}
