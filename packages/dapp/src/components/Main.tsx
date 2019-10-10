import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { formatRoute } from "react-router-named-routes";

import { EthAddress } from "@joincivil/core";
import { CivilErrors, setNetworkValue } from "@joincivil/utils";
import { CivilContext, StyledMainContainer, ICivilContext } from "@joincivil/components";
import { BigNumber } from "@joincivil/typescript-types";

import { routes, registryListingTypes, registrySubListingTypes, dashboardTabs, dashboardSubTabs } from "../constants";
import { setNetwork, setNetworkName } from "../redux/actionCreators/network";
import { addUser } from "../redux/actionCreators/userAccount";
import { catchWindowOnError } from "../redux/actionCreators/errors";
import {
  initializeGovernment,
  initializeGovernmentParamSubscription,
  initializeConstitution,
  initializeGovtProposalsSubscriptions,
} from "../helpers/government";
import { initializeTokenSubscriptions } from "../helpers/tokenEvents";
import { AuthRouter } from "./Auth";
import WrongNetwork from "./WrongNetwork";
import config from "../helpers/config";

import { isNetworkSupported } from "../helpers/networkHelpers";

import AsyncComponent from "./utility/AsyncComponent";
import { CivilHelperContext } from "../apis/CivilHelper";

import { initializeContractAddresses } from "../helpers/contractAddresses";
// PAGES
const ChallengePage = React.lazy(async () => import("./listing/Challenge"));
const Listing = React.lazy(async () => import("./listing/Listing"));
const Listings = React.lazy(async () => import("./listinglist/Listings"));
const NewsroomManagementV1 = React.lazy(async () => import("./newsroom/NewsroomManagement"));
const Parameterizer = React.lazy(async () => import("./Parameterizer"));
const Government = React.lazy(async () => import("./council/Government"));
const SubmitChallengePage = React.lazy(async () => import("./listing/SubmitChallenge"));
const SubmitAppealChallengePage = React.lazy(async () => import("./listing/SubmitAppealChallenge"));
const RequestAppealPage = React.lazy(async () => import("./listing/RequestAppeal"));
const ContractAddresses = React.lazy(async () => import("./ContractAddresses"));
const SignUpNewsroom = React.lazy(async () => import("./SignUpNewsroom"));
const StorefrontPage = React.lazy(async () => import("./Tokens/StorefrontPage"));
const DashboardPage = React.lazy(async () => import("./Dashboard/DashboardPage"));
const BoostPage = React.lazy(async () => import("./Boosts/Boost"));
const BoostFeedPage = React.lazy(async () => import("./Boosts/BoostFeed"));
const StoryFeedPage = React.lazy(async () => import("./StoryFeed/StoryFeed"));
const ManageNewsroomChannelPage = React.lazy(async () =>
  import("./Dashboard/ManageNewsroom/ManageNewsroomChannelPage"),
);

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
    setNetworkValue(parseInt(config.DEFAULT_ETHEREUM_NETWORK!, 10));
    const civil = civilCtx.civil!;
    const networkSub = civil.networkStream.subscribe(onNetworkUpdated);
    const networkNameSub = civil.networkNameStream.subscribe(onNetworkNameUpdated);
    const accountSub = civil.accountStream.subscribe(onAccountUpdated);

    (window as any).onerror = (message: string, source: string, lineNum: string, colNum: string, errorObj: any) => {
      dispatch!(catchWindowOnError(message, source, lineNum, colNum, errorObj));
      // return false;
    };

    return function cleanup(): void {
      networkSub.unsubscribe();
      networkNameSub.unsubscribe();
      accountSub.unsubscribe();
    };
  }, [civilCtx]);

  async function onNetworkUpdated(network: number): Promise<void> {
    dispatch!(setNetwork(network.toString()));
    setNetworkValue(network);

    try {
      await initializeGovernment(civilHelper!, dispatch!);
      await initializeConstitution(civilHelper!, dispatch!);
      await initializeGovernmentParamSubscription(civilHelper!, dispatch!);
      await initializeGovtProposalsSubscriptions(civilHelper!, dispatch!);
      await initializeContractAddresses(civilHelper!, dispatch!);
    } catch (err) {
      if (err.message !== CivilErrors.UnsupportedNetwork) {
        throw err;
      } else {
        console.error("Unsupported network, unlock Metamask and switch to Mainnet");
      }
    }
  }

  async function onNetworkNameUpdated(networkName: string): Promise<void> {
    dispatch!(setNetworkName(networkName));
  }

  const onAccountUpdated = async (account: EthAddress | undefined): Promise<void> => {
    const civil = civilCtx.civil!;
    const currentUser = civilCtx.currentUser;
    if (
      account &&
      currentUser &&
      currentUser.ethAddress &&
      account.toLowerCase() !== currentUser.ethAddress.toLowerCase()
    ) {
      console.log("web3 account does not match that of the logged in user, so logging out", {
        web3Account: account,
        currentUserAccount: currentUser.ethAddress,
      });
      civilCtx.auth.logout();
    }
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
          <Redirect
            exact
            path={routes.HOMEPAGE}
            to={formatRoute(routes.REGISTRY_HOME, { listingType: registryListingTypes.APPROVED })}
          />
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
          <Route path={routes.LISTING} component={AsyncComponent(Listing)} />
          <Route path={routes.NEWSROOM_MANAGEMENT_V1} component={AsyncComponent(NewsroomManagementV1)} />
          <Route path={routes.PARAMETERIZER} component={AsyncComponent(Parameterizer)} />
          <Route path={routes.APPLY_TO_REGISTRY} component={AsyncComponent(SignUpNewsroom)} />
          <Route path={routes.GOVERNMENT} component={AsyncComponent(Government)} />
          <Redirect
            exact
            path={routes.DASHBOARD_ROOT}
            to={formatRoute(routes.DASHBOARD, {
              activeDashboardTab: dashboardTabs.TASKS,
              activeDashboardSubTab: dashboardSubTabs.TASKS_ALL,
            })}
          />
          <Route path={routes.DASHBOARD} component={AsyncComponent(DashboardPage)} />
          <Route path={routes.MANAGE_NEWSROOM} component={AsyncComponent(ManageNewsroomChannelPage)} />
          <Route path={routes.AUTH} component={AuthRouter} />>
          <Route path={routes.TOKEN_STOREFRONT} component={AsyncComponent(StorefrontPage)} />
          <Route path={routes.BOOST_EDIT} component={AsyncComponent(BoostPage, { editMode: true })} />
          <Route path={routes.BOOST_PAYMENT} component={AsyncComponent(BoostPage, { payment: true })} />
          <Route path={routes.BOOST} component={AsyncComponent(BoostPage)} />
          <Route path={routes.BOOST_FEED} component={AsyncComponent(BoostFeedPage)} />
          <Route path={routes.STORY_FEED} component={AsyncComponent(StoryFeedPage)} />
          {/* TODO(jorgelo): Better 404 */}
          <Route path="*" render={() => <h1>404</h1>} />
        </Switch>
      )}
      <WrongNetwork />
    </StyledMainContainer>
  );
};

export default Main;
