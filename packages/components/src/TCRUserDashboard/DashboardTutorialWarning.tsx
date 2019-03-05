import * as React from "react";
import { StyledTutorialWarning, StyledWarningBox, StyledTutorialPrompt } from "./DashboardStyledComponents";
import { TransferTokenTutorialWarnText, TransferTokenTakeTutorialText } from "./DashboardTextComponents";
import { Button } from "../Button";

export const DashboardTutorialWarning: React.StatelessComponent = props => {
  return (
    <StyledTutorialWarning>
      <StyledWarningBox>
        <TransferTokenTutorialWarnText />
      </StyledWarningBox>
      <StyledTutorialPrompt>
        <TransferTokenTakeTutorialText />
        <Button to="/tokens">Start the Civil Tutorial</Button>
      </StyledTutorialPrompt>
    </StyledTutorialWarning>
  );
};
