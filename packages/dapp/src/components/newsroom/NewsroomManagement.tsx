import { Civil, NewsroomRoles, TwoStepEthTransaction } from "@joincivil/core";
import { List } from "immutable";
import * as React from "react";
import { Link } from "react-router-dom";
import { Subscription } from "rxjs";
import { applyToTCR, approveForApply, getNewsroom } from "../../apis/civilTCR";
import TransactionButton from "../utility/TransactionButton";
import { PageView, ViewModule } from "../utility/ViewModules";
import NewsroomDetail from "./NewsroomDetail";

export interface NewsroomManagementState {
  newsroom: any;
  error: string;
  editorAddress: string;
  articleURL: string;
  numTokens: string;
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
      newsroom: null,
      error: "",
      editorAddress: "",
      articleURL: "",
      numTokens: "",
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
      <PageView>
        <ViewModule>
          <span style={{ color: "red"}}>{this.state.error}</span>
          {this.state.error && <><br /><br /></>}

          <NewsroomDetail address={this.props.match.params.newsroomAddress} />
          ProposedArticleIds:
          <ul>
            {this.state.proposedArticleIds.map(id => {
              console.log("there is an article here");
              const articleAddress = "/article/" + this.props.match.params.newsroomAddress + "/" + id;
              return (
                <li key={id}>
                  <Link to={articleAddress}>Article {id}</Link>
                </li>
              );
            })}
          </ul>
          <br />

          <input name="editorAddress" onChange={this.onChange} />
          <TransactionButton transactions={[{ transaction: this.addEditor }]}>Add Editor</TransactionButton>
          <br />
          <input name="articleURL" onChange={this.onChange} />
          <TransactionButton transactions={[{ transaction: this.submitArticle }]}>Submit Article</TransactionButton>
          <br />
          <input name="numTokens" onChange={this.onChange} />
          <TransactionButton transactions={[{ transaction: this.sendTokenToMultisig }]}>Send CVL to Multisig</TransactionButton>
          <br />
          <br />

          <TransactionButton
            transactions={[
              {
                transaction: this.approve,
              },
              {
                transaction: this.applyToTCR,
                postTransaction: this.postApply,
              },
            ]}
          >
            Apply to TCR
          </TransactionButton>
        </ViewModule>
      </PageView>
    );
  }

  private approve = async (): Promise<TwoStepEthTransaction | void> => {
    return approveForApply();
  };

  private applyToTCR = async (): Promise<TwoStepEthTransaction> => {
    return applyToTCR(this.props.match.params.newsroomAddress);
  };

  private postApply = (result: any) => {
    this.props.history.push("/listing/" + this.props.match.params.newsroomAddress);
  };

  private onChange = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  private submitArticle = async (): Promise<TwoStepEthTransaction> => {
    const newsroomInstance = await getNewsroom(this.props.match.params.newsroomAddress);
    return newsroomInstance.publishRevision(this.state.articleURL);
  };

  private addEditor = async (): Promise<TwoStepEthTransaction> => {
    return this.addRole(NewsroomRoles.Editor);
  };

  private addRole = async (role: NewsroomRoles): Promise<TwoStepEthTransaction> => {
    const newsroomInstance = await getNewsroom(this.props.match.params.newsroomAddress);
    return newsroomInstance.addRole(this.state.editorAddress, role);
  };

  private sendTokenToMultisig = async (): Promise<TwoStepEthTransaction | void> => {
    const numTokens = parseInt(this.state.numTokens, 10);
    if (! numTokens || isNaN(numTokens)) {
      this.setState({ error: "Please enter a valid number of tokens" });
      // TODO(tobek) returning leaves button in "waiting for transaction" state, should just do nothing
      return;
    }

    if (! this.state.newsroom) {
      this.setState({ error: "Newsroom not yet loaded" });
      return;
    }

    const multisigAddress = await this.state.newsroom.getMultisigAddress();
    if (! multisigAddress) {
      this.setState({ error: "Newsroom is not a multisig newsroom" });
      return;
    }

    this.setState({ error: "" });

    const civil = new Civil();
    const tcr = civil.tcrSingletonTrusted();
    const token = await tcr.getToken();
    return token.transfer(multisigAddress, new BigNumber(numTokens * 1e18));
  };

  private initNewsroom = async () => {
    const newsroom = await getNewsroom(this.props.match.params.newsroomAddress);
    this.setState({ newsroom });
    if (newsroom) {
      console.log("lets get name.");
      this.state.compositeSubscription.add(
        newsroom
          .revisions()
          .subscribe((contentHeader: any) =>
            this.setState({ proposedArticleIds: this.state.proposedArticleIds.push(contentHeader.id) }),
          ),
      );
    }
  };
}

export default NewsroomManagement;
