import * as React from "react";
import { Query } from "react-apollo";
import { LoadingMessage } from "@joincivil/components";
import { LISTING_QUERY, transformGraphQLDataIntoNewsroom } from "@joincivil/utils";
import ErrorLoadingDataMsg from "../../utility/ErrorLoadingData";

import { SubmitChallengeProps } from "./SubmitChallengeTypes";
import SubmitChallengeViewComponent from "./SubmitChallengeViewComponent";

const SubmitChallengeGraphQLApolloContainer: React.FunctionComponent<SubmitChallengeProps> = props => {
  const { listingAddress } = props;
  return (
    <Query query={LISTING_QUERY} variables={{ addr: listingAddress }}>
      {({ loading, error, data }: any): JSX.Element => {
        if (error) {
          return <ErrorLoadingDataMsg />;
        }
        if (loading || !data) {
          return <LoadingMessage />;
        }

        const newsroom = transformGraphQLDataIntoNewsroom(data.tcrListing, listingAddress);

        const viewProps = {
          newsroomName: newsroom.data.name,
          charterRevisionId: newsroom.data.charterHeader!.revisionId,
        };

        return <SubmitChallengeViewComponent {...viewProps} {...props} />;
      }}
    </Query>
  );
};

export default SubmitChallengeGraphQLApolloContainer;
