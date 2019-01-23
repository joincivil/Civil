import * as React from "react";
import { TutorialWelcomeScreens } from "./TutorialWelcomeScreens";
import { TutorialContainer } from "./TokenTutorialStyledComponents";

export const TokenTutorial: React.StatelessComponent = props => {
  return (
    <TutorialContainer>
      <TutorialWelcomeScreens />
    </TutorialContainer>
  );
};
