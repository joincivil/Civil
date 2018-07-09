import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { SubmitChallengeModal, SubmitChallengeModalProps } from "./SubmitChallengeModal";

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

storiesOf("Submit Challenge Modal", module).add("Submit Challenge Modal", () => {
  const updateStatementValue = (value: any) => {
    console.log(value);
  };
  const handleClose = () => {
    console.log("Closed the Submit Challenge modal");
  };
  const props: SubmitChallengeModalProps = {
    open: true,
    constitutionURI: "https://civil.co",
    minDeposit: "100,000",
    dispensationPct: "50%",
    transactions: [],
    updateStatementValue,
    handleClose,
  };

  return (
    <Container>
      <p>Some good stuff was already on the page which is pretty exciting</p>
      {process.env.NODE_ENV !== "test" && <SubmitChallengeModal {...props} />}
    </Container>
  );
});
