import { Civil, EthAddress } from "@joincivil/core";
import { CivilErrors } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { setNetwork, setNetworkName } from "../actionCreators/network";
import { addUser } from "../actionCreators/userAccount";
import { getCivil } from "../helpers/civilInstance";
import { initializeGovernment, initializeGovernmentParamSubscription } from "../helpers/government";
import { initializeChallengeSubscriptions, initializeSubscriptions } from "../helpers/listingEvents";
import { initializeParameterizer, initializeProposalsSubscriptions } from "../helpers/parameterizer";
import { initializeTokenSubscriptions } from "../helpers/tokenEvents";
import Article from "./Article";
import ContractPage from "./ContractPage";
import Contracts from "./Contracts";
import CreateNewsroom from "./CreateNewsroom";
import Editor from "./Editor";
import ChallengePage from "./listing/Challenge";
import Listing from "./listing/Listing";
import Listings from "./listinglist/Listings";
import NewsroomManagementV1 from "./newsroom/NewsroomManagement";
import NewsroomManagement from "./newsroom/NewsroomManagementV2";
import Parameterizer from "./Parameterizer";
import Government from "./council/Government";
import ParameterizerProposal from "./parameterizer/Proposal";

class Main extends React.Component<DispatchProp<any> & RouteComponentProps<any>> {
  public async componentDidMount(): Promise<void> {
    const civil = getCivil();
    civil.networkStream.subscribe(this.onNetworkUpdated.bind(this, civil));
    civil.networkNameStream.subscribe(this.onNetworkNameUpdated);
    civil.accountStream.subscribe(this.onAccountUpdated.bind(this, civil));
  }

  public onNetworkUpdated = async (civil: Civil, network: number): Promise<void> => {
    this.props.dispatch!(setNetwork(network.toString()));

    await civil.accountStream.first().forEach(this.onAccountUpdated.bind(this, civil));
    try {
      await initializeParameterizer(this.props.dispatch!);
      await initializeGovernment(this.props.dispatch!);
      await initializeProposalsSubscriptions(this.props.dispatch!);
      await initializeGovernmentParamSubscription(this.props.dispatch!);
      await initializeSubscriptions(this.props.dispatch!);
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
      <Switch>
        <Route exact path="/" component={Listings} />
        <Route path="/contracts" component={Contracts} />
        <Route path="/contract/:contract" component={ContractPage} />
        <Route path="/listing/:listing/challenge/:challengeID" component={ChallengePage} />
        <Route path="/listing/:listing" component={Listing} />
        <Route path="/editor" component={Editor} />
        <Route path="/mgmt/:newsroomAddress" component={NewsroomManagement} />
        <Route path="/mgmt-v1/:newsroomAddress" component={NewsroomManagementV1} />
        <Route path="/parameterizer/proposal/:propId" component={ParameterizerProposal} />
        <Route path="/parameterizer" component={Parameterizer} />
        <Route path="/createNewsroom" component={CreateNewsroom} />
        <Route path="/article/:newsroomAddress/:articleId" component={Article} />
        <Route path="/government" component={Government} />
      </Switch>
    );
  }
}

export default withRouter(connect()(Main));
