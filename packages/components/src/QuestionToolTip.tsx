import * as React from "react";
import styled from "styled-components";
import { ToolTip, ToolTipProps } from "./ToolTip";
import { colors } from "./styleConstants";

const Outer = styled.div`
  display: inline-block;
  vertical-align: top;
`;

const Wrapper = styled.div`
  width: 18px;
  height: 18px;
  position: relative;
  margin-left: 5px;
  margin-top: -1px;
`;

export class QuestionToolTip extends React.Component<ToolTipProps> {
  public render(): JSX.Element {
    const color = this.props.disabled ? colors.accent.CIVIL_GRAY_3 : colors.primary.BLACK;
    return (
      <Outer>
        <ToolTip {...this.props}>
          <Wrapper>
            <svg height="18" viewBox="0 0 18 18" width="18" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd" opacity=".56">
                <path d="m0 0h18v18h-18z" stroke={color} strokeOpacity=".008" strokeWidth=".5" />
                <path
                  d="m8.25 13.5h1.5v-1.5h-1.5zm.75-12c-4.13999999 0-7.5 3.36000001-7.5 7.5 0 4.1400003 3.36000001 7.5 7.5 7.5 4.1400003 0 7.5-3.3599997 7.5-7.5 0-4.14000035-3.3599997-7.5-7.5-7.5zm0 13.5c-3.30749989 0-6-2.6925002-6-6 0-3.30749989 2.69250011-6 6-6 3.3074998 0 6 2.69250011 6 6 0 3.3074998-2.6925002 6-6 6zm0-10.5c-1.65750003 0-3 1.34249997-3 3h1.5c0-.82500029.6749997-1.5 1.5-1.5.82500023 0 1.5.67499971 1.5 1.5 0 1.5-2.25 1.3125-2.25 3.75h1.5c0-1.6875 2.25-1.875 2.25-3.75 0-1.65750003-1.3425-3-3-3z"
                  fill={color}
                />
              </g>
            </svg>
          </Wrapper>
        </ToolTip>
      </Outer>
    );
  }
}
