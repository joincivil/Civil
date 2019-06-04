import { Civil, EthAddress } from "@joincivil/core";
import { CivilErrors, setNetworkValue } from "@joincivil/utils";
import { StyledMainContainer } from "@joincivil/components";
import BigNumber from "bignumber.js";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { formatRoute } from "react-router-named-routes";
import { routes, registryListingTypes, registrySubListingTypes, dashboardTabs, dashboardSubTabs } from "../constants";
import { setNetwork, setNetworkName } from "../redux/actionCreators/network";
import { addUser } from "../redux/actionCreators/userAccount";
import { catchWindowOnError } from "../redux/actionCreators/errors";
import { getCivil, isGraphQLSupportedOnNetwork } from "../helpers/civilInstance";
import {
  initializeGovernment,
  initializeGovernmentParamSubscription,
  initializeConstitution,
  initializeGovtProposalsSubscriptions,
} from "../helpers/government";
import { initializeParameterizer, initializeProposalsSubscriptions } from "../helpers/parameterizer";
import { initializeTokenSubscriptions } from "../helpers/tokenEvents";
import { initializeContractAddresses } from "../helpers/contractAddresses";
import { AuthRouter } from "./Auth";
import WrongNetwork from "./WrongNetwork";
import config from "../helpers/config";
import { State } from "../redux/reducers";
import { supportedNetworks } from "../helpers/networkHelpers";
import { initialize, disableGraphQL } from "../redux/actionCreators/ui";

// PAGES
const ChallengePage = React.lazy(async () => import("./listing/Challenge"));
const Listing = React.lazy(async () => import("./listing/Listing"));
const Listings = React.lazy(async () => import("./listinglist/Listings"));
const NewsroomManagementV1 = React.lazy(async () => import("./newsroom/NewsroomManagement"));
const NewsroomManagement = React.lazy(async () => import("./newsroom/NewsroomManagementV2"));
const Parameterizer = React.lazy(async () => import("./Parameterizer"));
const Government = React.lazy(async () => import("./council/Government"));
const SubmitChallengePage = React.lazy(async () => import("./listing/SubmitChallenge"));
const SubmitAppealChallengePage = React.lazy(async () => import("./listing/SubmitAppealChallenge"));
const RequestAppealPage = React.lazy(async () => import("./listing/RequestAppeal"));
const ContractAddresses = React.lazy(async () => import("./ContractAddresses"));
const CreateNewsroom = React.lazy(async () => import("./CreateNewsroom"));
const SignUpNewsroom = React.lazy(async () => import("./SignUpNewsroom"));
const StorefrontPage = React.lazy(async () => import("./Tokens/StorefrontPage"));
const DashboardPage = React.lazy(async () => import("./Dashboard/DashboardPage"));
const BoostPage = React.lazy(async () => import("./Boosts/Boost"));
const BoostFeedPage = React.lazy(async () => import("./Boosts/BoostFeed"));

function AsyncComponent(Component: React.LazyExoticComponent<any>): any {
  return (props: any) => (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </React.Suspense>
  );
}

export interface MainReduxProps {
  network: string;
}

export interface MainState {
  prevAccount: EthAddress;
}

class Main extends React.Component<MainReduxProps & DispatchProp<any> & RouteComponentProps<any>, MainState> {
  constructor(props: MainReduxProps & DispatchProp<any> & RouteComponentProps<any>) {
    super(props);
    this.state = {
      prevAccount: "",
    };
  }

  public componentWillMount(): void {
    (window as any).onerror = (message: string, source: string, lineNum: string, colNum: string, errorObj: any) => {
      this.props.dispatch!(catchWindowOnError(message, source, lineNum, colNum, errorObj));
      return false;
    };
  }

