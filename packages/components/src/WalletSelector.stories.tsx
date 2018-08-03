import { storiesOf } from "@storybook/react";
import * as React from "react";
import { WalletSelector } from "./WalletSelector";

storiesOf("walletSelector", module).add("selector", () => {
  return <WalletSelector network={4} />;
});
