import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { fonts } from "../styleConstants";
import { ChallengeResults } from "./ChallengeResults";

const StyledDiv = styled.div`
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  width: 335px;
`;

const Container: React.FunctionComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

const totalVotes = "100000";
const votesFor = "73000";
const votesAgainst = "27000";
const percentFor = "73";
const percentAgainst = "27";
const didChallengeSucceed = false;

storiesOf("Registry", module).add("Challenge Results Chart", () => {
  return (
    <Container>
      <ChallengeResults
        totalVotes={totalVotes}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor}
        percentAgainst={percentAgainst}
        didChallengeSucceed={didChallengeSucceed}
      />
    </Container>
  );
});
