import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet";

import { EthAddress } from "@joincivil/typescript-types";
import {
  buttonSizes,
  Button,
  CivilContext,
  UserDashboardHeader,
  LoadUser,
  mediaQueries,
  colors,
  ICivilContext,
} from "@joincivil/components";

import { State } from "../../redux/reducers";
import ScrollToTopOnMount from "../utility/ScrollToTop";

import UserInfoSummary from "./UserInfoSummary";
import DashboardActivity from "./DashboardActivity";
import UserProfileSummary from "./UserProfileSummary";
import SetEmail from "../Auth/SetEmail";
import SetAvatar from "../Auth/SetAvatar";

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

export interface DashboardProps {
  match?: any;
  history: any;
}

export interface DashboardReduxProps {
  userAccount?: EthAddress;
}

const DashboardComponent = (props: DashboardProps & DashboardReduxProps) => {
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  const [shouldShowSetEmailModal, setShouldShowSetEmailModal] = React.useState(false);
  const [shouldShowSetAvatarModal, setShouldShowSetAvatarModal] = React.useState(false);
  const [shouldShowConfirmEmailWarning, setShouldShowConfirmEmailWarning] = React.useState(false);

  return (
    <>
      <Helmet title="My Dashboard - The Civil Registry" />
      <ScrollToTopOnMount />
      <LoadUser>
        {({ loading, user: civilUser, refetch }) => {
          if (loading) {
            return null;
          }

          if (civilUser && props.userAccount) {
            return (
              <DashboardContainer>
                <UserDashboardHeader>
                  <UserProfileSummary
                    user={civilUser}
                    onSetEmailClicked={() => setShouldShowSetEmailModal(true)}
                    onSetAvatarClicked={() => setShouldShowSetAvatarModal(true)}
                  />
                  {shouldShowConfirmEmailWarning && <>Please check your email to confirm address</>}
                  <UserInfoSummary />
                </UserDashboardHeader>
                <StyledDashboardActivityContainer>
                  <DashboardActivity match={props.match} history={props.history} />
                </StyledDashboardActivityContainer>
                {shouldShowSetEmailModal && (
                  <SetEmail
                    channelID={civilUser.userChannel.id}
                    isProfileEdit={true}
                    onSetEmailComplete={() => {
                      setShouldShowSetEmailModal(false);
                      setShouldShowConfirmEmailWarning(true);
                    }}
                    onSetEmailCancelled={() => setShouldShowSetEmailModal(false)}
                  />
                )}
                {shouldShowSetAvatarModal && (
                  <SetAvatar
                    channelID={civilUser.userChannel.id}
                    isProfileEdit={true}
                    onSetAvatarComplete={async () => {
                      await refetch(); // TODO(nickreynolds): Dashboard should just use civil user from context so doesn't need to refetch here
                      await civilContext.auth.handleInitialState(); // also update user$ in context so navbar avatar updates
                      setShouldShowSetAvatarModal(false);
                    }}
                    onSetAvatarCancelled={() => setShouldShowSetAvatarModal(false)}
                  />
                )}
              </DashboardContainer>
            );
          } else if (civilUser && !props.userAccount) {
            // loading account info
            return null;
          }

          return (
            <StyledAuthButtonContainer>
              <p>Sign Up or Log In to view your Civil Registry dashboard</p>
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
