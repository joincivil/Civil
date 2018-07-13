import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { colors } from "./styleConstants";

export interface QuestionToolTipProps {
  explainerText: React.ReactNode;
}

export interface QuestionToolTipState {
  open: boolean;
}

export interface TipProps {
  bottom: number;
  left: number;
}

const Tip = styled<TipProps, "div">("div")`
  position: absolute;
  bottom: ${(props: TipProps) => props.bottom}px;
  left: ${(props: TipProps) => props.left}px;
  margin-left: -90px;
  width: 180px;
  color: ${colors.basic.WHITE};
  background: rgba(21, 21, 21, 0.9);
  text-align: center;
  border-radius: 3px;
  padding: 13px;
  font-size: 12px;
  &:after {
    content: "";
    position: absolute;
    left: calc(50% - 5px);
    top: 100%;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 10px solid rgba(21, 21, 21, 0.9);
  }
`;

const Wrapper = styled.div`
  width: 18px;
  height: 18px;
  position: relative;
`;

const HitBox = styled.div`
  position: absolute;
  width: 180px;
  height: 50px;
  bottom: 0;
  left: -81px;
  border-radius: 50%;
  background-color: transparent;
`;

export class QuestionToolTip extends React.Component<QuestionToolTipProps, QuestionToolTipState> {
  public divEl: HTMLDivElement | null;
  public bucket: HTMLDivElement = document.createElement("div");

  constructor(props: QuestionToolTipProps) {
    super(props);
    this.divEl = null;
    this.state = {
      open: false,
    };
  }

  public componentDidMount(): void {
    document.body.appendChild(this.bucket);
  }

  public componentWillUnmount(): void {
    this.bucket.remove();
  }

  public render(): JSX.Element {
    let tip = null;
    let hitBox = null;
    if (this.state.open) {
      tip = ReactDOM.createPortal(
        <Tip left={this.getLeft()} bottom={this.getTop()}>
          {this.props.explainerText}
        </Tip>,
        this.bucket,
      );
      hitBox = <HitBox />;
    }
    return (
      <Wrapper
        innerRef={(el: HTMLDivElement) => (this.divEl = el)}
        onMouseLeave={this.onMouseLeave}
        onMouseEnter={this.onMouseEnter}
      >
        {tip}
        {hitBox}
        <svg height="18" viewBox="0 0 18 18" width="18" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="evenodd" opacity=".56">
            <path d="m0 0h18v18h-18z" stroke="#000" strokeOpacity=".008" strokeWidth=".5" />
            <path
              d="m8.25 13.5h1.5v-1.5h-1.5zm.75-12c-4.13999999 0-7.5 3.36000001-7.5 7.5 0 4.1400003 3.36000001 7.5 7.5 7.5 4.1400003 0 7.5-3.3599997 7.5-7.5 0-4.14000035-3.3599997-7.5-7.5-7.5zm0 13.5c-3.30749989 0-6-2.6925002-6-6 0-3.30749989 2.69250011-6 6-6 3.3074998 0 6 2.69250011 6 6 0 3.3074998-2.6925002 6-6 6zm0-10.5c-1.65750003 0-3 1.34249997-3 3h1.5c0-.82500029.6749997-1.5 1.5-1.5.82500023 0 1.5.67499971 1.5 1.5 0 1.5-2.25 1.3125-2.25 3.75h1.5c0-1.6875 2.25-1.875 2.25-3.75 0-1.65750003-1.3425-3-3-3z"
              fill="#000"
            />
          </g>
        </svg>
      </Wrapper>
    );
  }

  private getLeft = (): number => {
    const box = this.divEl!.getBoundingClientRect();
    return box.left - box.width / 4;
  };

  private getTop = (): number => {
    const box = this.divEl!.getBoundingClientRect();
    return box.top + box.height / 2 + 3;
  };

  private onMouseEnter = (): void => {
    this.setState({ open: true });
  };

  private onMouseLeave = (): void => {
    this.setState({ open: false });
  };
}
