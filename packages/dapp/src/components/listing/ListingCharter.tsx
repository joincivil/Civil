import * as React from "react";
import * as sanitizeHtml from "sanitize-html";
import styled from "styled-components";
import { fonts, colors, Button, buttonSizes } from "@joincivil/components";
import { ListingWrapper, NewsroomWrapper, CharterData } from "@joincivil/core";
import { renderPTagsFromLineBreaks } from "@joincivil/utils";
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

const VisitNewsroomWrapper = styled.div`
  padding-top: 32px;
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  line-height: 32px;
  text-align: right;
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
          {renderPTagsFromLineBreaks(charter.mission.purpose)}

          <CharterSubHeading>Ownership Structure</CharterSubHeading>
          {renderPTagsFromLineBreaks(charter.mission.structure)}

          <CharterSubHeading>Current or Intended Revenue Sources</CharterSubHeading>
          {renderPTagsFromLineBreaks(charter.mission.revenue)}

          <CharterSubHeading>Potential Conflicts of Interest</CharterSubHeading>
          {renderPTagsFromLineBreaks(charter.mission.encumbrances)}

          <CharterSubHeading>Additional Information</CharterSubHeading>
          {renderPTagsFromLineBreaks(charter.mission.miscellaneous)}
        </Mission>

        <CharterHeading>Team</CharterHeading>
        {charter.roster.map((rosterMember, i) => (
          <ListingCharterRosterMember key={i} member={rosterMember} />
        ))}

        <VisitNewsroomWrapper>
          <Button size={buttonSizes.MEDIUM_WIDE} href={charter.newsroomUrl} target="_blank">Visit Newsroom 🡭</Button>
        </VisitNewsroomWrapper>
      </Wrapper>
    );
  }
}

export default ListingCharter;
