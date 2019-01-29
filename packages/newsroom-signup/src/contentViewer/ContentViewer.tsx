import * as React from "react";
import { Map } from "immutable";
import { Newsroom } from "@joincivil/core/build/src/contracts/newsroom";
import { connect, DispatchProp } from "react-redux";
import { addRevision } from "./actions";
import { EthContentHeader } from "@joincivil/core";
import { ContentViewerReduxState, RevisionAndJson } from "./reducers";
import { ContentItem } from "./ContentItem";

export interface ContentViewerProps {
  newsroom: Newsroom;
}
export interface ContentInternalViewerProps extends ContentViewerProps {
  content: Map<number, Map<number, RevisionAndJson>>;
}

class ContentViewerComponent extends React.Component<ContentInternalViewerProps & DispatchProp<any>> {
  public componentDidMount(): void {
    this.props.newsroom.revisions().subscribe((item: EthContentHeader) => {
      this.props.dispatch!(addRevision(item));
    });
  }
  public render(): JSX.Element {
    const content = this.props.content.toArray();
    return (
      <div>
        <h2> Content </h2>
        {content.map((item: Map<number, RevisionAndJson>, index: number): JSX.Element => (
          <ContentItem key={index} content={item} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: ContentViewerReduxState, ownProps: ContentViewerProps): ContentInternalViewerProps => {
  return {
    content: state.newsroomContent,
    ...ownProps,
  };
};

export const ContentViewer = connect(mapStateToProps)(ContentViewerComponent);
