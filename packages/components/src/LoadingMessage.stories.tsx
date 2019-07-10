import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { LoadingMessage } from "./LoadingMessage";

const StyledDiv = styled.div`
  display: flex;
  width: 600px;
`;

const Container: React.FunctionComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("Pattern Library / Loading / Loading Message", module)
  .add("Default size (32px x 32px), default text", () => {
    return (
      <Container>
        <LoadingMessage />
      </Container>
    );
  })
  .add("Prop-defined size (100px x 100px), default text", () => {
    return (
      <Container>
        <LoadingMessage height={100} />
      </Container>
    );
  })
  .add("Default size (32px x 32px), custom text", () => {
    return (
      <Container>
        <LoadingMessage>Please wait while we load all the stuff.</LoadingMessage>
      </Container>
    );
  });
