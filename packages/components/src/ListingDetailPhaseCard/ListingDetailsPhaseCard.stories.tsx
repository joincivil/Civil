import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import StoryRouter from "storybook-react-router";
import { ListingDetailPhaseCard } from "./ListingDetailsPhaseCard";

const StyledDiv = styled.div`
  display: flex;
  width: 600px;
`;

const Container: React.StatelessComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("Listing Details Phase Card", module)
  .addDecorator(StoryRouter())
  .add("Card", () => {
    return (
      <Container>
        <ListingDetailPhaseCard />
      </Container>
    );
  });
