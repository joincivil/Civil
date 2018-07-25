import * as React from "react";
import styled, {StyledComponentClass} from "styled-components";
import { TabProps, TabComponentProps } from "./Tab";

export interface TabsProps {
  activeIndex?: number;
  children: Array<React.ReactElement<TabProps>>;
  TabComponent?: any;
}

export interface TabsState {
  activeIndex: number;
}

const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #d8d8d8;
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
    return (
      <div>
        <StyledUl>{this.renderTabs()}</StyledUl>
        <div>{this.renderContent()}</div>
      </div>
    );
  }
  private handleClick = (index: number) => {
    this.setState({ activeIndex: index });
  };
}
