import * as React from "react";
import * as ReactDOM from "react-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components/macro";

import { EthAddress } from "@joincivil/typescript-types";
import { colors, FeatureFlag, LoadingMessage, ChevronAnchor } from "@joincivil/components";

import config from "../../helpers/config";
import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";
import ErrorNotFoundMsg from "../utility/ErrorNotFound";

export interface ListingDiscourseProps {
  listingAddress: EthAddress;
  network: string;
}

interface DiscourseCommentsProps {
  topicID: number;
  isRinkebyNetwork: boolean;
}

const discourseTopicIDQuery = gql`
  query($addr: String!) {
    listing(addr: $addr) {
      discourseTopicID
    }
  }
`;

const StyledLinkContainer = styled.div`
  a {
    font-size: 16px;
  }

  span {
    color: ${colors.accent.CIVIL_GRAY_2};
    font-size: 12px;
    font-style: italic;
  }
`;

// CoralTalk aka to-be-depreacted comments widget
const CoralTalk: React.FunctionComponent = props => {
  const containerEl = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const discourseUrl = config.DISCOURSE_URL;
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = discourseUrl + "/static/embed.js";

    const handleCallback = () => {
      // @ts-ignore
      window.Coral.Talk.render(containerEl.current, {
        talk: discourseUrl,
      });
    };

    tag.onload = handleCallback;
    document.getElementsByTagName("body")[0].appendChild(tag);
  }, []);

  return <div ref={containerEl} />;
};

// Discourse Comments
const DiscourseComments: React.FunctionComponent<DiscourseCommentsProps> = props => {
  React.useEffect(() => {
    if (!props.isRinkebyNetwork) {
      (window as any).DiscourseEmbed = {
        discourseUrl: "https://community.civil.co/",
        topicId: props.topicID,
      };

      const { discourseUrl } = (window as any).DiscourseEmbed;
      const tag = document.createElement("script");
      tag.async = true;
      tag.src = discourseUrl + "javascripts/embed.js";

      document.getElementsByTagName("body")[0].appendChild(tag);
    }
  }, []);

  // TODO(jon): Topics for Rinkeby newsrooms currently live in our Production
  // hosted instance of Discourse, as we don't currently have a staging instance.
  // These Rinkeby newsroom topics are currently hidden from non-Civil staff members
  // in Discourse to prevent confusion in the forum, however this also prevents those
  // topics from being embedded via the Discourse JS widget in the DApp.
  //
  // For now, we are simply displaying a link to the correct Discourse topic for Rinkeby
  // newsrooms, but once we have a separate staging instance for Discourse, we should remove
  // this check and just embed the comments for the topic from the staging instance.
  //
  // Rinkeby Newsroom category: https://community.civil.co/c/rinkeby-network/rinkeby-newsrooms
  //
  if (props.isRinkebyNetwork) {
    return (
      <StyledLinkContainer>
        <ChevronAnchor href={`https://community.civil.co/t/${props.topicID}`}>
          Join the discussion on Discourse
        </ChevronAnchor>
        <p>
          <span>* Discourse embedding is not currently enabled for Rinkeby Test Network</span>
        </p>
      </StyledLinkContainer>
    );
  }

  return <div id="discourse-comments" />;
};

const ListingDiscourse: React.FunctionComponent<ListingDiscourseProps> = props => {
  return (
    <FeatureFlag feature="embed_discourse" replacementComponent={CoralTalk}>
      <Query query={discourseTopicIDQuery} variables={{ addr: props.listingAddress }}>
        {({ loading, error, data }: any): JSX.Element => {
          if (loading) {
            return <LoadingMessage />;
          }
          if (error) {
            return <ErrorLoadingDataMsg />;
          }
          if (!data.listing || !data.listing.discourseTopicID) {
            return <ErrorNotFoundMsg>We could not find the Discourse topic for this newsroom.</ErrorNotFoundMsg>;
          }

          const isRinkebyNetwork = parseInt(props.network, 10) === 4;
          return <DiscourseComments topicID={data.listing.discourseTopicID} isRinkebyNetwork={isRinkebyNetwork} />;
        }}
      </Query>
    </FeatureFlag>
  );
};

export default React.memo(ListingDiscourse);
