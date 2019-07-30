import * as React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import { CardClickable } from "./Card";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

const Container: React.FunctionComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

const handleClick = () => console.log("You clicked it.");

storiesOf("Pattern Library / Cards", module).add("Clickable Card", () => {
  return (
    <Container>
      <CardClickable onClick={handleClick}>I am a basic clickable card.</CardClickable>
    </Container>
  );
});
