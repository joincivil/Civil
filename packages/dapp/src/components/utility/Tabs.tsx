import * as React from "react";
import styled from "styled-components";

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
`;

const TabNav = styled.div`
  margin: 0 auto 50px;
  &.listings-nav {
    background-color: #E9E9EA;
    height: 76px;
  }
  &.listings-subnav {
    max-width: 1200px;
  }
`;

export interface TabsProps {
  className?: string;
}

export interface TabsState {
  activeTabIndex: number;
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

  public render(): JSX.Element {
    return (
      <div>
        <TabNav className={this.props.className}>
          <TabContainer>{this.renderChildrenWithTabsApiAsProps()}</TabContainer>
        </TabNav>
        <div>{this.renderActiveTabContent()}</div>
      </div>
    );
  }
}
