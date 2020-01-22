import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { formatRoute } from "react-router-named-routes";

import { CivilErrors, setDefaultNetworkValue } from "@joincivil/utils";
import { CivilContext, StyledMainContainer, ICivilContext } from "@joincivil/components";
import { BigNumber, EthAddress } from "@joincivil/typescript-types";

import { routes, registryListingTypes, registrySubListingTypes } from "../constants";
import { addUser } from "../redux/actionCreators/userAccount";
import { initializeGovernment, initializeConstitution } from "../helpers/government";
import { initializeTokenSubscriptions } from "../helpers/tokenEvents";
import { AuthRouter } from "./Auth";
import WrongNetwork from "./WrongNetwork";
import config from "../helpers/config";

import { isNetworkSupported } from "../helpers/networkHelpers";

import AsyncComponent from "./utility/AsyncComponent";
import { CivilHelperContext } from "../apis/CivilHelper";

import { initializeContractAddresses } from "../helpers/contractAddresses";
// PAGES
const ChallengePage = React.lazy(async () => import(/* webpackChunkName: "challenge-page" */ "./listing/Challenge"));
const Listing = React.lazy(async () => import(/* webpackChunkName: "listing-page" */ "./listing/Listing"));
const Listings = React.lazy(async () => import(/* webpackChunkName: "listings-page" */ "./listinglist/Listings"));
const NewsroomManagementV1 = React.lazy(async () =>
  import(/* webpackChunkName: "newsroom-mgmt-page" */ "./newsroom/NewsroomManagement"),
);
const Parameterizer = React.lazy(async () => import(/* webpackChunkName: "parameterizer-page" */ "./Parameterizer"));
const Government = React.lazy(async () => import(/* webpackChunkName: "government-page" */ "./council/Government"));
const SubmitChallengePage = React.lazy(async () =>
  import(/* webpackChunkName: "submit-challenge-page" */ "./listing/SubmitChallenge"),
);
const SubmitAppealChallengePage = React.lazy(async () =>
  import(/* webpackChunkName: "challenge-page" */ "./listing/SubmitAppealChallenge"),
);
const RequestAppealPage = React.lazy(async () =>
  import(/* webpackChunkName: "request-appeal-page" */ "./listing/RequestAppeal"),
);
const ContractAddresses = React.lazy(async () =>
  import(/* webpackChunkName: "contract-addresses-page" */ "./ContractAddresses"),
);
const SignUpNewsroom = React.lazy(async () =>
  import(/* webpackChunkName: "signup-newsroom-page" */ "./SignUpNewsroom"),
);
const StorefrontPage = React.lazy(async () =>
  import(/* webpackChunkName: "storefront-page" */ "./Tokens/StorefrontPage"),
);
const DashboardPage = React.lazy(async () =>
  import(/* webpackChunkName: "dashboard-page" */ "./Dashboard/DashboardPage"),
);
const BoostPage = React.lazy(async () => import(/* webpackChunkName: "boost-page" */ "./Boosts/Boost"));
const BoostFeedPage = React.lazy(async () =>
  import(/* webpackChunkName: "boost-feed-page" */ "./Boosts/BoostFeedPage"),
);
const BoostSuccessPage = React.lazy(async () =>
  import(/* webpackChunkName: "boost-success-page" */ "./Boosts/BoostSuccess"),
);
const StoryFeedPage = React.lazy(async () =>
  import(/* webpackChunkName: "storyfeed-page" */ "./StoryFeed/StoryFeedPage"),
);
const ManageNewsroomChannelPage = React.lazy(async () =>
  import(/* webpackChunkName: "manage-newsroom-channel" */ "./Dashboard/ManageNewsroom/ManageNewsroomChannelPage"),
);
const GetStartedPage = React.lazy(async () => import(/* webpackChunkName: "get-started-page" */ "./GetStarted"));

export interface MainReduxProps {
  network: string;
}

export interface MainOwnProps {
  civilUser: any;
}

