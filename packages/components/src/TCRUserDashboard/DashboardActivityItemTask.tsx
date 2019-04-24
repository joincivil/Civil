import * as React from "react";
import styled from "styled-components";

import { SmallNewsroomIcon } from "../ListingSummary/styledComponents";
import * as defaultNewsroomImgUrl from "../images/img-default-newsroom@2x.png";

import { DashboardActivityItemProps } from "./DashboardTypes";
import {
  StyledDashboardActivityItem,
  StyledDashboardActivityItemIcon,
  StyledDashboardActivityItemDetails,
} from "./DashboardStyledComponents";
import DashboardActivityItemTitle from "./DashboardActivityItemTitle";

export const DashboardActivityItemTask: React.FunctionComponent<DashboardActivityItemProps> = props => {
  const { logoUrl } = props;
  return (
    <StyledDashboardActivityItem>
      <StyledDashboardActivityItemIcon>
        {logoUrl && (
          <SmallNewsroomIcon>
            <img
              src={logoUrl}
              onError={e => {
                (e.target as any).src = defaultNewsroomImgUrl;
              }}
            />
          </SmallNewsroomIcon>
        )}
      </StyledDashboardActivityItemIcon>

      <StyledDashboardActivityItemDetails>
        <DashboardActivityItemTitle title={props.title} viewDetailURL={props.viewDetailURL} />
        {props.children}
      </StyledDashboardActivityItemDetails>
    </StyledDashboardActivityItem>
  );
};
