import { storiesOf } from "@storybook/react";
import * as React from "react";
import { QuestionToolTip } from "./QuestionToolTip";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

storiesOf("QuestionToolTip", module).add("tooltip", () => {
  return (
    <Wrapper>
      <QuestionToolTip explainerText={"this is a tool tip"} />
    </Wrapper>
  );
});
