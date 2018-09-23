import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import styled from "styled-components";
import { Button, SecondaryButton, DarkButton, InvertedButton, buttonSizes } from "./Button";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

const Container: React.StatelessComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("Buttons", module)
  .addDecorator(StoryRouter())
  .add("Button", () => {
    return (
      <Container>
        <Button>Standard Button</Button>
        <br />
        <Button disabled>Disabled</Button>
        <br />
        <Button to="/home">Link Button</Button>
        <br />
      </Container>
    );
  })
  .add("sizes", () => {
    return (
      <Container>
        <Button size={buttonSizes.LARGE}>large</Button>
        <br />
        <Button size={buttonSizes.MEDIUM}>medium</Button>
        <br />
        <Button size={buttonSizes.SMALL}>small</Button>
        <br />
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
  .add("DarkButton", () => {
    return (
      <Container>
        <DarkButton>Dark Button</DarkButton>
      </Container>
    );
  });
