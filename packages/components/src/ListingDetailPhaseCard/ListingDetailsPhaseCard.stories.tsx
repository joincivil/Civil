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

const now = Date.now() / 1000;
const oneDay = 86400;
const endTime = now + oneDay * 4.25;
const phaseLength = oneDay * 7;

const challenger = "0x0";
const rewardPool = "1000000";
const stake = "100000";

const totalVotes = "100000";
const votesFor = "73000";
const votesAgainst = "27000";
const percentFor = "73";
const percentAgainst = "27";

const tokenBalance = 10000;
let commitVoteState = {
  salt: "",
  numTokens: tokenBalance.toString(),
  voteOption: undefined,
};

function commitVoteChange(data: any): void {
  commitVoteState = { ...commitVoteState, ...data };
}

storiesOf("Listing Details Phase Card", module)
  .addDecorator(StoryRouter())
  .add("In Application", () => {
    return (
      <Container>
        <InApplicationCard endTime={endTime} phaseLength={phaseLength} transactions={[]} />
      </Container>
    );
  })
  .add("Under Challenge: Commit Vote", () => {
    return (
      <Container>
        <ChallengeCommitVoteCard
          endTime={endTime}
          phaseLength={phaseLength}
          challenger={challenger}
          rewardPool={rewardPool}
          stake={stake}
          tokenBalance={tokenBalance}
          salt={commitVoteState.salt}
          numTokens={commitVoteState.numTokens}
          onInputChange={commitVoteChange}
          transactions={[]}
        />
      </Container>
    );
  })
  .add("Under Challenge: Reveal Vote", () => {
    return (
      <Container>
        <ChallengeRevealVoteCard
          endTime={endTime}
          phaseLength={phaseLength}
          challenger={challenger}
          rewardPool={rewardPool}
          stake={stake}
        />
      </Container>
    );
  })
  .add("Under Challenge: Request Appeal", () => {
    return (
      <Container>
        <ChallengeRequestAppealCard
          endTime={endTime}
          phaseLength={phaseLength}
          totalVotes={totalVotes}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          percentFor={percentFor}
          percentAgainst={percentAgainst}
        />
      </Container>
    );
  })
  .add("Under Challenge: Resolve", () => {
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
          transactions={[]}
        />
      </Container>
    );
  })
  .add("Under Appeal: Awaiting Appeal Decision", () => {
    return (
      <Container>
        <AppealAwaitingDecisionCard
          endTime={endTime}
          phaseLength={phaseLength}
          totalVotes={totalVotes}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          percentFor={percentFor}
          percentAgainst={percentAgainst}
        />
      </Container>
    );
  })
  .add("Under Appeal: Decision / Can Challenge", () => {
    return (
      <Container>
        <AppealDecisionCard endTime={endTime} phaseLength={phaseLength} transactions={[]} />
      </Container>
    );
  })
  .add("Appeal Challenge: Commit Vote", () => {
    return (
      <Container>
        <AppealChallengeCommitVoteCard
          endTime={endTime}
          phaseLength={phaseLength}
          tokenBalance={tokenBalance}
          salt={commitVoteState.salt}
          numTokens={commitVoteState.numTokens}
          onInputChange={commitVoteChange}
          transactions={[]}
        />
      </Container>
    );
  })
  .add("Appeal Challenge: Reveal Vote", () => {
    return (
      <Container>
        <AppealChallengeRevealVoteCard endTime={endTime} phaseLength={phaseLength} />
      </Container>
    );
  })
  .add("Whitelisted", () => {
    return (
      <Container>
        <WhitelistedCard transactions={[]} />
      </Container>
    );
  })
  .add("Rejected", () => {
    return (
      <Container>
        <RejectedCard
          totalVotes={totalVotes}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          percentFor={percentFor}
          percentAgainst={percentAgainst}
        />
      </Container>
    );
  });