export const Main: React.FunctionComponent = () => {
  const civilCtx = React.useContext<ICivilContext>(CivilContext);
  const civilHelper = React.useContext(CivilHelperContext);
  const dispatch = useDispatch();
  const networkRedux = useSelector((state: any) => state.network);
  const networkIsSupported = isNetworkSupported(networkRedux);

  React.useEffect(() => {
    setDefaultNetworkValue(parseInt(config.DEFAULT_ETHEREUM_NETWORK!, 10));
    const civil = civilCtx.civil!;
    const networkSub = civil.networkStream.subscribe(onNetworkUpdated);
    const accountSub = civil.accountStream.subscribe(onAccountUpdated);
    const currentUser = civilCtx.currentUser;
    const userEthAddress = currentUser && currentUser.ethAddress;

    // tslint:disable-next-line
    onAccountUpdated(userEthAddress);

    return function cleanup(): void {
      networkSub.unsubscribe();
      accountSub.unsubscribe();
    };
  }, [civilCtx]);

  async function onNetworkUpdated(network: number): Promise<void> {
    try {
      await initializeGovernment(civilHelper!, dispatch!);
      await initializeConstitution(civilHelper!, dispatch!);
      await initializeContractAddresses(civilHelper!, dispatch!);
    } catch (err) {
      if (err.message !== CivilErrors.UnsupportedNetwork) {
        throw err;
      } else {
        console.error("Unsupported network, unlock Metamask and switch to Mainnet");
      }
    }
  }

  const onAccountUpdated = async (account: EthAddress | undefined): Promise<void> => {
    const civil = civilCtx.civil!;
    if (account) {
      try {
        dispatch!(addUser(account, new BigNumber(0), new BigNumber(0))); // get user eth address into redux right away
        const tcr = await civil.tcrSingletonTrusted();
        const token = await tcr.getToken();
        const voting = await tcr.getVoting();
        const balance = await token.getBalance(account);
        const votingBalance = await voting.getNumVotingRights(account);
        dispatch!(addUser(account, balance, votingBalance));
        await initializeTokenSubscriptions(civilHelper!, dispatch!, account);
      } catch (err) {
        console.log("ERROR", err);
        if (err.message === CivilErrors.UnsupportedNetwork) {
          dispatch!(addUser(account, new BigNumber(0), new BigNumber(0)));
          console.error("Unsupported network when trying to setup user");
        } else {
          throw err;
        }
      }
    } else {
      dispatch!(addUser("", new BigNumber(0), new BigNumber(0)));
    }
  };

  return (
    <StyledMainContainer>
      {networkIsSupported && (
        <Switch>
          <Redirect exact path={routes.HOMEPAGE} to={formatRoute(routes.STORY_FEED)} />
          <Redirect
            exact
            path={routes.REGISTRY_HOME_ROOT}
            to={formatRoute(routes.REGISTRY_HOME, { listingType: registryListingTypes.APPROVED })}
          />
          <Redirect
            exact
            path={formatRoute(routes.REGISTRY_HOME, { listingType: registryListingTypes.IN_PROGRESS })}
            to={formatRoute(routes.REGISTRY_HOME, {
              listingType: registryListingTypes.IN_PROGRESS,
              subListingType: registrySubListingTypes.IN_APPLICATION,
            })}
          />
          <Route path={routes.REGISTRY_HOME} component={AsyncComponent(Listings)} />
          <Route path={routes.CONTRACT_ADDRESSES} component={AsyncComponent(ContractAddresses)} />
          <Route path={routes.CHALLENGE} component={AsyncComponent(ChallengePage)} />
          <Route path={routes.SUBMIT_CHALLENGE} component={AsyncComponent(SubmitChallengePage)} />
          <Route path={routes.SUBMIT_APPEAL_CHALLENGE} component={AsyncComponent(SubmitAppealChallengePage)} />
          <Route path={routes.REQUEST_APPEAL} component={AsyncComponent(RequestAppealPage)} />
          <Route path={routes.LISTING_STORY_BOOST_PAYMENT} component={AsyncComponent(Listing, { payment: true })} />
          <Route path={routes.LISTING} component={AsyncComponent(Listing)} />
          <Route path={routes.NEWSROOM_MANAGEMENT_V1} component={AsyncComponent(NewsroomManagementV1)} />
          <Route path={routes.PARAMETERIZER} component={AsyncComponent(Parameterizer)} />
          <Route path={routes.APPLY_TO_REGISTRY} component={AsyncComponent(SignUpNewsroom)} />
          <Route path={routes.GOVERNMENT} component={AsyncComponent(Government)} />
          <Route path={routes.DASHBOARD} component={AsyncComponent(DashboardPage)} />
          <Route path={routes.DASHBOARD_ROOT} component={AsyncComponent(DashboardPage)} />
          <Route path={routes.MANAGE_NEWSROOM} component={AsyncComponent(ManageNewsroomChannelPage)} />
          <Route path={routes.AUTH} component={AuthRouter} />
          <Route path={routes.TOKEN_STOREFRONT} component={AsyncComponent(StorefrontPage)} />
          <Route path={routes.BOOST_SUCCESS} component={AsyncComponent(BoostSuccessPage)} />
          <Route path={routes.BOOST_EDIT} component={AsyncComponent(BoostPage, { editMode: true })} />
          <Route path={routes.BOOST_PAYMENT} component={AsyncComponent(BoostPage, { payment: true })} />
          <Route path={routes.BOOST} component={AsyncComponent(BoostPage)} />
          <Route path={routes.BOOST_FEED} component={AsyncComponent(BoostFeedPage)} />
          <Route path={routes.STORY_BOOST_PAYMENT} component={AsyncComponent(StoryFeedPage, { payment: true })} />
          <Route path={routes.STORY_BOOST_NEWSROOM} component={AsyncComponent(StoryFeedPage, { newsroom: true })} />
          <Route path={routes.STORY_FEED} component={AsyncComponent(StoryFeedPage)} />
          <Route path={routes.GET_STARTED} component={AsyncComponent(GetStartedPage)} />
          {/* TODO(jorgelo): Better 404 */}
          <Route path="*" render={() => <h1>404</h1>} />
        </Switch>
      )}
      <WrongNetwork />
    </StyledMainContainer>
  );
};

export default Main;
