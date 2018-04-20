import * as React from "react";
import { Link } from "react-router-dom";
import { List } from "immutable";
import { NewsroomRoles } from "@joincivil/core";
import { Subscription } from "rxjs";
import TransactionButton from "../utility/TransactionButton";
import { getCivil } from "../../helpers/civilInstance";

export interface NewsroomManagementState {
  name: string;
  error: string;
  editorAddress: string;
  reporterAddress: string;
  articleURL: string;
  owners: string[];
  editors: List<string>;
  reporters: List<string>;
  proposedArticleIds: List<string>;
  compositeSubscription: Subscription;
}
export interface NewsroomManagementProps {
  match: any;
}

class NewsroomManagement extends React.Component<NewsroomManagementProps, NewsroomManagementState> {
  constructor(props: NewsroomManagementProps) {
    super(props);
    this.state = {
      name: "",
      error: "",
      editorAddress: "",
      reporterAddress: "",
      articleURL: "",
      owners: [],
      editors: List<string>(),
      reporters: List<string>(),
      proposedArticleIds: List<string>(),
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
        Newsroom Address: {this.props.match.params.newsroomAddress}
        <br />
        Name: {this.state.name}
        <br />
        Owners: {this.state.owners}
        <br />
        Editors: {this.state.editors}
        <br />
        Reporters: {this.state.reporters}
        <br />
        ProposedArticleIds:
        {this.state.proposedArticleIds.map(id => {
          console.log("there is an article here");
          const articleAddress = "/article/" + this.props.match.params.newsroomAddress + "/" + id;
          return (
            <>
              <Link to={articleAddress}>Article {id}</Link> <br />
            </>
          );
        })}
        <br />
        <input onChange={this.onEditorAddressChange} />
        <TransactionButton transaction={this.addEditor}>Add Editor</TransactionButton>
        <br />
        <input onChange={this.onReporterAddressChange} />
        <TransactionButton transaction={this.addReporter}>Add Reporter</TransactionButton>
        <br />
        <input onChange={this.onArticleURLChange} />
        <TransactionButton transaction={this.submitArticle}>Submit Article</TransactionButton>
        <br />
      </>
    );
  }

  private onArticleURLChange = async (e: any) => {
    return this.setState({ articleURL: e.target.value });
  };

  private submitArticle = async () => {
    const newsroomInstance = await this.getNewsroom();
    if (newsroomInstance) {
      let newsroomTransaction;
      try {
        newsroomTransaction = await newsroomInstance.proposeUri(this.state.articleURL);
      } catch (ex) {
        console.log("failed to submit article: " + ex);
        this.setState({
          error: "Failed to Submit Article: " + ex,
        });
      }
      if (newsroomTransaction) {
        await newsroomTransaction.awaitReceipt();
      }
    }
  };

  private onReporterAddressChange = async (e: any) => {
    return this.setState({ reporterAddress: e.target.value });
  };

  private onEditorAddressChange = async (e: any) => {
    return this.setState({ editorAddress: e.target.value });
  };

  private addReporter = async () => {
    return this.addRole(NewsroomRoles.Reporter);
  };

  private addEditor = async () => {
    return this.addRole(NewsroomRoles.Editor);
  };

  private addRole = async (role: NewsroomRoles) => {
    const newsroomInstance = await this.getNewsroom();
    if (newsroomInstance) {
      let newsroomTransaction;
      try {
        newsroomTransaction = await newsroomInstance.addRole(this.state.editorAddress, role);
      } catch (ex) {
        console.log("failed to add role: " + ex);
        this.setState({
          error: "Failed to Add Role: " + ex,
        });
      }
      if (newsroomTransaction) {
        await newsroomTransaction.awaitReceipt();
      }
    }
  };

  private initNewsroom = async () => {
    const newsroom = await this.getNewsroom();
    if (newsroom) {
      console.log("lets get name.");
      this.setState({ name: await newsroom.getName() });
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
      this.state.compositeSubscription.add(
        newsroom
          .proposedContent()
          .subscribe((contentHeader: any) =>
            this.setState({ proposedArticleIds: this.state.proposedArticleIds.push(contentHeader.id) }),
          ),
      );
    }
  };

  private getNewsroom = async (): Promise<any> => {
    const civil = getCivil();
    let newsroom;
    try {
      newsroom = await civil.newsroomAtUntrusted(this.props.match.params.newsroomAddress);
    } catch (ex) {
      console.log("failed to get newsroom.");
      this.setState({
        error:
          "Error resolving newsroom. Ensure Metamask is installed and set to Rinkeby and that the address for the newsroom is correct.",
      });
    }
    return newsroom;
  };
}

export default NewsroomManagement;
