import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";

import { StepProcessTopNavNoButtons, ContentProps } from "./StepProcessTopNavNoButtons";
import { StepNoButtons } from "./Step";

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

storiesOf("Common / Steps / Step Process (no buttons)", module)
  .add("StepProcessTopNavNoButtons StepNoButtons 1", () => {
    return (
      <StepProcessTopNavNoButtons>
        <StepNoButtons title={"StepNoButtons 1"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 2"} disabled={true}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 3"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 4"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 5"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 6"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 7"}>
          <p>Content</p>
        </StepNoButtons>
      </StepProcessTopNavNoButtons>
    );
  })
  .add("StepProcessTopNavNoButtons complete StepNoButtons 1", () => {
    return (
      <StepProcessTopNavNoButtons>
        <StepNoButtons complete={true} title={"StepNoButtons 1"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 2"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 3"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 4"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 5"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 6"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 7"}>
          <p>Content</p>
        </StepNoButtons>
      </StepProcessTopNavNoButtons>
    );
  })
  .add("StepNoButtons 2", () => {
    return (
      <StepProcessTopNavNoButtons activeIndex={1}>
        <StepNoButtons complete={true} title={"StepNoButtons 1"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 2"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 3"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 4"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 5"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 6"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 7"}>
          <p>Content</p>
        </StepNoButtons>
      </StepProcessTopNavNoButtons>
    );
  })
  .add("StepNoButtons 3", () => {
    return (
      <StepProcessTopNavNoButtons activeIndex={2}>
        <StepNoButtons complete={true} title={"StepNoButtons 1"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 2"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 3"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 4"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 5"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 6"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 7"}>
          <p>Content</p>
        </StepNoButtons>
      </StepProcessTopNavNoButtons>
    );
  })
  .add("StepNoButtons 3 2 complete", () => {
    return (
      <StepProcessTopNavNoButtons activeIndex={2}>
        <StepNoButtons complete={true} title={"StepNoButtons 1"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 2"} complete={true}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 3"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 4"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 5"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 6"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 7"}>
          <p>Content</p>
        </StepNoButtons>
      </StepProcessTopNavNoButtons>
    );
  })
  .add("scrolls to top", () => {
    return (
      <StepProcessTopNavNoButtons>
        <StepNoButtons title={"StepNoButtons 1"}>
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
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 2"} disabled={true}>
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
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 3"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 4"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 5"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 6"}>
          <p>Content</p>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 7"}>
          <p>Content</p>
        </StepNoButtons>
      </StepProcessTopNavNoButtons>
    );
  })
  .add("passes go next to content", () => {
    return (
      <StepProcessTopNavNoButtons activeIndex={2}>
        <StepNoButtons complete={true} title={"StepNoButtons 1"}>
          <StepThing>Content</StepThing>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 2"} complete={true}>
          <StepThing>Content</StepThing>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 3"}>
          <StepThing>Content</StepThing>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 4"}>
          <StepThing>Content</StepThing>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 5"}>
          <StepThing>Content</StepThing>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 6"}>
          <StepThing>Content</StepThing>
        </StepNoButtons>
        <StepNoButtons title={"StepNoButtons 7"}>
          <StepThing>Content</StepThing>
        </StepNoButtons>
      </StepProcessTopNavNoButtons>
    );
  });
