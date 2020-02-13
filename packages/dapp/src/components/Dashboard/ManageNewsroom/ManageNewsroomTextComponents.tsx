import * as React from "react";
import { UserManagementTabText } from "../UserManagement";

interface ManageNewsoomTitleTextProps {
  newsroom?: string;
}

export const ManageNewsoomTitleText: React.FunctionComponent<ManageNewsoomTitleTextProps> = props => {
  return <h1>{props.newsroom}</h1>;
};

export const EditCharterTabText: React.FunctionComponent = props => {
  return <UserManagementTabText>Edit Charter</UserManagementTabText>;
};

export const EditCharterTitleText: React.FunctionComponent = props => {
  return (
    <>
      <h2>Edit Charter</h2>
    </>
  );
};

export const SmartContractTabText: React.FunctionComponent = props => {
  return (
    <UserManagementTabText>
      Smart Contract
      <span>Assign access to your Newsroom Smart Contract</span>
    </UserManagementTabText>
  );
};

export const SmartContractTitleText: React.FunctionComponent = props => {
  return (
    <>
      <h2>Smart Contract</h2>
    </>
  );
};

export const LaunchBoostTabText: React.FunctionComponent = props => {
  return (
    <UserManagementTabText>
      Launch Boost
      <span>Create and launch your Project Boost</span>
    </UserManagementTabText>
  );
};

export const LaunchBoostTitleText: React.FunctionComponent = props => {
  return (
    <>
      <h2>Launch Boost</h2>
      <p>
        Create and launch your Project Boost. Project Boosts will be displayed on the Project Boost directory in
        addition to your Registry listing.
      </p>
    </>
  );
};
