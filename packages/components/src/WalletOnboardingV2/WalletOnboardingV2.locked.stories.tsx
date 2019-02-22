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

storiesOf("Wallet Onboarding V2/Locked", module).add("Locked", () => {
  return <WalletOnboardingV2 civil={civil} />;
});
