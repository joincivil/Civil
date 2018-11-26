import * as React from "react";
import * as sanitizeHtml from "sanitize-html";
import styled from "styled-components";
import { fonts, colors } from "@joincivil/components";
import { ListingWrapper, NewsroomWrapper, CharterData } from "@joincivil/core";
import ListingCharterRosterMember from "./ListingCharterRosterMember";

export interface ListingCharterProps {
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
  charter?: CharterData;
}

const Wrapper = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
`;
const CharterHeading = styled.h2`
  font: 800 32px/34px ${fonts.SERIF};
  margin: 0 0 12px;
  color: ${colors.primary.BLACK};
`;
const CharterSubHeading = styled.h3`
  font: 600 21px/34px ${fonts.SERIF};
  margin: 24px 0 18px;
  color: ${colors.primary.BLACK};
`;
const Mission = styled.div`
  margin-bottom: 40px;
`;

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
      <Wrapper>
        <Mission>
          <CharterHeading>Our Mission</CharterHeading>
          {this.plainTextToPs(charter.mission.purpose)}

          <CharterSubHeading>Ownership Structure</CharterSubHeading>
          {this.plainTextToPs(charter.mission.structure)}

          <CharterSubHeading>Current or Intended Revenue Sources</CharterSubHeading>
          {this.plainTextToPs(charter.mission.revenue)}

          <CharterSubHeading>Potential Conflicts of Interest</CharterSubHeading>
          {this.plainTextToPs(charter.mission.encumbrances)}

          <CharterSubHeading>Additional Information</CharterSubHeading>
          {this.plainTextToPs(charter.mission.miscellaneous)}
        </Mission>

        <CharterHeading>Team</CharterHeading>
        {charter.roster.map((rosterMember, i) => (
          <ListingCharterRosterMember key={i} member={rosterMember} />
        ))}
      </Wrapper>
    );
  }

  /* Input plain text with possible line breaks, output as <p> tags. */
  private plainTextToPs = (text: string): JSX.Element => {
    if (!text) {
      return <></>
    }
    return <>{text.split("\n").filter(line => !!line).map((line, i) => <p key={i}>{line}</p>)}</>;
  }
}

export default ListingCharter;
