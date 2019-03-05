import { Civil, EthAddress } from "@joincivil/core";
import { CivilErrors, setNetworkValue } from "@joincivil/utils";
import { StyledMainContainer, AskTrackingBar } from "@joincivil/components";
import BigNumber from "bignumber.js";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { setNetwork, setNetworkName } from "../redux/actionCreators/network";
import { addUser } from "../redux/actionCreators/userAccount";
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
import cookie from "react-cookies";
import { addMiddleware } from "redux-dynamic-middlewares";
import { gaMiddleware } from "../redux/analytics";

export interface MainReduxProps {
  network: string;
}

export interface MainState {
  prevAccount: EthAddress;
}

const COOKIE_MAX_AGE = 120; // 2 minutes. TODO: make 30 days.

class Main extends React.Component<MainReduxProps & DispatchProp<any> & RouteComponentProps<any>, MainState> {
  constructor(props: MainReduxProps & DispatchProp<any> & RouteComponentProps<any>) {
    super(props);
    this.state = {
      prevAccount: "",
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
        console.error("Unsupported network, unlock Metamask and switch to Rinkeby");
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

  public allowTracking = (ev: any): void => {
    this.answerTracking();
    cookie.save("allowTracking", true, { path: "/", maxAge: COOKIE_MAX_AGE });
    addMiddleware(gaMiddleware);
    this.props.dispatch!({
      type: "FORCE_PAGE_VIEW",
      payload: { location: this.props.location },
    });
    this.forceUpdate();
  };

  public denyTracking = (ev: any): void => {
    this.answerTracking();
    cookie.save("allowTracking", false, { path: "/", maxAge: COOKIE_MAX_AGE });
    this.forceUpdate();
  };

  public render(): JSX.Element {
    const didAnswerTracking = cookie.load("didAnswerTracking");
    const isNetworkSupported = supportedNetworks.includes(parseInt(this.props.network, 10));
    return (
      <StyledMainContainer>
        {!didAnswerTracking && <AskTrackingBar onClickYes={this.allowTracking} onClickNo={this.denyTracking} />}
        {isNetworkSupported && (
          <Switch>
            <Redirect exact path="/" to="/registry/approved" />
            <Redirect exact path="/registry" to="/registry/approved" />
            <Redirect exact path="/registry/in-progress" to="/registry/in-progress/new-applications" />
            <Route path="/registry/:listingType/:subListingType?" component={Listings} />
            <Route path="/contract-addresses" component={ContractAddresses} />
            <Route path="/listing/:listing/challenge/:challengeID" component={ChallengePage} />
            <Route path="/listing/:listing/submit-challenge" component={SubmitChallengePage} />
            <Route path="/listing/:listing/submit-appeal-challenge" component={SubmitAppealChallengePage} />
            <Route path="/listing/:listing/request-appeal" component={RequestAppealPage} />
            <Route path="/listing/:listing" component={Listing} />
            <Route path="/mgmt/:newsroomAddress" component={NewsroomManagement} />
            <Route path="/mgmt-v1/:newsroomAddress" component={NewsroomManagementV1} />
            <Route path="/parameterizer" component={Parameterizer} />
            <Route path="/create-newsroom" component={CreateNewsroom} />
            <Route path="/apply-to-registry/:action?/:token?" component={SignUpNewsroom} />
            <Route path="/government" component={Government} />
            <Redirect exact path="/dashboard" to="/dashboard/tasks/all" />
            <Route path="/dashboard/:activeDashboardTab/:activeDashboardSubTab?" component={Dashboard} />
            <Route path="/auth" component={AuthRouter} />>
            <Route path="/tokens" component={Tokens} />
            {/* TODO(jorgelo): Better 404 */}
            <Route path="*" render={() => <h1>404</h1>} />
          </Switch>
        )}
        <WrongNetwork />
      </StyledMainContainer>
    );
  }

  private answerTracking = (): void => {
    cookie.save("didAnswerTracking", true, { path: "/", maxAge: COOKIE_MAX_AGE });
  };
}

const mapStateToProps = (state: State): MainReduxProps => {
  return { network: state.network };
};

export default withRouter(connect(mapStateToProps)(Main));
