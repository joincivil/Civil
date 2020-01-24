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
import { StoryNewsroomStatus } from "../StoryFeed";
import { CivilLogo, DisclosureArrowIcon, CloseXButton } from "@joincivil/elements";
import { RENDER_CONTEXT, ICivilContext, CivilContext } from "../context";

export interface PaymentsWrapperProps {
  boostType?: string;
  newsroomName: string;
  usdToSpend?: number;
  etherToSpend?: number;
  selectedUsdToSpend?: number;
  paymentAdjustedWarning?: boolean;
  paymentAdjustedEth?: boolean;
  paymentAdjustedStripe?: boolean;
  paymentInProgress?: boolean;
  waitingForConfirmation?: boolean;
  children: any;
  handleEditAmount?(): void;
  handleBack?(): void;
  handleClose?(): void;
}

export class PaymentsWrapper extends React.Component<PaymentsWrapperProps> {
  public static contextType = CivilContext;
  public static context: ICivilContext;

  public render(): JSX.Element {
    return (
      <PaymentWrapperStyled>
        <PaymentHeader>
          {this.context.renderContext === RENDER_CONTEXT.EMBED ? this.renderEmbedHeader() : this.renderHeader()}
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
        {this.props.boostType !== "project" && <SendPaymentHdrText />}
        <PaymentHeaderFlex>
          <PaymentHeaderNewsroom>
            <StoryNewsroomStatus newsroomName={this.props.newsroomName} activeChallenge={false} />
          </PaymentHeaderNewsroom>
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
          {this.props.handleBack ? (
            this.props.paymentInProgress ? (
              this.props.waitingForConfirmation ? (
                <PaymentBackBtn disabled={true}>
                  <DisclosureArrowIcon />
                  Back
                </PaymentBackBtn>
              ) : (
                <CloseXButton onClick={() => this.props.handleClose && this.props.handleClose()} />
              )
            ) : (
              <PaymentBackBtn onClick={this.props.handleBack}>
                <DisclosureArrowIcon />
                Back
              </PaymentBackBtn>
            )
          ) : (
            <div>{/*spacer so flex remains the same with avatarlogin on right*/}</div>
          )}
          <PaymentCivilLogo>
            <CivilLogo width={50} height={13} />
          </PaymentCivilLogo>
          <AvatarLogin />
        </PaymentHeaderFlex>
        {!this.props.usdToSpend ? (
          <PaymentHeaderCenter>
            <SendPaymentHdrEmbedText newsroomName={this.props.newsroomName} />
            <PaymentHeaderTip>
              <PaymentToNewsroomsTipText />
            </PaymentHeaderTip>
          </PaymentHeaderCenter>
        ) : (
          <PaymentHeaderFlex>
            <PaymentHeaderNewsroom>
              <StoryNewsroomStatus newsroomName={this.props.newsroomName} activeChallenge={false} />
            </PaymentHeaderNewsroom>
            {this.props.usdToSpend && this.renderBoostAmount()}
          </PaymentHeaderFlex>
        )}
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
