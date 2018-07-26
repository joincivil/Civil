import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { fonts } from "./styleConstants";

export interface TabProps {
  title: string | JSX.Element;
  isActive?: boolean;
  index?: number;
  children: React.ReactChild;
  TabComponent?: any;
  onClick?(index: number): void;
}

export interface TabComponentProps {
  isActive?: boolean;
  onClick?(e: any): void;
}

const StyledLi = styled.li`
  border-bottom: ${(props: TabComponentProps) => (props.isActive ? "3px solid #01a0d2" : "none")};
  box-sizing: border-box;
  font-family: ${props => props.theme.sanserifFont};
  font-weight: 600;
  margin-bottom: 0;
  padding: 3px 0 18px;
  text-align: center;
  width: 75px;
`;

StyledLi.defaultProps = {
  theme: {
    sanserifFont: fonts.SANS_SERIF,
  },
};

export const Count = styled.span`
  font-weight: 400;
`;

export class Tab extends React.Component<TabProps> {
  public render(): JSX.Element {
    const TabComponent = this.props.TabComponent || StyledLi;

    return (
      <TabComponent isActive={this.props.isActive} onClick={this.onClick}>
        {this.props.title}
      </TabComponent>
    );
  }
  private onClick = () => {
    this.props.onClick!(this.props.index!);
  };
}
