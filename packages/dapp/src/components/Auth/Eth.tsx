import * as React from "react";
import { AuthOuterWrapper, WalletOnboardingV2, LoadUser } from "@joincivil/components";
import { getCivil } from "../../helpers/civilInstance";
import { connect, DispatchProp } from "react-redux";
import { hasInjectedProvider } from "@joincivil/ethapi";
import { ethereumEnable } from "@joincivil/utils";
import { EthAddress } from "@joincivil/core";
import { State } from "../../redux/reducers";

export interface AuthEthProps {
  onAuthentication(): void;
}

export interface AuthEthState {
  metamaskEnabled: boolean;
}

export interface AuthEthReduxProps {
  userAccount?: EthAddress;
}

// TODO(jorgelo): Allow user to add their wallet ONLY after they are signed in .

export class AuthEth extends React.Component<AuthEthProps & AuthEthReduxProps & DispatchProp<any>, AuthEthState> {
  constructor(props: AuthEthProps & AuthEthReduxProps & DispatchProp<any>) {
    super(props);
    this.state = {
      metamaskEnabled: false,
    };
  }

  public render(): JSX.Element {
    // TODO(jorgelo): Maybe pass civil into here.
    const civil = getCivil();

    const { onAuthentication, userAccount } = this.props;
    const { metamaskEnabled } = this.state;
    const metamaskWalletAddress = userAccount || undefined;

    return (
      <AuthOuterWrapper>
        <LoadUser>
          {({ loading, user }) => {
            if (loading) {
              return null;
            }

            const profileWalletAddress = user && user.ethAddress;

            const wrongNetwork = false;
            const requiredNetworkNiceName = undefined;

            // TODO(jorgelo): What are these? (We can probably get rid of these in the future)
            const helpUrl = "http://help.com";
            const helpUrlBase = "/";

            // This is called when the auth is complete.
            const onOnboardingComplete = () => console.log("Wallet auth complete");
            const enable = async () => this.setState({ metamaskEnabled: !!(await ethereumEnable()) });

            return (
              <WalletOnboardingV2
                civil={civil}
                noProvider={!hasInjectedProvider()}
                notEnabled={!metamaskEnabled}
                enable={enable}
                walletLocked={civil && metamaskEnabled && !metamaskWalletAddress}
                wrongNetwork={wrongNetwork}
                requiredNetworkNiceName={requiredNetworkNiceName}
                metamaskWalletAddress={metamaskWalletAddress}
                helpUrl={helpUrl}
                helpUrlBase={helpUrlBase}
                profileWalletAddress={profileWalletAddress}
                onOnboardingComplete={onOnboardingComplete}
                onContinue={onAuthentication}
              />
            );
          }}
        </LoadUser>
      </AuthOuterWrapper>
    );
  }
}

const mapStateToProps = (state: State, ownProps: AuthEthProps): AuthEthProps & AuthEthReduxProps => {
  const { user } = state.networkDependent;

  return {
    ...ownProps,
    userAccount: user.account.account,
  };
};

export const AuthEthConnected = connect(mapStateToProps)(AuthEth);
