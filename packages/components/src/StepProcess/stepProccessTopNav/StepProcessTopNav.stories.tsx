import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Button, SecondaryButton } from "../../Button";

import { StepProcessTopNav } from "./StepProcessTopNav";
import { Step, RenderButtonsArgs } from "./Step";

storiesOf("StepProcessTopNav", module)
  .add("StepProcessTopNav step 1", () => {
    return (
      <StepProcessTopNav>
        <Step
          title={"Step 1"}
          renderButtons={(args: RenderButtonsArgs): JSX.Element => {
            return (
              <>
                <Button onClick={args.goNext}>got to next</Button>
              </>
            );
          }}
        >
          <p>Content</p>
        </Step>
        <Step
          title={"Step 2"}
          renderButtons={(args: RenderButtonsArgs): JSX.Element => {
            return (
              <>
                <SecondaryButton onClick={args.goPrevious}>got to previous</SecondaryButton>
                <Button onClick={args.goNext}>got to next</Button>
              </>
            );
          }}
        >
          <p>Content</p>
        </Step>
        <Step
          title={"Step 3"}
          renderButtons={(args: RenderButtonsArgs): JSX.Element => {
            return (
              <>
                <SecondaryButton onClick={args.goPrevious}>got to previous</SecondaryButton>
                <Button onClick={args.goNext}>got to next</Button>
              </>
            );
          }}
        >
          <p>Content</p>
        </Step>
        <Step
          title={"Step 4"}
          renderButtons={(args: RenderButtonsArgs): JSX.Element => {
            return (
              <>
                <SecondaryButton onClick={args.goPrevious}>got to previous</SecondaryButton>
                <Button onClick={args.goNext}>got to next</Button>
              </>
            );
          }}
        >
          <p>Content</p>
        </Step>
        <Step
          title={"Step 5"}
          renderButtons={(args: RenderButtonsArgs): JSX.Element => {
            return (
              <>
                <SecondaryButton onClick={args.goPrevious}>got to previous</SecondaryButton>
                <Button onClick={args.goNext}>got to next</Button>
              </>
            );
          }}
        >
          <p>Content</p>
        </Step>
        <Step
          title={"Step 6"}
          renderButtons={(args: RenderButtonsArgs): JSX.Element => {
            return (
              <>
                <SecondaryButton onClick={args.goPrevious}>got to previous</SecondaryButton>
                <Button onClick={args.goNext}>got to next</Button>
              </>
            );
          }}
        >
          <p>Content</p>
        </Step>
        <Step
          title={"Step 7"}
          renderButtons={(args: RenderButtonsArgs): JSX.Element => {
            return (
              <>
                <SecondaryButton onClick={args.goPrevious}>got to previous</SecondaryButton>
              </>
            );
          }}
        >
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
  });
