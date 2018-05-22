import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { ModalHeader } from "./ModalHeader";

const StyledDiv = styled.div`
  display: flex;
`;

const Container: React.StatelessComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("ModalHeader", module).add("ModalHeader", () => {
  return (
    <Container>
      <ModalHeader>I'm the header of a modal</ModalHeader>
    </Container>
  );
});
