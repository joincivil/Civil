import * as React from "react";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { EthAddress } from "@joincivil/core";
import { LoadingMessage, CivilContext, ICivilContext, ErrorIcon } from "@joincivil/components";
import { BoostWrapper } from "./BoostStyledComponents";

export const IS_NEWSROOM_ADMIN_QUERY = gql`
  query($contractAddress: String!) {
    channelsGetByNewsroomAddress(contractAddress: $contractAddress) {
      currentUserIsAdmin
      newsroom {
        charter {
          name
        }
      }
    }
  }
`;

export interface BoostPermissionsOuterProps {
  disableOwnerCheck?: boolean;
  editMode?: boolean;
}

export interface BoostPermissionsInjectedProps {
  boostOwner?: boolean;
  setNewsroomContractAddress(address: EthAddress): void;
}

export interface BoostPermissionsState {
  userEthAddress?: EthAddress;
  newsroomContractAddress?: EthAddress;
}

/** Usage: Wrap component with this HOC and make sure to call the injected prop `setNewsroomContractAddress` with the newsroom address once that is loaded. */
export const withBoostPermissions = <TProps extends BoostPermissionsInjectedProps>(
  WrappedComponent: React.ComponentType<TProps>,
  requirePermissions?: boolean,
) => {
  type TOriginalProps = Omit<TProps, keyof BoostPermissionsInjectedProps>;
  return class ComponentWithBoostPermissions extends React.Component<
    BoostPermissionsOuterProps & TOriginalProps,
    BoostPermissionsState
  > {
    public static contextType = CivilContext;
    public context!: ICivilContext;

    constructor(props: BoostPermissionsOuterProps & TOriginalProps) {
      super(props);
      this.state = {};
    }

    public async componentDidMount(): Promise<void> {
      await this.getUserEthAddress();
    }

    public render(): JSX.Element {
      if (!this.state.newsroomContractAddress || this.props.disableOwnerCheck) {
        return (
          <WrappedComponent {...(this.props as TProps)} setNewsroomContractAddress={this.setNewsroomContractAddress} />
        );
      }

      return (
        <Query query={IS_NEWSROOM_ADMIN_QUERY} variables={{ contractAddress: this.state.newsroomContractAddress }}>
          {this.renderWithQuery}
        </Query>
      );
    }

    public renderWithQuery = ({ error, loading, data }: { error?: any; loading?: any; data?: any }): JSX.Element => {
      const isBoostOwner =
        data && data.channelsGetByNewsroomAddress && data.channelsGetByNewsroomAddress.currentUserIsAdmin;

      // If editMode/requirePermissions then entire view depends on if user is owner, so block everything and show loading or permissions messages:
      if ((this.props.editMode || requirePermissions) && this.state.newsroomContractAddress) {
        if (loading) {
          return this.renderLoading();
        } else if (error || !data || !data.channelsGetByNewsroomAddress) {
          console.error(
            "error loading channel data for",
            this.state.newsroomContractAddress,
            " error:",
            error,
            "data:",
            data,
          );
          return this.renderError(
            "Sorry, there was an error loading your newsroom information. Please try again later.",
          );
        } else if (!isBoostOwner) {
          if (!this.state.userEthAddress) {
            return this.renderNotConnected();
          }
          return this.renderNotChannelAdmin(data.channelsGetByNewsroomAddress.newsroom.charter.name);
        }
      }

      return (
        <WrappedComponent
          {...(this.props as TProps)}
          boostOwner={isBoostOwner}
          setNewsroomContractAddress={this.setNewsroomContractAddress}
        />
      );
    };

    public renderLoading(): JSX.Element {
      return (
        <BoostWrapper open={true}>
          <LoadingMessage>Loading Permissions</LoadingMessage>
        </BoostWrapper>
      );
    }

    public renderError(message: string): JSX.Element {
      return (
        <BoostWrapper open={true}>
          <ErrorIcon width={16} height={16} /> {message}
        </BoostWrapper>
      );
    }

    public renderNotConnected(): JSX.Element {
      return (
        <BoostWrapper open={true}>
          <p>
            Please ensure that you are logged in to Civil and have connected your Ethereum account via a browser wallet
            such as MetaMask so that we can verify your ability to create and edit Project Boosts for this newsroom.
          </p>
        </BoostWrapper>
      );
    }

    public renderNotChannelAdmin(newsroomName: string): JSX.Element {
      return (
        <BoostWrapper open={true}>
          <p>
            Your account and ETH address <code>{this.state.userEthAddress}</code> don't have permissions to create and
            edit Project Boosts for "{newsroomName}". You can view the newsrooms you have access to at your{" "}
            <Link to="/dashboard/newsrooms">Newsroom Dashboard</Link>. Please verify that you are logged in to the
            correct Civil account and ethereum wallet.
          </p>
          <p>Alternately, please contact the newsroom and request that an officer add your account.</p>
          <p>
            <Link to={`/listing/${this.state.newsroomContractAddress}`}>View newsroom information.</Link>
          </p>
        </BoostWrapper>
      );
    }

    public async getUserEthAddress(): Promise<void> {
      if (this.props.disableOwnerCheck || !this.context.civil) {
        return;
      }

      this.setState({
        userEthAddress: await this.context.civil.accountStream.first().toPromise(),
      });
    }

    public setNewsroomContractAddress = (newsroomContractAddress: EthAddress) => {
      // @HACK/tobek: This gets called from `render()` function of wrapped component because we pick it up from apollo `<Query>` component. Bad form to call setState from render (putting in setImmediate to remove React warning) but the conditional prevents an infinite loop, and the only alternative is to use `withApollo` and get apollo client as prop and call this query on `componentDidMount` in wrapped component or something, which is an annoying refactor right now.
      if (this.state.newsroomContractAddress !== newsroomContractAddress) {
        setImmediate(() => {
          this.setState({
            newsroomContractAddress,
          });
        });
      }
    };
  };
};
