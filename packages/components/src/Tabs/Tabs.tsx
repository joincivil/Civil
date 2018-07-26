import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { TabProps } from "./Tab";
import { colors } from "../styleConstants";

export interface TabsProps {
  activeIndex?: number;
  children: Array<React.ReactElement<TabProps>>;
  TabComponent?: any;
  TabsNavComponent?: any;
}

export interface TabsState {
  activeIndex: number;
}

const StyledNav = styled.nav`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_2};
`;

const TabContainer = styled.ul`
  display: flex;
  list-style: none;
  margin: 0 auto;
  padding: 0;
`;

export class Tabs extends React.Component<TabsProps, TabsState> {
  constructor(props: TabsProps) {
    super(props);
    this.state = {
      activeIndex: props.activeIndex || 0,
    };
  }

  public renderTabs(): Array<React.ReactElement<TabProps>> {
    return React.Children.map(this.props.children, (child: React.ReactChild, index) => {
      return React.cloneElement(child as React.ReactElement<TabProps>, {
        index,
        isActive: this.state.activeIndex === index,
        onClick: this.handleClick,
        TabComponent: this.props.TabComponent,
      });
    });
  }

  public renderContent(): React.ReactNode | undefined {
    const children = this.props.children;
    const { activeIndex } = this.state;
    if (children[activeIndex]) {
      return children[activeIndex].props.children;
    }
  }

  public render(): JSX.Element {
    const TabsNavComponent = this.props.TabsNavComponent || StyledNav;
    return (
      <div>
        <TabsNavComponent>
          <TabContainer>{this.renderTabs()}</TabContainer>
        </TabsNavComponent>
        <div>{this.renderContent()}</div>
      </div>
    );
  }
  private handleClick = (index: number) => {
    this.setState({ activeIndex: index });
  };
}
