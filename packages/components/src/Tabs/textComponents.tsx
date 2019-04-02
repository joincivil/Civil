import * as React from "react";
import { ApplicationInProgressIcon } from "../icons/ApplicationInProgressIcon";
import { ApprovedNewsroomsIcon } from "../icons/ApprovedNewsroomsIcon";
import { RejectedNewsroomsIcon } from "../icons/RejectedNewsroomsIcon";

// Text for listings approved newsrooms tab
export const ApprovedNewsroomsTabText: React.FunctionComponent = props => {
  return (
    <>
      <ApprovedNewsroomsIcon /> Approved Newsrooms
    </>
  );
};

// Text for listings applicaitons in progress tab
export const ApplicationsInProgressTabText: React.FunctionComponent = props => {
  return (
    <>
      <ApplicationInProgressIcon /> Newsrooms In Progress
    </>
  );
};

// Text for listings rejected newsrooms tab
export const RejectedNewsroomsTabText: React.FunctionComponent = props => {
  return (
    <>
      <RejectedNewsroomsIcon /> Rejected Newsrooms
    </>
  );
};

export const TabNewApplicationsText: React.FunctionComponent = props => {
  return <>New Applications</>;
};

export const TabUnderChallengeText: React.FunctionComponent = props => {
  return <>Under Challenge</>;
};

export const TabAppealToCouncilText: React.FunctionComponent = props => {
  return <>Under Appeal</>;
};

export const TabChallengeCouncilAppealText: React.FunctionComponent = props => {
  return <>Decision Challenged</>;
};

export const TabReadyToUpdateText: React.FunctionComponent = props => {
  return <>Ready to Update</>;
};
