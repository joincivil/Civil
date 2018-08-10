import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import StoryRouter from "storybook-react-router";
import { ReviewVote, ReviewVoteProps } from "./ReviewVote";

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

const tokenBalance = 10000;
let commitVoteState = {
  salt: "9635457449074",
  numTokens: tokenBalance.toString(),
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

storiesOf("Review Vote", module).add("Review Vote Modal", () => {
  const updateStatementValue = (value: any) => {
    console.log("update statement", value);
  };
  const updateStatementSummaryValue = (value: string) => {
    console.log("update summary", value);
  };
  const handleClose = () => {
    console.log("Closed the Submit Challenge modal");
  };
  const props: ReviewVoteProps = {
    open: true,
    numTokens: "1000",
    voteOption: 1,
    salt: "foo",
  };

  return (
    <Container>
      <p>Some good stuff was already on the page which is pretty exciting</p>
      {process.env.NODE_ENV !== "test" && <ReviewVote {...props} />}
    </Container>
  );
});
