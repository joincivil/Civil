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
  padding: 100px 0 156px;
  width: 800px;

  a {
    border-bottom: transparent 1px solid;
    color: ${colors.accent.CIVIL_BLUE};
    cursor: pointer;
    text-decoration: none;
  }

  a:hover {
    border-bottom-color: ${colors.accent.CIVIL_BLUE};
  }
`;

export const StyledReviewVoteHeaderTitle = styled.h2`
  font-size: 24px;
  line-height: 30px;
  letter-spacing: -0.17px;
  margin: 0 0 2px;
`;

export const StyledReviewVoteContent = styled.div`
  width: 790px;
`;

export const StyledReviewVoteContentCopy = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 16px;
  line-height: 26px;
  margin: 12px 0 30px;

  span {
    border-bottom: transparent 1px solid;
    color: ${colors.accent.CIVIL_BLUE};
    cursor: pointer;
    text-decoration: none;
  }

  span:hover {
    border-bottom-color: ${colors.accent.CIVIL_BLUE};
  }
`;

export const StyledReviewVoteDetails = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 3px;
  padding: 33px 30px;
`;

export const MetaRowSalt = styled.div`
  background: ${colors.accent.CIVIL_TEAL_FADED};
  margin: -33px -30px 24px;
  padding: 33px 30px;
`;

export const MetaRow = styled.div`
  margin: 0 0 18px;

  & ~ & {
    border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
    padding: 19px 0 0;
  }
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
  color: ${colors.primary.BLACK}
  font-size: 18px;
  line-height: 21px;
  margin-bottom: 10px;
`;

export const MetaItemValue = styled.div`
  line-height: 33px;
`;

export const MetaItemValueTwoCol = styled(MetaItemValue)`
  display: flex;
  font-size: 18px;
  justify-content: space-between;
`;

export const StyledConfirmVoteDateRange = styled.div`
  width: 50%;
`;

export const StyledAddToCalendarContainer = styled.div`
  width: 207px;

  p {
    color: ${colors.primary.CIVIL_GRAY_1};
    font-size: 12px;
    line-height: 15px;
    margin: 6px 0 0;
  }
`;

export const MetaItemValueUser = styled(MetaItemValue)`
  font-family: ${fonts.MONOSPACE};
`;

export const MetaItemValueSalt = styled.div`
  background: ${colors.basic.WHITE};
  font-family: ${fonts.MONOSPACE};
  font-size: 21px;
  line-height: 14px;
  padding: 10px 27px;
  text-align: center;
`;

export const StyledAddToCalendar = styled.div`
  .react-add-to-calendar {
    -webkit-font-smoothing: antialiased;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
    position: relative;
    display: inline-block;
    margin: 0 auto 6px;
    white-space: nowrap;
  }

  .react-add-to-calendar__wrapper {
    zoom: 1;
    cursor: pointer;
  }

  .react-add-to-calendar__button {
    background-color: ${colors.basic.WHITE};
    border: 1px solid ${colors.accent.CIVIL_BLUE_VERY_FADED};
    border-radius: 0px;
    font-weight: bold;
    color: ${colors.accent.CIVIL_BLUE};
    font-size: 14px;
    line-height: 17px;
    padding: 15px 35px;

    .react-add-to-calendar--light {
      background-color: ${colors.basic.WHITE};
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
    top: 42px;
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
          font-size: 14px;
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

export const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  margin-bottom: 16px;
  text-align: right;

  & > button {
    margin-left: 10px;
  }
`;

export const StyledDidSaveSaltContainer = styled.div`
  display: flex;
  font-size: 15px;
  letter-spacing: -0.1px;
  line-height: 26px;
  padding: 0 30px;
  margin: 58px 0 51px;

  & > div + div {
    margin: -8px 0 0 8px;
  }
`;

export const StyledTransactionFinePrint = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 13px;
  line-height: 16px;
  margin-bottom: 150px;
  text-align: right;
`;
