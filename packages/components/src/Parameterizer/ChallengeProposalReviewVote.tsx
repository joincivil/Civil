import * as React from "react";
import AddToCalendar from "react-add-to-calendar";
import { EthAddress } from "@joincivil/core";
import { saltToWords, getFormattedEthAddress, getLocalDateTimeStrings, padString } from "@joincivil/utils";
import { FullScreenModal, FullScreenModalProps } from "../FullscreenModal";
import { buttonSizes, InvertedButton } from "../Button";
import { TransactionButton } from "../TransactionButton";
import {
  ReviewVoteHeaderTitleText,
  ReviewVoteHeaderCopyText,
  ReviewVoteCopyText,
  SaltLabelText,
  ReviewVoteDepositedCVLLabelText,
  ReviewVoteMyAddressLabelText,
  ConfirmVotesHeaderText,
  ConfirmVotesSaveSaltCopyText,
  WriteItDownText,
  TakeAScreenShotText,
  PrintThisText,
  EmailYourselfText,
  TransactionButtonText,
} from "../ReviewVote/textComponents";
import {
  ModalOuter,
  ModalContent,
  StyledReviewVoteHeader,
  StyledReviewVoteHeaderTitle,
  StyledReviewVoteHeaderCopy,
  StyledReviewVoteContent,
  StyledReviewVoteContentCopy,
  StyledReviewVoteContentGrid,
  StyledReviewVoteDetails,
  StyledReviewVoteDates,
  MetaRow,
  MetaItemLabel,
  MetaItemLabelSalt,
  MetaItemValue,
  MetaItemValueUser,
  MetaItemValueSalt,
  StyledReviewVoteDatesHeader,
  StyledReviewVoteDatesRange,
  StyledAddToCalendar,
  StyledDateAction,
  StyledButtonContainer,
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
  handleClose(): void;
  postExecuteTransactions?(): void;
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

export const ChallengeProposalReviewVote: React.FunctionComponent<ChallengeProposalReviewVoteProps> = props => {
  return (
    <FullScreenModal open={props.open || false}>
      <ModalOuter>
        <ModalContent>
          <StyledReviewVoteHeader>
            <StyledReviewVoteHeaderTitle>
              <ReviewVoteHeaderTitleText />
            </StyledReviewVoteHeaderTitle>
            <StyledReviewVoteHeaderCopy>
              <ReviewVoteHeaderCopyText />
            </StyledReviewVoteHeaderCopy>
          </StyledReviewVoteHeader>

          <StyledReviewVoteContent>
            <StyledReviewVoteContentCopy>
              <ReviewVoteCopyText />
            </StyledReviewVoteContentCopy>

            <StyledReviewVoteContentGrid>
              <StyledReviewVoteDetails>
                <MetaRow>
                  <MetaItemLabelSalt>
                    <SaltLabelText />
                  </MetaItemLabelSalt>

                  <MetaItemValueSalt>{getSaltyWords(props.salt)}</MetaItemValueSalt>
                </MetaRow>
                <MetaRow>
                  <MetaItemLabel>Challenge ID {props.challengeID}</MetaItemLabel>

                  <MetaItemValue>
                    I voted for {props.parameterName} to {props.voteOption === "0" ? "remain the same" : "change"} on
                    the Civil Registry\n\n
                  </MetaItemValue>
                </MetaRow>
                <MetaRow>
                  <MetaItemLabel>
                    <ReviewVoteDepositedCVLLabelText />
                  </MetaItemLabel>

                  <MetaItemValue>{props.numTokens}</MetaItemValue>
                </MetaRow>

                <MetaRow>
                  <MetaItemLabel>
                    <ReviewVoteMyAddressLabelText />
                  </MetaItemLabel>

                  <MetaItemValueUser>
                    {props.userAccount && getFormattedEthAddress(props.userAccount)}
                  </MetaItemValueUser>
                </MetaRow>
              </StyledReviewVoteDetails>

              <StyledReviewVoteDates>
                <StyledReviewVoteDatesHeader>
                  <ConfirmVotesHeaderText />
                </StyledReviewVoteDatesHeader>

                <StyledReviewVoteDatesRange>
                  {getReadableRevealDateRange(props.commitEndDate, props.revealEndDate)}
                </StyledReviewVoteDatesRange>

                <AddRevealPhaseToCalendar {...props} />

                <p>
                  <ConfirmVotesSaveSaltCopyText />
                </p>

                <ol>
                  <li>
                    <WriteItDownText />
                  </li>
                  <li>
                    <TakeAScreenShotText />
                  </li>
                  <li onClick={printThis}>
                    <StyledDateAction>
                      <PrintThisText />
                    </StyledDateAction>
                  </li>
                  <li>
                    <EmailYourselfText />
                  </li>
                </ol>
              </StyledReviewVoteDates>
            </StyledReviewVoteContentGrid>

            <StyledButtonContainer>
              <InvertedButton size={buttonSizes.MEDIUM} onClick={props.handleClose}>
                Cancel
              </InvertedButton>
              <TransactionButton
                transactions={props.transactions}
                modalContentComponents={props.modalContentComponents}
                postExecuteTransactions={props.postExecuteTransactions}
              >
                <TransactionButtonText />
              </TransactionButton>
            </StyledButtonContainer>
          </StyledReviewVoteContent>
        </ModalContent>
      </ModalOuter>
    </FullScreenModal>
  );
};
