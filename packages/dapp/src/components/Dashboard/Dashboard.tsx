import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import { EthAddress } from "@joincivil/core";
import { UserDashboardHeader, LoadUser, Button, buttonSizes } from "@joincivil/components";

import { State } from "../../redux/reducers";
import ScrollToTopOnMount from "../utility/ScrollToTop";

import UserInfoSummary from "./UserInfoSummary";
import DashboardActivity from "./DashboardActivity";

const StyledDashboardActivityContainer = styled.div`
  box-sizing: border-box;
  padding: 0 0 200px 396px;
  margin: -550px auto 0;
  width: 1200px;
`;

const StyledAuthButtonContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 100px 0 0;

  p {
    font-size: 18px
    font-weight: bold;
    line-height: 33px;
  }
`;

export interface DashboardProps {
  match?: any;
  history: any;
}

export interface DashboardReduxProps {
  userAccount?: EthAddress;
}

const DashboardComponent = (props: DashboardProps & DashboardReduxProps) => {
  return (
    <>
      <Helmet title="My Dashboard - The Civil Registry" />
      <ScrollToTopOnMount />
      <LoadUser>
        {({ loading, user: civilUser }) => {
          if (loading) {
            return null;
          }

          console.log("hey", civilUser, props);

          if (civilUser && props.userAccount) {
            return (
              <>
                <UserDashboardHeader>
                  <UserInfoSummary />
                </UserDashboardHeader>
                <StyledDashboardActivityContainer>
                  <DashboardActivity match={props.match} history={props.history} />
                </StyledDashboardActivityContainer>
              </>
            );
          } else if (civilUser) {
            return (
              <StyledAuthButtonContainer>
                <p>Enable Ethereum to view Your Civil Registry Dashboard</p>
                <Button onClick={() => (window as any).ethereum.enable()} size={buttonSizes.SMALL}>
                  Connect Wallet
                </Button>
              </StyledAuthButtonContainer>
            );
          }

          return (
            <StyledAuthButtonContainer>
              <p>Sign Up or Login to view Your Civil Registry Dashboard</p>
              <Button to="/auth/signup" size={buttonSizes.SMALL}>
                Sign Up | Login
              </Button>
            </StyledAuthButtonContainer>
          );
        }}
      </LoadUser>
    </>
  );
};

const mapStateToProps = (state: State, ownProps: DashboardProps): DashboardProps & DashboardReduxProps => {
  const { user } = state.networkDependent;
  console.log("dashboard mapStateToProps", user, user.account, user.account.account);
  const userAccount = user && user.account && user.account.account;

  return {
    userAccount,
    ...ownProps,
  };
};

export const Dashboard = connect(mapStateToProps)(DashboardComponent);
