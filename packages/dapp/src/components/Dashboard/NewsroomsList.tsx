import * as React from "react";
import { Set, Map } from "immutable";
import NewsroomsListItem from "./NewsroomsListItem";

export interface NewsroomsListOwnProps {
  listings?: Set<any>;
  newsroomsApplicationProgressData?: Map<string, any>;
}

const NewsroomsList: React.FunctionComponent<NewsroomsListOwnProps> = props => {
  const { listings, newsroomsApplicationProgressData } = props;
  return (
    <>
      {listings &&
        listings.map(l => {
          // let applicationProgressData;
          // if (newsroomsApplicationProgressData) {
          //   applicationProgressData = newsroomsApplicationProgressData.get(l!);
          // }
          return <NewsroomsListItem key={l} listing={l!.listing!} />;
        })}
    </>
  );
};

export default NewsroomsList;
