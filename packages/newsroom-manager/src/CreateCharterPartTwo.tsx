import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import debounce from "lodash/debounce";
import styled from "styled-components";
import { StepHeader, StepProps, StepDescription, TextareaInput } from "@joincivil/components";
import { EthAddress, CharterData } from "@joincivil/core";
import { FormSection, FormTitle, FormSubhead } from "./styledComponents";
import { StateWithNewsroom } from "./reducers";
import { updateCharter } from "./actionCreators";

export interface CreateCharterPartTwoProps extends StepProps {
  address?: EthAddress;
  savedCharter?: Partial<CharterData>;
  stepisComplete(isComplete: boolean): void;
  saveCharter?(charter: Partial<CharterData>): void;
}

export interface CreateCharterPartTwoState {
  charter: Partial<CharterData>;
}

const Textarea = styled(TextareaInput)`
  height: 140px;
`;

class CreateCharterPartTwoComponent extends React.Component<
  CreateCharterPartTwoProps & DispatchProp<any>,
  CreateCharterPartTwoState
> {
  private handleCharterUpdate = debounce(() => {
    this.props.dispatch!(updateCharter(this.props.address!, this.state.charter));

    this.checkIsComplete();

    if (this.props.saveCharter) {
      this.props.saveCharter(this.state.charter);
    }
  }, 1000);

  constructor(props: CreateCharterPartTwoProps) {
    super(props);
    this.state = {
      charter: props.savedCharter || {},
    };
    this.checkIsComplete();
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
            value={(this.state.charter.mission && this.state.charter.mission.purpose) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>Your newsroom's ownership structure.</FormSubhead>
          <Textarea
            name="structure"
            value={(this.state.charter.mission && this.state.charter.mission.structure) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>What are your newsroom's current or planned revenue sources?</FormSubhead>
          <Textarea
            name="revenue"
            value={(this.state.charter.mission && this.state.charter.mission.revenue) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>
            Are there any encumbrances on your ability to report independently that the Civil community should be aware
            of?
          </FormSubhead>
          <Textarea
            name="encumbrances"
            value={(this.state.charter.mission && this.state.charter.mission.encumbrances) || ""}
            onChange={this.missionInputChange}
          />

          <FormSubhead>
            Is there anything else the Civil community should know about your Newsroom to support its inclusion on the
            Registry?
          </FormSubhead>
          <Textarea
            name="miscellaneous"
            value={(this.state.charter.mission && this.state.charter.mission.miscellaneous) || ""}
            onChange={this.missionInputChange}
          />
        </FormSection>
      </>
    );
  }

  private checkIsComplete(): void {
    let isComplete = false;
    if (this.state.charter.mission) {
      const mission = this.state.charter.mission;
      isComplete = !!(
        mission.purpose &&
        mission.structure &&
        mission.revenue &&
        mission.encumbrances &&
        mission.miscellaneous
      );
    }
    this.props.stepisComplete(isComplete);
  }

  private missionInputChange = (name: string, val: string) => {
    this.setState({
      charter: {
        ...this.state.charter,
        mission: {
          ...this.state.charter.mission,
          [name]: val,
        } as any, // "as any" required because Partial<T> doesn't seem to recurse to optional mission values inside CharterData
      },
    });
    this.handleCharterUpdate();
  };
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: CreateCharterPartTwoProps): CreateCharterPartTwoProps => {
  let charterFromState;
  if (ownProps.address && state.newsrooms.get(ownProps.address)) {
    charterFromState = state.newsrooms.get(ownProps.address).charter;
  }
  return {
    ...ownProps,
    savedCharter: ownProps.savedCharter || charterFromState || {},
  };
};

export const CreateCharterPartTwo = connect(mapStateToProps)(CreateCharterPartTwoComponent);
