import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { EmbedIcon, ModalHeading, colors, Modal, CloseXIcon, loadingImgUrl } from "@joincivil/components";
import styled from "styled-components";
import { BoostModalContent, BoostModalCloseBtn } from "./BoostStyledComponents";

const EmbedCode = styled.pre`
  white-space: pre-wrap;
  word-break: break-word;
  background: ${colors.accent.CIVIL_GRAY_5};
  padding: 8px;
`;

const ModalContain = styled.div`
  position: relative;
`;

export interface BoostShareEmbedProps {
  boostId: string;
}

// Not using styled-components so that we can get the actual styles in `renderToStaticMarkup`.
const EMBED_WRAPPER_STYLES = {
  position: "relative",
  display: "block",
  width: "100%",
  height: "525px !important",
  margin: "32px 0",
  border: `1px solid ${colors.accent.CIVIL_GRAY_4}`,
  borderRadius: "4px",
  textAlign: "center",
} as React.CSSProperties;
const EMBED_IFRAME_STYLES = {
  position: "absolute",
  width: "100%",
  height: "523px !important", // 523px to make room for 1px border
  borderRadius: "4px",
  top: 0,
  left: 0,
  zIndex: 1,
} as React.CSSProperties;
const EMBED_LOADING_IMG_STYLES = {
  display: "block",
  margin: "72px auto 36px",
} as React.CSSProperties;
const EMBED_NOT_LOADED_STYLES = {
  position: "absolute",
  color: "#9B9B9B",
  fontSize: "smaller",
  bottom: 0,
  padding: 16,
} as React.CSSProperties;

export const BoostShareEmbed = (props: BoostShareEmbedProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  let embedCode;
  if (modalOpen) {
    const embed = (
      <div style={EMBED_WRAPPER_STYLES}>
        <iframe
          style={EMBED_IFRAME_STYLES}
          src={`${document.location.origin}/embed/boost/${props.boostId}`}
          sandbox="allow-popups allow-scripts allow-same-origin"
        ></iframe>
        <img style={EMBED_LOADING_IMG_STYLES} src={`${document.location.origin}${loadingImgUrl}`} />
        <p>Loading Boost</p>
        <p style={EMBED_NOT_LOADED_STYLES}>
          Boost not loading? You may have privacy protection such as the Privacy Badger extension or Brave Shields
          enabled. Ensure that all "civil.co" domains are whitelisted, or try viewing this Boost{" "}
          <a href={`${document.location.origin}/boosts/${props.boostId}`} target="_blank">
            on Civil
          </a>
          .
        </p>
      </div>
    );
    embedCode = ReactDOMServer.renderToStaticMarkup(embed);
  }

  return (
    <>
      <a onClick={() => setModalOpen(true)}>
        <EmbedIcon />
      </a>
      {modalOpen && (
        <Modal width={600}>
          <ModalContain>
            <BoostModalCloseBtn onClick={() => setModalOpen(false)}>
              <CloseXIcon color={colors.accent.CIVIL_GRAY_2} />
            </BoostModalCloseBtn>
            <ModalHeading>Embed Boost</ModalHeading>
            <BoostModalContent>
              Copy and paste this HTML code into your website where you would like this Boost to embedded:
            </BoostModalContent>
            <EmbedCode>{embedCode}</EmbedCode>
          </ModalContain>
        </Modal>
      )}
    </>
  );
};
