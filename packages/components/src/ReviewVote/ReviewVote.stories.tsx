import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { ReviewVote, ReviewVoteProps } from "./ReviewVoteModal";

const StyledDiv = styled.div`
  display: flex;
  width: 600px;
`;

const Container: React.FunctionComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("Registry / Review Vote", module).add("Review Vote Modal", () => {
  const handleClose = () => {
    console.log("Closed the  modal");
  };
  const props: ReviewVoteProps = {
    newsroomName: "Taco Tuesdays",
    listingDetailURL: "https://civil.co/#taco-tuesdays",
    challengeID: "420",
    open: true,
    numTokens: "1000",
    voteOption: "1",
    salt: "9635457449074",
    userAccount: "0xa441d0e2b078f13e8c45e221b81f6aa103c48a45",
    commitEndDate: 1533916728,
    revealEndDate: 1533917128,
    transactions: [],
    votingContractFaqURL: "#voting-contract-faq",
    gasFaqURL: "#gas-faq",
    handleClose,
  };

  return (
    <Container>
      <p>Some good stuff was already on the page which is pretty exciting</p>
      {process.env.NODE_ENV !== "test" && <ReviewVote {...props} />}
    </Container>
  );
});
