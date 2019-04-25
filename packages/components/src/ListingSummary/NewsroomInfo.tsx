import * as React from "react";
import * as defaultNewsroomImgUrl from "../images/img-default-newsroom@2x.png";
import { ListingSummaryComponentProps } from "./types";
import { NewsroomIcon, StyledListingSummaryTop, StyledListingSummaryNewsroomName } from "./styledComponents";
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
      <NewsroomIcon>
        {logoURL && (
          <img
            src={logoURL}
            onError={e => {
              (e.target as any).src = defaultNewsroomImgUrl;
            }}
          />
        )}
      </NewsroomIcon>
      <div>
        <StyledListingSummaryNewsroomName>{props.name}</StyledListingSummaryNewsroomName>
        <NewsroomTagline description={description} />
      </div>
    </StyledListingSummaryTop>
  );
};

export default NewsroomInfo;
