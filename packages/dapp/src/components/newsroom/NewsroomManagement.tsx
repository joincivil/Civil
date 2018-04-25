import * as React from "react";
import { Link } from "react-router-dom";
import { List } from "immutable";
import { NewsroomRoles, TwoStepEthTransaction } from "@joincivil/core";
import { Subscription } from "rxjs";
import TransactionButton from "../utility/TransactionButton";
import { applyToTCR, approve, getNewsroom } from "../../apis/civilTCR";
import NewsroomDetail from "./NewsroomDetail";
import BigNumber from "bignumber.js";

export interface NewsroomManagementState {
  error: string;
  editorAddress: string;
  reporterAddress: string;
  articleURL: string;
  proposedArticleIds: List<string>;
  compositeSubscription: Subscription;
}
export interface NewsroomManagementProps {
  match: any;
  history: any;
}

class NewsroomManagement extends React.Component<NewsroomManagementProps, NewsroomManagementState> {
  constructor(props: NewsroomManagementProps) {
    super(props);
    this.state = {
      error: "",
      editorAddress: "",
      reporterAddress: "",
      articleURL: "",
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
        <NewsroomDetail address={this.props.match.params.newsroomAddress} />
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
        <TransactionButton firstTransaction={this.addEditor}>Add Editor</TransactionButton>
        <br />
        <input onChange={this.onReporterAddressChange} />
        <TransactionButton firstTransaction={this.addReporter}>Add Reporter</TransactionButton>
        <br />
        <input onChange={this.onArticleURLChange} />
        <TransactionButton firstTransaction={this.submitArticle}>Submit Article</TransactionButton>
        <br />
        <TransactionButton
          firstTransaction={this.approve}
          secondTransaction={this.applyToTCR}
          postSecondTransaction={this.postApply}
        >
          Apply to TCR
        </TransactionButton>
        <br />
      </>
    );
  }

  private approve = async (): Promise<TwoStepEthTransaction | void> => {
    return approve(new BigNumber(100));
  };

  private applyToTCR = async (): Promise<TwoStepEthTransaction> => {
    return applyToTCR(this.props.match.params.newsroomAddress, new BigNumber(100));
  };

  private postApply = (result: any) => {
    this.props.history.push("/listing/" + this.props.match.params.newsroomAddress);
  };

  private onArticleURLChange = async (e: any) => {
    return this.setState({ articleURL: e.target.value });
  };

  private submitArticle = async (): Promise<TwoStepEthTransaction> => {
    const newsroomInstance = await getNewsroom(this.props.match.params.newsroomAddress);
    return newsroomInstance.proposeUri(this.state.articleURL);
  };

  private onReporterAddressChange = async (e: any) => {
    return this.setState({ reporterAddress: e.target.value });
  };

  private onEditorAddressChange = async (e: any) => {
    return this.setState({ editorAddress: e.target.value });
  };

  private addReporter = async (): Promise<TwoStepEthTransaction> => {
    return this.addRole(NewsroomRoles.Reporter);
  };

  private addEditor = async (): Promise<TwoStepEthTransaction> => {
    return this.addRole(NewsroomRoles.Editor);
  };

  private addRole = async (role: NewsroomRoles): Promise<TwoStepEthTransaction> => {
    const newsroomInstance = await getNewsroom(this.props.match.params.newsroomAddress);
    return newsroomInstance.addRole(this.state.editorAddress, role);
  };

  private initNewsroom = async () => {
    const newsroom = await getNewsroom(this.props.match.params.newsroomAddress);
    if (newsroom) {
      console.log("lets get name.");
      this.state.compositeSubscription.add(
        newsroom
          .proposedContent()
          .subscribe((contentHeader: any) =>
            this.setState({ proposedArticleIds: this.state.proposedArticleIds.push(contentHeader.id) }),
          ),
      );
    }
  };
}

export default NewsroomManagement;
