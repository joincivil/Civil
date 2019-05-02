import * as React from "react";
import styled from "styled-components";
import { StepProps, TextareaInput, OBSectionHeader, OBSectionDescription, colors } from "@joincivil/components";
import { CharterData } from "@joincivil/core";
import { FormSection, FormSubhead, StyledHr, StepSectionCounter } from "../styledComponents";
import { LearnMoreButton } from "./LearnMoreButton";
import { charterQuestions, questionsCopy } from "../constants";
import { urlConstants } from "@joincivil/utils";

export interface CharterQuestionsProps extends StepProps {
  charter: Partial<CharterData>;
  updateCharter(charter: Partial<CharterData>): void;
}

const Textarea = styled(TextareaInput)`
  height: 140px;
`;

const MoreQuestionsBox = styled.div`
  padding: 15px 25px;
  font-size: 13px;
  text-align: center;
  color: ${colors.primary.CIVIL_GRAY_2};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin-bottom: 30px;
  margin-top: 20px;
`;

export class CharterQuestions extends React.Component<CharterQuestionsProps> {
  constructor(props: CharterQuestionsProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <>
        <OBSectionHeader>Let’s write your Newsroom Charter</OBSectionHeader>
        <OBSectionDescription>
          Your Charter is an outline of your Newsroom's journalistic mission and purpose. It helps the Civil community
          discover and learn more about your newsroom. It's one of the first things the community views about your
          organization.
        </OBSectionDescription>
        <LearnMoreButton />
        <StyledHr />
        <StepSectionCounter>Step 3 of 4: Charter</StepSectionCounter>
        <MoreQuestionsBox>
          Have any questions?{" "}
          <a target="_blank" href={urlConstants.FAQ_CHARTER_BEST_PRACTICES}>
            Read the Civil Foundation's best practices on creating great charters.
          </a>
          <br />
          You can also view{" "}
          <a target="_blank" href={urlConstants.FAQ_CHARTER_EXAMPLE}>
            a sample charter.
          </a>
        </MoreQuestionsBox>
        <FormSection>
          <FormSubhead>{questionsCopy[charterQuestions.PURPOSE]}</FormSubhead>
          <Textarea
            name={charterQuestions.PURPOSE}
            value={(this.props.charter.mission && this.props.charter.mission.purpose) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>{questionsCopy[charterQuestions.STRUCTURE]}</FormSubhead>
          <Textarea
            name={charterQuestions.STRUCTURE}
            value={(this.props.charter.mission && this.props.charter.mission.structure) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>{questionsCopy[charterQuestions.REVENUE]}</FormSubhead>
          <Textarea
            name={charterQuestions.REVENUE}
            value={(this.props.charter.mission && this.props.charter.mission.revenue) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>{questionsCopy[charterQuestions.ENCUMBRANCES]}</FormSubhead>
          <Textarea
            name={charterQuestions.ENCUMBRANCES}
            value={(this.props.charter.mission && this.props.charter.mission.encumbrances) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>{questionsCopy[charterQuestions.MISCELLANEOUS]}</FormSubhead>
          <Textarea
            name={charterQuestions.MISCELLANEOUS}
            value={(this.props.charter.mission && this.props.charter.mission.miscellaneous) || ""}
            onChange={this.missionInputChange}
          />
        </FormSection>
      </>
    );
  }

  private missionInputChange = (name: string, val: string) => {
    this.props.updateCharter({
      ...this.props.charter,
      mission: {
        ...this.props.charter.mission,
        [name]: val,
      } as any, // "as any" required because Partial<T> doesn't recurse to optional mission values inside CharterData
    });
  };
}
