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
        {process.env.NODE_ENV !== "test" && (
          <InApplicationCard endTime={endTime} phaseLength={phaseLength} transactions={[]} />
        )}
      </Container>
    );
  })
  .add("Under Challenge: Commit Vote", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
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
        )}
      </Container>
    );
  })
  .add("Under Challenge: Reveal Vote", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <ChallengeRevealVoteCard
            endTime={endTime}
            phaseLength={phaseLength}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            salt={commitVoteState.salt}
            onInputChange={commitVoteChange}
            transactions={[]}
          />
        )}
      </Container>
    );
  })
  .add("Under Challenge: Request Appeal", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <ChallengeRequestAppealCard
            endTime={endTime}
            phaseLength={phaseLength}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
          />
        )}
      </Container>
    );
  })
  .add("Under Challenge: Resolve", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
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
        )}
      </Container>
    );
  })
  .add("Under Appeal: Awaiting Appeal Decision", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <AppealAwaitingDecisionCard
            endTime={endTime}
            phaseLength={phaseLength}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
          />
        )}
      </Container>
    );
  })
  .add("Under Appeal: Decision / Can Challenge", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <AppealDecisionCard endTime={endTime} phaseLength={phaseLength} transactions={[]} />
        )}
      </Container>
    );
  })
  .add("Appeal Challenge: Commit Vote", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <AppealChallengeCommitVoteCard
            endTime={endTime}
            phaseLength={phaseLength}
            tokenBalance={tokenBalance}
            salt={commitVoteState.salt}
            numTokens={commitVoteState.numTokens}
            onInputChange={commitVoteChange}
            transactions={[]}
          />
        )}
      </Container>
    );
  })
  .add("Appeal Challenge: Reveal Vote", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <AppealChallengeRevealVoteCard
            endTime={endTime}
            phaseLength={phaseLength}
            salt={commitVoteState.salt}
            onInputChange={commitVoteChange}
            transactions={[]}
          />
        )}
      </Container>
    );
  })
  .add("Whitelisted", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <WhitelistedCard transactions={[]} />
        )}
      </Container>
    );
  })
  .add("Rejected", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <RejectedCard
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
          />
        )}
      </Container>
    );
  });
