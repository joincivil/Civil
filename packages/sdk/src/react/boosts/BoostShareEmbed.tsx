import * as React from "react";
import { EmbedIcon, ModalHeading, colors, Modal, CloseXIcon } from "@joincivil/components";
import styled from "styled-components";
import { BoostModalContent, BoostModalCloseBtn } from "./BoostStyledComponents";

const EmbedCode = styled.pre`
  white-space: pre-wrap;
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
  return (
    <>
      <a onClick={() => setModalOpen(true)}>
        <EmbedIcon />
      </a>
      {modalOpen && (
        <Modal>
          <ModalContain>
            <BoostModalCloseBtn onClick={() => setModalOpen(false)}>
              <CloseXIcon color={colors.accent.CIVIL_GRAY_2} />
            </BoostModalCloseBtn>
            <ModalHeading>Embed Boost</ModalHeading>
            <BoostModalContent>
              Copy and paste this HTML code into your website where you would like this Boost to embedded:
            </BoostModalContent>
            <EmbedCode>
              &lt;iframe src="https://registry.civil.co/boost-embed/{props.boostId}" style="width: 100%; height:
              500px"&gt;&lt;/iframe&gt;
            </EmbedCode>
          </ModalContain>
        </Modal>
      )}
    </>
  );
};