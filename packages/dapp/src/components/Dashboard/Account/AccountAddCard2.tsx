import * as React from "react";
import { CivilContext, ICivilContext, Modal } from "@joincivil/components";
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
import { Mutation, MutationFunc } from "react-apollo";
import gql from "graphql-tag";
import { getCurrentUserQuery } from "@joincivil/utils";
import { AccountAddCard } from "./AccountAddCard";

export interface AccountAddCard2State {
  balance: any;
  showAddCardModal: boolean;
}

const removeCardMutation = gql`
  mutation($paymentMethodID: String!, $channelID: String!) {
    paymentsRemoveSavedPaymentMethod(paymentMethodID: $paymentMethodID, channelID: $channelID)
  }
`;

export class AccountAddCard2 extends React.Component<{}, AccountAddCard2State> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  constructor(props: any) {
    super(props);
    this.state = { balance: 0, showAddCardModal: false };
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
    const paymentMethods = currentUser && currentUser.userChannel && currentUser.userChannel.stripeCustomerInfo && currentUser.userChannel.stripeCustomerInfo.paymentMethods;
    const channelID = currentUser && currentUser.userChannel && currentUser.userChannel.id;

    if (currentUser) {
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
                <AccountAddCard />
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

    return <>Log in to view your Account</>;
  }
}
