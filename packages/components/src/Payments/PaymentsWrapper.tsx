import * as React from "react";
import {
  PaymentWrapperStyled,
  PaymentHeader,
  PaymentHeaderFlex,
  PaymentHeaderCenter,
  PaymentHeaderNewsroom,
  PaymentHeaderBoostLabel,
  PaymentHeaderAmount,
  PaymentHeaderTip,
  PaymentBackBtn,
  PaymentCivilLogo,
} from "./PaymentsStyledComponents";
import {
  SendPaymentHdrText,
  SendPaymentHdrEmbedText,
  PaymentToNewsroomsTipText,
  PayWithCardMinimumText,
  PayWithCardMinimumAdjustedText,
  PaymentUpdatedByEthText,
  PaymentEditText,
} from "./PaymentsTextComponents";
import { AvatarLogin } from "./AvatarLogin";
import { CivilLogo } from "@joincivil/elements";
import { PAYMENT_STATE, CivilUserData } from "./types";
import { RENDER_CONTEXT } from "../context";

export interface PaymentsWrapperProps {
  newsroomName: string;
  usdToSpend?: number;
  etherToSpend?: number;
  selectedUsdToSpend?: number;
  paymentAdjustedWarning?: boolean;
  paymentAdjustedEth?: boolean;
  paymentAdjustedStripe?: boolean;
  renderContext: any;
  civilUser?: CivilUserData;
  children: any;
  handleEditPaymentType?(paymentState: PAYMENT_STATE): void;
  handleEditAmount?(paymentState: PAYMENT_STATE): void;
}

export class PaymentsWrapper extends React.Component<PaymentsWrapperProps> {
  public render(): JSX.Element {
    const {
      usdToSpend,
      etherToSpend,
      paymentAdjustedWarning,
      paymentAdjustedEth,
      paymentAdjustedStripe,
      renderContext,
      children,
      handleEditPaymentType,
      handleEditAmount,
    } = this.props;
    return (
      <PaymentWrapperStyled>
        <PaymentHeader>
          {renderContext === RENDER_CONTEXT.EMBED ? this.renderEmbedHeader() : this.renderEmbedHeader()}
        </PaymentHeader>
        {paymentAdjustedWarning && handleEditAmount && <PayWithCardMinimumText handleEditAmount={handleEditAmount} />}
        {paymentAdjustedStripe && <PayWithCardMinimumAdjustedText />}
        {paymentAdjustedEth && <PaymentUpdatedByEthText usdToSpend={usdToSpend} etherToSpend={etherToSpend} />}
        {handleEditPaymentType && <PaymentEditText handleEditPaymentType={handleEditPaymentType} />}
        {children}
      </PaymentWrapperStyled>
    );
  }

  public renderHeader(): JSX.Element {
    return (
      <>
        <SendPaymentHdrText />
        <PaymentHeaderFlex>
          <PaymentHeaderNewsroom>{this.props.newsroomName}</PaymentHeaderNewsroom>
          {this.props.usdToSpend && this.renderBoostAmount()}
        </PaymentHeaderFlex>
        <PaymentHeaderTip>
          <PaymentToNewsroomsTipText />
        </PaymentHeaderTip>
      </>
    );
  }

  public renderEmbedHeader(): JSX.Element {
    return (
      <>
        <PaymentHeaderFlex>
          <PaymentBackBtn>Back</PaymentBackBtn>
          <PaymentCivilLogo>
            <CivilLogo width={50} height={13} />
          </PaymentCivilLogo>
          {this.props.civilUser && <AvatarLogin civilUser={this.props.civilUser} />}
        </PaymentHeaderFlex>
        <PaymentHeaderCenter>
          {!this.props.usdToSpend && (
            <>
              <SendPaymentHdrEmbedText newsroomName={this.props.newsroomName} />
              <PaymentHeaderTip>
                <PaymentToNewsroomsTipText />
              </PaymentHeaderTip>
            </>
          )}
          {this.props.usdToSpend && this.renderBoostAmount()}
        </PaymentHeaderCenter>
      </>
    );
  }

  public renderBoostAmount(): JSX.Element {
    const {
      usdToSpend,
      selectedUsdToSpend,
      paymentAdjustedWarning,
      paymentAdjustedEth,
      paymentAdjustedStripe,
    } = this.props;
    return (
      <div>
        <PaymentHeaderBoostLabel>
          {paymentAdjustedWarning || paymentAdjustedEth || paymentAdjustedStripe ? "Selected Boost" : "Boost"}
        </PaymentHeaderBoostLabel>
        <PaymentHeaderAmount>
          {paymentAdjustedEth || paymentAdjustedStripe ? "$" + selectedUsdToSpend : <b>{"$" + usdToSpend}</b>}
        </PaymentHeaderAmount>
      </div>
    );
  }
}
