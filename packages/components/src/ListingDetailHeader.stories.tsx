import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { ListingDetailHeader, ListingDetailHeaderProps } from "./ListingDetailHeader";

const StyledDiv = styled.div`
  display: flex;
  width: 100vh;
  height: 100vw;
  background-color: #fff;
`;

const Container: React.StatelessComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("Listing Details Header", module)
  .add("No phase label", () => {
    const props: ListingDetailHeaderProps = {
      newsroomName: "The Civil Times",
      newsroomDescription: "Civil is the decentralized marketplace for sustainable journalism.",
      owner: "0x0",
      unstakedDeposit: "100 CVL",
      isInApplication: false,
      inChallengeCommitVotePhase: false,
      inChallengeRevealPhase: false,
    };
    return (
      <Container>
        <ListingDetailHeader {...props} />
      </Container>
    );
  })
  .add("In Application", () => {
    const props: ListingDetailHeaderProps = {
      newsroomName: "The Civil Times",
      newsroomDescription: "Civil is the decentralized marketplace for sustainable journalism.",
      owner: "0x0",
      unstakedDeposit: "100 CVL",
      isInApplication: true,
      inChallengeCommitVotePhase: false,
      inChallengeRevealPhase: false,
    };
    return (
      <Container>
        <ListingDetailHeader {...props} />
      </Container>
    );
  })
  .add("Accepting Votes", () => {
    const props: ListingDetailHeaderProps = {
      newsroomName: "The Civil Times",
      newsroomDescription: "Civil is the decentralized marketplace for sustainable journalism.",
      owner: "0x0",
      unstakedDeposit: "100 CVL",
      isInApplication: false,
      inChallengeCommitVotePhase: true,
      inChallengeRevealPhase: false,
    };
    return (
      <Container>
        <ListingDetailHeader {...props} />
      </Container>
    );
  })
  .add("Revealing Votes", () => {
    const props: ListingDetailHeaderProps = {
      newsroomName: "The Civil Times",
      newsroomDescription: "Civil is the decentralized marketplace for sustainable journalism.",
      owner: "0x0",
      unstakedDeposit: "100 CVL",
      isInApplication: false,
      inChallengeCommitVotePhase: false,
      inChallengeRevealPhase: true,
    };
    return (
      <Container>
        <ListingDetailHeader {...props} />
      </Container>
    );
  });
