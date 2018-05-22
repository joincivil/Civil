import * as React from "react";
import { List } from "immutable";
import { Civil, EthAddress } from "@joincivil/core";
import { Subscription } from "rxjs";
import { getNewsroom } from "../../apis/civilTCR";

export interface NewsroomDetailState {
  name: string;
  error: string;
  editorAddress: string;
  reporterAddress: string;
  owners: string[];
  multisig: string;
  multisigBalance: string;
  editors: List<string>;
  reporters: List<string>;
  compositeSubscription: Subscription;
}
export interface NewsroomDetailProps {
  address: EthAddress;
}

class NewsroomDetail extends React.Component<NewsroomDetailProps, NewsroomDetailState> {
  constructor(props: NewsroomDetailProps) {
    super(props);
    this.state = {
      name: "",
      error: "",
      editorAddress: "",
      reporterAddress: "",
      multisig: "",
      multisigBalance: "",
      owners: [],
      editors: List<string>(),
      reporters: List<string>(),
      compositeSubscription: new Subscription(),
    };
  }

  public async componentDidMount(): Promise<void> {
    return this.initNewsroom();
  }

  public componentWillUnmount(): void {
    this.state.compositeSubscription.unsubscribe();
  }

  public render(): JSX.Element {
    return (
      <>
        {this.state.error}
        {this.state.error && <br />}
        Newsroom Address: {this.props.address}
        <br />
        Name: {this.state.name}
        <br />
        Multisig: {this.state.multisig || "false"}
        <br />
        {this.state.multisig &&
          <>
            Multisig balance: {this.state.multisigBalance} CVL
            <br />
          </>
        }
        Owners: {this.state.owners.join(", ")}
        <br />
        Editors: {this.state.editors.join(", ")}
        <br />
        Reporters: {this.state.reporters.join(", ")}
        <br />
      </>
    );
  }

  private initNewsroom = async () => {
    const newsroom = await getNewsroom(this.props.address);
    if (newsroom) {
      this.setState({ name: await newsroom.getName() });
      this.setState({ multisig: await newsroom.getMultisigAddress() });
      this.setState({ owners: await newsroom.owners() });
      this.state.compositeSubscription.add(
        newsroom
          .editors()
          .distinct()
          .subscribe((addr: any) => this.setState({ editors: this.state.editors.push(addr) })),
      );
      this.state.compositeSubscription.add(
        newsroom
          .reporters()
          .distinct()
          .subscribe((addr: any) => this.setState({ reporters: this.state.reporters.push(addr) })),
      );

      if (this.state.multisig) {
        const civil = new Civil();
        const tcr = civil.tcrSingletonTrusted();
        const token = await tcr.getToken();
        const balance = await token.getBalance(this.state.multisig);
        this.setState({ multisigBalance: balance.toString() });
      }
    }
  };
}

export default NewsroomDetail;
