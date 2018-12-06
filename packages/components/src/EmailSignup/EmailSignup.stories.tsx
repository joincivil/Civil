import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { EmailSignup } from "./EmailSignup";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

const Container: React.StatelessComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

function onChange(name: string, value: string): void {
  console.log("On Change", name, value);
}

function onSubmit(): void {
  console.log("On Submit");
}

storiesOf("Email Signup Component", module).add("Email Signup", () => {
  return (
    <Container>
      <EmailSignup onChange={onChange} onSubmit={onSubmit} />
    </Container>
  );
});
