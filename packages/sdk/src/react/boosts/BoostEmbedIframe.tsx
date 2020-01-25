import * as React from "react";
import { iframeResizer } from "iframe-resizer";
import { urlConstants } from "../urlConstants";

// This can be gotten from `loadingImgUrl` from `@joincivil/components`, but it's not worth bringing in entire package for that. The hash is from the contents of the svg so it's stable unless we change the image or its name or location. It's too big to inline into copy-paste-able embed code. @TODO/tobek Should we just host this image somewhere else?
const LOADING_IMAGE_URL = "https://civil.co/static/media/loading.ba73811a.svg";

// Not using styled-components so that we can get the actual styles in `renderToStaticMarkup`.
const INTRO_STYLES: React.CSSProperties = {
  textAlign: "center",
  maxWidth: 400,
  margin: "0 auto -18px auto",
  padding: "0 16px",
};
const FOOTER_WRAP: React.CSSProperties = {
  margin: "-24px 0 32px",
  padding: "0 4px",
};
const FOOTER_LINK_STYLES: React.CSSProperties = {
  float: "right",
  fontSize: "smaller",
  color: "inherit",
  textDecoration: "none",
  marginLeft: 16,
};
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
          tolerance: 16,

          // @ts-ignore iframe-resizer types are missing the event handlers and some other options
          warningTimeout: 20000,
          // @ts-ignore
          onResized: ({ iframe, height }: { iframe: HTMLIFrameElement; height: string }) => {
            setIframeHeight(parseInt(height, 10));
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
    <>
      {props.boostType === "story" && (
        <p style={INTRO_STYLES}>Good journalism costs money. Support this newsroom by giving it a Boost.</p>
      )}
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
      {props.boostType === "story" && (
        <p className="civil-embed-footer" style={FOOTER_WRAP}>
          <a href={urlConstants.HOME} target="_blank">
            <svg viewBox="0 0 72 21" width="47" height="13" xmlns="http://www.w3.org/2000/svg">
              <g fill="#000" fillRule="evenodd" transform="translate(0 .457)">
                <path d="M.5 10c0-5.76 4.357-10 9.856-10 3.58 0 6.069 1.414 7.729 3.77L15.75 5.445c-1.297-1.728-2.905-2.67-5.499-2.67-3.838 0-6.64 3.089-6.64 7.225 0 4.24 2.853 7.225 6.744 7.225 2.49 0 4.357-.942 5.81-2.827L18.5 16.02C16.529 18.691 13.987 20 10.252 20 4.805 20 .5 15.76.5 10M22.5 20h3V1h-3zM29 1h3.382l5.782 13.228L43.782 1H47l-8.782 20h-.163zM50.5 20h3V1h-3zM59.5 1h3.175v16.344H71.5V20h-12z" />
              </g>
            </svg>
          </a>
          <a href={urlConstants.PRIVACY_POLICY} target="_blank" style={FOOTER_LINK_STYLES}>
            Privacy Policy
          </a>
          <a href={urlConstants.HELP} target="_blank" style={FOOTER_LINK_STYLES}>
            Help
          </a>
          {/*There's no way to target pseudo classes in inline styles and we're avoiding loading styled-components so this is the only option:*/}
          <style>
            {`.civil-embed-footer a:hover {
              text-decoration: underline !important;
            }`}
          </style>
        </p>
      )}
    </>
  );
};

BoostEmbedIframe.defaultProps = {
  boostType: "story",
  initialHeight: 300,
};
