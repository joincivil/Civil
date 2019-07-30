import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import styled from "styled-components";
import { Button, SecondaryButton, DarkButton, InvertedButton, buttonSizes } from "./Button";
import { MetaMaskLogoButton } from "./MetaMaskLogoButton";
import { CardTransactionButton } from "./CardTransactionButton";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

const Container: React.FunctionComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("Pattern Library / Buttons", module)
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
        <Button size={buttonSizes.MEDIUM_WIDE}>medium wide</Button>
        <br />
        <Button size={buttonSizes.SMALL}>small</Button>
        <br />
        <Button size={buttonSizes.SMALL_WIDE}>small wide</Button>
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
  })
  .add("MetaMaskLogoButton", () => {
    return (
      <Container>
        <MetaMaskLogoButton onClick={(ev: any) => console.log("You clicked me!")}>MetaMaskLogo Transaction Button</MetaMaskLogoButton>
      </Container>
    );
  })
  .add("CardTransactionButton", () => {
    return (
      <Container>
        <p>This is a Transaction Button styled as a Card, and can contain any markup</p>
        <CardTransactionButton onClick={(ev: any) => console.log("You clicked me!")}>Transaction</CardTransactionButton>
      </Container>
    );
  });
