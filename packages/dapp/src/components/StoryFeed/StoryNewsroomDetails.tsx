import * as React from "react";
import { Query } from "react-apollo";
import { LISTINGS_ACTIVE_CHALLENGE } from "@joincivil/components";
import { StoryRegistryDetails } from "./StoryRegistryDetails";
import { renderPTagsFromLineBreaks, urlConstants as links } from "@joincivil/utils";
import { CivilIcon } from "@joincivil/elements";
import {
  RegistryStatusTag,
  StoryDetailsHeader,
  StoryDetailsContent,
  StoryNewsroomSection,
  StoryDetailsFooter,
  StoryRegistryLabel,
  StoryNewsroomName,
  StoryNewsroomURL,
  BlueLinkBtn,
  StoryETHAddress,
  StoryDetailsFlex,
} from "./StoryFeedStyledComponents";
import { StoryNewsroomData } from "./types";

export interface StoryNewsroomDetailsProps {
  newsroom: StoryNewsroomData;
}

export const StoryNewsroomDetails: React.FunctionComponent<StoryNewsroomDetailsProps> = props => {
  const { newsroom } = props;

  return (
    <>
      <Query query={LISTINGS_ACTIVE_CHALLENGE} variables={{ activeChallenge: true }}>
        {({ loading, error, data }: any): JSX.Element => {
          if (loading) {
            return <></>;
          } else if (error || !data || !data.tcrListings) {
            console.error("error loading listing data. error:", error, "data:", data);
            return <></>;
          }

          const { tcrListings } = data;
          const activeChallengeNewsrooms = tcrListings.edges.map((edge: any) => {
            return edge.node.name;
          });
          const activeChallenge = activeChallengeNewsrooms.includes(newsroom.name);

          return (
            <>
              <StoryDetailsHeader>
                <StoryRegistryLabel>
                  <CivilIcon width={42} height={11} /> Registry
                </StoryRegistryLabel>
                <StoryDetailsFlex>
                  <div>
                    <StoryNewsroomName>{newsroom.name}</StoryNewsroomName>
                    <StoryNewsroomURL href={newsroom.charter.newsroomUrl} target="_blank">
                      {newsroom.charter.newsroomUrl}
                    </StoryNewsroomURL>
                  </div>
                  {activeChallenge ? (
                    <RegistryStatusTag activeChallenge={true}>Challenged</RegistryStatusTag>
                  ) : (
                    <RegistryStatusTag activeChallenge={false}>Approved</RegistryStatusTag>
                  )}
                </StoryDetailsFlex>
              </StoryDetailsHeader>
              <StoryRegistryDetails activeChallenge={activeChallenge} />
            </>
          );
        }}
      </Query>
      <StoryDetailsContent>
        <StoryNewsroomSection>
          <h2>About</h2>
          {renderPTagsFromLineBreaks(newsroom.charter.mission.purpose)}
        </StoryNewsroomSection>
        <StoryNewsroomSection>
          <h3>Smart Contract Address</h3>
          <StoryETHAddress>{newsroom.contractAddress}</StoryETHAddress>
        </StoryNewsroomSection>
        <StoryNewsroomSection>
          <h3>Public Wallet Address</h3>
          <StoryETHAddress>{newsroom.multisigAddress}</StoryETHAddress>
        </StoryNewsroomSection>
      </StoryDetailsContent>
      <StoryDetailsFooter>
        <BlueLinkBtn
          href={links.REGISTRY + "listing/" + (newsroom.handle ? newsroom.handle : newsroom.contractAddress)}
          target="_blank"
        >
          View on Civil Registry
        </BlueLinkBtn>
      </StoryDetailsFooter>
    </>
  );
};
