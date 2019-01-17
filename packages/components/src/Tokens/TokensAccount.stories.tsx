import { storiesOf } from "@storybook/react";
import * as React from "react";
import { UserTokenAccount } from "./Tokens";

storiesOf("User Token Account", module).add("User Token Account", () => {
  return <UserTokenAccount />;
});
