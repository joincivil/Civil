import * as React from "react";
import styled from "styled-components";
import { fonts } from "../../styleConstants";
import { DotProps, StyledLiProps, StepState } from "../StepProcessTopNav";
import * as ReactDom from "react-dom";

export interface StepTopNavNoButtonsProps {
  title: string | JSX.Element;
  isActive?: boolean;
  isCurrent?: boolean;
  startPosition?: number;
  complete?: boolean;
  disabled?: boolean;
  index?: number;
  children: React.ReactChild;
  onClick?(index: number): void;
  setStartPosition?(position: number): void;
}

const StyledLi = styled<StyledLiProps, "li">("li")`
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  box-sizing: border-box;
  font-family: ${props => props.theme.sansSerifFont};
  font-weight: ${props => (props.isCurrent ? 500 : 300)};
  margin-bottom: 0;
  padding: 3px 0 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: ${props => {
    if (props.isCurrent) {
      return props.theme.stepProccessTopNavCurrentColor;
    } else if (props.isActive) {
      return props.theme.stepProccessTopNavActiveColor;
    } else {
      return props.theme.stepProccessTopNavFutureColor;
    }
  }};
`;

const Dot = styled<DotProps, "div">("div")`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props): string =>
    props.isActive ? props.theme.stepProcessDotActiveColor : props.theme.stepProcessDotFutureColor};
  margin: 0;
  margin-bottom: 8px;
  box-sizing: border-box;
  ${(props): string =>
    props.isCurrent
      ? `margin-left: -${props.tailLength}px;
     width: ${props.tailLength! + 10 || 10}px;
     border-radius: 10px;
     `
      : ""};
`;

const CompleteDot = styled(Dot)`
  position: relative;
  width: 21px;
  height: 21px;
  z-index: 10;
  margin-top: -5px;
  margin-left: -2px;
  margin-bottom: 2px;
  background-color: ${props => props.theme.stepProcessDotActiveColor};
  border: 2px solid ${props => props.theme.stepProccessCompleteDotBorderColor};
  ${(props): string =>
    props.isCurrent ? `margin-left: ${props.tailLength ? props.tailLength! - 2 : -2}px;` : ""} &:after {
    content: "";
    position: absolute;
    left: 6px;
    top: 2.5px;
    width: 3px;
    height: 7px;
    border: solid white;
    border-width: 0 1.5px 1.5px 0;
    transform: rotate(45deg);
  }
`;

StyledLi.defaultProps = {
  theme: {
    sansSerifFont: fonts.SANS_SERIF,
    stepProccessTopNavCurrentColor: "blue",
    stepProccessTopNavActiveColor: "#404040",
    stepProccessTopNavFutureColor: "#bbb",
  },
};

Dot.defaultProps = {
  theme: {
    stepProcessDotActiveColor: "blue",
    stepProcessDotFutureColor: "#ddd",
  },
};

CompleteDot.defaultProps = {
  theme: {
    stepProccessCompleteDotBorderColor: "#fff",
    stepProcessDotActiveColor: "blue",
  },
};

export class StepNoButtons extends React.Component<StepTopNavNoButtonsProps, StepState> {
  public dot?: HTMLDivElement;

  constructor(props: StepTopNavNoButtonsProps) {
    super(props);
    this.state = {};
  }

  public componentDidMount(): void {
    if (this.props.setStartPosition) {
      this.props.setStartPosition(this.dot!.offsetLeft);
    }
    this.setState({ dotPosition: this.dot!.offsetLeft });
  }

  public render(): JSX.Element {
    const tailLength = this.state.dotPosition! - this.props.startPosition!;
    return (
      <StyledLi
        onClick={() => !this.props.disabled && this.props.onClick!(this.props.index!)}
        isActive={this.props.isActive}
        isCurrent={this.props.isCurrent}
        disabled={this.props.disabled}
      >
        <Dot
          innerRef={(el: HTMLDivElement) => (this.dot = el)}
          isActive={this.props.isActive}
          isCurrent={this.props.isCurrent}
          tailLength={tailLength}
        >
          {this.props.complete && <CompleteDot isCurrent={this.props.isCurrent} tailLength={tailLength} />}
        </Dot>{" "}
        {this.props.title}
      </StyledLi>
    );
  }
}
