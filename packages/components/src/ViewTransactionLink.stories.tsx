import { storiesOf } from "@storybook/react";
import * as React from "react";
import { ViewTransactionLink } from "./ViewTransactionLink";

storiesOf("viewTransactionLink", module).add("link", () => {
  return (
    <ViewTransactionLink
      txHash="0x90cf2411cac2a4d4873332bcf60bed49e62d7d4021120c3de0749eba8f6168af"
      network="rinkeby"
    />
  );
});
