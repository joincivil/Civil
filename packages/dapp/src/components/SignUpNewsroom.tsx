import { RouteComponentProps } from "react-router-dom";
import { CivilContext } from "@joincivil/components";
import { Newsroom, STEP } from "@joincivil/newsroom-signup";
import * as React from "react";
import { useSelector } from "react-redux";
import { PageView } from "./utility/ViewModules";
import { State } from "../redux/reducers";

export type CreateNewsroomProps = RouteComponentProps<{
  action: string;
}>;

const SignUpNewsroom: React.FunctionComponent<CreateNewsroomProps> = props => {
  const { civil } = React.useContext(CivilContext);
  const networkName = useSelector((state: State) => state.networkName);
  const userAccount = useSelector((state: State) => state.networkDependent.user.account.account);
  return (
    <PageView>
      <Newsroom
        civil={civil}
        account={userAccount}
        currentNetwork={networkName}
        forceStep={props.match.params.action === "manage" ? STEP.PROFILE_SO_FAR : undefined}
      />
    </PageView>
  );
};

export default SignUpNewsroom;
