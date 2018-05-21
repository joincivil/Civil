import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { ModalContent } from "./ModalContent";

const StyledDiv = styled.div`
  display: flex;
`;

const Container: React.StatelessComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("ModalContent", module).add("content", () => {
  return (
    <Container>
      <ModalContent>I'm a paragraph of some sorts</ModalContent>
    </Container>
  );
});
