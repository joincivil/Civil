import * as React from "react";
import { HomepageHeroProps } from "./HomepageHero";

export const HeroTitleText: React.FunctionComponent = props => <>The Civil Registry</>;

export const HeroCopyText: React.FunctionComponent<HomepageHeroProps> = props => (
  <>
    <p>A community-driven space for curating quality journalism.</p>
    <p>
      Use Civil tokens to apply, challenge and vote on which newsrooms can publish on the Civil platform.{" "}
      <a href={props.learnMoreURL} target="_blank">
        Learn how
      </a>.
    </p>
  </>
);

export const ExploreTCRText: React.FunctionComponent = props => <>Explore The Civil Registry</>;
