import * as React from "react";
import { WelcomeSlide, WelcomeSlideBtns } from "./TokenTutorialStyledComponents";
import { WelcomeScreenContent } from "./WelcomeScreenContent";

export const TutorialWelcomeScreens: React.StatelessComponent = props => {
  return (
    <>
      {WelcomeScreenContent.map(slide => (
        <WelcomeSlide>
          {slide.icon}
          <h2>{slide.title}</h2>
          <p>{slide.description}</p>
          <WelcomeSlideBtns>{slide.btn}</WelcomeSlideBtns>
        </WelcomeSlide>
      ))}
    </>
  );
};
