import { storiesOf } from "@storybook/react";
import * as React from "react";
import { TokenTutorial } from "./TokenTutorial";
import { TokenTutorialLanding } from "./TokenTutorialLanding";

storiesOf("Token Tutorial", module)
  .add("Token Tutorial", () => {
    return <TokenTutorial />;
  })
  .add("Tutorial Landing", () => {
    return <TokenTutorialLanding />;
  });
