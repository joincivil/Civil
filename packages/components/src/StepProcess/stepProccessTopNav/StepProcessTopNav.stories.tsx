import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Button, SecondaryButton } from "../../Button";

import { StepProcessTopNav, ContentProps } from "./StepProcessTopNav";
import { Step, RenderButtonsArgs } from "./Step";

export interface StepThingProps extends ContentProps {
  children: string;
}

const StepThing = (props: StepThingProps): JSX.Element => {
  return (
    <div>
      {props.children}
      <button onClick={() => props.goNext!()}>next</button>
    </div>
  );
};

storiesOf("StepProcessTopNav", module)
  .add("StepProcessTopNav step 1", () => {
    return (
      <StepProcessTopNav>
        <Step title={"Step 1"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 2"} disabled={true}>
          <p>Content</p>
        </Step>
        <Step title={"Step 3"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 4"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 5"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 6"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 7"}>
          <p>Content</p>
        </Step>
      </StepProcessTopNav>
    );
  })
  .add("StepProcessTopNav complete step 1", () => {
    return (
      <StepProcessTopNav>
        <Step complete={true} title={"Step 1"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 2"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 3"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 4"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 5"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 6"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 7"}>
          <p>Content</p>
        </Step>
      </StepProcessTopNav>
    );
  })
  .add("step 2", () => {
    return (
      <StepProcessTopNav activeIndex={1}>
        <Step complete={true} title={"Step 1"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 2"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 3"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 4"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 5"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 6"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 7"}>
          <p>Content</p>
        </Step>
      </StepProcessTopNav>
    );
  })
  .add("step 3", () => {
    return (
      <StepProcessTopNav activeIndex={2}>
        <Step complete={true} title={"Step 1"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 2"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 3"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 4"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 5"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 6"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 7"}>
          <p>Content</p>
        </Step>
      </StepProcessTopNav>
    );
  })
  .add("step 3 2 complete", () => {
    return (
      <StepProcessTopNav activeIndex={2}>
        <Step complete={true} title={"Step 1"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 2"} complete={true}>
          <p>Content</p>
        </Step>
        <Step title={"Step 3"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 4"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 5"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 6"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 7"}>
          <p>Content</p>
        </Step>
      </StepProcessTopNav>
    );
  })
  .add("scrolls to top", () => {
    return (
      <StepProcessTopNav>
        <Step title={"Step 1"}>
          <div>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
          </div>
        </Step>
        <Step title={"Step 2"} disabled={true}>
          <div>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
            <p>Content</p>
          </div>
        </Step>
        <Step title={"Step 3"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 4"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 5"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 6"}>
          <p>Content</p>
        </Step>
        <Step title={"Step 7"}>
          <p>Content</p>
        </Step>
      </StepProcessTopNav>
    );
  })
  .add("passes go next to content", () => {
    return (
      <StepProcessTopNav activeIndex={2}>
        <Step complete={true} title={"Step 1"}>
          <StepThing>Content</StepThing>
        </Step>
        <Step title={"Step 2"} complete={true}>
          <StepThing>Content</StepThing>
        </Step>
        <Step title={"Step 3"}>
          <StepThing>Content</StepThing>
        </Step>
        <Step title={"Step 4"}>
          <StepThing>Content</StepThing>
        </Step>
        <Step title={"Step 5"}>
          <StepThing>Content</StepThing>
        </Step>
        <Step title={"Step 6"}>
          <StepThing>Content</StepThing>
        </Step>
        <Step title={"Step 7"}>
          <StepThing>Content</StepThing>
        </Step>
      </StepProcessTopNav>
    );
  });
