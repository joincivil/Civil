import { TransactionButton } from "@joincivil/components";
import { Civil, NewsroomRoles, TwoStepEthTransaction } from "@joincivil/core";
import { CivilErrors } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import { List } from "immutable";
import * as React from "react";
import { Link } from "react-router-dom";
import RichTextEditor from "react-rte";
import { Subscription } from "rxjs";
import { applyToTCR, approveForApply, getNewsroom } from "../../apis/civilTCR";
import { PageView, ViewModule } from "../utility/ViewModules";
import NewsroomDetail from "./NewsroomDetail";

export interface NewsroomManagementState {
  newsroom: any;
  multisigAddr: string;
  multisigBalance: BigNumber;
  error: string;
  editorAddress: string;
  articleURL: string;
  numTokens: string;
  proposedArticleIds: List<string>;
  compositeSubscription: Subscription;
  value: any;
  descValue: string;
}
export interface NewsroomManagementProps {
  match: any;
  history: any;
  initialValue: any;
}

class NewsroomManagement extends React.Component<NewsroomManagementProps, NewsroomManagementState> {
  constructor(props: NewsroomManagementProps) {
    super(props);
    this.state = {
      newsroom: null,
      multisigAddr: "",
      multisigBalance: new BigNumber(0),
      error: "",
      editorAddress: "",
      articleURL: "",
      numTokens: "",
      proposedArticleIds: List<string>(),
      compositeSubscription: new Subscription(),
      value: RichTextEditor.createEmptyValue(),
      descValue: "",
    };
  }

  public handleValueChange = (value: any) => {
    this.setState({ value });
  };

  public onDescChange = (event: any) => {
    this.setState({ descValue: event.target.value });
  };

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
          <span style={{ color: "red" }}>{this.state.error}</span>
          {this.state.error && <br />}
          <NewsroomDetail
            address={this.props.match.params.newsroomAddress}
            multisigAddr={this.state.multisigAddr}
            multisigBalance={this.state.multisigBalance}
          />
          ProposedArticleIds:
          <ul>
            {this.state.proposedArticleIds.map(id => {
              const articleAddress = "/article/" + this.props.match.params.newsroomAddress + "/" + id;
              return (
                <li key={id}>
                  <Link to={articleAddress}>Article {id}</Link>
                </li>
              );
            })}
          </ul>
          <br />
          <input onChange={this.onEditorAddressChange} />
          <TransactionButton transactions={[{ transaction: this.addEditor }]}>Add Editor</TransactionButton>
          <br />
          <input onChange={this.onArticleURLChange} />
          <TransactionButton transactions={[{ transaction: this.submitArticle }]}>Submit Article</TransactionButton>
          <br />
          {this.state.multisigAddr && (
            <>
              <input value={this.state.numTokens} onChange={this.onNumTokensChange} />
              <TransactionButton
                transactions={[
                  {
                    transaction: this.sendTokenToMultisig,
                    postTransaction: this.postSendToken,
                  },
                ]}
              >
                Send CVL to Multisig
              </TransactionButton>
              <br />
            </>
          )}
          Short Description:
          <br />
          <textarea value={this.state.descValue} onChange={this.onDescChange} />
          <br />
          Charter:
          <RichTextEditor value={this.state.value} onChange={this.handleValueChange} />
          <br />
          <TransactionButton transactions={[{ transaction: this.updateCharter }]}> Update Charter </TransactionButton>
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

  private updateCharter = async (): Promise<TwoStepEthTransaction | void> => {
    const newsroomInstance = await getNewsroom(this.props.match.params.newsroomAddress);
    const jsonToSave = { desc: this.state.descValue, charter: this.state.value.toString("html") };
    return newsroomInstance.updateRevision(0, JSON.stringify(jsonToSave));
  };

  private approve = async (): Promise<TwoStepEthTransaction | void> => {
    this.setState({ error: "" });
    try {
      return await approveForApply(this.state.multisigAddr);
    } catch (e) {
      if (e.message === CivilErrors.InsufficientToken) {
        this.setState({
          error:
            (this.state.multisigAddr ? "Newsroom multisig wallet" : "Your account") +
            " has insufficient CVL token to apply",
        });
      } else {
        throw e;
      }
    }
  };

  private applyToTCR = async (): Promise<TwoStepEthTransaction | void> => {
    if (this.state.error) {
      return;
    }
    return applyToTCR(this.props.match.params.newsroomAddress, this.state.multisigAddr);
  };

  private postApply = (result: any) => {
    this.props.history.push("/listing/" + this.props.match.params.newsroomAddress);
  };

  private onArticleURLChange = async (e: any) => {
    return this.setState({ articleURL: e.target.value });
  };

  private submitArticle = async (): Promise<TwoStepEthTransaction> => {
    const newsroomInstance = await getNewsroom(this.props.match.params.newsroomAddress);
    return newsroomInstance.publishRevision(this.state.articleURL);
  };

  private onEditorAddressChange = async (e: any) => {
    return this.setState({ editorAddress: e.target.value });
  };

  private addEditor = async (): Promise<TwoStepEthTransaction> => {
    return this.addRole(NewsroomRoles.Editor);
  };

  private addRole = async (role: NewsroomRoles): Promise<TwoStepEthTransaction> => {
    const newsroomInstance = await getNewsroom(this.props.match.params.newsroomAddress);
    return newsroomInstance.addRole(this.state.editorAddress, role);
  };

  private onNumTokensChange = async (e: any) => {
    return this.setState({ numTokens: e.target.value });
  };

  private sendTokenToMultisig = async (): Promise<TwoStepEthTransaction | void> => {
    const numTokens = parseInt(this.state.numTokens, 10);
    if (!numTokens || isNaN(numTokens)) {
      this.setState({ error: "Please enter a valid number of tokens" });
      // TODO(tobek) returning leaves button in "waiting for transaction" state, should just do nothing
      return;
    }
    this.setState({ error: "" });

    const civil = new Civil();
    const tcr = await civil.tcrSingletonTrusted();
    const token = await tcr.getToken();
    return token.transfer(this.state.multisigAddr, civil.toBigNumber(numTokens).mul(1e18));
  };

  private postSendToken = async () => {
    const civil = new Civil();
    const tcr = await civil.tcrSingletonTrusted();
    const token = await tcr.getToken();
    const balance = await token.getBalance(this.state.multisigAddr);
    this.setState({
      multisigBalance: balance,
      numTokens: "",
    });
    // TODO(tobek) should also update user's CVL balance in header nav
  };

  private initNewsroom = async () => {
    const newsroom = await getNewsroom(this.props.match.params.newsroomAddress);
    this.setState({ newsroom });

    const data = await newsroom.getNewsroomData();
    if (data.charter) {
      const charterStuff = JSON.parse(data.charter.content);
      this.setState({
        descValue: charterStuff.desc,
        value: RichTextEditor.createValueFromString(charterStuff.charter, "html"),
      });
    }
    if (newsroom) {
      this.state.compositeSubscription.add(
        newsroom
          .revisions()
          .subscribe((contentHeader: any) =>
            this.setState({ proposedArticleIds: this.state.proposedArticleIds.push(contentHeader.id) }),
          ),
      );

      const multisigAddr = await newsroom.getMultisigAddress();
      this.setState({ multisigAddr });
      if (multisigAddr) {
        const civil = new Civil();
        const tcr = await civil.tcrSingletonTrusted();
        const token = await tcr.getToken();
        const balance = await token.getBalance(multisigAddr);
        this.setState({ multisigBalance: balance });
      }
    }
  };
}

export default NewsroomManagement;
