import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { copyToClipboard } from "@joincivil/utils";
import { EmbedIcon, ModalHeading, colors, Modal, CloseXIcon } from "@joincivil/components";
import styled from "styled-components";
import { BoostButton, BoostModalContent, BoostModalCloseBtn } from "./BoostStyledComponents";
import { BoostEmbedIframe } from "./BoostEmbedIframe";

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

export const BoostShareEmbed = (props: BoostShareEmbedProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  let embedCode = "";
  if (modalOpen) {
    embedCode = ReactDOMServer.renderToStaticMarkup(
      <BoostEmbedIframe
        iframeSrc={`${document.location.origin}/embed/boost/${props.boostId}`}
        fallbackUrl={`${document.location.origin}/boosts/${props.boostId}`}
      />,
    );
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
            <BoostButton onClick={() => setCopied(copyToClipboard(embedCode))}>Copy</BoostButton> {copied && "Copied!"}
          </ModalContain>
        </Modal>
      )}
    </>
  );
};
