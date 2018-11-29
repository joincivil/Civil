import { EthAddress } from "@joincivil/core";
import { Newsroom } from "@joincivil/newsroom-manager";
import { DEFAULT_BUTTON_THEME } from "@joincivil/components";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
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

class CreateNewsroom extends React.Component<
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
          <Newsroom
            civil={civil}
            onNewsroomCreated={this.onCreated}
            account={this.props.userAccount}
            currentNetwork={this.props.networkName}
            theme={DEFAULT_BUTTON_THEME}
            metamaskEnabled={this.state.metamaskEnabled}
            initialStep={0}
            enable={async () => {
              if ((window as any).ethereum) {
                await (window as any).ethereum.enable();
                this.setState({ metamaskEnabled: true });
              }
            }}
          />
        </ViewModule>
      </PageView>
    );
  }

  private onCreated = (address: EthAddress) => {
    this.props.history.push("/mgmt-v1/" + address);
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

export default connect(mapStateToProps)(CreateNewsroom);
