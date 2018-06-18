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
    const now = Date.now() / 1000;
    const oneDay = 86400;
    const endTime = now + oneDay * 4.25;
    const phaseLength = oneDay * 7;
    const challenger = "0x0";
    const rewardPool = "1000000";
    const stake = "100000";
    return (
      <Container>
        <ChallengeCommitVoteCard
          endTime={endTime}
          phaseLength={phaseLength}
          challenger={challenger}
          rewardPool={rewardPool}
          stake={stake}
        />
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
    const challenger = "0x0";
    const rewardPool = "1000000";
    const stake = "100000";
    const totalVotes = "100000";
    const votesFor = "73000";
    const votesAgainst = "27000";
    const percentFor = "73";
    const percentAgainst = "27";
    return (
      <Container>
        <ChallengeResolveCard
          challenger={challenger}
          rewardPool={rewardPool}
          stake={stake}
          totalVotes={totalVotes}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          percentFor={percentFor}
          percentAgainst={percentAgainst}
        />
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
