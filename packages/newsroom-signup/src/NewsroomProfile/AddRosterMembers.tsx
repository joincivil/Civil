import * as React from "react";
import { LearnMoreButton } from "./LearnMoreButton";
import {
  StyledHr,
  FormSection,
  SectionHeader,
  SectionDescription,
  StepSectionCounter,
} from "../styledComponents";
import { CharterData, RosterMember as RosterMemberInterface } from "@joincivil/core";
import { InvertedButton, BorderlessButton, buttonSizes } from "@joincivil/components";
import { RosterMember } from "./RosterMember";
import { findIndex } from "lodash";
import styled from "styled-components";
import { RosterMemberListItem } from "./RosterMemberListItem";

export interface AddRosterMemberProps {
  charter: Partial<CharterData>;
  updateCharter(charter: Partial<CharterData>): void;
}

export interface AddRosterMemberState {
  editingMember: Partial<RosterMemberInterface> | null;
}

const LowerHeader = styled(SectionHeader)`
  font-size: 20px;
  text-align: left;
`;

const LowerDescription = styled(SectionDescription)`
  text-align: left;
`;

const StyledCounter = styled(StepSectionCounter)`
  margin-bottom: 35px;
`;

const StyledUl = styled.ul`
  list-style: none;
  margin: 0 0 35px 0;
  padding: 0;
`;

export class AddRosterMember extends React.Component<AddRosterMemberProps, AddRosterMemberState> {
  constructor(props: AddRosterMemberProps) {
    super(props);
    this.state = {
      editingMember: null,
    };
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
        <FormSection>
          <LowerHeader>Newsroom Roster</LowerHeader>
          <LowerDescription>Add yourself, in addition to any staff or team members to your roster.</LowerDescription>
          <StyledCounter>Step 2 of 4: Roster</StyledCounter>
          {this.state.editingMember ? (
            <RosterMember
              user={{ rosterData: this.state.editingMember }}
              updateRosterMember={this.rosterMemberUpdate}
            />
          ) : (
            <StyledUl>
              {(this.props.charter.roster || []).map((member, i) => {
                return <RosterMemberListItem key={i} member={member} edit={() => this.editRosterMember(i)} />;
              })}
            </StyledUl>
          )}
          {this.state.editingMember ? (
            <>
              <InvertedButton size={buttonSizes.MEDIUM} onClick={this.saveRosterMember}>
                Save
              </InvertedButton>
              <BorderlessButton size={buttonSizes.MEDIUM} onClick={() => this.setState({ editingMember: null })}>
                Cancel
              </BorderlessButton>
            </>
          ) : (
            <InvertedButton size={buttonSizes.MEDIUM_WIDE} onClick={this.addRosterMember}>
              Add a profile
            </InvertedButton>
          )}
        </FormSection>
      </>
    );
  }

  private addRosterMember = (e: any) => {
    e.preventDefault();
    this.setState({ editingMember: {} });
  };

  private rosterMemberUpdate = (newVal: Partial<RosterMemberInterface>): void => {
    this.setState({ editingMember: newVal });
  };

  private saveRosterMember = () => {
    const roster = (this.props.charter.roster || []).slice();
    const key = this.state.editingMember!.ethAddress ? "ethAddress" : "name";
    const memberIndex = findIndex(roster, rosterMember => rosterMember[key] === this.state.editingMember![key]);
    if (memberIndex >= 0) {
      roster[memberIndex] = this.state.editingMember as RosterMemberInterface;
    } else {
      roster.push(this.state.editingMember as RosterMemberInterface);
    }

    this.props.updateCharter({
      ...this.props.charter,
      roster,
    });

    this.setState({ editingMember: null });
  };

  private editRosterMember = (index: number) => {
    this.setState({ editingMember: this.props.charter.roster![index] });
  };
}
