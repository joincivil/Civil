import * as React from "react";
import * as ReactDOM from "react-dom";

class ListingDiscourse extends React.Component {
  constructor(props: {}) {
    super(props);
  }

  public async componentDidMount(): Promise<void> {
    const discourseUrl = process.env.REACT_APP_DISCOURSE_URL;
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = discourseUrl + "/static/embed.js";

    const handleCallback = () => {
      const node = ReactDOM.findDOMNode(this);
      // @ts-ignore
      window.Coral.Talk.render(node, {
        talk: discourseUrl,
      });
    };

    tag.onload = handleCallback;
    document.getElementsByTagName("body")[0].appendChild(tag);
  }

  public render(): JSX.Element {
    return <div />;
  }
}

export default ListingDiscourse;
