import * as React from "react";
import * as sanitizeHtml from "sanitize-html";
import { ListingWrapper, NewsroomWrapper } from "@joincivil/core";

export interface ListingCharterProps {
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
}

class ListingCharter extends React.Component<ListingCharterProps> {
  public render(): JSX.Element {
    let cleanNewsroomCharter = "";
    if (this.props.newsroom && this.props.newsroom.data.charter) {
      const newsroomCharter = JSON.parse(this.props.newsroom.data.charter.content.toString()).charter;
      cleanNewsroomCharter = sanitizeHtml(newsroomCharter, {
        allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(["bzz"]),
      });
    }

    return (
      (this.props.listing &&
        this.props.listing.data && <div dangerouslySetInnerHTML={{ __html: cleanNewsroomCharter }} />) || <></>
    );
  }
}

export default ListingCharter;
