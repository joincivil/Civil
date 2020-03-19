import * as React from "react";
import { ICivilContext, CivilContext } from "@joincivil/components";
import styled from "styled-components";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";

const NotificationBar = styled.div`
  width: 100%;
  min-height: 28px;
  background-color: #e0e6ff;
  color: black;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 5px;
`;

const setEmailMutation = gql`
  mutation($input: ChannelsSetEmailInput!) {
    userChannelSetEmail(input: $input) {
      id
    }
  }
`;

const UserNotificationBar: React.FunctionComponent = props => {
  // context
  const civilCtx = React.useContext<ICivilContext>(CivilContext);
  if (civilCtx === null) {
    // context still loading
    return <></>;
  }
  const [hasResent, setHasResent] = React.useState(false);
  const civilUser = civilCtx.currentUser;

  if (civilUser) {
    const isAwaitingEmailConfirmation = civilUser.userChannel!.isAwaitingEmailConfirmation;

    if (isAwaitingEmailConfirmation) {
      return (
        <ApolloConsumer>
          {client => (
            <NotificationBar
              onClick={async e => {
                await client.mutate({
                  mutation: setEmailMutation,
                  variables: {
                    input: {
                      emailAddress: civilUser.userChannel!.EmailAddressRestricted,
                      channelID: civilUser.userChannel!.id,
                      addToMailing: false,
                    },
                  },
                });
                setHasResent(true);
              }}
            >
              Please check your email to confirm your email address.
              {!hasResent && <> Click this banner to resend confirmation email.</>}
              {hasResent && <> Confirmation email has been resent.</>}
            </NotificationBar>
          )}
        </ApolloConsumer>
      );
    }
  }
  return <></>;
};

export default UserNotificationBar;
