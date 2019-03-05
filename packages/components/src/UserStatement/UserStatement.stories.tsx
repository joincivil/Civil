import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import styled from "styled-components";
import { SubmitChallengeStatement, SubmitChallengeStatementProps } from "./SubmitChallengeStatement";
import { RequestAppealStatement, RequestAppealStatementProps } from "./RequestAppealStatement";

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
  .addDecorator(StoryRouter())
  .add("Submit Challenge Statement", () => {
    const updateStatementValue = (name: string, value: any) => {
      console.log("update statement", name, value);
    };
    const props: SubmitChallengeStatementProps = {
      constitutionURI: "https://civil.co",
      governanceGuideURI: "https://civil.co",
      listingURI: "https://civil.co",
      newsroomName: "The Sleeper Reporters",
      minDeposit: "100,000 CVL",
      commitStageLen: "10 days",
      revealStageLen: "7 days",
      civil: undefined,
      transactions: [],
      updateStatementValue,
    };

    return <Container>{process.env.NODE_ENV !== "test" && <SubmitChallengeStatement {...props} />}</Container>;
  })
  .add("Submit Appeal Statement", () => {
    const updateStatementValue = (name: string, value: any) => {
      console.log("update statement", name, value);
    };
    const props: RequestAppealStatementProps = {
      constitutionURI: "https://civil.co",
      governanceGuideURI: "https://civil.co",
      listingURI: "https://civil.co",
      newsroomName: "The Sleeper Reporters",
      appealFee: "100,000 CVL",
      judgeAppealLen: "5 days",
      transactions: [],
      updateStatementValue,
    };

    return <Container>{process.env.NODE_ENV !== "test" && <RequestAppealStatement {...props} />}</Container>;
  });
