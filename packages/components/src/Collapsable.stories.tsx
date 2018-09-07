import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Collapsable } from "./Collapsable";

const Wrapper = styled.div`
  margin: 50px;
  max-width: 500px;
`;

storiesOf("Collapsable", module)
  .add("open", () => {
    return (
      <Wrapper>
        <Collapsable header={<h3>Hello</h3>} open={true}>
          <p> Some Content </p>
        </Collapsable>
      </Wrapper>
    );
  })
  .add("closed", () => {
    return (
      <Wrapper>
        <Collapsable header={<h3>Hello</h3>} open={false}>
          <p> Some Content </p>
        </Collapsable>
      </Wrapper>
    );
  })
  .add("disabled", () => {
    return (
      <Wrapper>
        <Collapsable disabled={true} header={<h3>Hello</h3>} open={false}>
          <p> Some Content </p>
        </Collapsable>
      </Wrapper>
    );
  })
  .add("with custom arrow", () => {
    const Arrow = styled<{ open: boolean }, "div">("div")`
      width: 8px;
      height: 8px;
      border-left: 3px solid blue;
      border-bottom: 3px solid blue;
      transform: ${props => (props.open ? "rotate(135deg)" : "rotate(-45deg)")};
      transition: transform 1s;
      display: inline-block;
      veritical-align: middle;
    `;
    return (
      <Wrapper>
        <Collapsable header={"Hello"} ArrowComponent={Arrow} open={false}>
          <p> Some Content </p>
        </Collapsable>
      </Wrapper>
    );
  })
  .add("with open text", () => {
    return (
      <Wrapper>
        <Collapsable header={"Hello"} headerOpen={"goodbye"} open={false}>
          <p> Some Content </p>
        </Collapsable>
      </Wrapper>
    );
  });
