import { EthAddress } from "@joincivil/core";
import { Newsroom } from "@joincivil/newsroom-manager";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { getCivil } from "../helpers/civilInstance";
import { PageView, ViewModule } from "./utility/ViewModules";
import { State } from "../reducers";

export interface CreateNewsroomState {
  error: string;
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
            requiredNetwork="rinkeby"
            theme={{}}
          />
        </ViewModule>
      </PageView>
    );
  }

  private onCreated = (address: EthAddress) => {
    this.props.history.push("/mgmt/" + address);
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
