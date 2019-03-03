import * as React from "react";
import { StyledWarningBox, StyledTutorialPrompt } from "./DashboardStyledComponents";
import { TransferTokenTutorialWarnText, TransferTokenTakeTutorialText } from "./DashboardTextComponents";
import { Button } from "../Button";

export const DashboardTutorialWarning: React.StatelessComponent = props => {
  return (
    <>
      <StyledWarningBox>
        <TransferTokenTutorialWarnText />
      </StyledWarningBox>
      <StyledTutorialPrompt>
        <TransferTokenTakeTutorialText />
        <Button to="/tokens">Start the Civil Tutorial</Button>
      </StyledTutorialPrompt>
    </>
  );
};
