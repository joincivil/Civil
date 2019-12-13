import * as React from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import { Mutation, MutationFunc } from "react-apollo";
import { PAYMENTS_STRIPE_MUTATION, SET_EMAIL_MUTATION } from "./queries";
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
    const userChannelID = (this.context && this.context.currentUser && this.context.currentUser.userChannel.id) || "";
    const userEmail =
      this.context && this.context.currentUser && this.context.currentUser.userChannel.EmailAddressRestricted;
    const AsyncScriptLoader = makeAsyncScriptLoader("https://js.stripe.com/v3/")(LoadingMessage);
    if (this.state.stripeLoaded) {
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
