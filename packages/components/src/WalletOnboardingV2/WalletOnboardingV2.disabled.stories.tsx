import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Civil } from "@joincivil/core";
import { WalletOnboardingV2 } from ".";

let civil: Civil | undefined;
try {
  civil = new Civil();
} catch (error) {
  civil = undefined;
}

storiesOf("Wallet Onboarding V2/Not Enabled", module).add("Not Enabled", () => {
  return (
    <WalletOnboardingV2
      metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
      profileWalletAddress="0xabc1230000000000000000000000000000abc123"
      civil={civil}
    >
      <b>NOTE:</b> To see this state you must view this story with metamask from a browser where you haven't enabled
      MetaMask for this domain, or if you already have, you can go into MetaMask settings, enable privacy mode, and hit
      Clear Privacy Data and refresh.
    </WalletOnboardingV2>
  );
});
