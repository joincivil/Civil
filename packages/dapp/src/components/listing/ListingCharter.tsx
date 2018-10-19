import * as React from "react";
import * as sanitizeHtml from "sanitize-html";
import { ListingWrapper, NewsroomWrapper } from "@joincivil/core";

export interface ListingCharterProps {
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
  charter?: any;
}

class ListingCharter extends React.Component<ListingCharterProps> {
  public render(): JSX.Element {
    let cleanNewsroomCharter = "";
    if (this.props.charter) {
      // TODO(jon): This is a temporary patch to handle the older charter format. It's needed while we're in transition to the newer schema and should be updated once the dapp is updated to properly handle the new charter
      const newsroomCharter = this.props.charter.charter;

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
