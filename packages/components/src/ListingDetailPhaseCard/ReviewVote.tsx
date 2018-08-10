import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { FullScreenModal, FullScreenModalProps } from "../FullscreenModal";
import { colors, fonts } from "../styleConstants";
import { ReviewVoteHeaderTitleText, ReviewVoteHeaderCopyText, ReviewVoteCopyText } from "./textComponents";

const ModalOuter = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  overflow: hidden scroll;
  width: 100vw;
`;

const ModalContent = styled.div`
  padding: 32px 0 156px;
  width: 800px;
`;

const StyledReviewVoteHeader = styled.div`
  background: ${colors.accent.CIVIL_GRAY_4};
  border-top: 6px solid ${colors.accent.CIVIL_BLUE};
  padding: 27px 42px;
`;

const StyledReviewVoteHeaderTitle = styled.h2`
  font-family: ${fonts.SERIF};
  font-size: 32px;
  line-height: 40px;
  margin: 0 0 2px;
`;

const StyledReviewVoteHeaderCopy = styled.p`
  font-size: 14px;
  line-height: 33px;
  margin: 0;
`;

const StyledReviewVoteContent = styled.div`
  width: 790px;
`;

const StyledReviewVoteContentGrid = styled.div`
  display: flex;
`;

const StyledReviewVoteDetails = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 3px;
  padding: 33px 30px;
`;

const StyledReviewVoteDates = styled.div``;

export interface ReviewVoteProps extends FullScreenModalProps {
  numTokens: string;
  voteOption: number;
  salt: string;
}

export const ReviewVote: React.StatelessComponent<ReviewVoteProps> = props => {
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
            <ReviewVoteCopyText />

            <StyledReviewVoteContentGrid>
              <StyledReviewVoteDetails>
                {props.salt}
                {props.numTokens}
              </StyledReviewVoteDetails>

              <StyledReviewVoteDates>Confirm Votes Phase</StyledReviewVoteDates>
            </StyledReviewVoteContentGrid>
          </StyledReviewVoteContent>
        </ModalContent>
      </ModalOuter>
    </FullScreenModal>
  );
};
