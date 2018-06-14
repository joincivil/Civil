import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import StoryRouter from "storybook-react-router";
import {
  WhitelistedCard,
  InApplicationCard,
  CommitVoteCard,
  RevealVoteCard,
  AwaitingAppealRequestCard,
  RejectedCard,
} from "./ListingDetailsPhaseCard";

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
  .add("Whitelisted", () => {
    return (
      <Container>
        <WhitelistedCard />
      </Container>
    );
  })
  .add("In Application", () => {
    return (
      <Container>
        <InApplicationCard />
      </Container>
    );
  })
  .add("Commit Vote", () => {
    return (
      <Container>
        <CommitVoteCard />
      </Container>
    );
  })
  .add("Reveal Vote", () => {
    return (
      <Container>
        <RevealVoteCard />
      </Container>
    );
  })
  .add("Awaiting Appeal Request", () => {
    return (
      <Container>
        <AwaitingAppealRequestCard />
      </Container>
    );
  })
  .add("Rejected", () => {
    return (
      <Container>
        <RejectedCard />
      </Container>
    );
  });
