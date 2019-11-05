import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import { EthAddress } from "@joincivil/core";
import { buttonSizes, Button, CivilContext, UserDashboardHeader, LoadUser, mediaQueries, colors } from "@joincivil/components";

import { State } from "../../redux/reducers";
import ScrollToTopOnMount from "../utility/ScrollToTop";

import UserInfoSummary from "./UserInfoSummary";
import DashboardActivity from "./DashboardActivity";

const StyledDashboardActivityContainer = styled.div`
  box-sizing: border-box;
  padding: 0 0 0px 0px;
  margin-top: 40px;
  ${mediaQueries.MOBILE} {
    max-width: 100%;
    margin-top: 0px;
  }
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

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: row;
  ${mediaQueries.MOBILE} {
    flex-direction: column;
  }
  background-color: ${colors.accent.CIVIL_BLUE_VERY_FADED_2};
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
              <DashboardContainer>
                <UserDashboardHeader>
                  <UserInfoSummary />
                </UserDashboardHeader>
                <StyledDashboardActivityContainer>
                  <DashboardActivity match={props.match} history={props.history} />
                </StyledDashboardActivityContainer>
              </DashboardContainer>
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
