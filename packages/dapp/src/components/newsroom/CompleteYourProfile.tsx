import * as React from "react";
import {
  StepHeader,
  StepProps,
  StepStyled,
  Collapsable,
  AddressWithCopyButton,
  BorderlessButton,
  colors,
  fonts,
  TextInput,
  DetailTransactionButton
} from "@joincivil/components";
import styled from "styled-components";
import { connect, DispatchProp } from "react-redux";
import { EthAddress, NewsroomRoles } from "@joincivil/core";
import { State } from "../../reducers";
import { fetchNewsroom } from "../../actionCreators/newsrooms";
import { getCivil } from "../../helpers/civilInstance";

export interface CompleteYourProfileComponentExternalProps {
  address?: EthAddress;
}

export interface CompleteYourProfileComponentProps extends StepProps {
  owners: EthAddress[];
  editors: EthAddress[];
  address?: EthAddress;
  newsroom: any;
}

export interface CompleteYourProfileComponentState {
  addOwner: boolean;
  addEditor: boolean;
  newOwner: EthAddress;
  newEditor: EthAddress;
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
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FormDescription = styled.p`
  font-family: ${fonts.SANS_SERIF};
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 15px;
`;

class CompleteYourProfileComponent extends React.Component<CompleteYourProfileComponentProps & DispatchProp<any>, CompleteYourProfileComponentState> {
  constructor(props: CompleteYourProfileComponentProps & DispatchProp<any>) {
    super(props);
    this.state = {
      addOwner: false,
      addEditor: false,
      newOwner: "",
      newEditor: "",
    };
  }

  public renderAddEditorForm(): JSX.Element {
    const civil = getCivil();
    if (!this.state.addEditor) {
      return <BorderlessButton onClick={() => this.setState({addEditor: true})}>ADD EDITORS +</BorderlessButton>;
    } else {
      return <>
        <TextInput label="Wallet Address" placeholder="Enter Wallet Address" name="EditorWalletInput" value={this.state.newEditor} onChange={(name, val) => this.setState({newEditor: val})} />
        <DetailTransactionButton
          transactions={[
            {
              transaction: this.addEditor,
              postTransaction: (result) => {
                this.setState({addEditor: false, newEditor: ""});
              },
            },
          ]}
          civil={civil}
          // estimateFunctions={[this.props.newsroom.estimateAddOwner.bind(this.props.newsroom, this.state.newOwner)]}
          requiredNetwork="rinkeby"
        >Add Owner</DetailTransactionButton>
      </>;
    }
  }

  public renderAddOwnerForm(): JSX.Element {
    const civil = getCivil();
    if (!this.state.addOwner) {
      return <BorderlessButton onClick={() => this.setState({addOwner: true})}>ADD OWNER +</BorderlessButton>;
    } else {
      return <>
        <TextInput label="Wallet Address" placeholder="Enter Wallet Address" name="OwnerWalletInput" value={this.state.newOwner} onChange={(name, val) => this.setState({newOwner: val})} />
        <DetailTransactionButton
          transactions={[
            {
              transaction: this.addOwner,
              postTransaction: (result) => {
                this.props.dispatch!(fetchNewsroom(this.props.address!));
                this.setState({addOwner: false, newOwner: ""});
              },
            },
          ]}
          civil={civil}
          // estimateFunctions={[this.props.newsroom.estimateAddOwner.bind(this.props.newsroom, this.state.newOwner)]}
          requiredNetwork="rinkeby"
        >Add Owner</DetailTransactionButton>
      </>;
    }
  }

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
            {this.props.owners.map(item => <AddressWithCopyButton key={item} address={item}/>)}
          </Section>
          {this.renderAddOwnerForm()}
        </FormSection>
        <FormSection>
          <Section>
            <FormTitle>Editors</FormTitle>
            <FormDescription>Editors can publish articles to the blockchain.</FormDescription>
          </Section>
          <Section>
            {this.props.editors.map(item => <AddressWithCopyButton key={item} address={item}/>)}
          </Section>
          {this.renderAddEditorForm()}
        </FormSection>
      </Collapsable>
    </StepStyled>);
  }

  private addOwner = async (): Promise<void> => {
    return this.props.newsroom.addOwner(this.state.newOwner);
  };
  private addEditor = async (): Promise<void> => {
    return this.props.newsroom.addRole(this.state.newEditor, NewsroomRoles.Editor);
  }
}

const mapStateToProps = (state: State, ownProps: CompleteYourProfileComponentExternalProps): CompleteYourProfileComponentProps => {
    const { address } = ownProps;
    const newsroom = state.newsrooms.get(address || "") || {wrapper: {data: {}}};
    return {
      ...ownProps,
      address,
      owners: newsroom.wrapper.data.owners || [],
      editors: newsroom.editors || [],
      newsroom: newsroom.newsroom,
    };
};

export const CompleteYourProfile = connect(mapStateToProps)(CompleteYourProfileComponent);
