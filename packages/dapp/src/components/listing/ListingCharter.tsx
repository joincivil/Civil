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
      let newsroomCharter;
      try {
        // TODO(jon): This is a temporary patch to handle the older charter format. It's needed while we're in transition to the newer schema and should be updated once the dapp is updated to properly handle the new charter
        newsroomCharter = (this.props.newsroom.data.charter.content as any).charter;
      } catch (ex) {
        console.error("charter not formatted correctly");
      }
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
