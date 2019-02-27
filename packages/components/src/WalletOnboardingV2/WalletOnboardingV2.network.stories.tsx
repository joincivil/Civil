import { storiesOf } from "@storybook/react";
import * as React from "react";
import { WalletOnboardingV2 } from ".";

storiesOf("Wallet Onboarding V2/Wrong Network", module).add("Wrong Network", () => {
  return <WalletOnboardingV2 wrongNetwork={true} requiredNetworkNiceName="Main Ethereum Network" />;
});
