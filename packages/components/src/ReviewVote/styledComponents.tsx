import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export const ModalOuter = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  overflow: hidden scroll;
  width: 100vw;
`;

export const ModalContent = styled.div`
  padding: 32px 0 156px;
  width: 800px;
`;

export const StyledReviewVoteHeader = styled.div`
  background: ${colors.accent.CIVIL_GRAY_4};
  border-top: 6px solid ${colors.accent.CIVIL_BLUE};
  padding: 27px 42px;
`;

export const StyledReviewVoteHeaderTitle = styled.h2`
  font-family: ${fonts.SERIF};
  font-size: 32px;
  line-height: 40px;
  margin: 0 0 2px;
`;

export const StyledReviewVoteHeaderCopy = styled.p`
  font-size: 14px;
  line-height: 33px;
`;

export const StyledReviewVoteContent = styled.div`
  width: 790px;
`;

export const StyledReviewVoteContentCopy = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 14px;
  line-height: 20px;
  padding: 0 65px;
  margin: 17px 0 32px;
`;

export const StyledReviewVoteContentGrid = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  display: flex;
  padding: 0 0 32px;
  margin: 0 0 38px;

  & > div {
    width: 50%;
  }
`;

export const StyledReviewVoteDetails = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 3px;
  padding: 33px 30px;
`;

export const StyledReviewVoteDates = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 14px;
  line-height: 20px;
  padding-left: 63px;

  p {
    margin: 40px 0 12px;
  }

  ol {
    margin: 0;
    padding: 0 0 0 16px;
  }

  li {
    margin: 0 0 10px;
  }
`;

export const MetaRow = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding: 0 0 19px;
  margin: 0 0 19px;
`;

export const MetaItemLabel = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 12px;
  font-weight: bold;
  line-height: 15px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

export const MetaItemLabelSalt = styled(MetaItemLabel)`
  text-align: center;
`;

export const MetaItemValue = styled.div`
  font-size: 18px;
  line-height: 33px;
`;

export const MetaItemValueUser = styled(MetaItemValue)`
  font-family: ${fonts.MONOSPACE};
`;

export const MetaItemValueSalt = styled.div`
  background: ${colors.accent.CIVIL_TEAL_FADED};
  font-family: ${fonts.MONOSPACE};
  font-size: 20px;
  line-height: 35px;
  padding: 10px 0;
  text-align: center;
`;

export const StyledReviewVoteDatesHeader = styled.div`
  font-size: 21px;
  font-weight: bold;
  line-height: 25px;
  margin: 0 0 15px;
`;

export const StyledReviewVoteDatesRange = styled.div`
  font-weight: 18px;
  line-height: 33px;
  margin: 0 0 16px;
`;

export const StyledAddToCalendar = styled.div`
  .react-add-to-calendar {
    -webkit-font-smoothing: antialiased;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
    position: relative;
    display: inline-block;
    margin: 0 auto;
    width: 175px;
  }

  .react-add-to-calendar__wrapper {
    zoom: 1;
    cursor: pointer;
  }

  .react-add-to-calendar__button {
    padding: 10px;
    background-color: #f9f9f9;
    border: 1px solid #aab9d4;
    border-radius: 3px;
    color: #000;

    .react-add-to-calendar--light {
      background-color: #fff;
    }
  }

  .react-add-to-calendar__icon {
    .react-add-to-calendar--right {
      padding-left: 5px;
    }

    .react-add-to-calendar--left {
      padding-right: 5px;
    }
  }

  .react-add-to-calendar__dropdown {
    position: absolute;
    top: 30px;
    left: 1px;
    width: 93%;
    padding: 5px 0 5px 8px;
    box-shadow: 1px 3px 6px rgba(0, 0, 0, 0.15);
    border: 1px solid ${colors.accent.CIVIL_GRAY_4};
    background-color: ${colors.basic.WHITE};
    text-align: left;

    ul {
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        padding: 0 0 5px;

        a {
          text-decoration: none;

          &:hover {
            color: ${colors.accent.CIVIL_BLUE};
          }

          i {
            padding-right: 10px;
          }
        }
      }
    }
  }
`;

export const StyledDateAction = styled.span`
  color: ${colors.accent.CIVIL_BLUE};
  cursor: pointer;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 150px;
`;
