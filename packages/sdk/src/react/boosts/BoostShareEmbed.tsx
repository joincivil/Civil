import * as React from "react";
import { EmbedIcon, ModalHeading, colors } from "@joincivil/components";
import styled from "styled-components";
import { BoostModalContent } from "./BoostStyledComponents";
import { BoostModal } from "./BoostModal";

const EmbedModal = styled(BoostModal)`
  overflow: auto;
`;

const EmbedCode = styled.pre`
  white-space: pre-wrap;
  background: ${colors.accent.CIVIL_GRAY_5};
  padding: 8px;
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
      <EmbedModal open={modalOpen} handleClose={() => setModalOpen(false)}>
        <ModalHeading>Boost Embed Code</ModalHeading>
        <BoostModalContent>
          <EmbedCode>
            &lt;iframe src="https://registry.civil.co/boost-embed/{props.boostId}" style="width: 100%; height:
            500px"&gt;&lt;/iframe&gt;
          </EmbedCode>
          <a href="@TODO" target="_blank">
            More about embedding boosts >
          </a>
        </BoostModalContent>
      </EmbedModal>
    </>
  );
};
