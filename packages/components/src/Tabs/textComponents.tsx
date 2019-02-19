import * as React from "react";
import { ApplicationInProgressIcon } from "../icons/ApplicationInProgressIcon";
import { ApprovedNewsroomsIcon } from "../icons/ApprovedNewsroomsIcon";
import { RejectedNewsroomsIcon } from "../icons/RejectedNewsroomsIcon";

// Text for listings approved newsrooms tab
export const ApprovedNewsroomsTabText: React.SFC = props => {
  return (
    <>
      <ApprovedNewsroomsIcon /> Approved Newsrooms
    </>
  );
};

// Text for listings applicaitons in progress tab
export const ApplicationsInProgressTabText: React.SFC = props => {
  return (
    <>
      <ApplicationInProgressIcon /> Newsrooms In Progress
    </>
  );
};

// Text for listings rejected newsrooms tab
export const RejectedNewsroomsTabText: React.SFC = props => {
  return (
    <>
      <RejectedNewsroomsIcon /> Rejected Newsrooms
    </>
  );
};

export const TabNewApplicationsText: React.SFC = props => {
  return <>New Applications</>;
};

export const TabUnderChallengeText: React.SFC = props => {
  return <>Under Challenge</>;
};

export const TabAppealToCouncilText: React.SFC = props => {
  return <>Under Appeal</>;
};

export const TabChallengeCouncilAppealText: React.SFC = props => {
  return <>Decision Challenged</>;
};

export const TabReadyToUpdateText: React.SFC = props => {
  return <>Ready to Update</>;
};
