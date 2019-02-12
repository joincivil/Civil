import * as React from "react";

import { DashboardActivityItemTitleProps } from "./DashboardTypes";
import { StyledDashboardActivityItemTitle } from "./styledComponents";

const DashboardActivityItemTitle: React.SFC<DashboardActivityItemTitleProps> = props => {
  return <StyledDashboardActivityItemTitle>{props.title}</StyledDashboardActivityItemTitle>;
};

export default DashboardActivityItemTitle;
