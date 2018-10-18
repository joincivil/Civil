import * as React from "react";
import styled from "styled-components";
import { StepTopNavProps } from "./Step";

export interface StepsProps {
  activeIndex?: number;
  children: Array<React.ReactElement<StepTopNavProps>>;
  startPosition?: number;
  onActiveTabChange?(activeIndex: number): void;
}

export interface StepProcessTopNavState {
  activeIndex: number;
  startPosition?: number;
}

const StyledNav = styled.div`
  position: relative;
  height: 76px;
  margin: 0 auto;
  width: 100%;
  & > ul {
    justify-content: space-between;
  }
`;

const StyledContainer = styled.ul`
  display: flex;
  list-style: none;
  margin: 0 auto;
  padding: 0;
`;

const MainSection = styled.div`
  background-color: #fff;
  padding: 45px 115px;
`;

const ButtonSection = styled.div`
  border-top: 1px solid rgb(233, 233, 234);
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 25px;
  & > button {
    margin-left: 15px;
  }
`;

export class StepProcessTopNav extends React.Component<StepsProps, StepProcessTopNavState> {
  public buttonContainer?: HTMLDivElement;

  constructor(props: StepsProps) {
    super(props);
    this.state = {
      activeIndex: props.activeIndex || 0,
    };
  }

  public componentDidUpdate(prevProps: StepsProps, prevState: StepProcessTopNavState): void {
    if (typeof this.props.activeIndex === "undefined") {
      return;
    }
    if (this.state.activeIndex !== prevState.activeIndex) {
      return;
    }
    if (this.props.activeIndex !== prevProps.activeIndex) {
      this.setState({ activeIndex: this.props.activeIndex });
    } else if (prevProps.activeIndex !== prevState.activeIndex && this.props.activeIndex !== this.state.activeIndex) {
      this.setState({ activeIndex: this.props.activeIndex });
    }
  }

  public renderTabs(): Array<React.ReactElement<StepTopNavProps>> {
    return React.Children.map(this.props.children, (child: React.ReactChild, index) => {
      return React.cloneElement(child as React.ReactElement<StepTopNavProps>, {
        index,
        startPosition: this.state.startPosition,
        isCurrent: this.state.activeIndex === index,
        isActive: this.state.activeIndex >= index,
        onClick: this.handleClick,
        setStartPosition: index === 0 ? this.setStartPosition : undefined,
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

  public renderButtons(): JSX.Element | undefined {
    const children = this.props.children;
    const { activeIndex } = this.state;
    if (children[activeIndex] && children[activeIndex].props.renderButtons) {
      return children[activeIndex].props.renderButtons!({
        goNext: this.goNext,
        goPrevious: this.goPrevious,
        index: this.state.activeIndex,
        stepsLength: children.length,
      });
    }
  }

  public render(): JSX.Element {
    return (
      <div>
        <StyledNav>
          <StyledContainer>{this.renderTabs()}</StyledContainer>
        </StyledNav>
        <MainSection>{this.renderContent()}</MainSection>
        <ButtonSection>{this.renderButtons()}</ButtonSection>
      </div>
    );
  }

  private setStartPosition = (position: number): void => {
    this.setState({ startPosition: position });
  };

  private goNext = (): void => {
    const newIndex = this.state.activeIndex + 1;
    if (this.props.onActiveTabChange) {
      this.props.onActiveTabChange(newIndex);
    }
    this.setState({ activeIndex: newIndex });
  };

  private goPrevious = (): void => {
    const newIndex = this.state.activeIndex - 1;
    if (this.props.onActiveTabChange) {
      this.props.onActiveTabChange(newIndex);
    }
    this.setState({ activeIndex: newIndex });
  };

  private handleClick = (index: number): void => {
    if (this.props.onActiveTabChange) {
      this.props.onActiveTabChange(index);
    }
    this.setState({ activeIndex: index });
  };
}
