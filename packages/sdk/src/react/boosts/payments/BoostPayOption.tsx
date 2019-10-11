import * as React from "react";
import styled from "styled-components";
import { colors, fonts, mediaQueries } from "@joincivil/components";

const BoostPayOptionWrapper = styled.div`
  box-sizing: border-box;
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  border-radius: 5px;
  font-family: ${fonts.SANS_SERIF};
  font-weight: normal;
  font-size: 14px;
  margin: 0 auto 40px;
  padding: 20px;
  position: relative;
  transition: border 0.2s ease;
  width: 100%;

  ${mediaQueries.MOBILE} {
    border-radius: 0;
    padding: 15px;
    margin-bottom: 16px;
  }
`;

const BoostPayOptionHeader = styled.div`
  align-items: center;
  color: ${(props: BoostPayOptionStyleProps) =>
    props.selected ? colors.accent.CIVIL_BLUE : colors.accent.CIVIL_GRAY_1};
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
  transition: color 0.2s ease;
`;

const BoostPayOptionCircle = styled.div`
  background-color: ${colors.basic.WHITE};
  border: ${(props: BoostPayOptionStyleProps) =>
    props.selected ? "5px solid" + colors.accent.CIVIL_BLUE : "1px solid" + colors.accent.CIVIL_GRAY_2};
  border-radius: 50%;
  height: 22px;
  margin-right: 13px;
  width: 22px;
`;

const BoostPayOptionBtn = styled.button`
  background-color: ${colors.basic.WHITE};
  border: none;
  margin: 0 auto 40px;
  padding: 0;
  text-align: left;
  width: 100%;

  ${mediaQueries.MOBILE} {
    margin-bottom: 16px;
  }

  ${BoostPayOptionWrapper} {
    margin: 0;
  }

  &:hover {
    ${BoostPayOptionWrapper} {
      border: 1px solid ${colors.accent.CIVIL_BLUE};
    }

    ${BoostPayOptionHeader} {
      color: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

export interface BoostPayOptionStyleProps {
  selected: boolean;
}

export interface BoostPayOptionProps {
  paymentType: string;
  optionLabel: string | JSX.Element;
  selected: boolean;
  handlePaymentSelected?(paymentType: string): void;
}

export class BoostPayOption extends React.Component<BoostPayOptionProps> {
  public render(): JSX.Element {
    if (!this.props.selected) {
      return <BoostPayOptionBtn onClick={this.handlePaymentSelected}>{this.renderPaymentOption()}</BoostPayOptionBtn>;
    }

    return <>{this.renderPaymentOption()}</>;
  }

  private renderPaymentOption = (): JSX.Element => {
    return (
      <>
        <BoostPayOptionWrapper>
          <BoostPayOptionHeader selected={this.props.selected}>
            <BoostPayOptionCircle selected={this.props.selected} />
            <span>{this.props.optionLabel}</span>
          </BoostPayOptionHeader>
          {this.props.children}
        </BoostPayOptionWrapper>
      </>
    );
  };

  private handlePaymentSelected = () => {
    this.props.handlePaymentSelected!(this.props.paymentType);
  };
}
