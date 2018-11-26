import * as React from "react";
import * as sanitizeHtml from "sanitize-html";
import { ListingWrapper, NewsroomWrapper, CharterData } from "@joincivil/core";

export interface ListingCharterProps {
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
  charter?: CharterData;
}

class ListingCharter extends React.Component<ListingCharterProps> {
  public render(): JSX.Element {
    const { charter, listing } = this.props;
    if (!charter || !listing || !listing.data) {
      return <></>;
    }
    // TODO(toby) remove legacy `charter.charter` after transition
    if ((charter as any).charter) {
      const cleanNewsroomCharter = sanitizeHtml((charter as any).charter, {
        allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(["bzz"]),
      });
      return <div dangerouslySetInnerHTML={{ __html: cleanNewsroomCharter }} />;
    }
    if (typeof charter !== "object" || !charter.mission || !charter.roster) {
      return <p style={{ color: "red" }}>Error: Newsroom charter is in an invalid format</p>;
    }

    return (
      <>
        {Object.keys(charter.mission).map(key => (
          <div key={key}>
            <h3>{key[0].toUpperCase() + key.substr(1)}</h3>
            <p>{charter.mission[key]}</p>
          </div>
        ))}

        <h2>Team</h2>
        {charter.roster.map((rosterMember, i) => (
          <div key={i}>
            <h3>{rosterMember.name}</h3>
            <p>{rosterMember.bio}</p>
          </div>
        ))}
      </>
    );
  }
}

export default ListingCharter;
