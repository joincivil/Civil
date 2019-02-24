import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Civil } from "@joincivil/core";
import { WalletOnboardingV2 } from ".";
import { apolloDecorator } from "./WalletOnboardingV2.decorator.stories";

let civil: Civil | undefined;
try {
  civil = new Civil();
} catch (error) {
  civil = undefined;
}

storiesOf("Wallet Onboarding V2/Mismatch", module)
  .addDecorator(apolloDecorator)
  .add("Civil account vs. MetaMask address mismatch", () => {
    return (
      <WalletOnboardingV2
        metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
        profileWalletAddress="0x123abc00000000000000000000000000000x123abc"
        civil={civil}
      />
    );
  });
