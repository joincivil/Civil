import * as React from "react";
import { ListingSummaryComponentProps } from "./types";
import {
  NewsroomIcon,
  NewsroomLogo,
  StyledListingSummaryTop,
  StyledListingSummaryNewsroomName,
} from "./styledComponents";
import NewsroomTagline from "./NewsroomTagline";

const NewsroomInfo: React.FunctionComponent<ListingSummaryComponentProps> = props => {
  let description = "";
  if (props.charter) {
    // TODO(toby) remove legacy `desc` after transition
    description = props.charter.tagline || (props.charter as any).desc;
  }
  const logoURL = props.charter && props.charter.logoUrl;

  return (
    <StyledListingSummaryTop>
      <NewsroomIcon>{logoURL && <NewsroomLogo src={logoURL} />}</NewsroomIcon>
      <div>
        <StyledListingSummaryNewsroomName>{props.name}</StyledListingSummaryNewsroomName>
        <NewsroomTagline description={description} />
      </div>
    </StyledListingSummaryTop>
  );
};

export default NewsroomInfo;
