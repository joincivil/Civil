import * as React from "react";
// tslint:disable-next-line
import styled, {StyledComponentClass} from "styled-components";
import { colorConstants } from "../../colorConstants";

export interface IndicatorState {
  open: boolean;
}

export interface IndicatorProps {
  title: string;
  description: string;
  icon: JSX.Element;
  key: string;
  readOnly: boolean;
  checked?: boolean;
  addOrRemove?(): void;
}

export const IndicatorHeader = styled.h5`
  font-family: "Libre Franklin", sans-serif;
  font-weight: 600;
  font-size: 14px;
  margin: 0;
  color: ${colorConstants.BLACK};
  vertical-align: middle;
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  position: relative;
  padding: 0 7px;
  height: 36px;
  box-sizing: border-box;
`;

export const IconWrapper = styled.span`
  margin: 0 7px 0 0;
  height: 16px;
`;

export interface IndicatorDescriptionProps {
  open: boolean;
}

export const IndicatorDescription = styled<IndicatorDescriptionProps, "p">("p")`
  margin: 0;
  height: ${(props: IndicatorDescriptionProps): string => props.open ? "auto" : "0"};
  overflow: hidden;
  font-family: "Libre Franklin", sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: ${colorConstants.PRIMARY_DARK_GREY};
  line-height: 20px;
  padding-left: 31px;
  box-sizing; border-box;
`;

export const IndicatorListItem = styled.li`
  margin: 0;
  padding: 7px 0;
  transition: height 1s;
  cursor: pointer;
  border-bottom: 1px solid ${colorConstants.ACCENT_FADED_GREY};
`;

export interface CollapseIndicatorProps {
  open: boolean;
}

export const CollapseIndicator = styled.span`
  position: absolute;
  right: 7px;
  top: 9.5px;
  font-weight: 400;
  font-size: 15px;
`;

export class Indicator extends React.Component<IndicatorProps, IndicatorState> {
  constructor(props: IndicatorProps) {
    super(props);
    this.state = {
      open: false,
    };
  }
  public toggle(): void {
    this.setState({ open: !this.state.open });
  }
  public toggleIndicator(e: any): void {
    e.stopPropagation();
    if (this.props.addOrRemove) {
      this.props.addOrRemove();
    }
  }
  public render(): JSX.Element {
    let firstPart = <IconWrapper>{this.props.icon}</IconWrapper>;
    if (!this.props.readOnly) {
      firstPart = <IconWrapper>
        <input
          onClick={(e: any) => this.toggleIndicator(e)}
          type="checkbox"
          checked={this.props.checked}
        />
      </IconWrapper>;
    }
    return <IndicatorListItem onClick={() => this.toggle()}>
      <IndicatorHeader>
        {firstPart}
        <span>{this.props.title}</span>
        <CollapseIndicator>{this.state.open ? "−" : "+" }</CollapseIndicator>
      </IndicatorHeader>
      <IndicatorDescription open={this.state.open}>{this.props.description}</IndicatorDescription>
    </IndicatorListItem>;
  }
}
