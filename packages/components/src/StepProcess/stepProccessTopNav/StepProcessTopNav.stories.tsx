import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";

import { StepProcessTopNav } from "./StepProcessTopNav";
import { Step } from "./Step";

export interface TestClassState {
  activeIndex: number;
}

class TestClass extends React.Component<{}, TestClassState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }
  public render(): JSX.Element {
    return (
      <StepProcessTopNav activeIndex={this.state.activeIndex}>
        <Step title={"Step 1"}>
          <>
            <p>Content</p>
            <button onClick={() => this.setState({ activeIndex: 1 })}>next</button>
          </>
        </Step>
        <Step title={"Step 2"}>
          <>
            <p>Content</p>
            <button onClick={() => this.setState({ activeIndex: 2 })}>next</button>
          </>
        </Step>
        <Step title={"Step 3"}>
          <>
            <p>Content</p>
            <button onClick={() => this.setState({ activeIndex: 3 })}>next</button>
          </>
        </Step>
        <Step title={"Step 4"}>
          <>
            <p>Content</p>
            <button onClick={() => this.setState({ activeIndex: 0 })}>next</button>
          </>
        </Step>
      </StepProcessTopNav>
    );
  }
}

storiesOf("StepProcessTopNav", module)
  .add("StepProcessTopNav step 1", () => {
    return (
      <StepProcessTopNav>
        <Step title={"Step 1"}>
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
  .add("navigate with next and clicks", () => {
    return <TestClass />;
  });
