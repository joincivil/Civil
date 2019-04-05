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

storiesOf("Common / Wallet Onboarding V2/Connected", module).add("Connected", () => {
  return (
    <WalletOnboardingV2
      metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
      profileWalletAddress="0xabc1230000000000000000000000000000abc123"
      civil={civil}
    />
  );
});
