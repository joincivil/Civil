import * as React from "react";
import { AuthOuterWrapper, WalletOnboardingV2 } from "@joincivil/components";
import { getCivil } from "../../helpers/civilInstance";
import { hasInjectedProvider } from "@joincivil/ethapi";

export interface AuthEthProps {
  onAuthentication(): void;
}

// TODO(jorgelo): Allow user to add their wallet ONLY after they are signed in .

export const AuthEth: React.SFC<AuthEthProps> = props => {
  // TODO(jorgelo): Maybe pass civil into here.

  const civil = getCivil();

  const metamaskEnabled = true; // For now let's assume metamasks enabled. How does this differ from hasInjectedProvider?
  const enable = () => console.log("Enable");

  const account = "0xabc1230000000000000000000000000000abc123"; // What is account? Eth address? Do we need this?

  // const wrongNetwork = this.props.civil && !!this.props.requiredNetwork && this.props.currentNetwork !== this.props.requiredNetwork
  const wrongNetwork = false; // Can you have a wrong network? This is just for signing.

  const requiredNetworkNiceName = undefined;
  // const requiredNetworkNiceName = this.props.requiredNetworkNiceName || this.props.requiredNetwork

  // TODO(jorgelo): What are these?
  const helpUrl = "http://help.com";
  const helpUrlBase = "/";

  const profileWalletAddress = undefined;

  // How do onOnboardingComplete and onContinue differ?
  // () => props.onAuthentication()
  const onOnboardingComplete = () => console.log("onOnboardingComplete");
  const onContinue = () => console.log("onContinue");

  return (
    <AuthOuterWrapper>
      <WalletOnboardingV2
        civil={civil}
        noProvider={!hasInjectedProvider()}
        notEnabled={!metamaskEnabled}
        enable={enable}
        walletLocked={civil && metamaskEnabled && !account}
        wrongNetwork={wrongNetwork}
        requiredNetworkNiceName={requiredNetworkNiceName}
        metamaskWalletAddress={account}
        helpUrl={helpUrl}
        helpUrlBase={helpUrlBase}
        profileWalletAddress={profileWalletAddress}
        onOnboardingComplete={onOnboardingComplete}
        onContinue={onContinue}
      />
    </AuthOuterWrapper>
  );
};
