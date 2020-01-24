import * as React from "react";
import styled from "styled-components";

import { colors } from "../styleConstants";
import { ExpandDownArrow } from "../icons";

import { TabProps } from "./Tab";
import { StyledTabsContainer, StyledNav, StyledResponsiveTabsToggleButton, TabContainer } from "./TabsStyled";

export interface TabsProps {
  activeIndex?: number;
  flex?: boolean;
  children: Array<React.ReactElement<TabProps>>;
  TabComponent?: any;
  TabsNavComponent?: any;
  TabsNavBefore?: React.ReactElement;
  TabsNavAfter?: React.ReactElement;
  /** Set to `true` to prevent tab change silently. If set to a string, on tab change attempt string will be passed to `window.confirm`: if user hits "cancel" tab change will be prevented. */
  preventTabChange?: boolean | string;
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
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child as React.ReactElement, {
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
      <StyledTabsContainer flex={this.props.flex}>
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
      </StyledTabsContainer>
    );
  }

  private handleClick = (index: number) => {
    if (
      this.props.preventTabChange &&
      (this.props.preventTabChange === true || !window.confirm(this.props.preventTabChange))
    ) {
      return;
    }

    this.setState({ activeIndex: index });
    if (this.props.onActiveTabChange) {
      this.props.onActiveTabChange(index);
    }
  };

  private toggleResponsiveVisible = () => {
    this.setState({ isResponsiveTabsetVisible: !this.state.isResponsiveTabsetVisible });
  };
}
