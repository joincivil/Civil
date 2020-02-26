import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet";

import { EthAddress } from "@joincivil/typescript-types";
import {
  CivilContext,
  UserDashboardHeader,
  mediaQueries,
  colors,
  ICivilContext,
  buttonSizes,
} from "@joincivil/components";

import { State } from "../../redux/reducers";
import ScrollToTopOnMount from "../utility/ScrollToTop";

import UserInfoSummary from "./UserInfoSummary";
import DashboardActivity from "./DashboardActivity";
import UserProfileSummary from "./UserProfileSummary";
import { routes } from "../../constants";
import { NewPrimaryButton } from "@joincivil/elements";

const StyledDashboardActivityContainer = styled.div`
  box-sizing: border-box;
  margin-top: 40px;
  flex-grow: 1;

  ${mediaQueries.MOBILE} {
    max-width: 100%;
    margin: 0;
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

const EditProfileButton = styled(NewPrimaryButton)`
  height: 30px;
  margin-bottom: 15px;
`;

export interface DashboardProps {
  match?: any;
  history: any;
}

export interface DashboardReduxProps {
  userAccount?: EthAddress;
}

const DashboardComponent = (props: DashboardProps & DashboardReduxProps) => {
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  const civilUser = civilContext.auth.currentUser;

  return (
    <>
      <Helmet title="My Dashboard - The Civil Registry" />
      <ScrollToTopOnMount />
      {civilUser && props.userAccount && (
        <DashboardContainer>
          <UserDashboardHeader>
            <UserProfileSummary user={civilUser} />
            <EditProfileButton size={buttonSizes.SMALL} to={routes.ACCOUNT_ROOT}>
              Edit Account
            </EditProfileButton>
            <UserInfoSummary />
          </UserDashboardHeader>
          <StyledDashboardActivityContainer>
            <DashboardActivity match={props.match} history={props.history} />
          </StyledDashboardActivityContainer>
        </DashboardContainer>
      )}
      {civilUser && !props.userAccount && <></>}
      {!civilUser && (
        <StyledAuthButtonContainer>
          <p>Sign Up or Log In to view your Civil Registry dashboard</p>
        </StyledAuthButtonContainer>
      )}
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
