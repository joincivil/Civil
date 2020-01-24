import * as React from "react";
import { CivilContext, ICivilContext } from "@joincivil/components";
import { InvertedButton, buttonSizes } from "@joincivil/elements";
import {
  AccountSectionWrap,
  AccountSectionHeader,
  AccountPaymentSection,
  AccountPaymentSectionHeader,
  AccountPaymentTable,
  AccountPaymentWallet,
  AccountPaymentWalletAddress,
  AccountPaymentWalletBalance,
} from "./AccountStyledComponents";
import { PaymentTitleText } from "./AccountTextComponents";

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

    if (currentUser) {
      return (
        <AccountSectionWrap>
          <AccountSectionHeader>
            <PaymentTitleText />
          </AccountSectionHeader>
          <AccountPaymentSection>
            <AccountPaymentSectionHeader>
              <h3>Credit and debit cards</h3>
            </AccountPaymentSectionHeader>
            <AccountPaymentTable>
              <thead>
                <tr>
                  <th>Default</th>
                  <th>Credit Card Number</th>
                  <th>Name</th>
                  <th>Exp. Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
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
        </AccountSectionWrap>
      );
    }

    return <>Log in to view your Account</>;
  }
}
