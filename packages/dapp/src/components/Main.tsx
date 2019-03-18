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
import { initializeChallengeSubscriptions } from "../helpers/listingEvents";
import { initializeParameterizer, initializeProposalsSubscriptions } from "../helpers/parameterizer";
import { initializeTokenSubscriptions } from "../helpers/tokenEvents";
import { initializeContractAddresses } from "../helpers/contractAddresses";
import { Tokens } from "./Tokens";
import ContractAddresses from "./ContractAddresses";
import CreateNewsroom from "./CreateNewsroom";
import SignUpNewsroom from "./SignUpNewsroom";
import { Dashboard } from "./Dashboard";
import ChallengePage from "./listing/Challenge";
import Listing from "./listing/Listing";
import Listings from "./listinglist/Listings";
import NewsroomManagementV1 from "./newsroom/NewsroomManagement";
import NewsroomManagement from "./newsroom/NewsroomManagementV2";
import Parameterizer from "./Parameterizer";
import Government from "./council/Government";
import SubmitChallengePage from "./listing/SubmitChallenge";
import SubmitAppealChallengePage from "./listing/SubmitAppealChallenge";
import RequestAppealPage from "./listing/RequestAppeal";
import { initialize, disableGraphQL } from "../redux/actionCreators/ui";
import { AuthRouter } from "./Auth";
import WrongNetwork from "./WrongNetwork";
import config from "../helpers/config";
import { State } from "../redux/reducers";
import { supportedNetworks } from "../helpers/networkHelpers";

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
        await initializeChallengeSubscriptions(this.props.dispatch!, account);
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
            <Route path={routes.REGISTRY_HOME} component={Listings} />
            <Route path={routes.CONTRACT_ADDRESSES} component={ContractAddresses} />
            <Route path={routes.CHALLENGE} component={ChallengePage} />
            <Route path={routes.SUBMIT_CHALLENGE} component={SubmitChallengePage} />
            <Route path={routes.SUBMIT_APPEAL_CHALLENGE} component={SubmitAppealChallengePage} />
            <Route path={routes.REQUEST_APPEAL} component={RequestAppealPage} />
            <Route path={routes.LISTING} component={Listing} />
            <Route path={routes.NEWSROOM_MANAGEMENT} component={NewsroomManagement} />
            <Route path={routes.NEWSROOM_MANAGEMENT_V1} component={NewsroomManagementV1} />
            <Route path={routes.PARAMETERIZER} component={Parameterizer} />
            <Route path={routes.CREATE_NEWSROOM} component={CreateNewsroom} />
            <Route path={routes.APPLY_TO_REGISTRY} component={SignUpNewsroom} />
            <Route path={routes.GOVERNMENT} component={Government} />
            <Redirect
              exact
              path={routes.DASHBOARD_ROOT}
              to={formatRoute(routes.DASHBOARD, {
                activeDashboardTab: dashboardTabs.TASKS,
                activeDashboardSubTab: dashboardSubTabs.TASKS_ALL,
              })}
            />
            <Route path={routes.DASHBOARD} component={Dashboard} />
            <Route path={routes.AUTH} component={AuthRouter} />>
            <Route path={routes.TOKEN_STOREFRONT} component={Tokens} />
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