  public async componentDidMount(): Promise<void> {
    setNetworkValue(parseInt(config.DEFAULT_ETHEREUM_NETWORK!, 10));
    const civil = getCivil();
    civil.networkStream.subscribe(this.onNetworkUpdated.bind(this, civil));
    civil.networkNameStream.subscribe(this.onNetworkNameUpdated);
    civil.accountStream.subscribe(this.onAccountUpdated.bind(this, civil));
  }

  public onNetworkUpdated = async (civil: Civil, network: number): Promise<void> => {
    this.props.dispatch!(setNetwork(network.toString()));
    setNetworkValue(network);
    if (!isGraphQLSupportedOnNetwork(network)) {
      this.props.dispatch!(disableGraphQL());
    }

    await civil.accountStream.first().forEach(this.onAccountUpdated.bind(this, civil));
    try {
      await initializeParameterizer(this.props.dispatch!);
      await initializeGovernment(this.props.dispatch!);
      await initializeConstitution(this.props.dispatch!);
      await initializeProposalsSubscriptions(this.props.dispatch!);
      await initializeGovernmentParamSubscription(this.props.dispatch!);
      await initializeGovtProposalsSubscriptions(this.props.dispatch!);
      await initializeContractAddresses(this.props.dispatch!);
      await this.props.dispatch!(await initialize());
    } catch (err) {
      if (err.message !== CivilErrors.UnsupportedNetwork) {
        throw err;
      } else {
        console.error("Unsupported network, unlock Metamask and switch to Mainnet");
      }
    }
  };

  public onNetworkNameUpdated = async (networkName: string): Promise<void> => {
    this.props.dispatch!(setNetworkName(networkName));
  };

  public onAccountUpdated = async (civil: Civil, account?: EthAddress): Promise<void> => {
    if (account && account !== this.state.prevAccount) {
      try {
        this.setState({ prevAccount: account });
        const tcr = await civil.tcrSingletonTrusted();
        const token = await tcr.getToken();
        const voting = await tcr.getVoting();
        const balance = await token.getBalance(account);
        const votingBalance = await voting.getNumVotingRights(account);
        this.props.dispatch!(addUser(account, balance, votingBalance));
        await initializeTokenSubscriptions(this.props.dispatch!, account);
      } catch (err) {
        if (err.message === CivilErrors.UnsupportedNetwork) {
          this.props.dispatch!(addUser(account, new BigNumber(0), new BigNumber(0)));
          console.error("Unsupported network when trying to set-up user");
        } else {
          throw err;
        }
      }
    } else {
      this.props.dispatch!(addUser("", new BigNumber(0), new BigNumber(0)));
    }
  };

  public render(): JSX.Element {
    const isNetworkSupported = supportedNetworks.includes(parseInt(this.props.network, 10));
    return (
      <StyledMainContainer>
        {isNetworkSupported && (
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
            <Route path={routes.NEWSROOM_MANAGEMENT} component={AsyncComponent(NewsroomManagement)} />
            <Route path={routes.NEWSROOM_MANAGEMENT_V1} component={AsyncComponent(NewsroomManagementV1)} />
            <Route path={routes.PARAMETERIZER} component={AsyncComponent(Parameterizer)} />
            <Route path={routes.CREATE_NEWSROOM} component={AsyncComponent(CreateNewsroom)} />
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
            <Route path={routes.AUTH} component={AuthRouter} />>
            <Route path={routes.TOKEN_STOREFRONT} component={AsyncComponent(StorefrontPage)} />
            <Route path={routes.BOOST} component={AsyncComponent(BoostPage)} />
            <Route path={routes.BOOST_FEED} component={AsyncComponent(BoostFeedPage)} />
            {/* TODO(jorgelo): Better 404 */}
            <Route path="*" render={() => <h1>404</h1>} />
          </Switch>
        )}
        <WrongNetwork />
      </StyledMainContainer>
    );
  }
}

const mapStateToProps = (state: State): MainReduxProps => {
  return { network: state.network };
};

export default withRouter(connect(mapStateToProps)(Main));
