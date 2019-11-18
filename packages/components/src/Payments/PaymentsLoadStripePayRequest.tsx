import * as React from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import { Mutation, MutationFunc } from "react-apollo";
import { PAYMENTS_STRIPE_MUTATION } from "./queries";
import makeAsyncScriptLoader from "react-async-script";
import PaymentRequestForm from "./PaymentsRequest";
import { CivilContext, ICivilContext } from "../context";
import { LoadingMessage } from "../";

export interface PaymentsStripeProps {
  postId: string;
  newsroomName: string;
  shouldPublicize: boolean;
  usdToSpend: number;
  handlePaymentSuccess(): void;
}

export interface PaymentsStripeStates {
  stripeLoaded: boolean;
  stripe: any;
}

export class PaymentsLoadStripePayRequest extends React.Component<PaymentsStripeProps, PaymentsStripeStates> {
  public static contextType = CivilContext;
  public context!: ICivilContext;
  constructor(props: PaymentsStripeProps) {
    super(props);
    this.state = {
      stripeLoaded: false,
      stripe: null,
    };
  }

  public render(): JSX.Element {
    const userChannelID = (this.context && this.context.currentUser && this.context.currentUser.userChannel.id) || "";
    const AsyncScriptLoader = makeAsyncScriptLoader("https://js.stripe.com/v3/")(LoadingMessage);
    if (this.state.stripeLoaded) {
      return (
        <StripeProvider apiKey={this.context.config.STRIPE_API_KEY}>
          <Elements>
            <Mutation mutation={PAYMENTS_STRIPE_MUTATION}>
              {(paymentsCreateStripePayment: MutationFunc) => {
                return (
                  <PaymentRequestForm
                    savePayment={paymentsCreateStripePayment}
                    boostId={this.props.postId}
                    usdToSpend={this.props.usdToSpend}
                    userChannelID={userChannelID}
                    shouldPublicize={this.props.shouldPublicize}
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
  }
}
