import * as React from "react";

import { getLocalDateTimeStrings } from "@joincivil/utils";

import { WhitelistedSummaryComponentProps } from "./types";
import { MetaRow, MetaItemLabel, MetaItemValue, StyledListingSummarySection } from "./styledComponents";
import { ApprovedLabelText } from "./textComponents";
import SummaryActionButton from "./SummaryActionButton";

export const WhitelistedSummaryActionDetails: React.SFC<WhitelistedSummaryComponentProps> = props => {
  if (!props.whitelistedTimestamp) {
    return null;
  }

  const timestampStrings: [string, string] = getLocalDateTimeStrings(props.whitelistedTimestamp);

  return (
    <StyledListingSummarySection>
      <MetaRow>
        <MetaItemLabel>
          <ApprovedLabelText />
        </MetaItemLabel>
        <MetaItemValue>
          {timestampStrings![0]} {timestampStrings![1]}
        </MetaItemValue>
      </MetaRow>
      <SummaryActionButton {...props} />
    </StyledListingSummarySection>
  );
};
