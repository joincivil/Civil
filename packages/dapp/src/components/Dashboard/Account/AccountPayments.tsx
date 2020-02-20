import * as React from "react";
import { CivilContext, ICivilContext } from "@joincivil/components";
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

export interface AccountPaymentsState {
  balance: any;
}

export class AccountPayments extends React.Component<{}, AccountPaymentsState> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  constructor(props: any) {
    super(props);
    this.state = { balance: 0 };
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
                    </tr>
                  );
                }))}

              </tbody>
            </AccountPaymentTable>
            <InvertedButton size={buttonSizes.SMALL}>Add card</InvertedButton>
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
