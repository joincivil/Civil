import * as React from "react";
import styled from "styled-components";

const StyledUL = styled.ul`
  border-bottom: 1px solid #aaa;
  margin: 0 0 10px;
  padding: 0;
`;

export interface TabsState {
  activeTabIndex: number;
}

export class Tabs extends React.Component<{}, TabsState> {
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
        <StyledUL>{this.renderChildrenWithTabsApiAsProps()}</StyledUL>
        <div>{this.renderActiveTabContent()}</div>
      </div>
    );
  }
}
