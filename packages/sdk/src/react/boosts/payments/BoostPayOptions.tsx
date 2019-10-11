import * as React from "react";
import {
  colors,
  fonts,
  mediaQueries,
  FeatureFlag,
  CivilContext,
  ICivilContext,
  RENDER_CONTEXT,
} from "@joincivil/components";
import { BoostPayEth } from "./BoostPayEth";
import { BoostPayStripe } from "./BoostPayStripe";
import styled from "styled-components";
import { BoostFlexCenter, BoostTextButton } from "../BoostStyledComponents";
import { PaymentInfoText, PaymentFAQText, PaymentLabelCardText, PaymentLabelEthText } from "../BoostTextComponents";
import { EthAddress } from "@joincivil/core";

export enum PAYMENT_TYPE {
  DEFAULT = "",
  ETH = "eth",
  STRIPE = "stripe",
}

export interface BoostPayOptionsProps {
  boostId: string;
  usdToSpend: number;
  newsroomName: string;
  title: string;
  paymentAddr: EthAddress;
  isStripeConnected: boolean;
  handlePaymentSuccess(): void;
}

const BoostInstructions = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  margin: 0 0 20px 20px;

  ${mediaQueries.MOBILE} {
    margin-left: 0;
  }

  ${props => props.theme.renderContext === RENDER_CONTEXT.EMBED && `display: none;`};
`;

const BoostPayFooter = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_3};
  margin: 20px 15px;
  padding: 20px;

  ${mediaQueries.MOBILE} {
    margin: 20px 0;
    padding: 10px;
  }
`;

const BoostPayFooterSection = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 14px;
  line-height: 19px;
  margin: 0 0 40px;

  ${mediaQueries.MOBILE} {
    margin-bottom: 16px;
  }

  h3 {
    font-size: 14px;
    line-height: 19px;
    font-weight: 600;
    margin: 0 0 20px;
  }

  p {
    margin: 0 0 20px;
  }

  a {
    display: block;
    margin: 0 0 15px;
    text-decoration: none;

    &:hover {
      color: ${colors.accent.CIVIL_BLUE};
      text-decoration: underline;
    }
  }
`;

export interface BoostPayOptionsStates {
  paymentType: string;
  etherToSpend: number;
  usdToSpend: number;
  selectedEth: boolean;
  selectedStripe: boolean;
}

export class BoostPayOptions extends React.Component<BoostPayOptionsProps, BoostPayOptionsStates> {
  public static contextType = CivilContext;
  public context!: ICivilContext;
  public constructor(props: BoostPayOptionsProps) {
    super(props);
    this.state = {
      paymentType: PAYMENT_TYPE.DEFAULT,
      selectedEth: false,
      selectedStripe: false,
      etherToSpend: 0,
      usdToSpend: this.props.usdToSpend,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        {this.state.paymentType === PAYMENT_TYPE.DEFAULT ? (
          <BoostInstructions>Select how you would like to support this Boost</BoostInstructions>
        ) : (
          <BoostInstructions>
            <BoostFlexCenter>
              Payment <BoostTextButton onClick={this.handleEdit}>Edit</BoostTextButton>
            </BoostFlexCenter>
          </BoostInstructions>
        )}
        {this.getPaymentTypes()}
        {this.state.paymentType === PAYMENT_TYPE.DEFAULT && (
          <BoostPayFooter>
            <BoostPayFooterSection>
              <PaymentInfoText />
            </BoostPayFooterSection>
            <BoostPayFooterSection>
              <PaymentFAQText />
            </BoostPayFooterSection>
          </BoostPayFooter>
        )}
      </>
    );
  }

  private getPaymentTypes = () => {
    const { isStripeConnected, boostId, newsroomName, paymentAddr, handlePaymentSuccess } = this.props;
    const { selectedEth, selectedStripe, etherToSpend, usdToSpend } = this.state;
    let isEthSelected = false;

    if (!isStripeConnected || selectedEth) {
      isEthSelected = true;
    }

    switch (this.state.paymentType) {
      case PAYMENT_TYPE.ETH:
        return (
          <BoostPayEth
            selected={true}
            boostId={boostId}
            newsroomName={newsroomName}
            title={this.props.title}
            paymentType={PAYMENT_TYPE.ETH}
            optionLabel={<PaymentLabelEthText />}
            handleNext={() => this.handleEthNext(etherToSpend, usdToSpend)}
            paymentStarted={true}
            etherToSpend={etherToSpend}
            usdToSpend={usdToSpend}
            paymentAddr={paymentAddr}
            handlePaymentSuccess={handlePaymentSuccess}
          />
        );
      case PAYMENT_TYPE.STRIPE:
        return (
          <BoostPayStripe
            boostId={boostId}
            usdToSpend={usdToSpend}
            selected={true}
            newsroomName={newsroomName}
            title={this.props.title}
            optionLabel={<PaymentLabelCardText />}
            paymentType={PAYMENT_TYPE.STRIPE}
            paymentStarted={true}
            handleNext={this.handleStripeNext}
            handlePaymentSuccess={handlePaymentSuccess}
          />
        );
      default:
        return (
          <>
            <BoostPayEth
              selected={isEthSelected}
              optionLabel={<PaymentLabelEthText />}
              boostId={boostId}
              newsroomName={newsroomName}
              title={this.props.title}
              paymentType={PAYMENT_TYPE.ETH}
              etherToSpend={etherToSpend}
              usdToSpend={usdToSpend}
              handleNext={this.handleEthNext}
              paymentAddr={paymentAddr}
              handlePaymentSuccess={handlePaymentSuccess}
              handlePaymentSelected={this.handlePaymentSelected}
            />
            <FeatureFlag feature={"boost-stripe"}>
              {isStripeConnected && (
                <BoostPayStripe
                  boostId={boostId}
                  usdToSpend={usdToSpend}
                  selected={selectedStripe}
                  newsroomName={newsroomName}
                  title={this.props.title}
                  optionLabel={<PaymentLabelCardText />}
                  paymentType={PAYMENT_TYPE.STRIPE}
                  handleNext={this.handleStripeNext}
                  handlePaymentSuccess={handlePaymentSuccess}
                  handlePaymentSelected={this.handlePaymentSelected}
                />
              )}
            </FeatureFlag>
          </>
        );
    }
  };

  private handlePaymentSelected = (paymentType: string) => {
    if (paymentType === PAYMENT_TYPE.ETH) {
      this.setState({ selectedEth: true, selectedStripe: false });
    } else if (paymentType === PAYMENT_TYPE.STRIPE) {
      this.setState({ selectedEth: false, selectedStripe: true });
    }
  };

  private handleEthNext = (etherToSpend: number, usdToSpend: number) => {
    this.context.fireAnalyticsEvent("boosts", "continue eth support", this.props.boostId, usdToSpend);
    this.setState({ paymentType: PAYMENT_TYPE.ETH, etherToSpend, usdToSpend });
  };

  private handleStripeNext = (usdToSpend: number) => {
    this.context.fireAnalyticsEvent("boosts", "continue CC support", this.props.boostId, usdToSpend);
    this.setState({ paymentType: PAYMENT_TYPE.STRIPE });
  };

  private handleEdit = () => {
    this.setState({ paymentType: PAYMENT_TYPE.DEFAULT });
  };
}
