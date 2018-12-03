import * as React from "react";

class ScrollToTopOnMount extends React.Component {
  public componentDidMount(): void {
    window.scrollTo(0, 0);
  }

  public render(): null {
    return null;
  }
}

export default ScrollToTopOnMount;
