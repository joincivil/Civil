import * as React from "react";
import styled from "styled-components";

import { SmallNewsroomLogo } from "../ListingSummary/styledComponents";

import { DashboardActivityItemProps } from "./DashboardTypes";
import {
  StyledDashboardActivityItem,
  StyledDashboardActivityItemIcon,
  StyledDashboardActivityItemDetails,
} from "./styledComponents";
import DashboardActivityItemTitle from "./DashboardActivityItemTitle";

export const DashboardActivityItemTask: React.SFC<DashboardActivityItemProps> = props => {
  const { logoUrl } = props;
  return (
    <StyledDashboardActivityItem>
      <StyledDashboardActivityItemIcon>
        {logoUrl && <SmallNewsroomLogo src={logoUrl} />}
      </StyledDashboardActivityItemIcon>

      <StyledDashboardActivityItemDetails>
        <DashboardActivityItemTitle title={props.title} viewDetailURL={props.viewDetailURL} />
        {props.children}
      </StyledDashboardActivityItemDetails>
    </StyledDashboardActivityItem>
  );
};
