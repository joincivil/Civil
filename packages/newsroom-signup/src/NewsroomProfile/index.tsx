import * as React from "react";
import styled from "styled-components";
import { colors, BorderlessButton, Button, buttonSizes } from "@joincivil/components";
import { CharterData } from "@joincivil/core";
import { NewsroomBio } from "./NewsroomBio";
import { AddRosterMember } from "./AddRosterMembers";
import { CharterQuestions } from "./CharterQuestions";
import { SignConstitution } from "./SignConstitution";
import { ApplicationSoFarPage } from "./ApplicationSoFarPage";

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
      currentStep: 4,
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
      <SignConstitution charter={this.props.charter} updateCharter={this.props.updateCharter} />,
      <ApplicationSoFarPage
        charter={{
          name: "adg",
          logoUrl: "https://brandmark.io/logo-rank/random/pepsi.png",
          newsroomUrl: "http://example.com",
          tagline:
            "ddafsgh ddafsgh ddafsgh ddaf ddafs ddafsgddafsgh ddafsgh ddafsghddafsgh ddafsgh ddafsgh ddafsgh ddafsgh ddafsgh ddafsgh",
          roster: [
            {
              name: "Walker Flynn",
              avatarUrl: "https://brandmark.io/logo-rank/random/pepsi.png",
              role: "Walker Flynn",
              socialUrls: {
                email: "walker.d.flynn@gmail.com",
              },
              ethAddress: "0x8c722B8AC728aDd7780a66017e8daDBa530EE261",
              bio: "adgsfhng",
            },
            {
              name: "Poop poo",
              role: "shitter",
              bio: "faldgas ",
            },
          ],
          mission: {
            purpose: "adsgfhg",
            structure: "aghsd",
            revenue: "dasgffgaerg",
            encumbrances: "adsghfgaf",
            miscellaneous: "asdgafdsg",
          },
          signatures: [
            {
              signature:
                "0x337fcdbbfebfd70ea38532e2d494e07c43f74dba104a050b8eb210b69cdec83e0586f56c6df9f0d06fd30543545295de0888a4ea46ec42687638559da2e91d5e1c",
              message:
                "By signing this message, I am agreeing on behalf of the Newsroom to abide by the Civil Community's ethical principles as described in the Civil Constitution.\n\nNewsrooom Name:\nadg\n\nConstitution Hash:\n0x3eaf99d3f9ad31d76d9c685655db55bf81211042841887d37c3643e12226b726",
              signer: "0x8c722b8ac728add7780a66017e8dadba530ee261",
            },
          ],
        }}
      />,
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
