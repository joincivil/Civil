import * as React from "react";
import { StyledListingDetailPhaseCardSection, CTACopy, FormCopy } from "./styledComponents";
import { buttonSizes, Button } from "../Button";

export interface AppealDecisionDetailProps {
  appealGranted: boolean;
}

export const AppealDecisionDetail: React.SFC<AppealDecisionDetailProps> = props => {
  const decisionText = props.appealGranted ? "grant" : "dismiss";
  return (
    <StyledListingDetailPhaseCardSection>
      <CTACopy>Civil Council Decision</CTACopy>
      <FormCopy>
        The Civil Council has decided to {decisionText} the appeal. Read more about their methodology and how they’ve
        come to this decision.
      </FormCopy>
      <Button size={buttonSizes.MEDIUM}>Read about this decision</Button>
    </StyledListingDetailPhaseCardSection>
  );
};
