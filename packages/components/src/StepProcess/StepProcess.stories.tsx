import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { StepProcess, StepProps } from "./StepProcess";
import { StepHeader } from "./StepHeader";
import { StepStyled } from "./StepStyled";

const Step1 = (props: StepProps): JSX.Element => {
  return (
    <StepStyled index={props.index || 0}>
      <StepHeader>Step 1</StepHeader>
      <p> this is a step </p>
    </StepStyled>
  );
};

const Step2 = (props: StepProps): JSX.Element => {
  return (
    <StepStyled index={props.index || 0}>
      <StepHeader>Step 2</StepHeader>
      <p> this is another step </p>
    </StepStyled>
  );
};

const Step3 = (props: StepProps): JSX.Element => {
  return (
    <StepStyled index={props.index || 0}>
      <StepHeader>Step 3</StepHeader>
      <p> this is another step </p>
    </StepStyled>
  );
};

storiesOf("Common / Steps / Step Process (deprecated?)", module).add("Step Process", () => {
  return (
    <div>
      <StepProcess>
        <Step1 />
        <Step2 />
        <Step3 />
      </StepProcess>
    </div>
  );
});
