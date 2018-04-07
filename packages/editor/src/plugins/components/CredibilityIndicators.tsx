import * as React from "react";
// tslint:disable-next-line
import styled, { StyledComponentClass } from "styled-components";
import { colorConstants } from "../../colorConstants";
import { Indicator } from "./Indicator";
import { SubjectSpecialist } from "./svg/SubjectSpecialist";
import { OriginalReporting } from "./svg/OriginalReporting";
import { OnTheGround } from "./svg/OnTheGround";
import { SourcesSited } from "./svg/SourcesSited";

export interface EnumInterface {
  [key: string]: string;
}

export enum CredibilityIndicator {
  FIRSTHAND_REPORTING = "FIRSTHAND_REPORTING",
  ON_THE_GROUND = "ON_THE_GROUND",
  SOURCES_CITED = "SOURCES_CITED",
  SUBJECT_SPECIALIST = "SUBJECT_SPECIALIST",
}

export interface CredibilityIndicatorCopy {
  [key: string]: {
    title: string;
    description: string;
    icon: JSX.Element;
  };
}

const credibilityIndicatorCopy: CredibilityIndicatorCopy = {
  [CredibilityIndicator.FIRSTHAND_REPORTING]: {
    title: "Original Reporting",
    description: `Lorem ipsum dolor sit amet, consectetur
     adipiscing elit. Donec fermentum at nunc vitae egestas.
     Vivamus magna nunc, semper id lectus nec, egestas pharetra est.
     Fusce eu ultrices lacus. Sed ac finibus dolor. Pellentesque nibh
     est, ullamcorper non odio id, eleifend malesuada purus.
     Integer non ex turpis. Integer euismod lectus in feugiat tincidunt.
     Suspendisse laoreet ut ipsum in feugiat. Mauris consequat
     purus molestie, egestas risus at, porta odio. Mauris eget
     faucibus lorem. Vestibulum id elit elementum, pulvinar turpis nec,
     scelerisque odio. Fusce nec ornare urna. Fusce a eros iaculis,
     imperdiet nisi sodales, ultrices ex. Donec pulvinar arcu
     ac enim mattis, vel feugiat enim sagittis. Nulla et nunc
     a tortor lacinia facilisis.`,
    icon: <OriginalReporting color={colorConstants.BLACK} />,
  },
  [CredibilityIndicator.ON_THE_GROUND]: {
    title: "On The Ground",
    description: `Lorem ipsum dolor sit amet, consectetur
     adipiscing elit. Donec fermentum at nunc vitae egestas.
     Vivamus magna nunc, semper id lectus nec, egestas pharetra est.
     Fusce eu ultrices lacus. Sed ac finibus dolor. Pellentesque nibh
     est, ullamcorper non odio id, eleifend malesuada purus.
     Integer non ex turpis. Integer euismod lectus in feugiat tincidunt.
     Suspendisse laoreet ut ipsum in feugiat. Mauris consequat
     purus molestie, egestas risus at, porta odio. Mauris eget
     faucibus lorem. Vestibulum id elit elementum, pulvinar turpis nec,
     scelerisque odio. Fusce nec ornare urna. Fusce a eros iaculis,
     imperdiet nisi sodales, ultrices ex. Donec pulvinar arcu
     ac enim mattis, vel feugiat enim sagittis. Nulla et nunc
     a tortor lacinia facilisis.`,
    icon: <OnTheGround color={colorConstants.BLACK} />,
  },
  [CredibilityIndicator.SOURCES_CITED]: {
    title: "Sources Cited",
    description: `Lorem ipsum dolor sit amet, consectetur
     adipiscing elit. Donec fermentum at nunc vitae egestas.
     Vivamus magna nunc, semper id lectus nec, egestas pharetra est.
     Fusce eu ultrices lacus. Sed ac finibus dolor. Pellentesque nibh
     est, ullamcorper non odio id, eleifend malesuada purus.
     Integer non ex turpis. Integer euismod lectus in feugiat tincidunt.
     Suspendisse laoreet ut ipsum in feugiat. Mauris consequat
     purus molestie, egestas risus at, porta odio. Mauris eget
     faucibus lorem. Vestibulum id elit elementum, pulvinar turpis nec,
     scelerisque odio. Fusce nec ornare urna. Fusce a eros iaculis,
     imperdiet nisi sodales, ultrices ex. Donec pulvinar arcu
     ac enim mattis, vel feugiat enim sagittis. Nulla et nunc
     a tortor lacinia facilisis.`,
    icon: <SourcesSited color={colorConstants.BLACK} />,
  },
  [CredibilityIndicator.SUBJECT_SPECIALIST]: {
    title: "Subject Specialist",
    description: `Lorem ipsum dolor sit amet, consectetur
     adipiscing elit. Donec fermentum at nunc vitae egestas.
     Vivamus magna nunc, semper id lectus nec, egestas pharetra est.
     Fusce eu ultrices lacus. Sed ac finibus dolor. Pellentesque nibh
     est, ullamcorper non odio id, eleifend malesuada purus.
     Integer non ex turpis. Integer euismod lectus in feugiat tincidunt.
     Suspendisse laoreet ut ipsum in feugiat. Mauris consequat
     purus molestie, egestas risus at, porta odio. Mauris eget
     faucibus lorem. Vestibulum id elit elementum, pulvinar turpis nec,
     scelerisque odio. Fusce nec ornare urna. Fusce a eros iaculis,
     imperdiet nisi sodales, ultrices ex. Donec pulvinar arcu
     ac enim mattis, vel feugiat enim sagittis. Nulla et nunc
     a tortor lacinia facilisis.`,
    icon: <SubjectSpecialist color={colorConstants.BLACK} />,
  },
};

