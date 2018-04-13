import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { InfoMessage } from "./Message";

const StyledDiv = styled.div`
  display: flex;
  width: 600px;
`;

const Container: React.StatelessComponent<{}> = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("Messages", module).add("Info Message", () => {
  return (
    <Container>
      <InfoMessage>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </InfoMessage>
    </Container>
  );
});
