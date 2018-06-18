import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import StoryRouter from "storybook-react-router";
import {
  InApplicationCard,
  ChallengeCommitVoteCard,
  ChallengeRevealVoteCard,
  ChallengeRequestAppealCard,
  ChallengeResolveCard,
  AppealAwaitingDecisionCard,
  AppealDecisionCard,
  AppealChallengeCommitVoteCard,
  AppealChallengeRevealVoteCard,
  WhitelistedCard,
  RejectedCard,
} from "./index";

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
  .add("In Application", () => {
    const now = Date.now() / 1000;
    const oneDay = 86400;
    const endTime = now + oneDay * 4.25;
    const phaseLength = oneDay * 7;
    return (
      <Container>
        <InApplicationCard endTime={endTime} phaseLength={phaseLength} />
      </Container>
    );
  })
  .add("Under Challenge: Commit Vote", () => {
    return (
      <Container>
        <ChallengeCommitVoteCard />
      </Container>
    );
  })
  .add("Under Challenge: Reveal Vote", () => {
    return (
      <Container>
        <ChallengeRevealVoteCard />
      </Container>
    );
  })
  .add("Under Challenge: Request Appeal", () => {
    return (
      <Container>
        <ChallengeRequestAppealCard />
      </Container>
    );
  })
  .add("Under Challenge: Resolve", () => {
    return (
      <Container>
        <ChallengeResolveCard />
      </Container>
    );
  })
  .add("Under Appeal: Awaiting Appeal Decision", () => {
    return (
      <Container>
        <AppealAwaitingDecisionCard />
      </Container>
    );
  })
  .add("Under Appeal: Decision / Can Challenge", () => {
    return (
      <Container>
        <AppealDecisionCard />
      </Container>
    );
  })
  .add("Appeal Challenge: Commit Vote", () => {
    return (
      <Container>
        <AppealChallengeCommitVoteCard />
      </Container>
    );
  })
  .add("Appeal Challenge: Reveal Vote", () => {
    return (
      <Container>
        <AppealChallengeRevealVoteCard />
      </Container>
    );
  })
  .add("Whitelisted", () => {
    return (
      <Container>
        <WhitelistedCard />
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
