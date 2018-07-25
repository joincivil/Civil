import * as React from "react";
import styled from "styled-components";
import { getLocalDateTimeStrings } from "@joincivil/utils";
import { colors } from "../styleConstants";
import { ListingHistoryEventTimestampProps } from "./types";

const StyledEventDate = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 13px;
  font-weight: bold;
  line-height: 16px;
  padding: 5px 0 0;
  width: 148px;
`;

const EventDate: React.StatelessComponent<ListingHistoryEventTimestampProps> = props => {
  const eventDateTimeStrings = getLocalDateTimeStrings(props.timestamp);
  return <StyledEventDate>{eventDateTimeStrings[0]}</StyledEventDate>;
};

export default EventDate;
