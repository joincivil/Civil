import * as React from "react";
import { NewsroomTaglineProps } from "./types";
import { StyledListingSummaryDescription } from "./styledComponents";

const NewsroomTagline: React.SFC<NewsroomTaglineProps> = props => {
  let { description } = props;
  if (!description) {
    return null;
  }

  const maxDescriptionLength = 120;
  if (description && description.length > maxDescriptionLength) {
    description = description.substring(0, maxDescriptionLength) + "...";
  }

  return <StyledListingSummaryDescription>{description}</StyledListingSummaryDescription>;
};

export default NewsroomTagline;
