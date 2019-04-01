import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { ModalHeading, ModalContent } from "./ModalContent";

const StyledDiv = styled.div`
  display: flex;
`;

const Container: React.FunctionComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("ModalContent", module).add("content", () => {
  return (
    <Container>
      <ModalHeading>I'm a Heading</ModalHeading>
      <ModalContent>I'm a paragraph of some sorts</ModalContent>
    </Container>
  );
});
