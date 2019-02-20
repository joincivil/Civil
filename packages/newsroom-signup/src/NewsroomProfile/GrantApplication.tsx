import * as React from "react";
import { SectionDescription, SectionHeader } from "../styledComponents";
import { fonts, colors, Checkbox } from "@joincivil/components";
import styled from "styled-components";

const DialogueBox = styled.div`
  border: 1px solid rgba(43,86,255,0.4);
  border-radius: 8px;
  padding: 22px 24px;
`;

const DialogueHeader = styled.h4`
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  font-weight: bold;
  line-height: 32px;
`;

const DialogueDescription = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 15px;
  line-height: 24px;
`;

const SmallNote = styled.p`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  line-height: 20px;
`;

const CheckboxArare = styled.div`
  display: grid;
  grid-template-columns: 5% 95%;
`;

const CheckboxP = styled.p`
  font-family: ${fonts.SANS_SERIF};
  font-size: 15px;
  letter-spacing: -0.1px;
  line-height: 26px;
  margin: 0;
`;

const Divider = styled.div`
  display: grid;
  grid-template-columns: auto 15px auto;
  grid-column-gap: 10px;
  align-items: center;
  margin: 20px 0;
`;

const DividerLine = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_3};
`;

const Or = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 10px;
  font-weight: 500;
  line-height: 21px;
  color: ${colors.accent.CIVIL_GRAY_2};
`;

const CostSectionHeader = styled.h5`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  font-weight: bold;
  line-height: 24px;
`;

const CostGrid = styled.div`
  display: grid;
  grid-template-columns: 30% auto;
`;

export interface GrantApplicationState {
  appliedForGrant: boolean;
  skipped: boolean;
}

export class GrantApplication extends React.Component<{}, GrantApplicationState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      appliedForGrant: false,
      skipped: false,
    };
  }
  public render(): JSX.Element {
    return <>
      <SectionHeader>Civil Foundation Grant</SectionHeader>
      <SectionDescription>
        Your Newsroom can apply for a Civil Foundation Grant at this time.
      </SectionDescription>
      <DialogueBox>
        <DialogueHeader>
          Apply for a Civil Foundation Grant
        </DialogueHeader>
        <DialogueDescription>
          Your grant will include enough Civil tokens (CVL) to pay your deposit to join the Civil Registry, as well as a small portion of ETH to cover the cost of your first several blockchain transactions. You'll also receive helpful tutorials and best practices on how to join.
        </DialogueDescription>
        <SmallNote>
          <strong>Note:</strong> The process can take up to 14 days (reply times will vary). You will not be able to continue until the Civil Foundation team has reviewed your application.
        </SmallNote>
        <CheckboxArare>
          <Checkbox checked={this.state.appliedForGrant} onClick={() => this.setState({appliedForGrant: !this.state.appliedForGrant})}/>
          <div>
            <CheckboxP>I would like to apply for a Civil Foundation Grant. My Newsroom Registry Profile will be reviewed by the Civil Foundation team so they can evaluate an ETH and Civil Token Grant.</CheckboxP>
            <SmallNote>Please consult with a tax professional about receiving a token grant.</SmallNote>
          </div>
        </CheckboxArare>
      </DialogueBox>
      <Divider><DividerLine/><Or>OR</Or><DividerLine/></Divider>
      <DialogueBox>
        <DialogueHeader>Skip applying for a Civil Foundation Grant</DialogueHeader>
        <DialogueDescription>You will need to pay for the following:</DialogueDescription>
        <hr/>
        <CostSectionHeader>Joining Civil Registry Costs</CostSectionHeader>
        <CostGrid><SmallNote>Civil Registry Token Deposit</SmallNote><SmallNote>$1,000 USD worth of CVL tokens (CVL)</SmallNote><SmallNote>ETH transaction fees</SmallNote><SmallNote>$15.00 USD (estimated)</SmallNote></CostGrid>
        <CheckboxArare>
          <Checkbox checked={this.state.skipped} onClick={() => this.setState({skipped: !this.state.skipped})}/>
          <CheckboxP>Skip applying for a Civil Foundation Grant.</CheckboxP>
        </CheckboxArare>
      </DialogueBox>
    </>;
  }
}
