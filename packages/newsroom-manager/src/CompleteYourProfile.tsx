import {
  AddressInput,
  BorderlessButton,
  buttonSizes,
  Collapsable,
  colors,
  DetailTransactionButton,
  fonts,
  QuestionToolTip,
  StepDescription,
  StepHeader,
  StepProps,
  StepStyled,
} from "@joincivil/components";
import { EthAddress, NewsroomRoles } from "@joincivil/core";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled from "styled-components";
import { fetchNewsroom, uiActions } from "./actionCreators";
import { CivilContext, CivilContextValue } from "./CivilContext";
import { NewsroomUser } from "./NewsroomUser";
import { StateWithNewsroom } from "./reducers";
import { TransactionButtonInner } from "./TransactionButtonInner";

export interface CompleteYourProfileComponentExternalProps extends StepProps {
  address?: EthAddress;
  renderUserSearch?(onSetAddress: any): JSX.Element;
}

export interface CompleteYourProfileComponentProps extends StepProps {
  owners: Array<{ address: EthAddress; name?: string }>;
  editors: Array<{ address: EthAddress; name?: string }>;
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
  padding-bottom: 40px;
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
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FormTitleSection = Section.extend`
  flex-direction: row;
  justify-content: flex-start;
`;

const FormDescription = styled.p`
  font-family: ${fonts.SANS_SERIF};
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 15px;
  width: 430px;
  margin-left: 50px;
`;

const AddButton = BorderlessButton.extend`
  padding-left: 0px;
`;

const makeUserObject = (state: StateWithNewsroom, item: EthAddress): { address: EthAddress; name?: string } => {
  let name;
  if (state.newsroomUi.get(uiActions.GET_NAME_FOR_ADDRESS)) {
    name = state.newsroomUsers.get(item);
  }
  return {
    address: item,
    name,
  };
};

class CompleteYourProfileComponent extends React.Component<
  CompleteYourProfileComponentProps & CompleteYourProfileComponentExternalProps & DispatchProp<any>,
  CompleteYourProfileComponentState
> {
  constructor(props: CompleteYourProfileComponentProps & DispatchProp<any>) {
    super(props);
    this.state = {
      addOwner: false,
      addEditor: false,
      newOwner: "",
      newEditor: "",
    };
  }

  public renderEditorInputs(): JSX.Element {
    return this.props.renderUserSearch ? (
      this.props.renderUserSearch((address: string) => this.setState({ newEditor: address }))
    ) : (
      <AddressInput
        address={this.state.newEditor}
        onChange={(name: any, val: any) => this.setState({ newEditor: val })}
      />
    );
  }

  public renderOwnerInputs(): JSX.Element {
    return this.props.renderUserSearch ? (
      this.props.renderUserSearch((address: string) => this.setState({ newOwner: address }))
    ) : (
      <AddressInput address={this.state.newOwner} onChange={(name, val) => this.setState({ newOwner: val })} />
    );
  }

  public renderAddEditorForm(): JSX.Element {
    if (!this.state.addEditor) {
      return (
        <AddButton size={buttonSizes.SMALL} onClick={() => this.setState({ addEditor: true })}>
          + Add Additional Editor
        </AddButton>
      );
    } else {
      return (
        <CivilContext.Consumer>
          {(value: CivilContextValue) => (
            <>
              {this.renderEditorInputs()}
              <DetailTransactionButton
                transactions={[
                  {
                    transaction: this.addEditor,
                    postTransaction: (result: any) => {
                      this.setState({ addEditor: false, newEditor: "" });
                    },
                  },
                ]}
                Button={TransactionButtonInner}
                civil={value.civil}
                requiredNetwork={value.requiredNetwork}
              >
                Add Editor
              </DetailTransactionButton>
            </>
          )}
        </CivilContext.Consumer>
      );
    }
  }

  public renderAddOwnerForm(): JSX.Element {
    if (!this.state.addOwner) {
      return (
        <AddButton size={buttonSizes.SMALL} onClick={() => this.setState({ addOwner: true })}>
          + Add Additional Officer
        </AddButton>
      );
    } else {
      return (
        <CivilContext.Consumer>
          {(value: CivilContextValue) => (
            <>
              {this.renderOwnerInputs()}
              <DetailTransactionButton
                transactions={[
                  {
                    transaction: this.addOwner,
                    postTransaction: result => {
                      this.props.dispatch!(fetchNewsroom(this.props.address!));
                      this.setState({ addOwner: false, newOwner: "" });
                    },
                  },
                ]}
                civil={value.civil}
                Button={TransactionButtonInner}
                requiredNetwork={value.requiredNetwork}
              >
                Add Officer
              </DetailTransactionButton>
            </>
          )}
        </CivilContext.Consumer>
      );
    }
  }

  public render(): JSX.Element {
    return (
      <StepStyled disabled={this.props.disabled} index={this.props.index || 0}>
        <Collapsable
          header={
            <>
              <StepHeader disabled={this.props.disabled}>Add accounts to your newsroom contract</StepHeader>
              <StepDescription disabled={this.props.disabled}>
                Add additional officers and editors to your newsroom contract. You will need their wallet addresses.
                This step is optional, but recommended.
                <QuestionToolTip
                  disabled={this.props.disabled}
                  explainerText={
                    "Think of officers as admins of your newsroom.  You can skip adding an additional officer but if not have one, you will not be able to access you newsroom contract if you lose your private key."
                  }
                />
              </StepDescription>
            </>
          }
          open={!!this.props.address && !this.props.disabled}
          disabled={this.props.disabled}
        >
          <FormSection>
            <FormTitleSection>
              <FormTitle>Officer</FormTitle>
              <FormDescription>
                Officers can add members to the newsroom contract, sign and index posts.
              </FormDescription>
            </FormTitleSection>
            <Section>
              {this.props.owners.map(item => {
                return <NewsroomUser key={item.address} address={item.address} name={item.name} />;
              })}
            </Section>
            {this.renderAddOwnerForm()}
          </FormSection>
          <FormSection>
            <FormTitleSection>
              <FormTitle>Editor</FormTitle>
              <FormDescription>
                Editors have permission to index and sign posts on the blockchain. They cannot add officers to a
                newsroom contract.
              </FormDescription>
            </FormTitleSection>
            <Section>
              {this.props.editors.map(item => (
                <NewsroomUser key={item.address} address={item.address} name={item.name} />
              ))}
            </Section>
            {this.renderAddEditorForm()}
          </FormSection>
        </Collapsable>
      </StepStyled>
    );
  }

  private addOwner = async (): Promise<void> => {
    return this.props.newsroom.addOwner(this.state.newOwner);
  };
  private addEditor = async (): Promise<void> => {
    return this.props.newsroom.addRole(this.state.newEditor, NewsroomRoles.Editor);
  };
}

const mapStateToProps = (
  state: StateWithNewsroom,
  ownProps: CompleteYourProfileComponentExternalProps,
): CompleteYourProfileComponentProps & CompleteYourProfileComponentExternalProps => {
  const { address } = ownProps;
  const newsroom = state.newsrooms.get(address || "") || { wrapper: { data: {} } };
  const owners: Array<{ address: EthAddress; name?: string }> = (newsroom.wrapper.data.owners || []).map(
    makeUserObject.bind(null, state),
  );
  const editors: Array<{ address: EthAddress; name?: string }> = (newsroom.editors || []).map(
    makeUserObject.bind(null, state),
  );
  return {
    ...ownProps,
    address,
    owners,
    editors,
    newsroom: newsroom.newsroom,
  };
};

export const CompleteYourProfile = connect(mapStateToProps)(CompleteYourProfileComponent);
