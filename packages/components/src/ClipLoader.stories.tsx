import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { ClipLoader } from "./ClipLoader";

const StyledDiv = styled.div`
  display: flex;
  width: 600px;
`;

const Container: React.StatelessComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("Clip Loader", module)
  .add("Default Size (32px x 32px)", () => {
    return (
      <Container>
        <ClipLoader />
      </Container>
    );
  })
  .add("Prop-defined size (100px x 100px)", () => {
    return (
      <Container>
        <ClipLoader size={100} />
      </Container>
    );
  });
