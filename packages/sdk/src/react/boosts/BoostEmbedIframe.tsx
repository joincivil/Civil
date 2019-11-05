import * as React from "react";

// This can be gotten from `loadingImgUrl` from `@joincivil/components`, but it's not worth bringing in entire package for that. The hash is from the contents of the svg so it's stable unless we change the image or its name or location. It's too big to inline into copy-paste-able embed code. @TODO/tobek Should we just host this image somewhere else?
const LOADING_IMAGE_URL = "https://registry.civil.co/static/media/loading.ba73811a.svg";

// Not using styled-components so that we can get the actual styles in `renderToStaticMarkup`.
const EMBED_WRAPPER_STYLES: React.CSSProperties = {
  position: "relative",
  display: "block",
  width: "100%",
  // @NOTE: If changed, make sure to change in `setHeightImportant` calls too.
  height: "525px !important",
  margin: "32px 0",
  border: "1px solid #E9E9EA", // colors.accent.CIVIL_GRAY_4 but not worth importing entire package just for that
  borderRadius: "4px",
  textAlign: "center",
};
const EMBED_IFRAME_STYLES: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "523px !important", // 523px to make room for 1px border
  border: 0,
  outline: 0,
  borderRadius: "4px",
  top: 0,
  left: 0,
  zIndex: 1,
};
const EMBED_LOADING_IMG_STYLES: React.CSSProperties = {
  display: "block",
  margin: "72px auto 36px",
  height: 32,
};
const EMBED_NOT_LOADED_STYLES: React.CSSProperties = {
  position: "absolute",
  color: "#9B9B9B",
  fontSize: "smaller",
  bottom: 0,
  padding: 16,
};

export interface BoostEmbedIframeProps {
  fallbackUrl: string;
  iframeSrc?: string;
  noIframe?: boolean;
  error?: string;
}

// When using `ReactDOMServer.renderToStaticMarkup`, the inlined important styles are included, but using `ReactDOM.render`, they are not. In the latter case, we can fix with this:
const setHeightImportant = (node: HTMLElement | null, height: string) => {
  if (node) {
    node.style.setProperty("height", height, "important");
  }
};

export const BoostEmbedIframe = (props: BoostEmbedIframeProps) => (
  <div style={EMBED_WRAPPER_STYLES} ref={node => setHeightImportant(node, "525px")}>
    {!props.noIframe && (
      <iframe
        ref={node => setHeightImportant(node, "523px")}
        style={EMBED_IFRAME_STYLES}
        src={props.iframeSrc}
        sandbox="allow-popups allow-scripts allow-same-origin"
      ></iframe>
    )}

    {props.error ? (
      <>
        <p>
          Sorry, there was an error loading this Boost. Try viewing it{" "}
          <a href={props.fallbackUrl} target="_blank">
            on Civil
          </a>
        </p>
        <pre>{props.error}</pre>
      </>
    ) : (
      <>
        {/*Use `object` instead of `img` because if this domain is blocked or image otherwise fails to load, `img` will show a broken image icon, but `object` will show nothing.*/}
        <object style={EMBED_LOADING_IMG_STYLES} data={LOADING_IMAGE_URL} type="image/svg+xml"></object>
        <p>Loading Boost&hellip;</p>
      </>
    )}

    <p style={EMBED_NOT_LOADED_STYLES}>
      Boost not loading? You may have privacy protection such as the Privacy Badger extension or Brave Shields enabled.
      Ensure that all "civil.co" domains are whitelisted, or try viewing this Boost{" "}
      <a href={props.fallbackUrl} target="_blank">
        on Civil
      </a>
      .
    </p>
  </div>
);
