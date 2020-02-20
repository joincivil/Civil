import * as React from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import { ApolloConsumer } from "react-apollo";
import makeAsyncScriptLoader from "react-async-script";
import PaymentStripeForm from "./PaymentsStripeForm";
import { CivilContext, ICivilContext } from "../context";
import { LoadingMessage } from "../";

export interface PaymentsStripeProps {
  postId: string;
  newsroomName: string;
  shouldPublicize: boolean;
  usdToSpend: number;
  stripeAccountID: string;
  handlePaymentSuccess(userSubmittedEmail: boolean, didSaveEmail: boolean): void;
  handleEditPaymentType(): void;
}

export interface PaymentsStripeStates {
  stripeLoaded: boolean;
  stripe: any;
}

export class PaymentsStripe extends React.Component<PaymentsStripeProps, PaymentsStripeStates> {
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
    const { currentUser, features } = this.context;
    const userChannelID = (currentUser && currentUser.userChannel.id) || "";
    const userEmail =
      currentUser && currentUser.userChannel.EmailAddressRestricted;
    const paymentMethods = currentUser && currentUser.userChannel.stripeCustomerInfo.paymentMethods;
    const AsyncScriptLoader = makeAsyncScriptLoader("https://js.stripe.com/v3/")(LoadingMessage);
    if (this.state.stripeLoaded) {
      return (
        <StripeProvider apiKey={this.context.config.STRIPE_API_KEY} stripeAccount={"acct_1BbHH2I7gPEo6b55"}>
          <Elements>
            <ApolloConsumer>
              {client => (
                <PaymentStripeForm
                  postId={this.props.postId}
                  newsroomName={this.props.newsroomName}
                  shouldPublicize={this.props.shouldPublicize}
                  userEmail={userEmail}
                  userChannelID={userChannelID}
                  usdToSpend={this.props.usdToSpend}
                  handlePaymentSuccess={this.props.handlePaymentSuccess}
                  handleEditPaymentType={this.props.handleEditPaymentType}
                  apolloClient={client}
                  paymentMethods={paymentMethods}
                  paymentIntentsEnabled={features.featureEnabled("payment-intents")}
                  stripeApiKey={this.context.config.STRIPE_API_KEY}
                  connectedStripeAccountID={this.props.stripeAccountID}
                />
              )}
            </ApolloConsumer>
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
