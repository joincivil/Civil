import * as React from "react";
import {
  fonts,
  colors,
  Checkbox,
  Modal,
  BorderlessButton,
  OBSectionHeader,
  OBSectionDescription,
  QuestionToolTip,
} from "@joincivil/components";
import { urlConstants } from "@joincivil/utils";
import styled from "styled-components";
import { connect, DispatchProp } from "react-redux";
import { setGrant, setSkip, grantSubmitted, grantSkipped } from "../actionCreators";
import { StateWithNewsroom } from "../reducers";
import { WaitingAfterSkip } from "./WaitingAfterSkip";
import { WaitingForGrant } from "./WaitingForGrant";
import { Mutation, MutationFunc, Query } from "react-apollo";
import { grantQuery } from "../queries";
import { requestGrantMutation } from "../mutations";

const DialogueBox = styled.div`
  border: 1px solid rgba(43, 86, 255, 0.4);
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

const CheckboxArea = styled.div`
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

const CostTip = styled(QuestionToolTip)`
  margin-top: 3px;
`;

const CostGrid = styled.div`
  display: grid;
  grid-template-columns: 30% auto;
`;

const ModalHeader = styled.h4`
  font-family: ${fonts.SANS_SERIF};
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
`;

const ModalP = styled.p`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 24px;
`;

