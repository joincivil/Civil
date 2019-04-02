import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { LoadingIndicator } from "./LoadingIndicator";

const StyledDiv = styled.div`
  display: flex;
  width: 600px;
`;

const Container: React.FunctionComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("Loading Indicator", module)
  .add("Default Size (32px x 32px)", () => {
    return (
      <Container>
        <LoadingIndicator />
      </Container>
    );
  })
  .add("Prop-defined size (100px x 100px)", () => {
    return (
      <Container>
        <LoadingIndicator height={100} />
      </Container>
    );
  });
