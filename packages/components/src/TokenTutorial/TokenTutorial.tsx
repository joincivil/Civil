import * as React from "react";
import { TutorialWelcomeScreens } from "./TutorialWelcomeScreens";
import { TokenTutorialLanding } from "./TokenTutorialLanding";

export const TokenTutorial: React.StatelessComponent = props => {
  return (
    <>
      <TutorialWelcomeScreens />
      <TokenTutorialLanding />
    </>
  );
};
