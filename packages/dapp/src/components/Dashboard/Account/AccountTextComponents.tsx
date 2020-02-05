import * as React from "react";
import { AccountTabText } from "./AccountStyledComponents";

export const AccountTitleText: React.FunctionComponent = props => {
  return <h1>Account</h1>;
};

export const ProfileTabText: React.FunctionComponent = props => {
  return (
    <AccountTabText>
      Profile
      <span>Your account details</span>
    </AccountTabText>
  );
};

export const ProfileTitleText: React.FunctionComponent = props => {
  return (
    <>
      <h2>Edit profile</h2>
      <p>
        Edit your profile and account settings. Your profile picture and username will be displayed on your profile.
      </p>
    </>
  );
};

export const PaymentTabText: React.FunctionComponent = props => {
  return (
    <AccountTabText>
      Payment methods
      <span>Manage your payments</span>
    </AccountTabText>
  );
};

export const PaymentTitleText: React.FunctionComponent = props => {
  return (
    <>
      <h2>Payment methods</h2>
      <p>
        Manage your credit cards and Ethereum wallet for Boosts. Saved payment methods will be kept secure and listed
        here for your convenience. You can also add a credit card for the future.
      </p>
    </>
  );
};

export const TransactionsTabText: React.FunctionComponent = props => {
  return (
    <AccountTabText>
      Transactions
      <span>View all the boosts and newsrooms that you have supported</span>
    </AccountTabText>
  );
};

export const TransactionsTitleText: React.FunctionComponent = props => {
  return (
    <>
      <h2>Transaction History</h2>
    </>
  );
};

export const AccountChangesSavedText: React.FunctionComponent = props => {
  return <>Your changes have been saved.</>;
};
