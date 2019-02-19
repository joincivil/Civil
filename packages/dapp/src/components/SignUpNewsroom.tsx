import { EthAddress } from "@joincivil/core";
import { Newsroom } from "@joincivil/newsroom-signup";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { getCivil } from "../helpers/civilInstance";
import { PageView, ViewModule } from "./utility/ViewModules";
import { State } from "../redux/reducers";

export interface CreateNewsroomState {
  error: string;
  metamaskEnabled?: boolean;
}
export interface CreateNewsroomProps {
  match: any;
  history: any;
}
export interface CreateNewsroomReduxProps {
  networkName: string;
  userAccount: EthAddress;
}

const userEthAddress = gql`
  query {
    currentUser {
      ethAddress
    }
  }
`;

class SignUpNewsroom extends React.Component<
  CreateNewsroomProps & CreateNewsroomReduxProps & DispatchProp<any>,
  CreateNewsroomState
> {
  constructor(props: CreateNewsroomProps & CreateNewsroomReduxProps) {
    super(props);
    this.state = {
      error: "",
    };
  }

  public async componentDidMount(): Promise<void> {
    if ((window as any).ethereum && (window as any).ethereum.isEnabled) {
      const metamaskEnabled = await (window as any).ethereum.isEnabled();
      this.setState({ metamaskEnabled });
    } else {
      this.setState({ metamaskEnabled: true });
    }
  }

  public render(): JSX.Element {
    const civil = getCivil();
    return (
      <PageView>
        <ViewModule>
          <Query query={userEthAddress}>
            {({ loading, error, data }) => {
              if (loading) {
                return "Loading...";
              }
              if (error) {
                return `Error! ${JSON.stringify(error)}`;
              }

              return (
                <Newsroom
                  civil={civil}
                  onNewsroomCreated={this.onCreated}
                  account={this.props.userAccount}
                  currentNetwork={this.props.networkName}
                  metamaskEnabled={this.state.metamaskEnabled}
                  profileWalletAddress={data.currentUser.ethAddress}
                  allSteps={true}
                  initialStep={0}
                  enable={async () => {
                    if ((window as any).ethereum) {
                      await (window as any).ethereum.enable();
                      this.setState({ metamaskEnabled: true });
                    }
                  }}
                />
              );
            }}
          </Query>
        </ViewModule>
      </PageView>
    );
  }

  private onCreated = (address: EthAddress) => {
    return;
  };
}

const mapStateToProps = (
  state: State,
  ownProps: CreateNewsroomProps,
): CreateNewsroomProps & CreateNewsroomReduxProps => {
  const { networkName } = state;
  const { user } = state.networkDependent;

  return {
    ...ownProps,
    networkName,
    userAccount: user.account.account,
  };
};

export default connect(mapStateToProps)(SignUpNewsroom);
