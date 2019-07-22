import * as React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { BoostForm } from "@joincivil/civil-sdk";
import { Tabs, StyledTabLarge, StyledTabNav, Tab } from "@joincivil/components";

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
          tagline
          logoUrl
        }
      }
    }
  }
`;

export const ManageNewsroom = (props: any) => {
  const variables = {
    id: props.channelID,
  };

  return (
    <Query query={ManageQuery} variables={variables}>
      {({ loading, data, error }) => {
        if (loading) {
          return null;
        }
        if (error) {
          return <div>error</div>;
        }

        const newsroom = data.channelsGetByID.newsroom;

        const listingRoute = "#fixme";

        const charter = data.channelsGetByID.newsroom.charter;

        return (
          <div>
            <Tabs TabsNavComponent={StyledTabNav} TabComponent={StyledTabLarge}>
              <Tab title={"Home"}>Home</Tab>
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
