import * as React from "react";
import AddToCalendar from "react-add-to-calendar";
import { ListingWrapper } from "@joincivil/core";
import {
  SubmitChallengeSuccessIcon as ApplicationSuccessIcon,
  OBSectionHeader,
  OBSectionDescription,
  StyledAddToCalendar,
  Button,
  buttonSizes,
} from "@joincivil/components";
import { getLocalDateTimeStrings, padString, urlConstants } from "@joincivil/utils";

import { FormSection, FormRow, FormRowCenter, FormRowItem } from "../styledComponents";

export interface ApplyToTCRSuccessProps {
  listing: ListingWrapper;
  applyStageLenDisplay: string;
}

function getCalendarEventDateTime(seconds: number | Date): string {
  const theDate = typeof seconds === "number" ? new Date(seconds * 1000) : seconds;
  const pad = (num: number | string) => {
    return padString(num, 2, "0");
  };
  const hours = pad(theDate.getHours());
  const mins = pad(theDate.getMinutes());
  const tzOffset = `${pad(theDate.getTimezoneOffset() / 60)}${pad(theDate.getTimezoneOffset() % 60)}`;
  const dateString = `${theDate.getFullYear()}-${pad(theDate.getMonth() + 1)}-${pad(theDate.getDate())}`;
  const timeString = `${hours}:${mins}-${tzOffset}`;
  return `${dateString}T${timeString}`;
}

interface AddApplicationEndToCalendar {
  endTime: number;
  listingDetailURL: string;
}

const AddApplicationEndToCalendar: React.SFC<AddApplicationEndToCalendar> = props => {
  const title = "My Newsroom review period has ended for the Civil Registry";
  const description = "My Newsroom review period has ended for the Civil Registry";
  const location = props.listingDetailURL;
  const startTime = getCalendarEventDateTime(props.endTime);
  const endTime = getCalendarEventDateTime(props.endTime);
  const event = {
    title,
    description,
    location,
    startTime,
    endTime,
  };
  return (
    <StyledAddToCalendar>
      <AddToCalendar event={event} />
    </StyledAddToCalendar>
  );
};

const ApplyToTCRSuccess: React.SFC<ApplyToTCRSuccessProps> = props => {
  const { listing } = props;
  const listingAddress = listing.address;
  const endTime = listing.data.appExpiry.toNumber();
  const applicationEndDateTime = getLocalDateTimeStrings(endTime);
  // Need an absolute URL cause it goes into calendar event:
  const registryListingURL = `${document.location.origin}/listing/${listingAddress}`;

  return (
    <>
      <FormRowCenter>
        <ApplicationSuccessIcon />
      </FormRowCenter>
      <OBSectionHeader>Application submitted!</OBSectionHeader>
      <OBSectionDescription>
        Your newsroom application was submitted to the Civil Registry and will now be reviewed by the Civil Community
        over the next {props.applyStageLenDisplay}.
      </OBSectionDescription>

      <FormSection>
        <FormRow>
          <FormRowItem>
            <p>
              Your newsroom review period ends on{" "}
              <b>
                {applicationEndDateTime[0]} at {applicationEndDateTime[1]}
              </b>.
            </p>

            <p>Please check your emails during that time to keep tabs on your newsroom's process.</p>
          </FormRowItem>
          <FormRowItem align="right">
            <AddApplicationEndToCalendar endTime={endTime} listingDetailURL={registryListingURL} />
          </FormRowItem>
        </FormRow>
        <FormRow>
          If a community member challenges your newsroom during the review period, you will get an email with
          recommendations on next steps.
        </FormRow>
      </FormSection>

      <FormSection>
        <OBSectionDescription>
          You can also follow the progress of your application on your Newsroom Profile on the Registry.
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

export default ApplyToTCRSuccess;
