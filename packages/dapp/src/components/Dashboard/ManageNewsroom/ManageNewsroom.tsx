import * as React from "react";
import gql from "graphql-tag";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { formatRoute } from "react-router-named-routes";
import { Query } from "react-apollo";
import { BoostForm } from "@joincivil/civil-sdk";
import { EthAddress, CharterData } from "@joincivil/core";
import {
  Tabs,
  StyledTabLarge,
  StyledTabNav,
  Tab,
  LoadingMessage,
  withNewsroomChannel,
  NewsroomChannelInjectedProps,
} from "@joincivil/components";
import { NewsroomManager } from "@joincivil/newsroom-signup";
import { routes } from "../../../constants";

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

export interface ManageParams {
  activeTab?: "edit-charter" | "launch-boost";
}
const TABS = ["edit-charter", "launch-boost"];

export interface ManageNewsroomOwnProps extends RouteComponentProps<ManageParams> {
  newsroomAddress: string;
}

const ManageNewsroomComponent: React.FunctionComponent<
  ManageNewsroomOwnProps & NewsroomChannelInjectedProps
> = props => {
  // Load tab from path:
  const [activeTabIndex, setActiveTabIndex] = React.useState<number>(0);
  React.useEffect(() => {
    const activeTab = props.match.params.activeTab || "edit-charter";
    if (TABS[activeTabIndex] !== activeTab) {
      setActiveTabIndex(TABS.indexOf(activeTab));
    }
  }, [props.match.params.activeTab]);

  return (
    <Query<ManageQueryData, ManageQueryVariables>
      query={ManageQuery}
      variables={{
        id: props.channelData.id,
      }}
    >
      {({ loading, data, error }) => {
        if (loading) {
          return <LoadingMessage>Loading your Newsroom</LoadingMessage>;
        } else if (error) {
          console.error("error querying channelsGetByID:", error);
          return (
            <>
              Error loading newsroom: <code>{error.message || JSON.stringify(error)}</code>
            </>
          );
        } else if (!data) {
          console.error("error querying channelsGetByID: no data returned");
          return <>Error loading newsroom: no newsroom data returned</>;
        }

        const newsroom = data.channelsGetByID.newsroom;
        const listingRoute = formatRoute(routes.LISTING, { listingAddress: props.newsroomAddress });
        const charter = data.channelsGetByID.newsroom.charter;

        return (
          <>
            <Tabs
              TabsNavComponent={StyledTabNav}
              TabComponent={StyledTabLarge}
              activeIndex={activeTabIndex}
              onActiveTabChange={(tab: number) => {
                props.history.push(
                  formatRoute(props.match.path, { newsroomAddress: props.newsroomAddress, activeTab: TABS[tab] }),
                );
              }}
            >
              <Tab title={"Edit Charter"}>
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
          </>
        );
      }}
    </Query>
  );
};

export const ManageNewsroom = withRouter(withNewsroomChannel(ManageNewsroomComponent));
