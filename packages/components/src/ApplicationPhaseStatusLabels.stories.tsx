import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import {
  AwaitingApprovalStatusLabel,
  AwaitingAppealRequestLabel,
  AwaitingDecisionStatusLabel,
  AwaitingAppealChallengeStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
  ReadyToCompleteStatusLabel,
} from "./ApplicationPhaseStatusLabels";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

const Container: React.FunctionComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("Registry / Application Status Labels", module).add("Labels", () => {
  return (
    <Container>
      <AwaitingApprovalStatusLabel />
      <br />
      <AwaitingAppealRequestLabel />
      <br />
      <AwaitingDecisionStatusLabel />
      <br />
      <AwaitingAppealChallengeStatusLabel />
      <br />
      <CommitVoteStatusLabel />
      <br />
      <RevealVoteStatusLabel />
      <br />
      <ReadyToCompleteStatusLabel />
    </Container>
  );
});
