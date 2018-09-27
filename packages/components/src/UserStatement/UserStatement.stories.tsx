import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { SubmitChallengeStatement, SubmitChallengeStatementProps } from "./SubmitChallengeStatement";
import { SubmitAppealStatement, SubmitAppealStatementProps } from "./SubmitAppealStatement";

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

storiesOf("User Statement Forms", module)
  .add("Submit Challenge Statement", () => {
    const updateStatementValue = (name: string, value: any) => {
      console.log("update statement", name, value);
    };
    const handleClose = () => {
      console.log("Closed the Submit Challenge modal");
    };
    const props: SubmitChallengeStatementProps = {
      constitutionURI: "https://civil.co",
      governanceGuideURI: "https://civil.co",
      backToURL: "https://civil.co",
      newsroomName: "The Sleeper Reporters",
      minDeposit: "100,000",
      commitStageLen: "10 days",
      revealStageLen: "7 days",
      transactions: [],
      updateStatementValue,
      handleClose,
    };

    return (
      <Container>
        {process.env.NODE_ENV !== "test" && <SubmitChallengeStatement {...props} />}
      </Container>
    );
  })
  .add("Submit Appeal Statement", () => {
    const updateStatementValue = (name: string, value: any) => {
      console.log("update statement", name, value);
    };
    const handleClose = () => {
      console.log("Closed the Submit Challenge modal");
    };
    const props: SubmitAppealStatementProps = {
      constitutionURI: "https://civil.co",
      governanceGuideURI: "https://civil.co",
      backToURL: "https://civil.co",
      newsroomName: "The Sleeper Reporters",
      appealFee: "100,000",
      judgeAppealLen: "5 days",
      transactions: [],
      updateStatementValue,
      handleClose,
    };

    return (
      <Container>
        {process.env.NODE_ENV !== "test" && <SubmitAppealStatement {...props} />}
      </Container>
    );
  });
