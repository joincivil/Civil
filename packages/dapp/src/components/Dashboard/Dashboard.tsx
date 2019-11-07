import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet";

import { EthAddress } from "@joincivil/core";
import { buttonSizes, Button, CivilContext, UserDashboardHeader, LoadUser } from "@joincivil/components";

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
  const { civil } = React.useContext(CivilContext);

  let enableEthereum: () => Promise<void> | undefined;
  if (civil && civil.currentProvider) {
    enableEthereum = async () => {
      await civil.currentProviderEnable();
    };
  }
  return (
    <>
      <Helmet title="My Dashboard - The Civil Registry" />
      <ScrollToTopOnMount />
      <LoadUser>
        {({ loading, user: civilUser }) => {
          if (loading) {
            return null;
          }

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
          } else if (civilUser && enableEthereum) {
            return (
              <StyledAuthButtonContainer>
                <p>Enable Ethereum to view Your Civil Registry Dashboard</p>
                <Button onClick={enableEthereum} size={buttonSizes.SMALL}>
                  Connect Wallet
                </Button>
              </StyledAuthButtonContainer>
            );
          }

          return (
            <StyledAuthButtonContainer>
              <p>Sign Up or Login to view Your Civil Registry Dashboard</p>
            </StyledAuthButtonContainer>
          );
        }}
      </LoadUser>
    </>
  );
};

const mapStateToProps = (state: State, ownProps: DashboardProps): DashboardProps & DashboardReduxProps => {
  const { user } = state.networkDependent;
  const userAccount = user && user.account && user.account.account;

  return {
    userAccount,
    ...ownProps,
  };
};

export const Dashboard = connect(mapStateToProps)(DashboardComponent);
