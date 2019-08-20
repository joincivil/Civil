import { RouteComponentProps } from "react-router-dom";
import { EthAddress } from "@joincivil/core";
import { CivilContext } from "@joincivil/components";
import { Newsroom, STEP } from "@joincivil/newsroom-signup";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { PageView } from "./utility/ViewModules";
import { State } from "../redux/reducers";

export type CreateNewsroomProps = RouteComponentProps<{
  action: string;
}>;
export interface CreateNewsroomReduxProps {
  networkName: string;
  userAccount: EthAddress;
}

const SignUpNewsroom: React.FunctionComponent<
  CreateNewsroomProps & CreateNewsroomReduxProps & DispatchProp<any>
> = props => {
  const { civil } = React.useContext(CivilContext);
  return (
    <PageView>
      <Newsroom
        civil={civil}
        account={props.userAccount}
        currentNetwork={props.networkName}
        forceStep={props.match.params.action === "manage" ? STEP.PROFILE_SO_FAR : undefined}
      />
    </PageView>
  );
};

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
