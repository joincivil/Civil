import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled from "styled-components";
import { StepHeader, StepProps, StepDescription, TextareaInput } from "@joincivil/components";
import { CharterData } from "@joincivil/core";
import { FormSection, FormTitle, FormSubhead } from "./styledComponents";
import { StateWithNewsroom } from "./reducers";

export interface CreateCharterPartTwoProps extends StepProps {
  charter: Partial<CharterData>;
  updateCharter(charter: Partial<CharterData>): void;
}

const Textarea = styled(TextareaInput)`
  height: 140px;
`;

class CreateCharterPartTwoComponent extends React.Component<CreateCharterPartTwoProps & DispatchProp<any>> {
  constructor(props: CreateCharterPartTwoProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <>
        <StepHeader>Write your charter</StepHeader>
        <StepDescription>
          Civil’s Registry is based on transparency and trust, so we ask newsrooms to be as open and clear as possible
          in answering the following questions. The aim is to ensure the Civil community is able to make an informed
          decision about new applicants and uphold the highest standards of journalism. We ask that any newsroom
          applying to the registry provide the information below to the best of their ability.
        </StepDescription>
        <StepDescription>
          {/*TODO: link "Civil Registry" to registry once it's launch*/}
          This information will also be included on your smart contract and shown on your listing page in the Civil
          Registry.{" "}
          <strong>
            Note that the information you provide will be public on the platform and used by the Civil community as the
            basis for accepting or rejecting your newsroom. We recommend reviewing the{" "}
            <a href="https://civil.co/constitution/" target="blank">
              Constitution
            </a>{" "}
            closely to familiarize yourself with Civil’s code of ethics before filling it out.
          </strong>{" "}
          You can change or amend this charter at any time.
        </StepDescription>

        <FormSection>
          <FormTitle>Identify your newsroom's journalistic mission.</FormTitle>

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

const mapStateToProps = (state: StateWithNewsroom, ownProps: CreateCharterPartTwoProps): CreateCharterPartTwoProps => {
  return {
    ...ownProps,
  };
};

export const CreateCharterPartTwo = connect(mapStateToProps)(CreateCharterPartTwoComponent);
