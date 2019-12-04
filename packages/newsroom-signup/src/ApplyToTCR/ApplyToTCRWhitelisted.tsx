import * as React from "react";
import { ListingWrapper } from "@joincivil/typescript-types";
import {
  SubmitChallengeSuccessIcon as ApplicationSuccessIcon,
  OBSectionHeader,
  OBSectionDescription,
  Button,
  buttonSizes,
} from "@joincivil/components";
import { urlConstants } from "@joincivil/utils";

import { FormSection, FormRow, FormRowCenter } from "../styledComponents";

export interface ApplyToTCRWhitelistedProps {
  listing: ListingWrapper;
}

const ApplyToTCRWhitelisted: React.FunctionComponent<ApplyToTCRWhitelistedProps> = props => {
  const { listing } = props;
  const listingAddress = listing.address;
  const registryListingURL = `${document.location.origin}/listing/${listingAddress}`;

  return (
    <>
      <FormRowCenter>
        <ApplicationSuccessIcon />
      </FormRowCenter>
      <OBSectionHeader>Application Approved!</OBSectionHeader>
      <OBSectionDescription>
        Your newsroom application was received by the Civil Community, has passed the review period, and is now
        whitelisted on the registry.
      </OBSectionDescription>

      <FormSection>
        <FormRow>
          A community member may still challenge your newsroom in the future. If they do, you will get an email with
          recommendations on next steps. Please note, if your newsroom is challenged, you will not be able to make any
          edits to your profile or charter until the challenge period is over.
        </FormRow>
      </FormSection>

      <FormSection>
        <OBSectionDescription>
          You can also see your Newsroom Profile and any community discussions on the Registry.
        </OBSectionDescription>

        <FormRowCenter>
          <Button size={buttonSizes.MEDIUM} href={registryListingURL}>
            View your Newsroom
          </Button>
        </FormRowCenter>

        <FormRowCenter>
          <p>
            If you have any questions, you can contact{" "}
            <a href={urlConstants.EMAIL_MAILTO} target="_blank">
              support
            </a>
          </p>
        </FormRowCenter>
      </FormSection>
    </>
  );
};

export default ApplyToTCRWhitelisted;
