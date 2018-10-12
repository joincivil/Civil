import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled from "styled-components";
import { StepHeader, StepProps, StepDescription, TextareaInput } from "@joincivil/components";
import { EthAddress, CharterData } from "@joincivil/core";
import { FormSection, FormTitle, FormSubhead } from "./styledComponents";
import { StateWithNewsroom } from "./reducers";
import { updateCharter } from "./actionCreators";

export interface CreateCharterPartTwoProps extends StepProps {
  charter: Partial<CharterData>;
  updateCharter(charter: Partial<CharterData>): void;
}

const Textarea = styled(TextareaInput)`
  height: 140px;
`;

class CreateCharterPartTwoComponent extends React.Component<
  CreateCharterPartTwoProps & DispatchProp<any>
> {
  constructor(props: CreateCharterPartTwoProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <>
        <StepHeader>Write your charter</StepHeader>
        <StepDescription>
          Add your Newsroom’s mission to the charter. This will also be included on your smart contract and shown on
          your listing page in the Civil Registry.
        </StepDescription>

        <FormSection>
          <FormTitle>Identify your newsroom's journalistic mission.</FormTitle>

          <FormSubhead>Your newsroom's mission or purpose.</FormSubhead>
          <Textarea
            name="purpose"
            value={(this.props.charter.mission && this.props.charter.mission.purpose) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>Your newsroom's ownership structure.</FormSubhead>
          <Textarea
            name="structure"
            value={(this.props.charter.mission && this.props.charter.mission.structure) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>What are your newsroom's current or planned revenue sources?</FormSubhead>
          <Textarea
            name="revenue"
            value={(this.props.charter.mission && this.props.charter.mission.revenue) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>
            Are there any encumbrances on your ability to report independently that the Civil community should be aware
            of?
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
