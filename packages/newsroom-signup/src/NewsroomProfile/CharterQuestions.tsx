import * as React from "react";
import { DispatchProp } from "react-redux";
import styled from "styled-components";
import { StepProps, TextareaInput } from "@joincivil/components";
import { CharterData } from "@joincivil/core";
import {
  FormSection,
  FormSubhead,
  SectionHeader,
  SectionDescription,
  StyledHr,
  StepSectionCounter,
} from "../styledComponents";
import { LearnMoreButton } from "./LearnMoreButton";
export interface CharterQuestionsProps extends StepProps {
  charter: Partial<CharterData>;
  updateCharter(charter: Partial<CharterData>): void;
}

const Textarea = styled(TextareaInput)`
  height: 140px;
`;

export class CharterQuestions extends React.Component<CharterQuestionsProps & DispatchProp<any>> {
  constructor(props: CharterQuestionsProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <>
        <SectionHeader>Now, add your team to the Newsroom Roster</SectionHeader>
        <SectionDescription>
          Your newsroom roster is a list of journalists who are part of your newsroom. This is part of your public
          Registry Profile.
        </SectionDescription>
        <LearnMoreButton />
        <StyledHr />
        <StepSectionCounter>Step 2 of 4: Roster</StepSectionCounter>

        <FormSection>
          <p>Suggested length for answers: 250 words or about 2 paragraphs.</p>

          <FormSubhead>Please describe your newsroom's mission or purpose.</FormSubhead>
          <Textarea
            name="purpose"
            value={(this.props.charter.mission && this.props.charter.mission.purpose) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>What is your newsroom's ownership structure? (e.g. non-profit, for-profit, co-op)</FormSubhead>
          <Textarea
            name="structure"
            value={(this.props.charter.mission && this.props.charter.mission.structure) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>
            What are your newsroom's current or planned revenue sources? (ex: membership, subscriptions, advertising,
            sponsored content, promoted links)
          </FormSubhead>
          <Textarea
            name="revenue"
            value={(this.props.charter.mission && this.props.charter.mission.revenue) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>
            Does anything get in the way of your ability to report independently? Are there any conflicts of interest
            that voters should be aware of?
          </FormSubhead>
          <Textarea
            name="encumbrances"
            value={(this.props.charter.mission && this.props.charter.mission.encumbrances) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>
            Is there anything else the Civil community should know about your Newsroom to support its inclusion on the
            Registry?
          </FormSubhead>
          <Textarea
            name="miscellaneous"
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
