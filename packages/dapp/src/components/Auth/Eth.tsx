import * as React from "react";
import { AuthOuterWrapper, CivilContext, WalletOnboardingV2, LoadUser } from "@joincivil/components";
import { connect, DispatchProp } from "react-redux";
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
      <LoadUser>
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
      </LoadUser>
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

export const AuthEthConnected = connect(mapStateToProps)(AuthEth);
