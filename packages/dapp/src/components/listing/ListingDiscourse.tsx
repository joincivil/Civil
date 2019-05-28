import * as React from "react";
import * as ReactDOM from "react-dom";

// import config from "../../helpers/config";

class ListingDiscourse extends React.Component {
  constructor(props: {}) {
    super(props);
  }

  public async componentDidMount(): Promise<void> {
    (window as any).DiscourseEmbed = {
      discourseUrl: "https://community.civil.co/",
      topicId: 13,
    };

    const { discourseUrl } = (window as any).DiscourseEmbed;
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = discourseUrl + "javascripts/embed.js";

    document.getElementsByTagName("body")[0].appendChild(tag);
  }

  public render(): JSX.Element {
    return <div id="discourse-comments" />;
  }
}

export default ListingDiscourse;
