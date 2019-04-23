import * as React from "react";
import styled from "styled-components";
import { buttonSizes, InvertedButton } from "../Button";
import { CharterData } from "@joincivil/core";
import { SmallNewsroomIcon } from "../ListingSummary/styledComponents";
import * as defaultNewsroomImgUrl from "../images/img-default-newsroom@2x.png";
import {
  StyledDashboardActivityItem,
  StyledDashboardActivityItemDetails,
  StyledNewsroomName,
} from "./DashboardStyledComponents";

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

export const DashboardActivityItem: React.FunctionComponent<DashboardActivityItemProps> = props => {
  return (
    <StyledDashboardActivityItem>
      <StyledDashboardActivityItemIcon>
        {props.charter &&
          props.charter.logoUrl && (
            <SmallNewsroomIcon>
              <img
                src={props.charter.logoUrl}
                onError={e => {
                  (e.target as any).src = defaultNewsroomImgUrl;
                }}
              />
            </SmallNewsroomIcon>
          )}
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
