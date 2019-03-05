import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "../styleConstants";
import { Button } from "../";
import { buttonSizes } from "../Button";

const AskTracking = styled.div`
  background-color: ${colors.accent.CIVIL_YELLOW};
  color: ${colors.primary.BLACK};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: 500;
  height: 48px;
  padding: 8px 0;
  text-align: center;
  text-transform: uppercase;
  width: 100%;
`;

export interface AskTrackingBarProps {
  onClickYes(ev: any): void;
  onClickNo(ev: any): void;
}

export class AskTrackingBar extends React.Component<AskTrackingBarProps> {
  public render(): JSX.Element {
    return (
      <AskTracking>
        Allow Civil to collect Anonymized App Usage Data?{" "}
        <Button size={buttonSizes.SMALL} onClick={this.props.onClickYes}>
          YES
        </Button>{" "}
        <Button size={buttonSizes.SMALL} onClick={this.props.onClickNo}>
          NO
        </Button>{" "}
      </AskTracking>
    );
  }
}
