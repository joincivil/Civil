import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Civil } from "@joincivil/core";
import { AccountEthAuth } from "../";

let civil: Civil | undefined;
try {
  civil = new Civil();
} catch (error) {
  civil = undefined;
}

storiesOf("Account/ETH", module)
  .add("AccountEthAuth", () => {
    return (
      <AccountEthAuth
        civil={civil!}
        onAuthenticated={() => {
          alert("authenticated successfully");
        }}
      />
    );
  });