const ModalLi = styled.li`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 9px;
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export interface GrantApplicationProps {
  chooseGrant: boolean;
  chooseSkip: boolean;
}

class GrantApplicationComponent extends React.Component<GrantApplicationProps & DispatchProp<any>> {
  public renderGrantModal(): JSX.Element | null {
    if (!this.props.chooseGrant) {
      return null;
    }
    return (
      <Modal width={560}>
        <ModalHeader>Apply for a Civil Token Grant</ModalHeader>
        <ModalP>By continuing, you agree to the following:</ModalP>
        <ul>
          <ModalLi>Your Newsroom Registry Profile will be reviewed by the Civil Foundation</ModalLi>
          <ModalLi>
            You will be notified via email once your application has been decided (reply times will vary)
          </ModalLi>
          <ModalLi>
            You will <strong>not</strong> be able to to edit your Registry Profile until the Foundation team has
            completed its review
          </ModalLi>
          <ModalLi>
            If approved, you will receive Civil Tokens (CVL) and a small amount of ETH to apply to the Civil Registry,
            in the wallet associated with your Newsroom Smart Contract
          </ModalLi>
          <ModalLi>
            You <strong>must</strong> complete a verification walkthrough tutorial and steps necessary to receive and
            store Civil Tokens (CVL)
          </ModalLi>
          <ModalLi>We recommend you consult a tax professional about reporting a token-based grant</ModalLi>
          <ModalLi>
            You understand that a successful token grant application does not allow you to bypass review and potential
            challenge by the Civil community
          </ModalLi>
        </ul>
        <ModalP>
          <a href={urlConstants.FAQ_GRANT} target="_blank">
            Learn more about the Civil Token Grant process
          </a>
        </ModalP>
        <Mutation
          update={cache => {
            cache.writeQuery({
              query: grantQuery,
              data: { nrsignupNewsroom: { grantRequested: true } },
            });
          }}
          mutation={requestGrantMutation}
        >
          {(requestGrant: MutationFunc) => {
            return (
              <ButtonSection>
                <BorderlessButton onClick={this.deselectGrant}>Cancel</BorderlessButton>
                <BorderlessButton
                  onClick={async () => {
                    this.props.dispatch!(grantSubmitted());
                    return requestGrant({
                      variables: {
                        input: true,
                      },
                    });
                  }}
                >
                  Continue
                </BorderlessButton>
              </ButtonSection>
            );
          }}
        </Mutation>
      </Modal>
    );
  }

  public renderSkipModal(): JSX.Element | null {
    if (!this.props.chooseSkip) {
      return null;
    }
    return (
      <Modal width={560}>
        <ModalHeader>Skip applying for a Civil Token Grant</ModalHeader>
        <ModalP>By continuing, you agree to the following:</ModalP>
        <ul>
          <ModalLi>
            {/*@TODO/tobek get from parameterizer*/}
            Your newsroom will be responsible for purchasing 5,000 Civil tokens (CVL) to apply to the Civil Registry. To
            do so, you must purchase ETH, first.
          </ModalLi>
          <ModalLi>
            You will also need to purchase enough Ether (ETH) to cover your transaction fees on the blockchain
          </ModalLi>
          <ModalLi>
            You <strong>must</strong> complete a verification walkthrough tutorial to ensure you understand how to
            purchase and store Civil tokens (CVL)
          </ModalLi>
          <ModalLi>
            You understand that your newsroom must submit to review and potential challenge by the Civil community
          </ModalLi>
        </ul>
        <Mutation
          mutation={requestGrantMutation}
          update={cache => {
            cache.writeQuery({
              query: grantQuery,
              data: { nrsignupNewsroom: { grantRequested: false } },
            });
          }}
        >
          {(requestGrant: MutationFunc) => {
            return (
              <ButtonSection>
                <BorderlessButton onClick={this.deselectSkip}>Cancel</BorderlessButton>
                <BorderlessButton
                  onClick={async () => {
                    this.props.dispatch!(grantSkipped());
                    return requestGrant({
                      variables: {
                        input: false,
                      },
                    });
                  }}
                >
                  Continue
                </BorderlessButton>
              </ButtonSection>
            );
          }}
        </Mutation>
      </Modal>
    );
  }

  public renderOptions(): JSX.Element {
    return (
      <>
        <OBSectionHeader>Civil Token Grant</OBSectionHeader>
        <OBSectionDescription>Your Newsroom can apply for a Civil Token Grant at this time. </OBSectionDescription>
        <DialogueBox>
          <DialogueHeader>Apply for a Civil Token Grant</DialogueHeader>
          <DialogueDescription>
            Your grant will include enough Civil tokens (CVL) to pay your deposit to join the Civil Registry, as well as
            a small portion of ETH to cover the cost of your first several blockchain transactions.
          </DialogueDescription>
          <SmallNote>
            <strong>Note:</strong> The process can take up to 14 days. You will not be able to continue until the Civil
            Foundation team has reviewed your application.
          </SmallNote>
          <CheckboxArea>
            <Checkbox checked={this.props.chooseGrant} onClick={this.selectGrant} id="apply_for_grant" />
            <div>
              <CheckboxP>
                <label htmlFor="apply_for_grant">
                  I would like to apply for a Civil Token Grant. My Newsroom Registry Profile will be reviewed by the
                  Civil Foundation team so they can evaluate an ETH and Civil Token Grant.
                </label>
              </CheckboxP>
              <SmallNote>Please consult with a tax professional about receiving a token grant.</SmallNote>
            </div>
          </CheckboxArea>
        </DialogueBox>
        <Divider>
          <DividerLine />
          <Or>OR</Or>
          <DividerLine />
        </Divider>
        <DialogueBox>
          <DialogueHeader>Skip applying for a Civil Token Grant</DialogueHeader>
          <DialogueDescription>You will need to pay for the following:</DialogueDescription>
          <hr />
          <CostSectionHeader>
            Joining Civil Registry Costs
            <CostTip explainerText="These are standard Registry costs that would be covered by a grant." />
          </CostSectionHeader>
          <CostGrid>
            <SmallNote>Civil Registry Token Deposit</SmallNote>
            {/* @TODO/tobek get this from parameterizer */}
            <SmallNote>5,000 Civil tokens (CVL)</SmallNote>
            <SmallNote>ETH transaction fees</SmallNote>
            <SmallNote>$10.00 USD (estimated)</SmallNote>
          </CostGrid>
          <CheckboxArea>
            <Checkbox checked={this.props.chooseSkip} onClick={this.selectSkip} id="skip_grant" />
            <CheckboxP>
              <label htmlFor="skip_grant">Skip applying for a Civil Token Grant.</label>
            </CheckboxP>
          </CheckboxArea>
        </DialogueBox>
        {this.renderGrantModal()}
        {this.renderSkipModal()}
      </>
    );
  }

  public render(): JSX.Element {
    return (
      <Query query={grantQuery}>
        {({ loading, error, data }) => {
          if (loading) {
            return "Loading...";
          }
          let grantRequested: boolean | undefined;
          if (data && data.nrsignupNewsroom) {
            grantRequested = data.nrsignupNewsroom.grantRequested;
          }
          if (grantRequested === true) {
            return <WaitingForGrant />;
          } else if (grantRequested === false) {
            return <WaitingAfterSkip />;
          } else {
            return this.renderOptions();
          }
        }}
      </Query>
    );
  }

  private selectSkip = () => {
    this.props.dispatch!(setSkip(true));
  };
  private selectGrant = () => {
    this.props.dispatch!(setGrant(true));
  };
  private deselectSkip = () => {
    this.props.dispatch!(setSkip(false));
  };
  private deselectGrant = () => {
    this.props.dispatch!(setGrant(false));
  };
}

const mapStateToProps = (state: StateWithNewsroom): GrantApplicationProps => {
  return {
    chooseGrant: state.grantApplication.get("chooseGrant"),
    chooseSkip: state.grantApplication.get("chooseSkip"),
  };
};

export const GrantApplication = connect(mapStateToProps)(GrantApplicationComponent);
