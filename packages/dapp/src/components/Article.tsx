import * as React from "react";
import { CivilEditor, plugins } from "@joincivil/editor";
import { getCivil } from "../helpers/civilInstance";

export interface ArticleState {
  value: any | undefined;
  error: string;
}

export interface ArticleProps {
  match: any;
}

class Article extends React.Component<ArticleProps, ArticleState> {
  constructor(props: ArticleProps) {
    super(props);
    this.state = {
      value: undefined,
      error: "",
    };
  }

  public async componentDidMount(): Promise<void> {
    return this.initArticle();
  }

  public render(): JSX.Element {
    return (
      <>
        {this.state.value && (
          <CivilEditor plugins={plugins} value={this.state.value} onChange={this.onChange} readOnly={true} />
        )}
        {!this.state.value && "loading..."}
      </>
    );
  }

  private onChange = ({ value }: { value: any }): void => {
    // gave warning (treated as error on production build) if function left empty
    return;
  };

  private initArticle = async () => {
    const newsroom = await this.getNewsroom();
    if (newsroom) {
      const article = await newsroom.loadArticle(this.props.match.params.articleId);
      const json = JSON.parse(article.content);
      this.setState({ value: json });
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

export default Article;
