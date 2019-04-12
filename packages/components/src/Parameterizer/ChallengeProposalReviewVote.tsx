import * as React from "react";
import AddToCalendar from "react-add-to-calendar";
import { EthAddress } from "@joincivil/core";
import { saltToWords, getFormattedEthAddress, getLocalDateTimeStrings, padString } from "@joincivil/utils";
import { FullScreenModal, FullScreenModalProps } from "../FullscreenModal";
import { buttonSizes, CancelButton } from "../Button";
import { TransactionButtonNoModal } from "../TransactionButton";
import { QuestionToolTip } from "../QuestionToolTip";
import { Checkbox, CheckboxSizes } from "../input/Checkbox";
import { MetaMaskLogoButton } from "../";
import {
  ReviewVoteHeaderTitleText,
  ReviewVoteCopyText,
  SaltLabelText,
  ReviewVoteDepositedCVLLabelText,
  ReviewVoteMyAddressLabelText,
  ConfirmVotesLabelText,
  TransactionButtonText,
  SaltPhraseToolTipText,
  TransactionFinePrintText,
  SaveSaltCheckboxLabelText,
} from "../ReviewVote/textComponents";
import {
  ModalOuter,
  ModalContent,
  StyledReviewVoteHeaderTitle,
  StyledReviewVoteContent,
  StyledReviewVoteContentCopy,
  StyledReviewVoteDetails,
  MetaRow,
  MetaRowSalt,
  MetaItemLabel,
  MetaItemLabelSalt,
  MetaItemValue,
  MetaItemValueUser,
  MetaItemValueSalt,
  MetaItemValueTwoCol,
  StyledAddToCalendarContainer,
  StyledConfirmVoteDateRange,
  StyledAddToCalendar,
  StyledButtonContainer,
  StyledTransactionFinePrint,
  StyledDidSaveSaltContainer,
} from "../ReviewVote/styledComponents";

export interface ChallengeProposalReviewVoteProps extends FullScreenModalProps {
  parameterName: string | JSX.Element;
  proposalURL: string;
  challengeID: string;
  numTokens?: string;
  voteOption?: string;
  salt?: string;
  userAccount: EthAddress;
  commitEndDate: number;
  revealEndDate: number;
  transactions: any[];
  modalContentComponents?: any;
  gasFaqURL: string;
  votingContractFaqURL: string;
  handleClose(): void;
  postExecuteTransactions?(): void;
}

interface ReviewVoteState {
  didSaveSalt: boolean;
}

function printThis(): void {
  window.print();
}

function getSaltyWords(salt?: string): string {
  if (!salt) {
    return "";
  }

  return saltToWords(salt).join(" ");
}

function getReadableRevealDateRange(commitEndDate: number, revealEndDate: number): string {
  const revealStartDateTime = getLocalDateTimeStrings(commitEndDate + 1);
  const revealEndDateTime = getLocalDateTimeStrings(revealEndDate);
  return `From ${revealStartDateTime[0]} at ${revealStartDateTime[1]} to ${revealEndDateTime[0]} at ${
    revealEndDateTime[1]
  }`;
}

function getCalendarEventDateTime(seconds: number | Date): string {
  const theDate = typeof seconds === "number" ? new Date(seconds * 1000) : seconds;
  const pad = (num: number | string) => {
    return padString(num, 2, "0");
  };
  const hours = pad(theDate.getHours());
  const mins = pad(theDate.getMinutes());
  const tzOffset = `${pad(theDate.getTimezoneOffset() / 60)}${pad(theDate.getTimezoneOffset() % 60)}`;
  const dateString = `${theDate.getFullYear()}-${pad(theDate.getMonth() + 1)}-${pad(theDate.getDate())}`;
  const timeString = `${hours}:${mins}-${tzOffset}`;
  return `${dateString}T${timeString}`;
}

const AddRevealPhaseToCalendar: React.FunctionComponent<ChallengeProposalReviewVoteProps> = props => {
  // @TODO(jon): `textComponents` don't work here b/c these fields are plaintext. Let's
  // revisit converting JSX.Components to strings via textContent before this goes to mainnet
  const title = `Reveal My Vote for ${props.parameterName} on The Civil Registry`;
  const description = `
    ${props.proposalURL}\n\n
    My Secret Phrase\n
    ${getSaltyWords(props.salt)}\n\n
    Challenge ID ${props.challengeID}\n
    I voted for ${props.parameterName} to ${
    props.voteOption === "0" ? "remain the same" : "change"
  } on the Civil Registry\n\n
    My Deposited CVL\n
    ${props.numTokens}
  `;
  const location = props.proposalURL;
  const startTime = getCalendarEventDateTime(props.commitEndDate + 1);
  const endTime = getCalendarEventDateTime(props.revealEndDate);
  const event = {
    title,
    description,
    location,
    startTime,
    endTime,
  };
  return (
    <StyledAddToCalendar>
      <AddToCalendar event={event} />
    </StyledAddToCalendar>
  );
};

