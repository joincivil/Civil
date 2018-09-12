import { storiesOf } from "@storybook/react";
import * as React from "react";

import { StepProcessTopNav } from "./StepProcessTopNav";
import { Step } from "./Step";

storiesOf("StepProcessTopNav", module)
  .add("StepProcessTopNav step 1", () => {
    return (<StepProcessTopNav>
      <Step title={"Step 1"}><p>Content</p></Step>
      <Step title={"Step 2"}><p>Content</p></Step>
      <Step title={"Step 3"}><p>Content</p></Step>
      <Step title={"Step 4"}><p>Content</p></Step>
      <Step title={"Step 5"}><p>Content</p></Step>
      <Step title={"Step 6"}><p>Content</p></Step>
      <Step title={"Step 7"}><p>Content</p></Step>
    </StepProcessTopNav>);
  }).add("StepProcessTopNav complete step 1", () => {
    return (<StepProcessTopNav>
      <Step complete={true} title={"Step 1"}><p>Content</p></Step>
      <Step title={"Step 2"}><p>Content</p></Step>
      <Step title={"Step 3"}><p>Content</p></Step>
      <Step title={"Step 4"}><p>Content</p></Step>
      <Step title={"Step 5"}><p>Content</p></Step>
      <Step title={"Step 6"}><p>Content</p></Step>
      <Step title={"Step 7"}><p>Content</p></Step>
    </StepProcessTopNav>);
  });
