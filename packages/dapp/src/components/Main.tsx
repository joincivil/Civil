import { Civil, EthAddress } from "@joincivil/core";
import { CivilErrors, setNetworkValue, clearApolloSession } from "@joincivil/utils";
import { CivilContext, StyledMainContainer } from "@joincivil/components";
import { BigNumber } from "@joincivil/typescript-types";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { formatRoute } from "react-router-named-routes";
import { routes, registryListingTypes, registrySubListingTypes, dashboardTabs, dashboardSubTabs } from "../constants";
import { setNetwork, setNetworkName } from "../redux/actionCreators/network";
import { addUser } from "../redux/actionCreators/userAccount";
import { catchWindowOnError } from "../redux/actionCreators/errors";
import { isGraphQLSupportedOnNetwork } from "../helpers/civilInstance";
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
import { isNetworkSupported } from "../helpers/networkHelpers";
import { initialize, disableGraphQL } from "../redux/actionCreators/ui";
import AsyncComponent from "./utility/AsyncComponent";
import { analyticsEvent } from "../redux/actionCreators/analytics";
import { Subscription } from "rxjs";

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
const BoostCreatePage = React.lazy(async () => import("./Boosts/BoostCreate"));
const BoostFeedPage = React.lazy(async () => import("./Boosts/BoostFeed"));
const ManageNewsroomChannelPage = React.lazy(async () =>
  import("./Dashboard/ManageNewsroom/ManageNewsroomChannelPage"),
);

export interface MainReduxProps {
  network: string;
}

export interface MainOwnProps {
  civilUser: any;
}

export interface MainState {
  prevAccount?: EthAddress;
  accountStream?: Subscription;
  networkStream?: Subscription;
  networkNameStream?: Subscription;
}

type MainProps = MainReduxProps & MainOwnProps & DispatchProp<any> & RouteComponentProps<any>;

class Main extends React.Component<MainProps, MainState> {
  public static contextType = CivilContext;

  constructor(props: MainProps) {
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
    const { civil } = this.context;
    const networkStream = civil.networkStream.subscribe(this.onNetworkUpdated.bind(this, civil));
    const networkNameStream = civil.networkNameStream.subscribe(this.onNetworkNameUpdated);
    const accountStream = civil.accountStream.subscribe(this.onAccountUpdated.bind(this));
    this.context.setAnalyticsEvent(this.fireAnalyticsEvent);
    this.setState({ networkNameStream, networkStream, accountStream });
  }

  public async componentDidUpdate(prevProps: MainProps): Promise<void> {
    if (this.props.civilUser && (!prevProps.civilUser || (prevProps !== this.props && prevProps.civilUser))) {
      const account = this.props.civilUser.ethAddress;
      const oldAccount = prevProps.civilUser && prevProps.civilUser.ethAddress;
      if (account !== oldAccount) {
        if (account) {
          return this.setUserAccount(account);
        } else {
          this.props.dispatch!(addUser("", new BigNumber(0), new BigNumber(0)));
        }
      }
    }
  }

  public setUserAccount = async (account: EthAddress): Promise<void> => {
    try {
      // add placeholder user here while we get token balances
      this.props.dispatch!(addUser(account, new BigNumber(0), new BigNumber(0)));

      const { civil } = this.context;
      this.setState({ prevAccount: account });
      const tcr = await civil.tcrSingletonTrusted();
      const token = await tcr.getToken();
      const voting = await tcr.getVoting();
      const balance = await token.getBalance(account);
      const votingBalance = await voting.getNumVotingRights(account);
      console.log("add real.");
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
  };

  public async componentWillUnmount(): Promise<void> {
    const { networkStream, networkNameStream, accountStream } = this.state;
    if (networkStream) {
      networkStream.unsubscribe();
    }
    if (networkNameStream) {
      networkNameStream.unsubscribe();
    }
    if (accountStream) {
      accountStream.unsubscribe();
    }
  }

  public onNetworkUpdated = async (civil: Civil, network: number): Promise<void> => {
    this.props.dispatch!(setNetwork(network.toString()));
    setNetworkValue(network);
    if (!isGraphQLSupportedOnNetwork(network)) {
      this.props.dispatch!(disableGraphQL());
    }

    const account = await civil.accountStream.first().toPromise();
    if (account && this.props.civilUser && account === this.props.civilUser.ethAddress) {
      await this.setUserAccount(account);
    }
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

  public onAccountUpdated = (account?: EthAddress): void => {
    if (account !== this.state.prevAccount && this.state.prevAccount) {
      this.setState({ prevAccount: account });
      clearApolloSession();
    }
  };

  public render(): JSX.Element {
    const networkIsSupported = isNetworkSupported(this.props.network);
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
            <Route path={routes.BOOST_CREATE} component={AsyncComponent(BoostCreatePage)} />
            <Route path={routes.BOOST_FEED} component={AsyncComponent(BoostFeedPage)} />
            {/* TODO(jorgelo): Better 404 */}
            <Route path="*" render={() => <h1>404</h1>} />
          </Switch>
        )}
        <WrongNetwork />
      </StyledMainContainer>
    );
  }

  private fireAnalyticsEvent = (category: string, action: string, label: string, value: number): void => {
    this.props.dispatch!(analyticsEvent({ category, action, label, value }));
  };
}

const mapStateToProps = (state: State): MainReduxProps => {
  return { network: state.network };
};

export default withRouter(connect(mapStateToProps)(Main));
