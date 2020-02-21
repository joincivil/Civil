import * as React from "react";
import { CivilContext, ICivilContext, Modal, LoadingMessage } from "@joincivil/components";
import { InvertedButton, buttonSizes } from "@joincivil/elements";
import {
  AccountPaymentSection,
  AccountPaymentSectionHeader,
  AccountPaymentTable,
  AccountPaymentWallet,
  AccountPaymentWalletAddress,
  AccountPaymentWalletBalance,
} from "./AccountStyledComponents";
import { PaymentTitleText } from "./AccountTextComponents";
import { UserManagementSection } from "../UserManagement";
import { Mutation, MutationFunc, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import { getCurrentUserQuery } from "@joincivil/utils";
import AccountAddCard from "./AccountAddCard";
import { StripeProvider, Elements } from "react-stripe-elements";
import makeAsyncScriptLoader from "react-async-script";

export interface AccountPaymentsState {
  balance: any;
  showAddCardModal: boolean;
  stripeLoaded: boolean;
}

const removeCardMutation = gql`
  mutation($paymentMethodID: String!, $channelID: String!) {
    paymentsRemoveSavedPaymentMethod(paymentMethodID: $paymentMethodID, channelID: $channelID)
  }
`;

export class AccountPayments extends React.Component<{}, AccountPaymentsState> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  constructor(props: any) {
    super(props);
    this.state = { balance: 0, showAddCardModal: false, stripeLoaded: false, };
  }

  public async componentDidMount(): Promise<void> {
    const civil = this.context.civil;

    if (civil) {
      await civil.currentProviderEnable();
      const account = await civil.accountStream.first().toPromise();
      if (account) {
        await this.setState({
          balance: await civil.accountBalance(account),
        });
      }
    }
  }

  public render(): JSX.Element {
    const currentUser = this.context.currentUser;
    const { userChannel } = currentUser;
    let paymentMethods;
    let channelID = "";
    let email = "";
    if (userChannel) {
      paymentMethods = userChannel.stripeCustomerInfo && userChannel.stripeCustomerInfo.paymentMethods;
      channelID = userChannel.id;
      email = userChannel.EmailAddressRestricted;
    }

    const AsyncScriptLoader = makeAsyncScriptLoader("https://js.stripe.com/v3/")(LoadingMessage);
    if (!currentUser) {
      return <>Log in to view your Account</>;
    }
    if (!this.state.stripeLoaded) {
      return (
        <AsyncScriptLoader
          asyncScriptOnLoad={() => {
            this.setState({ stripeLoaded: true });
          }}
        />
      );
    }

    return (
      <UserManagementSection header={<PaymentTitleText />}>
        <AccountPaymentSection>
          <AccountPaymentSectionHeader>
            <h3>Credit and debit cards</h3>
          </AccountPaymentSectionHeader>
          <AccountPaymentTable>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Last 4 Digits</th>
                <th>Name</th>
                <th>Exp. Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods && (paymentMethods.map((pm: any) => {
                return (
                  <tr>
                    <td>{pm.brand}</td>
                    <td>{pm.last4Digits}</td>
                    <td>{pm.name}</td>
                    <td>{pm.expMonth + "/" + pm.expYear}</td>
                    <th>
                      <Mutation mutation={removeCardMutation}>
                        {(removeCard: MutationFunc) => {
                          return (
                            <span onClick={async () => {
                              const res = await removeCard({
                                variables: {
                                  paymentMethodID: pm.paymentMethodID,
                                  channelID,
                                },
                                refetchQueries: [
                                  {
                                    query: getCurrentUserQuery,
                                  },
                                ],
                              }) as any;
                              if (res.data && res.data.paymentsRemoveSavedPaymentMethod) {
                                await this.context.auth.handleInitialState()
                              }
                            }}>Remove</span>
                          )
                        }}
                      </Mutation>
                    </th>
                  </tr>
                );
              }))}

            </tbody>
          </AccountPaymentTable>
          <InvertedButton size={buttonSizes.SMALL} onClick={() => this.setState({showAddCardModal: true})}>Add card</InvertedButton>
          {this.state.showAddCardModal && (
            <Modal width={588}>
              <StripeProvider apiKey={this.context.config.STRIPE_API_KEY} stripeAccount={this.context.config.STRIPE_PLATFORM_ACCOUNT_ID}>
                <Elements>
                  <ApolloConsumer>
                    {client => (
                      <AccountAddCard
                        userEmail={email}
                        userChannelID={channelID}
                        handleCancel={() => {this.setState({showAddCardModal: false})}}
                        handleAdded={async () => {
                          await this.context.auth.handleInitialState();
                          this.setState({ showAddCardModal: false });
                        }}
                        apolloClient={client}
                      />
                    )}
                  </ApolloConsumer>
                </Elements>
              </StripeProvider>
            </Modal>
          )}
        </AccountPaymentSection>
        <AccountPaymentSection>
          <AccountPaymentSectionHeader>
            <h3>Wallets</h3>
            <AccountPaymentWallet>
              <label>Wallet address</label>
              <AccountPaymentWalletAddress>{currentUser.ethAddress}</AccountPaymentWalletAddress>
              <label>ETH balance</label>
              <AccountPaymentWalletBalance>{this.state.balance}</AccountPaymentWalletBalance>
            </AccountPaymentWallet>
          </AccountPaymentSectionHeader>
        </AccountPaymentSection>
      </UserManagementSection>
    );
  }
}
