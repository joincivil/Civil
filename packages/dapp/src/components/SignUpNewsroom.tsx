import { EthAddress } from "@joincivil/core";
import { Newsroom } from "@joincivil/newsroom-signup";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { getCivil } from "../helpers/civilInstance";
import { PageView } from "./utility/ViewModules";
import { State } from "../redux/reducers";

export interface CreateNewsroomProps {
  match: any;
  history: any;
}
export interface CreateNewsroomReduxProps {
  networkName: string;
  userAccount: EthAddress;
}

class SignUpNewsroom extends React.Component<CreateNewsroomProps & CreateNewsroomReduxProps & DispatchProp<any>> {
  public render(): JSX.Element {
    const civil = getCivil();
    return (
      <PageView>
        <Newsroom civil={civil} account={this.props.userAccount} currentNetwork={this.props.networkName} />
      </PageView>
    );
  }
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
