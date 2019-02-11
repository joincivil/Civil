import * as React from "react";
import styled from "styled-components";
import { CharterData } from "@joincivil/core";

import { colors, fonts } from "../styleConstants";
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

export const DashboardActivityItemCommitVote: React.SFC<DashboardActivityItemProps> = props => {
  const { logoUrl } = props;
  return (
    <StyledDashboardActivityItem>
      <StyledDashboardActivityItemIcon>
        {logoUrl && <SmallNewsroomLogo src={logoUrl} />}
      </StyledDashboardActivityItemIcon>

      <StyledDashboardActivityItemDetails>
        <DashboardActivityItemTitle title={props.title} />
        {props.children}
      </StyledDashboardActivityItemDetails>

      <StyledDashboardActivityItemAction>
        <DashboardActivityItemCTAButton {...props} />
      </StyledDashboardActivityItemAction>
    </StyledDashboardActivityItem>
  );
};
