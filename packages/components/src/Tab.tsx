import * as React from "react";
import styled from "styled-components";
import { fonts } from "./styleConstants";

export interface TabProps {
  title: string;
  isActive?: boolean;
  index?: number;
  children: React.ReactChild;
  onClick?(index: number): void;
}

export interface StyledLiProps {
  isActive?: boolean;
}

const StyledLi = styled.li`
  padding: 3px 0 18px;
  margin-bottom: 0;
  width: 75px;
  box-sizing: border-box;
  text-align: center;
  font-weight: 600;
  font-family: ${props => props.theme.sanserifFont};
  border-bottom: ${(props: StyledLiProps) => (props.isActive ? "3px solid #01a0d2" : "none")};
`;

StyledLi.defaultProps = {
  theme: {
    sanserifFont: fonts.SANS_SERIF,
  },
};

export class Tab extends React.Component<TabProps> {
  public render(): JSX.Element {
    return (
      <StyledLi isActive={this.props.isActive} onClick={this.onClick}>
        {this.props.title}
      </StyledLi>
    );
  }
  private onClick = () => {
    this.props.onClick!(this.props.index!);
  };
}
