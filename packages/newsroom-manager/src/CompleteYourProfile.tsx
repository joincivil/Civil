import * as React from "react";
import {
  StepHeader,
  StepProps,
  StepStyled,
  Collapsable,
  BorderlessButton,
  colors,
  fonts,
  TextInput,
  DetailTransactionButton,
  StepDescription,
} from "@joincivil/components";
import styled from "styled-components";
import { connect, DispatchProp } from "react-redux";
import { EthAddress, NewsroomRoles, Civil } from "@joincivil/core";
import { CivilContext } from "./CivilContext";
import { StateWithNewsroom } from "./reducers";
import { fetchNewsroom, uiActions } from "./actionCreators";
import { NewsroomUser } from "./NewsroomUser";

export interface CompleteYourProfileComponentExternalProps extends StepProps {
  address?: EthAddress;
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
  CompleteYourProfileComponentProps & DispatchProp<any>,
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

  public renderAddEditorForm(): JSX.Element {
    if (!this.state.addEditor) {
      return <BorderlessButton onClick={() => this.setState({ addEditor: true })}>ADD EDITORS +</BorderlessButton>;
    } else {
      return (
        <CivilContext.Consumer>
          {(civil: Civil) => (
            <>
              <TextInput
                label="Wallet Address"
                placeholder="Enter Wallet Address"
                name="EditorWalletInput"
                value={this.state.newEditor}
                onChange={(name: any, val: any) => this.setState({ newEditor: val })}
              />
              <DetailTransactionButton
                transactions={[
                  {
                    transaction: this.addEditor,
                    postTransaction: (result: any) => {
                      this.setState({ addEditor: false, newEditor: "" });
                    },
                  },
                ]}
                civil={civil}
                requiredNetwork="rinkeby"
              >
                Add Owner
              </DetailTransactionButton>
            </>
          )}
        </CivilContext.Consumer>
      );
    }
  }

  public renderAddOwnerForm(): JSX.Element {
    if (!this.state.addOwner) {
      return <BorderlessButton onClick={() => this.setState({ addOwner: true })}>ADD OWNER +</BorderlessButton>;
    } else {
      return (
        <CivilContext.Consumer>
          {(civil: Civil) => (
            <>
              <TextInput
                label="Wallet Address"
                placeholder="Enter Wallet Address"
                name="OwnerWalletInput"
                value={this.state.newOwner}
                onChange={(name, val) => this.setState({ newOwner: val })}
              />
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
                civil={civil}
                requiredNetwork="rinkeby"
              >
                Add Owner
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
              <StepHeader
                disabled={this.props.disabled}
                el={this.props.el}
                isActive={this.props.active === this.props.index}
              >
                Add other users
              </StepHeader>
              <StepDescription disabled={this.props.disabled}>
                Add owners and editors to your newsroom contract.
              </StepDescription>
            </>
          }
          open={!!this.props.address}
          disabled={this.props.disabled}
        >
          <FormSection>
            <Section>
              <FormTitle>Owners</FormTitle>
              <FormDescription>
                Owners can add members to the newsroom contract (including you, if you lose your private key).
              </FormDescription>
            </Section>
            <Section>
              {this.props.owners.map(item => (
                <NewsroomUser key={item.address} address={item.address} name={item.name} />
              ))}
            </Section>
            {this.renderAddOwnerForm()}
          </FormSection>
          <FormSection>
            <Section>
              <FormTitle>Editors</FormTitle>
              <FormDescription>Editors can publish articles to the blockchain.</FormDescription>
            </Section>
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
): CompleteYourProfileComponentProps => {
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
