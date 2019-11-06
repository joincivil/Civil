import * as React from "react";
import { TasksText, NewsroomsText, HistoryText } from "./textComponents";

export interface CollapsibleContainerTitleProps {
  count?: number;
  isOpen?: boolean;
}

const CollapsibleContainerTitle: React.FunctionComponent<CollapsibleContainerTitleProps> = props => {
  return (
    <div>
      {props.children}
    </div>
  );
};

export const TasksTitle: React.FunctionComponent<CollapsibleContainerTitleProps> = props => {
  return (
    <CollapsibleContainerTitle count={props.count}>
      <TasksText />
    </CollapsibleContainerTitle>
  );
};

export const NewsroomsTitle: React.FunctionComponent<CollapsibleContainerTitleProps> = props => {
  return (
    <CollapsibleContainerTitle count={props.count}>
      <NewsroomsText />
    </CollapsibleContainerTitle>
  );
};

export const HistoryTitle: React.FunctionComponent<CollapsibleContainerTitleProps> = props => {
  return (
    <CollapsibleContainerTitle count={props.count}>
      <HistoryText />
    </CollapsibleContainerTitle>
  );
};