export const SectionWrapper = styled.div`
  width: 185px;
`;

export const SectionHeadline = styled.h4`
  font-family: "Libre Franklin", sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: ${colorConstants.BLACK}
  margin: 5px 0;
`;

export const SectionP = styled.p`
  font-family: "Libre Franklin", sans-serif;
  color: ${colorConstants.BLACK};
  margin: 0;
  margin-bottom: 12px;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
`;

export const Underline = styled.div`
  border-bottom: 4px solid ${colorConstants.BLACK};
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export interface CredibilityIndicatorsProps {
  readOnly: boolean;
  value: any;
  onChange: any;
}

export interface CredibilityIndicatorsState {
  indicators: string[];
}

export class CredibilityIndicators extends React.Component<CredibilityIndicatorsProps, CredibilityIndicatorsState> {
  constructor(props: CredibilityIndicatorsProps) {
    super(props);
    this.state = {
      indicators: this.props.value.document.data.get("credibilityIndicators") || [],
    };
  }
  public addOrRemoveIndicators(str: string): void {
    let indicators = null;
    const index = this.state.indicators.indexOf(str);
    if (index >= 0) {
      this.state.indicators.splice(index, 1);
      indicators = this.state.indicators;
    } else {
      indicators = this.state.indicators.concat([str]);
    }

    const change = this.props.value.change().setNodeByKey(this.props.value.document.key, {
      data: this.props.value.document.data.merge({
        credibilityIndicators: indicators,
      }),
    });
    this.props.onChange(change);
    this.setState({
      indicators,
    });
  }
  public render(): JSX.Element | null {
    if (this.props.readOnly) {
      if (!this.state.indicators || !this.state.indicators.length) {
        return null;
      } else {
        return (
          <SectionWrapper>
            <Underline>
              <SectionHeadline>Credibility Indicators</SectionHeadline>
              <SectionP>These are selected by the writer and confirmed by the editor.</SectionP>
            </Underline>
            <List>
              {this.state.indicators.map((item: string): JSX.Element => {
                return <Indicator key={item} {...credibilityIndicatorCopy[item]} readOnly={this.props.readOnly} />;
              })}
            </List>
          </SectionWrapper>
        );
      }
    } else {
      return (
        <SectionWrapper>
          <Underline>
            <SectionHeadline>Credibility Indicators</SectionHeadline>
            <SectionP>Choose the credibility indicators associated with this content.</SectionP>
          </Underline>
          <List>
            {Object.keys(CredibilityIndicator).map((item: string) => {
              return (
                <Indicator
                  key={item}
                  readOnly={this.props.readOnly}
                  checked={this.state.indicators.includes(item)}
                  addOrRemove={this.addOrRemoveIndicators.bind(this, item)}
                  {...credibilityIndicatorCopy[item]}
                />
              );
            })}
          </List>
        </SectionWrapper>
      );
    }
  }
}
