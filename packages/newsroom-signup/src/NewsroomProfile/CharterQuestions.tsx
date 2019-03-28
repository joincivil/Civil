import * as React from "react";
import styled from "styled-components";
import { StepProps, TextareaInput, OBSectionHeader, OBSectionDescription } from "@joincivil/components";
import { CharterData } from "@joincivil/core";
import { FormSection, FormSubhead, StyledHr, StepSectionCounter } from "../styledComponents";
import { LearnMoreButton } from "./LearnMoreButton";
import { charterQuestions, questionsCopy } from "../constants";

export interface CharterQuestionsProps extends StepProps {
  charter: Partial<CharterData>;
  updateCharter(charter: Partial<CharterData>): void;
}

const Textarea = styled(TextareaInput)`
  height: 140px;
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
          Your Charter is an outline of your Newsroom's journalistic mission and purpose.
        </OBSectionDescription>
        <LearnMoreButton />
        <StyledHr />
        <StepSectionCounter>Step 3 of 4: Charter</StepSectionCounter>

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
