import * as React from "react";
import styled from "styled-components";
import { colors } from "@joincivil/components";

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 1200px;
`;

export const TabNav = styled.div`
  margin: 0 auto 50px;
  width: 100%;
`;

export const ListingsNavTabs = TabNav.extend`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  height: 76px;
`;

export const ListingsSubnavTabs = TabNav.extend`
  max-width: 1200px;
`;

export const ListingNavTabs = TabNav.extend`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin-top: 30px;
  width: 100%;
  & > div {
    justify-content: left;
  }
`;

export interface TabsProps {
  tabNameComponent?: string;
}

export interface TabsState {
  activeTabIndex: number;
}

export interface RenderActiveTabContentProps {
  [index: string]: JSX.Element | undefined;
}

export class Tabs extends React.Component<TabsProps, TabsState> {
  constructor(props: {}, context: any) {
    super(props, context);
    this.state = {
      activeTabIndex: 0,
    };
  }

  public handleTabClick = (tabIndex: number): any => {
    this.setState({
      activeTabIndex: tabIndex === this.state.activeTabIndex ? 0 : tabIndex,
    });
    this.render();
  };

  // Encapsulate <Tabs/> component API as props for <Tab/> children
  public renderChildrenWithTabsApiAsProps = (): any => {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child as JSX.Element, {
        onClick: this.handleTabClick,
        tabIndex: index,
        isActive: index === this.state.activeTabIndex,
      });
    });
  };

  // Render current active tab content
  public renderActiveTabContent = (): JSX.Element => {
    const { children } = this.props;
    const { activeTabIndex } = this.state;

    if (children![activeTabIndex]) {
      return children![activeTabIndex].props.children;
    }
    return <></>;
  };

  // Render custom tab nav
  public renderTabNav = (): JSX.Element => {
    let CustomTabNav;

    switch (this.props.tabNameComponent) {
      case "listingsNavTabs":
        CustomTabNav = ListingsNavTabs;
        break;
      case "listingsSubnavTabs":
        CustomTabNav = ListingsSubnavTabs;
        break;
      case "listingNavTabs":
        CustomTabNav = ListingNavTabs;
        break;
      default:
        CustomTabNav = TabNav;
    }

    return (
      <CustomTabNav>
        <TabContainer>{this.renderChildrenWithTabsApiAsProps()}</TabContainer>
      </CustomTabNav>
    );
  };

  public render(): JSX.Element {
    return (
      <div>
        {this.renderTabNav()}
        <div>{this.renderActiveTabContent()}</div>
      </div>
    );
  }
}
