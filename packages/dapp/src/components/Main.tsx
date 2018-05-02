import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Listings from "./Listings";
import Newsroom from "./newsroom/Newsroom";
import Contracts from "./Contracts";
import ContractPage from "./ContractPage";
import Listing from "./listing/Listing";
import Editor from "./Editor";
import NewsroomManagement from "./newsroom/NewsroomManagement";
import Parameterizer from "./Parameterizer";
import CreateNewsroom from "./CreateNewsroom";
import Article from "./Article";
import { setCivil } from "../helpers/civilInstance";

export interface MainState {
  civilSet: boolean;
}
class Main extends React.Component<{}, MainState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      civilSet: false,
    };
  }
  public componentDidMount(): void {
    window.addEventListener("load", this.initCivil);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("load", this.initCivil);
  }

  public render(): JSX.Element {
    return (
      <>
        {!this.state.civilSet && "loading..."}
        {this.state.civilSet && (
          <Switch>
            <Route exact={true} path="/" component={Listings} />
            <Route path="/newsroom/:newsroomAddress" component={Newsroom} />
            <Route path="/contracts" component={Contracts} />
            <Route path="/contract/:contract" component={ContractPage} />
            <Route path="/listing/:listing" component={Listing} />
            <Route path="/editor" component={Editor} />
            <Route path="/mgmt/:newsroomAddress" component={NewsroomManagement} />
            <Route path="/parameterizer" component={Parameterizer} />
            <Route path="/createNewsroom" component={CreateNewsroom} />
            <Route path="/article/:newsroomAddress/:articleId" component={Article} />
          </Switch>
        )}
      </>
    );
  }

  private initCivil = () => {
    setCivil();
    this.setState({ civilSet: true });
  };
}

export default Main;
