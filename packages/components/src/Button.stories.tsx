import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import styled from "styled-components";
import { Button, SecondaryButton, CancelButton, InvertedButton } from "./Button";

const StyledDiv = styled.div`
  display: flex;
  width: 400px;
`;

const Container: React.StatelessComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("Buttons", module)
  .addDecorator(StoryRouter())
  .add("Button", () => {
    return (
      <Container>
        <Button>Standard Button</Button>
        <Button disabled>Disabled</Button>
        <Button to="/home">Link Button</Button>
      </Container>
    );
  })
  .add("SecondaryButton", () => {
    return (
      <Container>
        <SecondaryButton>Secondary Button</SecondaryButton>
      </Container>
    );
  })
  .add("InvertedButton", () => {
    return (
      <Container>
        <InvertedButton>Inverted Button</InvertedButton>
      </Container>
    );
  })
  .add("CancelButton", () => {
    return (
      <Container>
        <CancelButton>Cancel Button</CancelButton>
      </Container>
    );
  });
