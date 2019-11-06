import * as React from "react";
import { ApplicationInProgressIcon, ApprovedNewsroomsIcon, RejectedNewsroomsIcon } from "@joincivil/elements";

export const TasksText: React.FunctionComponent = props => {
  return (
    <>
      <ApprovedNewsroomsIcon /> Tasks
    </>
  );
};

export const NewsroomsText: React.FunctionComponent = props => {
  return (
    <>
      <ApplicationInProgressIcon /> Newsrooms
    </>
  );
};

export const HistoryText: React.FunctionComponent = props => {
  return (
    <>
      <RejectedNewsroomsIcon /> History
    </>
  );
};
