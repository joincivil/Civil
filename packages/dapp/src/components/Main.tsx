import { CivilErrors } from "@joincivil/core";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { BigNumber } from "../../../../node_modules/bignumber.js";
import { setNetwork } from "../actionCreators/network";
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
    civil.addCallbackToSetNetworkEmitter(this.onNetworkUpdated);
    civil.addCallbackToSetAccountEmitter(this.onAccountUpdated);
    await this.onNetworkUpdated();
  }

  public onNetworkUpdated = async (): Promise<void> => {
    const civil = getCivil();
    if (civil.network) {
      this.props.dispatch!(setNetwork(civil.network));

      await this.onAccountUpdated();
      try {
        await initializeParameterizer(this.props.dispatch!);
        await initializeGovernment(this.props.dispatch!);
        await initializeConstitution(this.props.dispatch!);
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
    }
  };

  public onAccountUpdated = async (): Promise<void> => {
    const civil = getCivil();
    if (civil.userAccount) {
      try {
        const tcr = civil.tcrSingletonTrusted();
        const token = await tcr.getToken();
        const voting = await tcr.getVoting();
        const balance = await token.getBalance(civil.userAccount);
        const votingBalance = await voting.getNumVotingRights(civil.userAccount);
        this.props.dispatch!(addUser(civil.userAccount, balance, votingBalance));
        await initializeTokenSubscriptions(this.props.dispatch!, civil.userAccount);
        await initializeChallengeSubscriptions(this.props.dispatch!, civil.userAccount);
      } catch (err) {
        if (err.message === CivilErrors.UnsupportedNetwork) {
          this.props.dispatch!(addUser(civil.userAccount, new BigNumber(0), new BigNumber(0)));
        } else {
          throw err;
        }
      }
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
