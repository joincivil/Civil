import * as React from "react";
import { ListingSummaryComponentProps } from "./types";
import {
  NewsroomIcon,
  NewsroomLogo,
  StyledListingSummaryTop,
  StyledListingSummaryNewsroomName,
} from "./styledComponents";
import DepositOrStakeAmount from "./DepositOrStakeAmount";
import NewsroomTagline from "./NewsroomTagline";

const NewsroomInfo: React.SFC<ListingSummaryComponentProps> = props => {
  return (
    <StyledListingSummaryTop>
      <NewsroomIcon>{props.logoURL && <NewsroomLogo src={props.logoURL} />}</NewsroomIcon>
      <div>
        <StyledListingSummaryNewsroomName>{props.name}</StyledListingSummaryNewsroomName>
        <NewsroomTagline description={props.description} />
        <DepositOrStakeAmount {...props} />
      </div>
    </StyledListingSummaryTop>
  );
};

export default NewsroomInfo;
