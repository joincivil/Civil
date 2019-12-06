import * as React from "react";
import { iframeResizer } from "iframe-resizer";

// This can be gotten from `loadingImgUrl` from `@joincivil/components`, but it's not worth bringing in entire package for that. The hash is from the contents of the svg so it's stable unless we change the image or its name or location. It's too big to inline into copy-paste-able embed code. @TODO/tobek Should we just host this image somewhere else?
const LOADING_IMAGE_URL = "https://registry.civil.co/static/media/loading.ba73811a.svg";

// Not using styled-components so that we can get the actual styles in `renderToStaticMarkup`.
let EMBED_WRAPPER_STYLES: React.CSSProperties = {
  position: "relative",
  display: "block",
  width: "100%",
  margin: "32px 0",
  border: "1px solid #E9E9EA", // colors.accent.CIVIL_GRAY_4 but not worth importing entire package just for that
  borderRadius: "4px",
  textAlign: "center",
  lineHeight: 1.1,
};
let EMBED_IFRAME_STYLES: React.CSSProperties = {
  position: "absolute",
  minWidth: "100%", // workaround for iOS bug that prevents iframe resizing
  width: "100%",
  border: 0,
  outline: 0,
  borderRadius: "4px",
  top: 0,
  left: 0,
  zIndex: 1,
};
const EMBED_LOADING_IMG_STYLES: React.CSSProperties = {
  display: "block",
  margin: "36px auto",
  height: 32,
};
const EMBED_NOT_LOADED_STYLES: React.CSSProperties = {
  position: "absolute",
  color: "#9B9B9B",
  fontSize: 12,
  bottom: 0,
  padding: 16,
  margin: 0,
};
const EMBED_ERROR_STYLES: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  padding: "0 10px",
  fontSize: 12,
  lineHeight: 1.2,
};

export interface BoostEmbedIframeProps {
  fallbackUrl: string;
  iframeSrc?: string;
  noIframe?: boolean;
  error?: string;
  iframeId?: string;
  boostType?: "project" | "story";
  initialHeight?: number;
}
export interface BoostEmbedIframeDefaultProps {
  boostType: "project" | "story";
  initialHeight: number;
}

// When using `ReactDOMServer.renderToStaticMarkup`, the inlined important styles are included, but using `ReactDOM.render`, they are not. In the latter case, we can fix with this:
const setHeightImportant = (node: HTMLElement | null, height: number) => {
  if (node) {
    node.style.setProperty("height", height + "px", "important");
  }
};

export const BoostEmbedIframe = (props: BoostEmbedIframeProps & BoostEmbedIframeDefaultProps) => {
  const [isIframeSetUp, setIsIframeSetUp] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [iframeHeight, setIframeHeight] = React.useState(props.initialHeight);

  const boostTypeLabel = props.boostType === "project" ? "Project" : "Story";
  EMBED_WRAPPER_STYLES = {
    ...EMBED_WRAPPER_STYLES,
    height: iframeHeight + "px !important",
  };
  EMBED_IFRAME_STYLES = {
    ...EMBED_IFRAME_STYLES,
    // -2 to make room for 1px border
    height: iframeHeight - 2 + "px !important",
  };

  const setUpIframeResizer = (el: HTMLIFrameElement | null, initialHeight: number) => {
    if (el) {
      setHeightImportant(el, initialHeight - 2);
      if (isIframeSetUp) {
        return;
      }
      iframeResizer(
        {
          heightCalculationMethod: "taggedElement", // looks for elements with `data-iframe-height` attribute and resizes to fit them
          tolerance: 25,

          // @ts-ignore iframe-resizer types are missing the event handlers and some other options
          warningTimeout: 20000,
          // @ts-ignore
          onResized: ({ iframe, height }: { iframe: HTMLIFrameElement; height: string }) => {
            setIframeHeight(parseInt(height, 10) + 20);
          },
          // @ts-ignore
          onInit: () => {
            setIsLoaded(true);
          },
        },
        el,
      );
      setIsIframeSetUp(true);
    }
  };

  return (
    <div style={EMBED_WRAPPER_STYLES} ref={node => setHeightImportant(node, iframeHeight)}>
      {!props.noIframe && (
        <iframe
          ref={node => setUpIframeResizer(node, iframeHeight)}
          style={EMBED_IFRAME_STYLES}
          key={props.iframeId}
          id={props.iframeId}
          src={props.iframeSrc}
          sandbox="allow-popups allow-scripts allow-same-origin"
        ></iframe>
      )}

      {!isLoaded && (
        <>
          {props.error ? (
            <>
              <p style={{ margin: "2rem 1rem" }}>
                Sorry, there was an error loading this {boostTypeLabel} Boost. Try viewing it{" "}
                <a href={props.fallbackUrl} target="_blank">
                  on Civil
                </a>
                . If the problem persists, please contact <a href="mailto:support@civil.co">support@civil.co</a>.
              </p>
              <pre style={EMBED_ERROR_STYLES}>{props.error}</pre>
            </>
          ) : (
            <>
              {/*Use `object` instead of `img` because if this domain is blocked or image otherwise fails to load, `img` will show a broken image icon, but `object` will show nothing.*/}
              <object style={EMBED_LOADING_IMG_STYLES} data={LOADING_IMAGE_URL} type="image/svg+xml"></object>
              <p>Loading {boostTypeLabel} Boost&hellip;</p>
            </>
          )}

          <p style={EMBED_NOT_LOADED_STYLES}>
            Boost not loading? You may have blockers such as the Privacy Badger extension or Brave Shields enabled.
            Please check that all "civil.co" domains are whitelisted, or try viewing this Boost{" "}
            <a href={props.fallbackUrl} target="_blank">
              on Civil
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
};

BoostEmbedIframe.defaultProps = {
  boostType: "story",
  initialHeight: 300,
};
