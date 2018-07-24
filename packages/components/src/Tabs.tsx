import * as React from "react";
import styled from "styled-components";
import { TabProps } from "./Tab";

export interface TabsProps {
  activeIndex?: number;
  children: Array<React.ReactElement<TabProps>>;
}

export interface TabsState {
  activeIndex: number;
}

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
    return <div>
      <ul>
        {this.renderTabs()}
      </ul>
      <div>
        {this.renderContent()}
      </div>
    </div>;

  }
  private handleClick = (index: number) => {
    this.setState({activeIndex: index});
  }
}
