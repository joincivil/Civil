import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { StyledListingDetailPhaseCardSection } from "./styledComponents";
import { colors } from "../styleConstants";

export interface NeedHelpProps {
  faqURL: string;
}

const NeedHelpCopy = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 14px;
  letter-spacing: 0.68px;
  line-height: 20px;

  a,
  a:visited {
    color: ${colors.accent.CIVIL_BLUE};
  }
`;

const NeedHelp: React.FunctionComponent<NeedHelpProps> = props => {
  return (
    <StyledListingDetailPhaseCardSection>
      <NeedHelpCopy>
        Need help?{" "}
        <a href={props.faqURL} target="_blank">
          Check out our guide
        </a>
      </NeedHelpCopy>
    </StyledListingDetailPhaseCardSection>
  );
};

export default NeedHelp;
