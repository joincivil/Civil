import * as React from "react";
import * as ReactDOM from "react-dom";
import { FeatureFlag } from "@joincivil/components";

import config from "../../helpers/config";

// CoralTalk aka to-be-depreacted comments widget
const CoralTalk: React.FunctionComponent = props => {
  const containerEl = React.createRef<HTMLDivElement>();

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
const DiscourseComments: React.FunctionComponent = props => {
  React.useEffect(() => {
    (window as any).DiscourseEmbed = {
      discourseUrl: "https://community.civil.co/",
      topicId: 42,
    };

    const { discourseUrl } = (window as any).DiscourseEmbed;
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = discourseUrl + "javascripts/embed.js";

    document.getElementsByTagName("body")[0].appendChild(tag);
  }, []);

  return <div id="discourse-comments" />;
};

// https://community.civil.co/c/rinkeby-network/rinkeby-newsrooms
// - we're hiding rinkeby-network category from the Discourse UI via CSS (Admin > Customize > Themes > Neutral > Edit CSS), to minimize confusion for our users
// - limit suggested topics to category (settings > basic setup > limit suggested to category), so rinkeby network topic don't appear in suggestions for mainnet topic threads
//
//
// // hook up slack -> discourse
// // discourse_moderator@civil.co -> create
//
const ListingDiscourse: React.FunctionComponent = props => {
  return (
    <FeatureFlag feature="embed_discourse" replacementComponent={CoralTalk}>
      <DiscourseComments />
    </FeatureFlag>
  );
};

export default React.memo(ListingDiscourse);
