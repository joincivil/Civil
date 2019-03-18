import * as React from "react";
import { BorderlessButton, Button, buttonSizes } from "@joincivil/components";
import { NextBackButtonContainer } from "../styledComponents";
import { CharterData } from "@joincivil/core";
import { NewsroomBio } from "./NewsroomBio";
import { AddRosterMember } from "./AddRosterMembers";
import { CharterQuestions } from "./CharterQuestions";
import { SignConstitution } from "./SignConstitution";
import { ApplicationSoFarPage } from "./ApplicationSoFarPage";
import { GrantApplication } from "./GrantApplication";

export interface NewsroomProfileState {
  showButtons: boolean;
}

export interface NewsroomProfileProps {
  currentStep: number;
  charter: Partial<CharterData>;
  grantRequested?: boolean;
  grantApproved?: boolean;
  updateCharter(charter: Partial<CharterData>): void;
  navigate(go: 1 | -1): void;
}

export class NewsroomProfile extends React.Component<NewsroomProfileProps, NewsroomProfileState> {
  constructor(props: NewsroomProfileProps) {
    super(props);
    this.state = {
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
        return !!this.props.grantRequested;
      },
    ];

    if (index >= functions.length) {
      // Dumb edge case because of how auto-skipping from grant step interacts with our nested step processes, we can briefly have too-high a step
      return () => {
        return false;
      };
    }

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
    return steps[this.props.currentStep];
  }

  public renderButtons(): JSX.Element | null {
    // @TODO/toby Confirm that when grant is rejected, it comes through as explicit `false` and not null or undefined
    const waitingOnGrant = this.props.grantRequested && typeof this.props.grantApproved !== "boolean";
    if (!this.state.showButtons || waitingOnGrant) {
      return null;
    }
    return (
      <NextBackButtonContainer>
        {this.props.currentStep > 0 ? (
          <BorderlessButton size={buttonSizes.MEDIUM_WIDE} onClick={() => this.props.navigate(-1)}>
            Back
          </BorderlessButton>
        ) : (
          <div />
        )}
        <Button
          disabled={this.getDisabled(this.props.currentStep)()}
          textTransform="none"
          width={220}
          size={buttonSizes.MEDIUM_WIDE}
          onClick={() => this.props.navigate(1)}
        >
          Next
        </Button>
      </NextBackButtonContainer>
    );
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
