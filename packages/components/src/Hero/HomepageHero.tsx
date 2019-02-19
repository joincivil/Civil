import * as React from "react";
import { Button, buttonSizes } from "../Button";
import { ExpandDownArrow } from "../icons";
import { StyledHeroHeading, StyledHeroCopy, StyledExplore } from "./HeroStyledComponents";
import { HeroTitleText, HeroCopyText, ExploreTCRText } from "./HeroTextComponents";

export interface HomepageHeroProps {
  ctaButtonURL: string;
  learnMoreURL: string;
}

export const HomepageHero: React.SFC<HomepageHeroProps> = props => {
  return (
    <>
      <StyledHeroHeading>
        <HeroTitleText />
      </StyledHeroHeading>

      <StyledHeroCopy>
        <HeroCopyText {...props} />
      </StyledHeroCopy>

      <Button to={props.ctaButtonURL} size={buttonSizes.SMALL}>
        Get CVL
      </Button>

      <StyledExplore>
        <ExploreTCRText />
        <div>
          <ExpandDownArrow width={18} height={10} />
        </div>
      </StyledExplore>
    </>
  );
};
