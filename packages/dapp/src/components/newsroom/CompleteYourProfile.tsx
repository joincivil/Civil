import * as React from "react";
import { StepHeader, StepProps, StepStyled, Collapsable, AddressWithCopyButton, BorderlessButton, colors, fonts } from "@joincivil/components";
import styled from "styled-components";
import { connect, DispatchProp } from "react-redux";
import { EthAddress } from "@joincivil/core";
import { State } from "../../reducers";

export interface CompleteYourProfileComponentExternalProps {
  address?: EthAddress;
}

export interface CompleteYourProfileComponentProps extends StepProps {
  owners: EthAddress[];
  address?: EthAddress;
}

const FormSection = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding-top: 10px;
`;

const FormTitle = styled.h4`
  font-size: 15px;
  color: #000;
  font-family: ${fonts.SANS_SERIF};
  margin-right: 15px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FormDescription = styled.p`
  font-family: ${fonts.SANS_SERIF};
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 15px;
`;

class CompleteYourProfileComponent extends React.Component<CompleteYourProfileComponentProps & DispatchProp<any>> {
  public render(): JSX.Element {
    return (<StepStyled index={this.props.index || 0}>
      <Collapsable header={
        <>
          <StepHeader el={this.props.el} isActive={this.props.active === this.props.index}>
            Complete your profile
          </StepHeader>
          <p>Add owners, editors, and your charter to your profile.</p>
        </>
      } open={false}>
        <FormSection>
          <Section>
            <FormTitle>Owners</FormTitle>
            <FormDescription>Owners can add members to the newsroom contract (including you, if you lose your private key).</FormDescription>
          </Section>
          <Section>
            {this.props.owners.map(item => <AddressWithCopyButton address={item}/>)}
          </Section>
          <BorderlessButton>ADD OWNER +</BorderlessButton>
        </FormSection>
      </Collapsable>
    </StepStyled>)
  }
}

const mapStateToProps = (state: State, ownProps: CompleteYourProfileComponentExternalProps): CompleteYourProfileComponentProps => {
    const { address } = ownProps;
    const newsroom = state.newsrooms.get(address || "") || {data: {}};
    return {
      ...ownProps,
      address,
      owners: newsroom.data.owners || [],
    };
};

export const CompleteYourProfile = connect(mapStateToProps)(CompleteYourProfileComponent);
