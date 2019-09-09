import * as React from "react";
import styled from "styled-components";
import { fonts } from "../styleConstants";

export interface TabProps {
  title: string | JSX.Element;
  isActive?: boolean;
  isResponsiveAndVisible?: boolean;
  index?: number;
  children: React.ReactChild;
  TabComponent?: any;
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
  width: 75px;
  cursor: ${(props: TabComponentProps) => (props.isActive ? "default" : "pointer")};

  & a {
    color: inherit;
  }
`;

StyledLi.defaultProps = {
  theme: {
    sansSerifFont: fonts.SANS_SERIF,
  },
};

export const Count = styled.span`
  font-weight: 400;
`;

export class Tab extends React.Component<TabProps> {
  public render(): JSX.Element {
    const TabComponent = this.props.TabComponent || StyledLi;

    return (
      <TabComponent
        isActive={this.props.isActive}
        isResponsiveAndVisible={this.props.isResponsiveAndVisible}
        onClick={this.onClick}
      >
        {this.props.title}
      </TabComponent>
    );
  }
  private onClick = () => {
    this.props.onClick!(this.props.index!);
  };
}
