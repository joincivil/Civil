import { storiesOf } from "@storybook/react";
import * as React from "react";
import { TokenTutorial } from "./TokenTutorial";
import { TokenTutorialLanding } from "./TokenTutorialLanding";

const onClickFunc = () => {
  console.log("clicked!");
};

storiesOf("Token Tutorial", module)
  .add("Token Tutorial", () => {
    return <TokenTutorial handleClose={onClickFunc} />;
  })
  .add("Tutorial Landing", () => {
    return <TokenTutorialLanding quizPayload={{}} handleClose={onClickFunc} />;
  });
