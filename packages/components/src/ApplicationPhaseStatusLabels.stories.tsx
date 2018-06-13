import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import {
  AwaitingApprovalStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
  RequestingAppealStatusLabel,
} from "./ApplicationPhaseStatusLabels";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

const Container: React.StatelessComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("Application Status Labels", module).add("Labels", () => {
  return (
    <Container>
      <AwaitingApprovalStatusLabel />
      <br />
      <CommitVoteStatusLabel />
      <br />
      <RevealVoteStatusLabel />
      <br />
      <RequestingAppealStatusLabel />
      <br />
    </Container>
  );
});
