import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "../styleConstants";
import { buttonSizes, InvertedButton } from "../Button";

const StyledDashboardActivityItem = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  box-sizing: border-box;
  display: flex;
  padding: 25px;
  justify-content: space-between;
`;

const StyledDashboardActivityItemIcon = styled.div`
  margin-right: 16px;
  width: 50px;
`;

const IconPlaceHolder = styled.figure`
  background: ${colors.accent.CIVIL_GRAY_4};
  height: 52px;
  margin: 0;
  padding: 0;
  width: 52px;
`;

const StyledDashboardActivityItemDetails = styled.div`
  flex-grow: 1;
  font-size: 14px;
  line-height: 22px;
  margin-right: 30px;
`;

const StyledNewsroomName = styled.h4`
  font: 800 21px/26px ${fonts.SERIF};
  margin: 0 0 10px;
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
  listingDetailURL: string;
  buttonText: string;
  buttonHelperText?: string | JSX.Element;
  challengeID?: string;
  toggleSelect?(challengeID: string, isSelected: boolean): void;
}

export const DashboardActivityItem: React.SFC<DashboardActivityItemProps> = props => {
  return (
    <StyledDashboardActivityItem>
      <StyledDashboardActivityItemIcon>
        {props.toggleSelect && ItemCheckbox(props)}
        {!props.toggleSelect && <IconPlaceHolder />}
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

const ItemCheckbox: React.SFC<DashboardActivityItemProps> = props => {
  const handleChange = (event: any) => {
    props.toggleSelect!(props.challengeID!, event.target.checked);
  };
  return <input type="checkbox" onChange={handleChange} />;
};
