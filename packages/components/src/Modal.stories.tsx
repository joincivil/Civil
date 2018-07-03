import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Modal } from "./Modal";
import { FullScreenModal } from "./FullscreenModal";

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

storiesOf("Modal", module)
  .add("Modal", () => {
    return (
      <Container>
        <p>Some good stuff was already on the page which is pretty exciting</p>
        {process.env.NODE_ENV !== "test" && (
          <Modal>
            <h3>Hello</h3>
            <p>lorem ipsum whatever you know what i mean. It gets pretty long because thats more useful</p>
          </Modal>
        )}
      </Container>
    );
  })
  .add("Fullscreen Modal", () => {
    const handleClose = () => {
      console.log("Modal closed");
    };
    return (
      <Container>
        <p>Some good stuff was already on the page which is pretty exciting</p>
        {process.env.NODE_ENV !== "test" && (
          <FullScreenModal open={true} handleClose={handleClose}>
            <h3>Hello</h3>
            <p>lorem ipsum whatever you know what i mean. It gets pretty long because thats more useful</p>
          </FullScreenModal>
        )}
      </Container>
    );
  })
;
