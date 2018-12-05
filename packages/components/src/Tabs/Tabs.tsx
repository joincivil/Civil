import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors } from "../styleConstants";
import { ExpandDownArrow } from "../icons";

import { TabProps } from "./Tab";
import { StyledNav, StyledResponsiveTabsToggleButton, TabContainer } from "./TabsStyled";

export interface TabsProps {
  activeIndex?: number;
  children: Array<React.ReactElement<TabProps>>;
  TabComponent?: any;
  TabsNavComponent?: any;
  TabsNavBefore?: React.ReactElement<any>;
  TabsNavAfter?: React.ReactElement<any>;
  onActiveTabChange?(activeIndex: number): void;
}

export interface TabsState {
  activeIndex: number;
  isResponsiveTabsetVisible: boolean;
}

export class Tabs extends React.Component<TabsProps, TabsState> {
  public static getDerivedStateFromProps(nextProps: TabsProps, prevState: TabsState): TabsState {
    return {
      ...prevState,
      activeIndex: typeof nextProps.activeIndex === "number" ? nextProps.activeIndex : prevState.activeIndex,
    };
  }

  constructor(props: TabsProps) {
    super(props);
    this.state = {
      activeIndex: props.activeIndex || 0,
      isResponsiveTabsetVisible: false,
    };
  }

  public renderTabs(): Array<React.ReactElement<TabProps>> {
    return React.Children.map(this.props.children, (child: React.ReactChild, index) => {
      return React.cloneElement(child as React.ReactElement<TabProps>, {
        index,
        isActive: this.state.activeIndex === index,
        isResponsiveAndVisible: this.state.isResponsiveTabsetVisible,
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
    const TabComponentOrnamental = styled(this.props.TabComponent || "span")`
      cursor: default;
    `;
    const arrowColor = this.state.isResponsiveTabsetVisible ? colors.accent.CIVIL_BLUE : colors.accent.CIVIL_GRAY_2;

    return (
      <div>
        <TabsNavComponent>
          <TabContainer>
            {this.props.TabsNavBefore && <TabComponentOrnamental>{this.props.TabsNavBefore}</TabComponentOrnamental>}
            {this.renderTabs()}
            {this.props.TabsNavAfter && <TabComponentOrnamental>{this.props.TabsNavAfter}</TabComponentOrnamental>}
          </TabContainer>

          <StyledResponsiveTabsToggleButton
            isExpanded={this.state.isResponsiveTabsetVisible}
            onClick={this.toggleResponsiveVisible}
          >
            <ExpandDownArrow color={arrowColor} opacity={1} />
          </StyledResponsiveTabsToggleButton>
        </TabsNavComponent>
        <div>{this.renderContent()}</div>
      </div>
    );
  }

  private handleClick = (index: number) => {
    this.setState({ activeIndex: index });
    if (this.props.onActiveTabChange) {
      this.props.onActiveTabChange(index);
    }
  };

  private toggleResponsiveVisible = () => {
    this.setState({ isResponsiveTabsetVisible: !this.state.isResponsiveTabsetVisible });
  };
}
