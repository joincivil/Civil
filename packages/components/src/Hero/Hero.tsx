import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";

export interface HeroProps {
  backgroundImage?: string;
}

const HeroOuter = styled.div`
  background-color: ${colors.primary.BLACK};
  background-image: ${(props: HeroProps) => (props.backgroundImage ? "url(" + props.backgroundImage + ")" : "none")};
  background-repeat: no-repeat;
  background-size: cover;
  padding: 70px 15px;
`;

const HeroInner = styled.div`
  align-items: center;
  color: ${colors.basic.WHITE};
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 850px;
  text-align: center;
  width: 100%;
`;

export class Hero extends React.Component<HeroProps> {
  public render(): JSX.Element {
    return (
      <HeroOuter backgroundImage={this.props.backgroundImage}>
        <HeroInner>{this.props.children}</HeroInner>
      </HeroOuter>
    );
  }
}
