import * as React from "react";
import * as defaultNewsroomImgUrl from "../images/img-default-newsroom@2x.png";
import { ListingSummaryComponentProps } from "./types";
import { NewsroomIcon, StyledListingSummaryTop, StyledListingSummaryNewsroomName } from "./styledComponents";
import NewsroomTagline from "./NewsroomTagline";

const NewsroomInfo: React.FunctionComponent<ListingSummaryComponentProps> = props => {
  const description = props.charter && props.charter.tagline;
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
