import * as React from "react";
import {
  StyledUserStatementHeader,
  StatementHeaderHeading,
  StatementHeaderNewsroomName,
} from "./styledComponents";

export interface SubmitChallengeStatementProps {
  constitutionURI: string;
  minDeposit: string;
  dispensationPct: string;
  transactions: any[];
  modalContentComponents?: { [index: string]: JSX.Element };
  updateStatementValue(value: any): void;
  updateStatementSummaryValue(value: string): void;
  handleClose?(): void;
  postExecuteTransactions?(): void;
}

const SubmitChallengeStatement: React.SFC<SubmitChallengeStatementProps> = props => {
  return (
    <>
      <StyledUserStatementHeader>
        <StatementHeaderHeading>Challenge Newsroom</StatementHeaderHeading>
        <StatementHeaderNewsroomName>Challenge Newsroom</StatementHeaderNewsroomName>
      </StyledUserStatementHeader>
    </>
  );
};
