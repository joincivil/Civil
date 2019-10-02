import * as React from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import { Mutation, MutationFunc } from "react-apollo";
import { PAYMENTS_STRIPE_MUTATION } from "./queries";
import makeAsyncScriptLoader from "react-async-script";
import {  } from "./PaymentsStyledComponents";
import { PayWithCardText } from "./PaymentsTextComponents";
import PaymentStripeForm from "./PaymentStripeForm";
import { CivilContext, ICivilContext } from "../context";
import { LoadingMessage } from "../";

export interface BoostPayStripeProps {
  linkId: string;
  newsroomName: string;
  usdToSpend: number;
  handlePaymentSuccess(): void;
}

export interface BoostPayStripeStates {
  stripeLoaded: boolean;
  stripe: any;
}

export class BoostPayStripe extends React.Component<BoostPayStripeProps, BoostPayStripeStates> {
  public static contextType = CivilContext;
  public context!: ICivilContext;
  constructor(props: BoostPayStripeProps) {
    super(props);
    this.state = {
      stripeLoaded: false,
      stripe: null,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <><PayWithCardText /></>
        <>Apple Pay / Google Pay TKTK</>
        {this.renderStripePaymentForm()}
      </>
    );
  }

  private renderStripePaymentForm = (): JSX.Element => {
    const AsyncScriptLoader = makeAsyncScriptLoader("https://js.stripe.com/v3/")(LoadingMessage);
    if (this.state.stripeLoaded) {
      return (
        <StripeProvider apiKey={this.context.config.STRIPE_API_KEY}>
          <Elements>
            <Mutation mutation={PAYMENTS_STRIPE_MUTATION}>
              {(paymentsCreateStripePayment: MutationFunc) => {
                return (
                  <PaymentStripeForm
                    linkId={this.props.linkId}
                    newsroomName={this.props.newsroomName}
                    usdToSpend={this.props.usdToSpend}
                    savePayment={paymentsCreateStripePayment}
                    handlePaymentSuccess={this.props.handlePaymentSuccess}
                  />
                );
              }}
            </Mutation>
          </Elements>
        </StripeProvider>
      );
    }

    return (
      <AsyncScriptLoader
        asyncScriptOnLoad={() => {
          this.setState({ stripeLoaded: true });
        }}
      />
    );
  };
}
