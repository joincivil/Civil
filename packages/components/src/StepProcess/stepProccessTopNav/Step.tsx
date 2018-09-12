import * as React from "react";
import styled from "styled-components";
import { fonts } from "../../styleConstants";

export interface StepProps {
  title: string | JSX.Element;
  isActive?: boolean;
  complete?: boolean;
  index?: number;
  children: React.ReactChild;
  onClick?(index: number): void;
  setStartPosition?(position: number): void;
}

export interface DotProps {
  isActive?: boolean;
}

const StyledLi = styled.li`
  box-sizing: border-box;
  font-family: ${props => props.theme.sansSerifFont};
  font-weight: 600;
  margin-bottom: 0;
  padding: 3px 0 18px;
  text-align: center;
  width: 75px;
`;

const Dot = styled<DotProps, "div">("div")`
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props): string => props.isActive ? "blue" : "#ddd"};
  margin: auto;
  margin-bottom: 10px;
`;

const CompleteDot = Dot.extend`
  width: 15px;
  height: 15px;
  background-color: "blue";
  margin-bottom: 5px;
  &:after {
    content: "";
    position: absolute;
    left: 4px;
    top: 1.5px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

StyledLi.defaultProps = {
  theme: {
    sansSerifFont: fonts.SANS_SERIF,
  },
};

export class Step extends React.Component<StepProps> {
  public render(): JSX.Element {
    return <StyledLi>{this.props.complete ? <CompleteDot isActive={this.props.isActive} /> : <Dot isActive={this.props.isActive}/>} {this.props.title}</StyledLi>;
  }
}
