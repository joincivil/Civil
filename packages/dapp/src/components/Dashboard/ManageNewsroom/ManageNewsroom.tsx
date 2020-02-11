import styled from "styled-components";
import * as React from "react";
import { Helmet } from "react-helmet";
import ScrollToTopOnMount from "../../utility/ScrollToTop";
import gql from "graphql-tag";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { formatRoute } from "react-router-named-routes";
import { Query } from "react-apollo";
import { BoostForm } from "@joincivil/sdk";
import { EthAddress, CharterData } from "@joincivil/typescript-types";
import {
  colors,
  Tabs,
  Tab,
  LoadingMessage,
  withNewsroomChannel,
  NewsroomChannelInjectedProps,
  CivilContext,
  ICivilContext,
} from "@joincivil/components";
import { NewsroomManager, ManageContractMembers } from "@joincivil/newsroom-signup";
import { routes } from "../../../constants";
import { getListingPhaseState } from "../../../selectors";
import { LISTING_QUERY, transformGraphQLDataIntoListing } from "@joincivil/utils";
import {
  UserManagementPageLayout,
  UserManagementSection,
  UserManagementTabNav,
  UserManagementTabs,
} from "../UserManagement";
import {
  ManageNewsoomTitleText,
  EditCharterTabText,
  EditCharterTitleText,
  SmartContractTabText,
  SmartContractTitleText,
  LaunchBoostTabText,
  LaunchBoostTitleText,
} from "./ManageNewsroomTextComponents";
import { ManageNewsroomSmartContractStyles } from "./ManageNewsroomStyledComponents";

const Notice = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 16px;
  text-align: center;
  color: ${colors.primary.CIVIL_GRAY_0};
  font-size: 16px;
  line-height: 25px;
  font-family: ${props => props.theme.sansSerifFont};
`;
const NotAdminNotice = styled(Notice)`
  text-align: left;
`;

const ManageQuery = gql`
  query($id: String!) {
    channelsGetByID(id: $id) {
      id
      currentUserIsAdmin
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
    currentUserIsAdmin: boolean;
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
  activeTab?: "edit-charter" | "smart-contract" | "launch-boost";
}
const TABS = ["edit-charter", "smart-contract", "launch-boost"];

export interface ManageNewsroomOwnProps extends RouteComponentProps<ManageParams> {
  newsroomAddress: string;
}

const ManageNewsroomComponent: React.FunctionComponent<
  ManageNewsroomOwnProps & NewsroomChannelInjectedProps
> = props => {
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  if (civilContext.auth.loading) {
    return <LoadingMessage>Loading Permissions</LoadingMessage>;
  } else if (!civilContext.auth.currentUser) {
    return (
      <Notice>
        <p>Please Sign Up or Log In to manage your newsroom.</p>
      </Notice>
    );
  }

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
        } else if (!data || !data.channelsGetByID) {
          console.error("error querying channelsGetByID: no data returned");
          return <>Error loading newsroom: no newsroom data returned</>;
        } else if (!data.channelsGetByID.currentUserIsAdmin) {
          return (
            <NotAdminNotice>
              <p>
                Your account with ETH address <code>{civilContext.auth.currentUser.ethAddress}</code> doesn't have
                permissions to manage the newsroom "{data.channelsGetByID.newsroom.charter.name}". You can view the
                newsrooms you have access to on your <Link to="/dashboard/newsrooms">Newsroom Dashboard</Link>. Please
                verify that you are logged in to the correct Civil account and ethereum wallet.
              </p>
              <p>Alternately, please contact the newsroom and request that an officer add your account.</p>
              <p>
                <Link to={`/listing/${data.channelsGetByID.newsroom.contractAddress}`}>View newsroom information.</Link>
              </p>
            </NotAdminNotice>
          );
        }

        const newsroom = data.channelsGetByID.newsroom;
        const listingRoute = formatRoute(routes.LISTING, { listingAddress: props.newsroomAddress });
        const charter = data.channelsGetByID.newsroom.charter;

        return (
          <Query query={LISTING_QUERY} variables={{ addr: props.newsroomAddress }} pollInterval={10000}>
            {({ loading: listingLoading, error: listingError, data: listingData }: any) => {
              if (listingLoading) {
                return <LoadingMessage>Loading your Newsroom</LoadingMessage>;
              }
              if (listingError) {
                console.error("error querying listing:", listingError);
                return (
                  <>
                    Error loading newsroom listing: <code>{listingError.message || JSON.stringify(listingError)}</code>
                  </>
                );
              }

              const listing = transformGraphQLDataIntoListing(listingData.tcrListing, props.newsroomAddress);
              const listingPhaseState = getListingPhaseState(listing);

              return (
                <>
                  <Helmet title="Newsroom Management - The Civil Registry" />
                  <ScrollToTopOnMount />
                  <UserManagementPageLayout header={<ManageNewsoomTitleText newsroom={charter.name} />}>
                    <Tabs
                      TabsNavComponent={UserManagementTabNav}
                      TabComponent={UserManagementTabs}
                      activeIndex={activeTabIndex}
                      onActiveTabChange={(tab: number) => {
                        props.history.push(
                          formatRoute(props.match.path, {
                            newsroomAddress: props.newsroomAddress,
                            activeTab: TABS[tab],
                          }),
                        );
                      }}
                      flex={true}
                    >
                      <Tab title={<EditCharterTabText />}>
                        <UserManagementSection header={<EditCharterTitleText />}>
                          <NewsroomManager
                            newsroomAddress={newsroom.contractAddress}
                            publishedCharter={charter}
                            listingPhaseState={listingPhaseState}
                          />
                        </UserManagementSection>
                      </Tab>
                      <Tab title={<SmartContractTabText />}>
                        <UserManagementSection header={<SmartContractTitleText />}>
                          <ManageNewsroomSmartContractStyles>
                            <ManageContractMembers charter={charter} newsroomAddress={props.newsroomAddress} />
                          </ManageNewsroomSmartContractStyles>
                        </UserManagementSection>
                      </Tab>
                      <Tab title={<LaunchBoostTabText />}>
                        <UserManagementSection header={<LaunchBoostTitleText />}>
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
                            removeHeader={true}
                          />
                        </UserManagementSection>
                      </Tab>
                    </Tabs>
                  </UserManagementPageLayout>
                </>
              );
            }}
          </Query>
        );
      }}
    </Query>
  );
};

export const ManageNewsroom = withRouter(withNewsroomChannel(ManageNewsroomComponent));
