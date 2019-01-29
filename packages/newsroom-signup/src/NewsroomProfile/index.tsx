import * as React from "react";
import styled from "styled-components";
import { colors, BorderlessButton, Button, buttonSizes } from "@joincivil/components";
import { CharterData } from "@joincivil/core";
import { NewsroomBio } from "./NewsroomBio";
import { AddRosterMember } from "./AddRosterMembers";
import { CharterQuestions } from "./CharterQuestions";

export interface NewsroomProfileState {
  currentStep: number;
}

export interface NewsroomProfileProps {
  charter: Partial<CharterData>;
  updateCharter(charter: Partial<CharterData>): void;
  goNext?(): void;
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding-top: 24px;
`;

export class NewsroomProfile extends React.Component<NewsroomProfileProps, NewsroomProfileState> {
  constructor(props: NewsroomProfileProps) {
    super(props);
    this.state = {
      currentStep: 0,
    };
  }
  public getDisabled(index: number): () => boolean {
    const functions = [
      () => {
        return !(
          this.props.charter &&
          this.props.charter.name &&
          this.props.charter.logoUrl &&
          this.props.charter.newsroomUrl &&
          this.props.charter.tagline
        );
      },
      () => {
        return !(this.props.charter && this.props.charter.roster && this.props.charter.roster.length);
      },
      () => {
        return true;
      },
    ];
    return functions[index];
  }
  public renderCurrentStep(): JSX.Element {
    const steps = [
      <NewsroomBio charter={this.props.charter} updateCharter={this.props.updateCharter} />,
      <AddRosterMember charter={this.props.charter} updateCharter={this.props.updateCharter} />,
      <CharterQuestions charter={this.props.charter} updateCharter={this.props.updateCharter} />,
    ];
    return steps[this.state.currentStep];
  }
  public goNext(): void {
    this.setState({ currentStep: this.state.currentStep + 1 });
  }
  public goBack(): void {
    this.setState({ currentStep: this.state.currentStep - 1 });
  }
  public render(): JSX.Element {
    console.log(this.getDisabled(this.state.currentStep)());
    return (
      <>
        {this.renderCurrentStep()}
        <ButtonContainer>
          {this.state.currentStep > 0 ? (
            <BorderlessButton size={buttonSizes.MEDIUM} onClick={() => this.goBack()}>
              Back
            </BorderlessButton>
          ) : (
            <div />
          )}
          <Button
            disabled={this.getDisabled(this.state.currentStep)()}
            textTransform="none"
            width={220}
            size={buttonSizes.MEDIUM}
            onClick={() => this.goNext()}
          >
            Next
          </Button>
        </ButtonContainer>
      </>
    );
  }
}
