import * as React from "react";
import { Set } from "immutable";
import NewsroomsListItem from "./NewsroomsListItem";

export interface NewsroomsListOwnProps {
  listings?: Set<string>;
}

const NewsroomsList: React.FunctionComponent<NewsroomsListOwnProps> = props => {
  return <>{props.listings && props.listings.map(l => <NewsroomsListItem key={l} listingAddress={l!} />)}</>;
};

export default NewsroomsList;
