import * as React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { BoostForm } from "@joincivil/civil-sdk";
import { EthAddress, CharterData } from "@joincivil/core";
import { Tabs, StyledTabLarge, StyledTabNav, Tab, LoadingMessage } from "@joincivil/components";
import { NewsroomManager } from "@joincivil/newsroom-signup";

const ManageQuery = gql`
  query($id: String!) {
    channelsGetByID(id: $id) {
      id
      newsroom {
        contractAddress
        multisigAddress
        charter {
          name
          newsroomUrl
          logoUrl
          tagline
          mission {
            purpose
            structure
            revenue
            encumbrances
            miscellaneous
          }
          socialUrls {
            twitter
            facebook
          }
          roster {
            name
            role
            bio
            ethAddress
            avatarUrl
            signature
            socialUrls {
              twitter
              facebook
            }
          }
        }
      }
    }
  }
`;
interface ManageQueryData {
  channelsGetByID: {
    id: string;
    newsroom: {
      contractAddress: EthAddress;
      multisigAddress: EthAddress;
      charter: Partial<CharterData>;
    };
  };
}
interface ManageQueryVariables {
  id: string;
}

export const ManageNewsroom = (props: any) => {
  const variables = {
    id: props.channelID,
  };

  return (
    <Query<ManageQueryData, ManageQueryVariables> query={ManageQuery} variables={variables}>
      {({ loading, data, error }) => {
        if (loading) {
          return <LoadingMessage>Loading your Newsroom</LoadingMessage>;
        } else if (error) {
          console.error("error querying channelsGetByID:", error);
          return (
            <div>
              Error loading newsroom: <code>{error.message || JSON.stringify(error)}</code>
            </div>
          );
        } else if (!data) {
          console.error("error querying channelsGetByID: no data returned");
          return <div>Error loading newsroom: no newsroom data returned</div>;
        }

        const newsroom = data.channelsGetByID.newsroom;

        const listingRoute = "#fixme";

        const charter = data.channelsGetByID.newsroom.charter;

        return (
          <div>
            <Tabs TabsNavComponent={StyledTabNav} TabComponent={StyledTabLarge}>
              <Tab title={"Home"}>
                <NewsroomManager newsroomAddress={newsroom.contractAddress} publishedCharter={charter} />
              </Tab>
              <Tab title={"Launch Boost"}>
                <BoostForm
                  channelID={data.channelsGetByID.id}
                  newsroomData={{
                    name: charter.name,
                    url: charter && charter.newsroomUrl,
                    owner: newsroom.multisigAddress,
                  }}
                  newsroomContractAddress={newsroom.contractAddress}
                  newsroomAddress={newsroom.contractAddress}
                  newsroomListingUrl={`${document.location.origin}${listingRoute}`}
                  newsroomTagline={charter && charter.tagline}
                  newsroomLogoUrl={charter && charter.logoUrl}
                />
              </Tab>
            </Tabs>
          </div>
        );
      }}
    </Query>
  );
};