export class ChallengeProposalReviewVote extends React.Component<ChallengeProposalReviewVoteProps, ReviewVoteState> {
  public state = {
    didSaveSalt: false,
  };

  public render(): JSX.Element {
    const {
      open,
      votingContractFaqURL,
      challengeID,
      salt,
      commitEndDate,
      revealEndDate,
      voteOption,
      parameterName,
      numTokens,
      userAccount,
      transactions,
      postExecuteTransactions,
      handleClose,
      gasFaqURL,
    } = this.props;

    const { didSaveSalt } = this.state;

    return (
      <FullScreenModal open={open || false}>
        <ModalOuter>
          <ModalContent>
            <StyledReviewVoteHeaderTitle>
              <ReviewVoteHeaderTitleText />
            </StyledReviewVoteHeaderTitle>
            <StyledReviewVoteContentCopy>
              <ReviewVoteCopyText handlePrintClick={printThis} votingContractFaqURL={votingContractFaqURL} />
            </StyledReviewVoteContentCopy>

            <StyledReviewVoteContent>
              <div>
                <StyledReviewVoteDetails>
                  <MetaRowSalt>
                    <MetaItemLabelSalt>
                      <SaltLabelText challengeID={challengeID} />
                      <QuestionToolTip explainerText={<SaltPhraseToolTipText />} positionBottom={true} />
                    </MetaItemLabelSalt>

                    <MetaItemValueSalt>{getSaltyWords(salt)}</MetaItemValueSalt>
                  </MetaRowSalt>

                  <MetaRow>
                    <MetaItemLabel>
                      <ConfirmVotesLabelText />
                    </MetaItemLabel>

                    <MetaItemValueTwoCol>
                      <StyledConfirmVoteDateRange>
                        {getReadableRevealDateRange(commitEndDate, revealEndDate)}
                      </StyledConfirmVoteDateRange>

                      <StyledAddToCalendarContainer>
                        <AddRevealPhaseToCalendar {...this.props} />
                        <p>Remember to set event to Private</p>
                      </StyledAddToCalendarContainer>
                    </MetaItemValueTwoCol>
                  </MetaRow>

                  <MetaRow>
                    <MetaItemLabel>Challenge ID {challengeID}</MetaItemLabel>

                    <MetaItemValue>
                      I voted for {parameterName} to {voteOption === "0" ? "remain the same" : "change"} on the Civil
                      Registry\n\n
                    </MetaItemValue>
                  </MetaRow>
                  <MetaRow>
                    <MetaItemLabel>
                      <ReviewVoteDepositedCVLLabelText />
                    </MetaItemLabel>

                    <MetaItemValue>{numTokens}</MetaItemValue>
                  </MetaRow>

                  <MetaRow>
                    <MetaItemLabel>
                      <ReviewVoteMyAddressLabelText />
                    </MetaItemLabel>

                    <MetaItemValueUser>{userAccount && getFormattedEthAddress(userAccount)}</MetaItemValueUser>
                  </MetaRow>
                </StyledReviewVoteDetails>
              </div>

              <StyledDidSaveSaltContainer>
                <div>
                  <Checkbox size={CheckboxSizes.SMALL} checked={didSaveSalt} onClick={this.toggleHasSavedSalt} />
                </div>
                <div>
                  <SaveSaltCheckboxLabelText />
                </div>
              </StyledDidSaveSaltContainer>

              <StyledButtonContainer>
                <TransactionButtonNoModal
                  transactions={transactions}
                  postExecuteTransactions={postExecuteTransactions}
                  Button={MetaMaskLogoButton}
                  disabled={!didSaveSalt}
                >
                  <TransactionButtonText />
                </TransactionButtonNoModal>
                <CancelButton size={buttonSizes.SMALL} onClick={handleClose}>
                  Cancel
                </CancelButton>
              </StyledButtonContainer>

              <StyledTransactionFinePrint>
                <TransactionFinePrintText gasFaqURL={gasFaqURL} />
              </StyledTransactionFinePrint>
            </StyledReviewVoteContent>
          </ModalContent>
        </ModalOuter>
      </FullScreenModal>
    );
  }

  private toggleHasSavedSalt = (): void => {
    this.setState({ didSaveSalt: !this.state.didSaveSalt });
  };
}
