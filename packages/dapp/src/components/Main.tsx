import { Civil, EthAddress } from "@joincivil/core";
import { CivilErrors } from "@joincivil/utils";
import { StyledMainContainer } from "@joincivil/components";
import BigNumber from "bignumber.js";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { setNetwork, setNetworkName } from "../redux/actionCreators/network";
import { addUser } from "../redux/actionCreators/userAccount";
import { getCivil, isGraphQLSupportedOnNetwork } from "../helpers/civilInstance";
import {
  initializeGovernment,
  initializeGovernmentParamSubscription,
  initializeConstitution,
} from "../helpers/government";
import { initializeChallengeSubscriptions } from "../helpers/listingEvents";
import { initializeParameterizer, initializeProposalsSubscriptions } from "../helpers/parameterizer";
import { initializeTokenSubscriptions } from "../helpers/tokenEvents";
import ContractPage from "./ContractPage";
import Contracts from "./Contracts";
import CreateNewsroom from "./CreateNewsroom";
import { Dashboard } from "./Dashboard";
import ChallengePage from "./listing/Challenge";
import Listing from "./listing/Listing";
import Listings from "./listinglist/Listings";
import NewsroomManagementV1 from "./newsroom/NewsroomManagement";
import NewsroomManagement from "./newsroom/NewsroomManagementV2";
import Parameterizer from "./Parameterizer";
import Government from "./council/Government";
import SubmitChallengePage from "./listing/SubmitChallenge";
import RequestAppealPage from "./listing/RequestAppeal";
import { initialize, disableGraphQL } from "../redux/actionCreators/ui";

class Main extends React.Component<DispatchProp<any> & RouteComponentProps<any>> {
  public async componentDidMount(): Promise<void> {
    const civil = getCivil();
    civil.networkStream.subscribe(this.onNetworkUpdated.bind(this, civil));
    civil.networkNameStream.subscribe(this.onNetworkNameUpdated);
    civil.accountStream.subscribe(this.onAccountUpdated.bind(this, civil));
  }

  public onNetworkUpdated = async (civil: Civil, network: number): Promise<void> => {
    this.props.dispatch!(setNetwork(network.toString()));
    if (!isGraphQLSupportedOnNetwork(network.toString())) {
      this.props.dispatch!(disableGraphQL());
    }

    await civil.accountStream.first().forEach(this.onAccountUpdated.bind(this, civil));
    try {
      await initializeParameterizer(this.props.dispatch!);
      await initializeGovernment(this.props.dispatch!);
      await initializeConstitution(this.props.dispatch!);
      await initializeProposalsSubscriptions(this.props.dispatch!);
      await initializeGovernmentParamSubscription(this.props.dispatch!);
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
    if (account) {
      try {
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
      console.log("No account found");
      this.props.dispatch!(addUser("", new BigNumber(0), new BigNumber(0)));
    }
  };

  public render(): JSX.Element {
    return (
      <StyledMainContainer>
        <Switch>
          <Route exact path="/" component={Listings} />
          <Route path="/registry/:listingType/:subListingType" component={Listings} />
          <Route path="/registry/:listingType" component={Listings} />
          <Route path="/registry" component={Listings} />
          <Route path="/contracts" component={Contracts} />
          <Route path="/contract/:contract" component={ContractPage} />
          <Route path="/listing/:listing/challenge/:challengeID" component={ChallengePage} />
          <Route path="/listing/:listing/submit-challenge" component={SubmitChallengePage} />
          <Route path="/listing/:listing/request-appeal" component={RequestAppealPage} />
          <Route path="/listing/:listing" component={Listing} />
          <Route path="/mgmt/:newsroomAddress" component={NewsroomManagement} />
          <Route path="/mgmt-v1/:newsroomAddress" component={NewsroomManagementV1} />
          <Route path="/parameterizer" component={Parameterizer} />
          <Route path="/createNewsroom" component={CreateNewsroom} />
          <Route path="/government" component={Government} />
          <Route path="/dashboard/:activeDashboardTab" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </StyledMainContainer>
    );
  }
}

export default withRouter(connect()(Main));
