import * as React from "react";
import { AuthOuterWrapper, CivilContext, WalletOnboardingV2 } from "@joincivil/components";
import { connect, DispatchProp } from "react-redux";
import { AuthenticatedUserContainer } from "@joincivil/civil-session";
import { EthAddress } from "@joincivil/core";
import { State } from "../../redux/reducers";

export interface AuthEthProps {
  onAuthentication(): void;
}

export interface AuthEthReduxProps {
  userAccount?: EthAddress;
}

// TODO(jorgelo): Allow user to add their wallet ONLY after they are signed in .

const AuthEth: React.FunctionComponent<AuthEthProps & AuthEthReduxProps & DispatchProp<any>> = props => {
  const { civil } = React.useContext(CivilContext);

  const { onAuthentication, userAccount } = props;
  const metamaskWalletAddress = userAccount || undefined;

  return (
    <AuthOuterWrapper>
      <AuthenticatedUserContainer>
        {({ loading, user }) => {
          if (loading) {
            return null;
          }

          const profileWalletAddress = user && user.ethAddress;

          return (
            <WalletOnboardingV2
              civil={civil}
              metamaskWalletAddress={metamaskWalletAddress}
              profileWalletAddress={profileWalletAddress}
              onOnboardingComplete={onAuthentication}
            />
          );
        }}
      </AuthenticatedUserContainer>
    </AuthOuterWrapper>
  );
};

const mapStateToProps = (state: State, ownProps: AuthEthProps): AuthEthProps & AuthEthReduxProps => {
  const { user } = state.networkDependent;

  return {
    ...ownProps,
    userAccount: user.account.account,
  };
};

const AuthEthConnected = connect(mapStateToProps)(AuthEth);

export default AuthEthConnected;
