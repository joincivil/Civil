import * as React from "react";
import styled from "styled-components";
import { HeroOuter, HeroInner } from "./styledComponents";

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
