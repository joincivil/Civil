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
} from "./PaymentsTextComponents";
import { AvatarLogin } from "./AvatarLogin";
import { CivilLogo, DisclosureArrowIcon } from "@joincivil/elements";
import { CivilUserData } from "./types";
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
  handleEditAmount?(): void;
  handleBack?(): void;
  handleLogin?(): void;
  handleLogout?(): void;
}

export class PaymentsWrapper extends React.Component<PaymentsWrapperProps> {
  public render(): JSX.Element {
    return (
      <PaymentWrapperStyled>
        <PaymentHeader>
          {this.props.renderContext === RENDER_CONTEXT.EMBED ? this.renderEmbedHeader() : this.renderHeader()}
        </PaymentHeader>
        {this.props.paymentAdjustedWarning && this.props.handleEditAmount && (
          <PayWithCardMinimumText handleEditAmount={this.props.handleEditAmount} />
        )}
        {this.props.paymentAdjustedStripe && <PayWithCardMinimumAdjustedText />}
        {this.props.paymentAdjustedEth && (
          <PaymentUpdatedByEthText usdToSpend={this.props.usdToSpend} etherToSpend={this.props.etherToSpend} />
        )}
        {this.props.children}
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
          {this.props.handleBack && <PaymentBackBtn onClick={this.props.handleBack}><DisclosureArrowIcon />Back</PaymentBackBtn>}
          <PaymentCivilLogo>
            <CivilLogo width={50} height={13} />
          </PaymentCivilLogo>
          {this.props.civilUser && this.props.handleLogin && this.props.handleLogout && (
            <AvatarLogin
              civilUser={this.props.civilUser}
              handleLogin={this.props.handleLogin}
              handleLogout={this.props.handleLogout}
            />
          )}
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
    return (
      <div>
        <PaymentHeaderBoostLabel>
          {this.props.paymentAdjustedWarning || this.props.paymentAdjustedEth || this.props.paymentAdjustedStripe
            ? "Selected Boost"
            : "Boost"}
        </PaymentHeaderBoostLabel>
        <PaymentHeaderAmount>
          {this.props.paymentAdjustedEth || this.props.paymentAdjustedStripe ? (
            "$" + this.props.selectedUsdToSpend
          ) : (
            <b>{"$" + this.props.usdToSpend}</b>
          )}
        </PaymentHeaderAmount>
      </div>
    );
  }
}
