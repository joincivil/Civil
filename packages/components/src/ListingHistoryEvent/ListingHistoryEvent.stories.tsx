import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { ListingHistoryEvent } from "./ListingHistoryEvent";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

const Container: React.StatelessComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("Listing History Event", module).add("Default", () => {
  const props = {
    timestamp: new Date().valueOf() / 1000,
    title: "Whitelisted",
  };

  return (
    <Container>
      {process.env.NODE_ENV !== "test" && (
        <>
          <ListingHistoryEvent {...props} />
          <ListingHistoryEvent {...props} />
        </>
      )}
    </Container>
  );
});
