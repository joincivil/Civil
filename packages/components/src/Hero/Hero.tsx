import * as React from "react";
import { HeroOuter, HeroInner } from "./HeroStyledComponents";

export interface HeroProps {
  backgroundImage?: string;
}

export class Hero extends React.Component<HeroProps> {
  public render(): JSX.Element {
    return (
      <HeroOuter backgroundImage={this.props.backgroundImage}>
        <HeroInner>{this.props.children}</HeroInner>
      </HeroOuter>
    );
  }
}
