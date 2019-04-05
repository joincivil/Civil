import { RouteComponentProps } from "react-router-dom";
import { EthAddress } from "@joincivil/core";
import { Newsroom, STEP } from "@joincivil/newsroom-signup";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { getCivil } from "../helpers/civilInstance";
import { PageView } from "./utility/ViewModules";
import { State } from "../redux/reducers";

export type CreateNewsroomProps = RouteComponentProps<{
  action: string;
}>;
export interface CreateNewsroomReduxProps {
  networkName: string;
  userAccount: EthAddress;
}

class SignUpNewsroom extends React.Component<CreateNewsroomProps & CreateNewsroomReduxProps & DispatchProp<any>> {
  public render(): JSX.Element {
    const civil = getCivil();
    return (
      <PageView>
        <Newsroom
          civil={civil}
          account={this.props.userAccount}
          currentNetwork={this.props.networkName}
          forceStep={this.props.match.params.action === "manage" ? STEP.PROFILE_SO_FAR : undefined}
        />
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
