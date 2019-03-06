import * as React from "react";
import styled from "styled-components";
import { colors, BorderlessButton, Button, buttonSizes } from "@joincivil/components";
import { CharterData } from "@joincivil/core";
import { NewsroomBio } from "./NewsroomBio";
import { AddRosterMember } from "./AddRosterMembers";
import { CharterQuestions } from "./CharterQuestions";
import { SignConstitution } from "./SignConstitution";
import { ApplicationSoFarPage } from "./ApplicationSoFarPage";
import { GrantApplication } from "./GrantApplication";

const NUM_STEPS = 5;

export interface NewsroomProfileState {
  currentStep: number;
  showButtons: boolean;
}

export interface NewsroomProfileProps {
  charter: Partial<CharterData>;
  grantRequested?: boolean;
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
    let currentStep = 0;
    try {
      if (localStorage.newsroomOnBoardingNewsroomProfileStep) {
        currentStep = Number(localStorage.newsroomOnBoardingNewsroomProfileStep);
      }
    } catch (e) {
      console.error("Failed to load step index");
    }
    this.state = {
      currentStep,
      showButtons: true,
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
        return !(
          this.props.charter &&
          this.props.charter.mission &&
          this.props.charter.mission.encumbrances &&
          this.props.charter.mission.miscellaneous &&
          this.props.charter.mission.purpose &&
          this.props.charter.mission.revenue &&
          this.props.charter.mission.structure
        );
      },
      () => {
        return !(this.props.charter.signatures && this.props.charter.signatures.length);
      },
      () => {
        return false;
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
      <AddRosterMember
        charter={this.props.charter}
        updateCharter={this.props.updateCharter}
        setButtonVisibility={this.setButtonVisibility}
      />,
      <CharterQuestions charter={this.props.charter} updateCharter={this.props.updateCharter} />,
      <SignConstitution charter={this.props.charter} updateCharter={this.props.updateCharter} />,
      <ApplicationSoFarPage charter={this.props.charter} />,
      <GrantApplication />,
    ];
    return steps[this.state.currentStep];
  }
  public renderButtons(): JSX.Element | null {
    if (!this.state.showButtons || this.props.grantRequested) {
      return null;
    }
    return (
      <ButtonContainer>
        {this.state.currentStep > 0 ? (
          <BorderlessButton size={buttonSizes.MEDIUM} onClick={() => this.goBack()}>
            Back
          </BorderlessButton>
        ) : (
          <div />
        )}
        {this.state.currentStep < NUM_STEPS ? (
          <Button
            disabled={this.getDisabled(this.state.currentStep)()}
            textTransform="none"
            width={220}
            size={buttonSizes.MEDIUM}
            onClick={() => this.goNext()}
          >
            Next
          </Button>
        ) : (
          <div />
        )}
      </ButtonContainer>
    );
  }
  public goNext(): void {
    try {
      localStorage.newsroomOnBoardingNewsroomProfileStep = JSON.stringify(this.state.currentStep + 1);
    } catch (e) {
      console.error("Failed to save step index", e);
    }
    this.setState({ currentStep: this.state.currentStep + 1 });
  }
  public goBack(): void {
    try {
      localStorage.newsroomOnBoardingNewsroomProfileStep = JSON.stringify(this.state.currentStep - 1);
    } catch (e) {
      console.error("Failed to save step index", e);
    }
    this.setState({ currentStep: this.state.currentStep - 1 });
  }
  public render(): JSX.Element {
    return (
      <>
        {this.renderCurrentStep()}
        {this.renderButtons()}
      </>
    );
  }
  private setButtonVisibility = (visible: boolean) => {
    this.setState({ showButtons: visible });
  };
}
