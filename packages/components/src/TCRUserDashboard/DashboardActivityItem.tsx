import * as React from "react";
import styled from "styled-components";
import { buttonSizes, InvertedButton } from "../Button";
import { CharterData } from "@joincivil/core";
import { SmallNewsroomLogo } from "../ListingSummary/styledComponents";
import {
  StyledDashboardActivityItem,
  StyledDashboardActivityItemDetails,
  StyledNewsroomName,
} from "./styledComponents";

const StyledDashboardActivityItemIcon = styled.div`
  margin-right: 16px;
  width: 50px;
`;

const StyledDashboardActivityItemAction = styled.div`
  text-align: right;
`;

const StyledButtonHelperText = styled.div`
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  margin: 0 0 10px;
`;

export interface DashboardActivityItemProps {
  newsroomName: string;
  charter?: CharterData;
  listingDetailURL: string;
  buttonText: string;
  buttonHelperText?: string | JSX.Element;
  challengeID?: string;
  salt?: any;
  toggleSelect?(challengeID: string, isSelected: boolean, salt: any): void;
}

export const DashboardActivityItem: React.SFC<DashboardActivityItemProps> = props => {
  return (
    <StyledDashboardActivityItem>
      <StyledDashboardActivityItemIcon>
        {props.charter &&
          props.charter.logoUrl && <SmallNewsroomLogo src={props.charter.logoUrl} />}
      </StyledDashboardActivityItemIcon>

      <StyledDashboardActivityItemDetails>
        <StyledNewsroomName>{props.newsroomName}</StyledNewsroomName>
        {props.children}
      </StyledDashboardActivityItemDetails>

      <StyledDashboardActivityItemAction>
        <StyledButtonHelperText>{props.buttonHelperText}</StyledButtonHelperText>
        <InvertedButton to={props.listingDetailURL} size={buttonSizes.SMALL}>
          {props.buttonText}
        </InvertedButton>
      </StyledDashboardActivityItemAction>
    </StyledDashboardActivityItem>
  );
};
