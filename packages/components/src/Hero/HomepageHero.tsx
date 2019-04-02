import * as React from "react";
import { buttonSizes } from "../Button";
import { ExpandDownArrow } from "../icons";
import {
  StyledHeroHeading,
  StyledHeroCopy,
  StyledExplore,
  StyledButtonContainer,
  CTAButton,
} from "./HeroStyledComponents";
import { HeroTitleText, HeroCopyText, ExploreTCRText } from "./HeroTextComponents";

export interface HomepageHeroProps {
  buyCvlUrl: string;
  applyURL: string;
  learnMoreURL: string;
}

export const HomepageHero: React.FunctionComponent<HomepageHeroProps> = props => {
  const { buyCvlUrl, applyURL } = props;

  let buyBtnProps: any = { href: buyCvlUrl };
  if (buyCvlUrl.charAt(0) === "/") {
    buyBtnProps = { to: buyCvlUrl };
  }
  let applyBtnProps: any = { href: applyURL };
  if (applyURL.charAt(0) === "/") {
    applyBtnProps = { to: applyURL };
  }
  return (
    <>
      <StyledHeroHeading>
        <HeroTitleText />
      </StyledHeroHeading>

      <StyledHeroCopy>
        <HeroCopyText {...props} />
      </StyledHeroCopy>

      <StyledButtonContainer>
        <CTAButton size={buttonSizes.SMALL} {...buyBtnProps}>
          Join as a member
        </CTAButton>

        <CTAButton size={buttonSizes.SMALL} {...applyBtnProps}>
          Join as a newsroom
        </CTAButton>
      </StyledButtonContainer>

      <StyledExplore>
        <ExploreTCRText />
        <div>
          <ExpandDownArrow width={18} height={10} />
        </div>
      </StyledExplore>
    </>
  );
};
