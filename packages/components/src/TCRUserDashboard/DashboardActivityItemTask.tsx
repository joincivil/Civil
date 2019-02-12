import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { SmallNewsroomLogo } from "../ListingSummary/styledComponents";

import { DashboardActivityItemProps } from "./DashboardTypes";
import {
  StyledDashboardActivityItem,
  StyledDashboardActivityItemIcon,
  StyledDashboardActivityItemDetails,
  StyledDashboardActivityItemAction,
} from "./styledComponents";
import DashboardActivityItemTitle from "./DashboardActivityItemTitle";
import DashboardActivityItemCTAButton from "./DashboardActivityItemCTAButton";

export const DashboardActivityItemTask: React.SFC<DashboardActivityItemProps> = props => {
  const { logoUrl, viewDetailURL } = props;
  return (
    <StyledDashboardActivityItem>
      <StyledDashboardActivityItemIcon>
        {logoUrl && <SmallNewsroomLogo src={logoUrl} />}
      </StyledDashboardActivityItemIcon>

      <StyledDashboardActivityItemDetails>
        <DashboardActivityItemTitle title={props.title} viewDetailURL={props.viewDetailURL} />
        {props.children}
      </StyledDashboardActivityItemDetails>

      <StyledDashboardActivityItemAction>
        <DashboardActivityItemCTAButton {...props} />

        {viewDetailURL && <Link to={viewDetailURL}>View details &gt;</Link>}
      </StyledDashboardActivityItemAction>
    </StyledDashboardActivityItem>
  );
};
