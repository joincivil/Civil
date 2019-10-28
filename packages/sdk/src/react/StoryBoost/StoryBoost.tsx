import * as React from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import {
  LoadingMessage,
  Contributors,
  ContributorCount,
  Payments,
  StoryModal,
  StoryNewsroomStatus,
} from "@joincivil/components";
import { StoryBoostData } from "./types";
import { storyBoostQuery } from "./queries";
import { PaymentButton } from "@joincivil/elements";

const StoryBoostHeader = styled.div``;
const StoryBoostContent = styled.div``;
const StoryBoostFooter = styled.div``;

export interface StoryBoostProps {
  boostId: string;
  isLoggedIn: boolean;
  userAddress?: string;
  userEmail?: string;
  handleLogin(): void;
}

export const StoryBoost: React.FunctionComponent<StoryBoostProps> = props => {
  const search = { postType: "externallink" };
  const onClickFunction = () => {
    console.log("click");
  };
  return (
    <Query query={storyBoostQuery} variables={{ search }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingMessage>Loading Story Boost</LoadingMessage>;
        } else if (error || !data || !data.postsSearch) {
          console.error("error loading Story Feed data. error: ", error);
          if (data) {
            console.error(data);
          }
          return "Error loading Story Boost.";
        }

        const storyBoostData = data.postsGet as StoryBoostData;

        return (
          <>
            <StoryBoostHeader>
              <StoryNewsroomStatus newsroomName={storyBoostData.channel.newsroom.name} activeChallenge={false} />
              {storyBoostData.openGraphData.title}
            </StoryBoostHeader>
            <StoryBoostContent>
              <Contributors sortedContributors={storyBoostData.groupedSanitizedPayments} />
              {storyBoostData.groupedSanitizedPayments && storyBoostData.groupedSanitizedPayments.length !== 0 ? (
                <ContributorCount
                  totalContributors={storyBoostData.groupedSanitizedPayments.length}
                  displayedContributors={storyBoostData.groupedSanitizedPayments}
                />
              ) : (
                <></>
              )}
            </StoryBoostContent>
            <StoryBoostFooter>
              Support this newsroom
              <PaymentButton onClick={onClickFunction} />
            </StoryBoostFooter>
            <StoryModal open={false}>
              <Payments
                postId={props.boostId}
                newsroomName={storyBoostData.channel.newsroom.name}
                paymentAddress={storyBoostData.channel.newsroom.multisigAddress}
                isStripeConnected={storyBoostData.channel.isStripeConnected}
              />
            </StoryModal>
          </>
        );
      }}
    </Query>
  );
};
