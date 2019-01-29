import * as React from "react";
import { Map } from "immutable";
import { RevisionAndJson } from "./reducers";
import { Revision } from "./Revision";

export interface ContentItemProps {
  content: Map<number, RevisionAndJson>;
}

export class ContentItem extends React.Component<ContentItemProps> {
  public render(): JSX.Element {
    const content = this.props.content.toArray();
    return (
      <div>
        <h3>{content[0].revision.contentId || "charter"}</h3>
        {content.map((item: RevisionAndJson): JSX.Element => {
          return (
            <div key={item.revision.revisionId}>
              <Revision {...item} />
            </div>
          );
        })}
      </div>
    );
  }
}
