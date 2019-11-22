import * as React from "react";
import styled from "styled-components";
import { fonts, colors } from "../styleConstants";

export interface TabProps {
  title: string | JSX.Element;
  isActive?: boolean;
  isResponsiveAndVisible?: boolean;
  index?: number;
  children: React.ReactChild;
  TabComponent?: any;
  badgeNum?: number;
  onClick?(index: number): void;
}

export interface TabComponentProps {
  isActive?: boolean;
  isResponsiveAndVisible?: boolean;
  onClick?(e: any): void;
}

const StyledLi = styled.li`
  border-bottom: ${(props: TabComponentProps) => (props.isActive ? "3px solid #01a0d2" : "none")};
  box-sizing: border-box;
  font-family: ${props => props.theme.sansSerifFont};
  font-weight: ${(props: TabComponentProps) => (props.isActive ? "600" : "400")};
  margin-bottom: 0;
  padding: 3px 0 18px;
  text-align: center;
  cursor: ${(props: TabComponentProps) => (props.isActive ? "default" : "pointer")};

  & a {
    color: inherit;
  }
  flex-grow: 1;
`;

StyledLi.defaultProps = {
  theme: {
    sansSerifFont: fonts.SANS_SERIF,
  },
};

export const Count = styled.span`
  font-weight: 400;
`;

const StyledBadge = styled.figure`
  position: absolute;
  top: -20px;
  right: -60px;
  border-radius: 10px;
  background: ${colors.accent.CIVIL_RED_2};
  color: white;
  font-size: 10px;
  font-weight: 400;
  width: 20px;
  height: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const StyledTabTitle = styled.div`
  position: relative;
  display: inline-block;
`;

export class Tab extends React.Component<TabProps> {
  public render(): JSX.Element {
    const { badgeNum } = this.props;
    const TabComponent = this.props.TabComponent || StyledLi;
    const displayBadge = badgeNum && badgeNum > 0;
    let badgeCount = "";
    if (displayBadge) {
      if (badgeNum! > 99) {
        badgeCount = "99+";
      } else {
        badgeCount = badgeNum + "";
      }
    }
    return (
      <TabComponent
        isActive={this.props.isActive}
        isResponsiveAndVisible={this.props.isResponsiveAndVisible}
        onClick={this.onClick}
      >
        <StyledTabTitle>
          {this.props.title}
          {displayBadge && <StyledBadge>{badgeCount}</StyledBadge>}
        </StyledTabTitle>
      </TabComponent>
    );
  }
  private onClick = () => {
    this.props.onClick!(this.props.index!);
  };
}
