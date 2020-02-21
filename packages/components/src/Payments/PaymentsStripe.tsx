import * as React from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import { ApolloConsumer, Mutation, MutationFunc } from "react-apollo";
import makeAsyncScriptLoader from "react-async-script";
import PaymentStripeForm from "./PaymentsStripeForm";
import { CivilContext, ICivilContext } from "../context";
import { LoadingMessage } from "../";
import PaymentIntentsStripeForm from "./PaymentIntentsStripeForm";
import { PAYMENTS_STRIPE_MUTATION, SET_EMAIL_MUTATION } from "./queries";

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
      if (!features.featureEnabled("payment-intents")) {
        return (
          <StripeProvider apiKey={this.context.config.STRIPE_API_KEY} stripeAccount={this.props.stripeAccountID}>
            <Elements>
              <Mutation mutation={PAYMENTS_STRIPE_MUTATION}>
                {(paymentsCreateStripePayment: MutationFunc) => {
                  return (
                    <Mutation mutation={SET_EMAIL_MUTATION}>
                      {(setEmailMutation: MutationFunc) => {
                        return (
                          <PaymentStripeForm
                            postId={this.props.postId}
                            newsroomName={this.props.newsroomName}
                            shouldPublicize={this.props.shouldPublicize}
                            userEmail={userEmail}
                            userChannelID={userChannelID}
                            usdToSpend={this.props.usdToSpend}
                            savePayment={paymentsCreateStripePayment}
                            setEmail={setEmailMutation}
                            handlePaymentSuccess={this.props.handlePaymentSuccess}
                            handleEditPaymentType={this.props.handleEditPaymentType}
                          />
                        );
                      }}
                    </Mutation>
                  );
                }}
              </Mutation>
            </Elements>
          </StripeProvider>
        );
      } else {
        return (
          <StripeProvider apiKey={this.context.config.STRIPE_API_KEY} stripeAccount={this.context.config.STRIPE_PLATFORM_ACCOUNT_ID}>
            <Elements>
              <ApolloConsumer>
                {client => (
                  <PaymentIntentsStripeForm
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
