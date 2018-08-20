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
      <ApplicationInProgressIcon /> Applications In Progress
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
