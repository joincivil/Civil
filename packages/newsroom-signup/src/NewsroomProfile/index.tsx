import * as React from "react";
import { NextBack } from "../styledComponents";
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
        const waitingOnGrant = this.props.grantRequested && typeof this.props.grantApproved !== "boolean";
        return waitingOnGrant || this.props.grantRequested === null;
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
    return steps[this.props.currentStep];
  }

  public renderButtons(): JSX.Element | null {
    // @TODO/toby Confirm that when grant is rejected, it comes through as explicit `false` and not null or undefined
    const waitingOnGrant = this.props.grantRequested && typeof this.props.grantApproved !== "boolean";
    if (!this.state.showButtons || waitingOnGrant) {
      return null;
    }
    return (
      <NextBack
        navigate={this.props.navigate}
        backHidden={this.props.currentStep === 0}
        nextDisabled={this.getDisabled(this.props.currentStep)}
      />
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
