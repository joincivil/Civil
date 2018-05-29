import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Collapsable } from "./Collapsable";

const Wrapper = styled.div`
  margin: 50px;
  max-width: 500px;
`;

storiesOf("Collapsable", module).add("open", () => {
  return (
    <Wrapper>
      <Collapsable header={<h3>Hello</h3>} open={true}>
        <p> Some Content </p>
      </Collapsable>
    </Wrapper>
  );
}).add("closed", () => {
  return (
    <Wrapper>
      <Collapsable header={<h3>Hello</h3>} open={false}>
        <p> Some Content </p>
      </Collapsable>
    </Wrapper>
  );
}).add("disabled", () => {
  return (
    <Wrapper>
      <Collapsable disabled={true} header={<h3>Hello</h3>} open={false}>
        <p> Some Content </p>
      </Collapsable>
    </Wrapper>
  );
});;
