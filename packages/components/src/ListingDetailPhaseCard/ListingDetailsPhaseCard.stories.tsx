import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import StoryRouter from "storybook-react-router";
import {
  InApplicationCard,
  InApplicationResolveCard,
  ChallengeCommitVoteCard,
  ChallengeRevealVoteCard,
  ChallengeRequestAppealCard,
  ChallengeResolveCard,
  AppealAwaitingDecisionCard,
  AppealDecisionCard,
  AppealResolveCard,
  AppealChallengeCommitVoteCard,
  AppealChallengeRevealVoteCard,
  AppealChallengeResolveCard,
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
const secondaryPhaseLength = phaseLength * 2;

const challengeID = "420";
const challenger = "0x0";
const rewardPool = "1000000";
const stake = "100000";

const requester = "0x01";
const appealFeePaid = "10.00 CVL";

const appealChallengeID = "1420";

const totalVotes = "100000";
const votesFor = "73000";
const votesAgainst = "27000";
const percentFor = "73";
const percentAgainst = "27";
const didChallengeSucceed = false;

const tokenBalance = 10000;
let commitVoteState = {
  salt: "9635457449074",
  numTokens: (tokenBalance * 0.67).toString(),
  voteOption: undefined,
};

function commitVoteChange(data: any, callback?: () => any): void {
  commitVoteState = { ...commitVoteState, ...data };
  if (callback) {
    callback();
  }
}

const noop = () => {
  console.log("noop");
};

storiesOf("Listing Details Phase Card", module)
  .addDecorator(StoryRouter())
  .add("In Application", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <InApplicationCard endTime={endTime} phaseLength={phaseLength} transactions={[]} faqURL="#faq" />
        )}
      </Container>
    );
  })
  .add("Resolve Application", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && <InApplicationResolveCard transactions={[]} faqURL="#faq" />}
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
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            tokenBalance={tokenBalance}
            votingTokenBalance={tokenBalance}
            tokenBalanceDisplay={`${tokenBalance} CVL`}
            votingTokenBalanceDisplay={`${tokenBalance} CVL`}
            salt={commitVoteState.salt}
            numTokens={commitVoteState.numTokens}
            onInputChange={commitVoteChange}
            onCommitMaxTokens={noop}
            onReviewVote={noop}
            transactions={[]}
            faqURL="#faq"
          />
        )}
      </Container>
    );
  })
  .add("Under Challenge: Reveal Vote - User Did Not Commit", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <ChallengeRevealVoteCard
            endTime={endTime}
            phaseLength={phaseLength}
            secondaryPhaseLength={secondaryPhaseLength}
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            voteOption={commitVoteState.voteOption}
            salt={commitVoteState.salt}
            onInputChange={commitVoteChange}
            transactions={[]}
            userHasCommittedVote={false}
            votingSmartContractFaqURL="#voting-smart-contract-faq"
            faqURL="#faq"
          />
        )}
      </Container>
    );
  })
  .add("Under Challenge: Reveal Vote - User Already Revealed", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <ChallengeRevealVoteCard
            endTime={endTime}
            phaseLength={phaseLength}
            secondaryPhaseLength={secondaryPhaseLength}
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            voteOption={commitVoteState.voteOption}
            salt={commitVoteState.salt}
            onInputChange={commitVoteChange}
            transactions={[]}
            userHasCommittedVote={true}
            userHasRevealedVote={true}
            votingSmartContractFaqURL="#voting-smart-contract-faq"
            faqURL="#faq"
          />
        )}
      </Container>
    );
  })
  .add("Under Challenge: Reveal Vote - User committed and has not revealed", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <ChallengeRevealVoteCard
            endTime={endTime}
            phaseLength={phaseLength}
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            voteOption={commitVoteState.voteOption}
            salt={commitVoteState.salt}
            onInputChange={commitVoteChange}
            transactions={[]}
            userHasCommittedVote={true}
            votingSmartContractFaqURL="#voting-smart-contract-faq"
            faqURL="#faq"
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
            challengeID={challengeID}
            endTime={endTime}
            phaseLength={phaseLength}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
            didChallengeSucceed={didChallengeSucceed}
            transactions={[]}
            faqURL="#faq"
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
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
            didChallengeSucceed={didChallengeSucceed}
            transactions={[]}
            faqURL="#faq"
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
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            requester={requester}
            appealFeePaid={appealFeePaid}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
            didChallengeSucceed={didChallengeSucceed}
            faqURL="#faq"
          />
        )}
      </Container>
    );
  })
  .add("Under Appeal: Awaiting Appeal Decision, Civil Council Multisig", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <AppealAwaitingDecisionCard
            endTime={endTime}
            phaseLength={phaseLength}
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            requester={requester}
            appealFeePaid={appealFeePaid}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
            didChallengeSucceed={didChallengeSucceed}
            transactions={[]}
            faqURL="#faq"
          />
        )}
      </Container>
    );
  })
  .add("Under Appeal: Decision / Can Challenge", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <AppealDecisionCard
            endTime={endTime}
            phaseLength={phaseLength}
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
            appealGranted={true}
            didChallengeSucceed={didChallengeSucceed}
            transactions={[]}
            faqURL="#faq"
          />
        )}
      </Container>
    );
  })
  .add("Under Appeal: Resolve", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <AppealResolveCard
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            appealGranted={true}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
            didChallengeSucceed={didChallengeSucceed}
            transactions={[]}
            faqURL="#faq"
          />
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
            secondaryPhaseLength={secondaryPhaseLength}
            tokenBalance={tokenBalance}
            votingTokenBalance={tokenBalance}
            tokenBalanceDisplay={`${tokenBalance} CVL`}
            votingTokenBalanceDisplay={`${tokenBalance} CVL`}
            salt={commitVoteState.salt}
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            numTokens={commitVoteState.numTokens}
            onCommitMaxTokens={noop}
            onInputChange={commitVoteChange}
            transactions={[]}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
            appealChallengeID={appealChallengeID}
            appealGranted={true}
            didChallengeSucceed={didChallengeSucceed}
            onReviewVote={noop}
            faqURL="#faq"
          />
        )}
      </Container>
    );
  })
  .add("Appeal Challenge: Reveal Vote - User Did Not Commit", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <AppealChallengeRevealVoteCard
            endTime={endTime}
            phaseLength={phaseLength}
            secondaryPhaseLength={secondaryPhaseLength}
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            voteOption={commitVoteState.voteOption}
            salt={commitVoteState.salt}
            onInputChange={commitVoteChange}
            transactions={[]}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            didChallengeSucceed={didChallengeSucceed}
            percentAgainst={percentAgainst}
            appealChallengeID={appealChallengeID}
            appealGranted={true}
            votingSmartContractFaqURL="#voting-smart-contract-faq"
            faqURL="#faq"
          />
        )}
      </Container>
    );
  })
  .add("Appeal Challenge: Reveal Vote - User Already Revealed", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <AppealChallengeRevealVoteCard
            endTime={endTime}
            phaseLength={phaseLength}
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            voteOption={commitVoteState.voteOption}
            salt={commitVoteState.salt}
            onInputChange={commitVoteChange}
            transactions={[]}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
            didChallengeSucceed={didChallengeSucceed}
            appealChallengeID={appealChallengeID}
            appealGranted={true}
            userHasCommittedVote={true}
            userHasRevealedVote={true}
            votingSmartContractFaqURL="#voting-smart-contract-faq"
            faqURL="#faq"
          />
        )}
      </Container>
    );
  })
  .add("Appeal Challenge: Reveal Vote - User committed and has not revealed", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <AppealChallengeRevealVoteCard
            endTime={endTime}
            phaseLength={phaseLength}
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            voteOption={commitVoteState.voteOption}
            salt={commitVoteState.salt}
            onInputChange={commitVoteChange}
            transactions={[]}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
            didChallengeSucceed={didChallengeSucceed}
            appealChallengeID={appealChallengeID}
            appealGranted={true}
            userHasCommittedVote={true}
            userHasRevealedVote={false}
            votingSmartContractFaqURL="#voting-smart-contract-faq"
            faqURL="#faq"
          />
        )}
      </Container>
    );
  })
  .add("Appeal Challenge: Resolve", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <AppealChallengeResolveCard
            appealGranted={true}
            challengeID={challengeID}
            challenger={challenger}
            rewardPool={rewardPool}
            stake={stake}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
            didChallengeSucceed={didChallengeSucceed}
            appealChallengeTotalVotes={totalVotes}
            appealChallengeVotesFor={votesFor}
            appealChallengeVotesAgainst={votesAgainst}
            appealChallengePercentFor={percentFor}
            appealChallengePercentAgainst={percentAgainst}
            transactions={[]}
            appealChallengeID={appealChallengeID}
            didAppealChallengeSucceed={didChallengeSucceed}
            faqURL="#faq"
          />
        )}
      </Container>
    );
  })
  .add("Whitelisted", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <WhitelistedCard whitelistedTimestamp={now} transactions={[]} faqURL="#faq" />
        )}
      </Container>
    );
  })
  .add("Rejected", () => {
    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <RejectedCard
            listingRemovedTimestamp={now}
            totalVotes={totalVotes}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
            didChallengeSucceed={didChallengeSucceed}
            faqURL="#faq"
          />
        )}
      </Container>
    );
  });
