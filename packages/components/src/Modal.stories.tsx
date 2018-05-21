import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Modal } from "./Modal";

const StyledDiv = styled.div`
  display: flex;
  width: 100vh;
  height: 100vw;
  background-color: #fff;
`;

const Container: React.StatelessComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("Modal", module).add("Modal", () => {
  return (
    <Container>
      <p>Some good stuff was already on the page which is pretty exciting</p>
<<<<<<< HEAD
      {process.env.NODE_ENV !== "test" && (
        <Modal>
          <h3>Hello</h3>
          <p>lorem ipsum whatever you know what i mean. It gets pretty long because thats more useful</p>
        </Modal>
      )}
=======
      <Modal><h3>Hello</h3><p>lorem ipsum whatever you know what i mean. It gets pretty long because thats more useful</p></Modal>
>>>>>>> add modal to patterns
    </Container>
  );
});
