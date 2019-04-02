import * as React from "react";
import { urlConstants as links } from "@joincivil/utils";
import { StyledListingCopy } from "../utility/styledComponents";

export const WhitelistedTabDescription: React.FunctionComponent = props => (
  <StyledListingCopy>
    All approved Newsrooms agreed to uphold the journalistic principles in the{" "}
    <a href={links.CONSTITUTION}>Civil Constitution</a>, and Newsrooms are subject to Civil's{" "}
    <a href={links.FAQ_COMMUNITY_VETTING_PROCESS} target="_blank">
      community vetting process
    </a>.
  </StyledListingCopy>
);

export const RejectedTabDescription: React.FunctionComponent = props => (
  <StyledListingCopy>
    Rejected Newsrooms have been removed from the Civil Registry following a vote that they had violated the{" "}
    <a href={links.CONSTITUTION}>Civil Constitution</a> in some way. Rejected Newsrooms can reapply to the Registry at
    any time.
    <a href={links.FAQ_CAN_REJECTED_NEWSROOMS_REAPPLY} target="_blank">
      Learn how
    </a>.
  </StyledListingCopy>
);

export const NewApplicationsTabDescription: React.FunctionComponent = props => (
  <StyledListingCopy>
    New applications are subject to Civil community review to ensure alignment with the{" "}
    <a href={links.CONSTITUTION}>Civil Constitution</a>. If you believe any of these Newsrooms don't abide by the Civil
    Constitution, you may challenge them at any time.{" "}
    <a href={links.FAQ_HOW_TO_CHALLENGE} target="_blank">
      Learn how
    </a>.
  </StyledListingCopy>
);

export const UnderChallengeTabDescription: React.FunctionComponent = props => (
  <StyledListingCopy>
    These Newsrooms have been challenged by a community member who perceives they violated the{" "}
    <a href={links.CONSTITUTION}>Civil Constitution</a>. You can vote to accept or reject the Newsroom from the Civil
    Registry and potentially earn Civil tokens when you vote.{" "}
    <a href={links.FAQ_HOW_TO_VOTE} target="_blank">
      Learn how
    </a>.
  </StyledListingCopy>
);

export const UnderAppealTabDescription: React.FunctionComponent = props => (
  <StyledListingCopy>
    The <a href={links.FOUNDATION}>Civil Council</a> has agreed to consider the appeals of these challenged Newsrooms.
    Their decisions are based on the <a href={links.CONSTITUTION}>Civil Constitution</a>. If you disagree with the Civil
    Council’s decision, you will have a chance to challenge it.
    <a href={links.FAQ_HOW_TO_APPEAL} target="_blank">
      Learn how
    </a>.
  </StyledListingCopy>
);

export const UnderAppealChallengeTabDescription: React.FunctionComponent = props => (
  <StyledListingCopy>
    A community member has challenged the Civil Council's appeal decision on these Newsrooms' fate, based on the{" "}
    <a href={links.CONSTITUTION}>Civil Constitution</a>. You can vote to uphold or overturn the Civil Council's decision
    and potentially earn Civil tokens when you vote.
    <a href={links.FAQ_HOW_TO_VOTE} target="_blank">
      Learn how
    </a>.
  </StyledListingCopy>
);

export const ReadyToUpdateTabDescription: React.FunctionComponent = props => (
  <StyledListingCopy>
    The Civil community has spoken and the vote results are in. In order to enact the decision, community members must
    update the Newsroom's status.
    <a href={links.FAQ_HOW_TO_UPDATE_NEWSROOM_STATUS} target="_blank">
      Learn more
    </a>.
  </StyledListingCopy>
);
