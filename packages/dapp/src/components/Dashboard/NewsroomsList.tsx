import * as React from "react";
import { Set } from "immutable";
import NewsroomsListItem from "./NewsroomsListItem";

export interface NewsroomsListOwnProps {
  listings?: Set<any>;
}

const NewsroomsList: React.FunctionComponent<NewsroomsListOwnProps> = props => {
  const { listings } = props;
  return (
    <>
      {listings &&
        listings.map(l => {
          return <NewsroomsListItem key={l} listing={l!.listing!} />;
        })}
    </>
  );
};

export default NewsroomsList;
