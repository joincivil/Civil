import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { ListingHistoryEventDetailsProps, ListingHistoryEventProps } from "./types";
import EventDate from "./EventDate";

export enum ListingHistoryEventStyles {
  WHITELISTED = "WHITELISTED",
  REJECTED = "REJECTED",
}

const StyledListingHistoryEvent = styled.div`
  display: flex;
  font-family: ${fonts.SANS_SERIF};
`;

export interface StyledEventDetailProps {
  eventStyle?: string;
}

const eventColors: any = {
  [ListingHistoryEventStyles.WHITELISTED]: colors.accent.CIVIL_TEAL,
  [ListingHistoryEventStyles.REJECTED]: colors.accent.CIVIL_RED,
};

const StyledEventDetail = styled<StyledEventDetailProps, "div">("div")`
  border-left: 4px solid ${colors.accent.CIVIL_GRAY_4}
  padding: 0 0 40px 33px;
  position: relative;

  & svg {
    background: ${colors.basic.WHITE};
    position: absolute;
    left: -15px;
    top: 0;
    z-index: 2;
  }

  & circle {
    fill: ${props => (props.eventStyle ? eventColors[props.eventStyle] : colors.accent.CIVIL_GRAY_2)};
    stroke: ${props => (props.eventStyle ? eventColors[props.eventStyle] : colors.accent.CIVIL_GRAY_2)};
  }
`;

const StyledEventTitle = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 21px;
  font-weight: 600;
  line-height: 25px;
  margin: 0 0 8px;
`;

export const StyledEventCopy = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.39px;

  & > strong {
    color: ${colors.primary.CIVIL_GRAY_1};
    font-weight: normal;
  }
`;

export const ListingHistoryEvent: React.StatelessComponent<ListingHistoryEventProps> = props => {
  return (
    <StyledListingHistoryEvent>
      <EventDate timestamp={props.timestamp} />
      <EventDetail title={props.title} eventStyle={props.eventStyle}>
        {props.children}
      </EventDetail>
    </StyledListingHistoryEvent>
  );
};

const EventDetail: React.StatelessComponent<ListingHistoryEventDetailsProps> = props => {
  return (
    <StyledEventDetail eventStyle={props.eventStyle}>
      <svg viewBox="0 0 26 26" width="26" height="26" xmlns="http://www.w3.org/2000/svg">
        <circle cx="13" cy="13" r="7" />
      </svg>

      <StyledEventTitle>{props.title}</StyledEventTitle>
      {props.children}
    </StyledEventDetail>
  );
};
