import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { StyledParameterizerContainer } from "./styledComponents";
import { CreateProposal } from "./CreateProposal";

const StyledDiv = styled.div`
  display: flex;
  width: 110pxpx;
`;

const Container: React.StatelessComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

const noop = () => {
  return;
};

storiesOf("Parameterizer", module).add("Create Proposal", () => {
  return (
    <Container>
      {process.env.NODE_ENV !== "test" && (
        <StyledParameterizerContainer>
          <CreateProposal
            pApplyLenText="14 days"
            parameterDisplayName="Application Deposit"
            parameterCurrentValue="100.00 CVL"
            parameterDisplayUnits="CVL"
            parameterProposalValue=""
            proposalDeposit="1,000 CVL"
            transactions={[]}
            handleClose={noop}
            handleUpdateProposalValue={(name: string, value: string) => console.log("Proposed Value is", value)}
          />
        </StyledParameterizerContainer>
      )}
    </Container>
  );
});
