import * as React from "react";
import { Link } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import { copyToClipboard } from "@joincivil/utils";
import styled from "styled-components";
import { DashboardNewsroomStripeConnect, colors } from "@joincivil/components";
import { BoostShare } from "./BoostShare";
import { BoostEmbedIframe } from "./BoostEmbedIframe";
import { BoostButton } from "./BoostStyledComponents";

const EmbedCode = styled.pre`
  background: ${colors.accent.CIVIL_GRAY_5};
  padding: 8px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const Header = styled.h2`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.2px;
  line-height: 25px;
`;

const Section = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin: 20px 0 0;
  padding: 20px 0;
`;

const SectionHeader = styled.h3`
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  margin: 10px 0;
`;

const SectionDes = styled.p`
  font-size: 14px;
  line-height: 20px;
`;

const SectionCenter = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  display: flex;
  justify-content: center;
  margin: 20px 0 0;
  padding: 20px 0;
`;

export interface BoostCreateSuccessProps {
  boostId: string;
  editMode?: boolean;
  newsroomAddress: string;
  newsroomName: string;
  boostTitle: string;
  isStripeConnected: boolean;
}

export const BoostCreateSuccess: React.FunctionComponent<BoostCreateSuccessProps> = props => {
  const [copied, setCopied] = React.useState(false);
  const embedCode = ReactDOMServer.renderToStaticMarkup(
    <BoostEmbedIframe
      iframeSrc={`${document.location.origin}/embed/boost/${props.boostId}`}
      fallbackUrl={`${document.location.origin}/boosts/${props.boostId}`}
      boostType="project"
      initialHeight={525}
    />,
  );

  return (
    <>
      <Header>Project Boost {props.editMode ? "Updated" : "Launched!"}</Header>
      {props.editMode ? (
        <SectionDes>
          Your Project Boost <b>“{props.boostTitle}”</b> has been updated successfully.
        </SectionDes>
      ) : (
        <SectionDes>
          Great work! Your Project Boost <b>“{props.boostTitle}”</b> has successfully launched and is live.{" "}
          <Link to={"/boosts/" + props.boostId}>To view it, go here.</Link>
        </SectionDes>
      )}
      {!props.isStripeConnected && (
        <Section>
          <SectionHeader>Set Up Credit Card Payments</SectionHeader>
          <SectionDes>
            Connect a Stripe account to allow readers to give you a Boost with credit cards. You can link your existing
            Stripe account or start a new one. Any payments sent with credit cards will automatically be deposited into
            your Stripe account.
          </SectionDes>
          <DashboardNewsroomStripeConnect newsroomAddress={props.newsroomAddress} />
        </Section>
      )}
      <Section>
        <SectionHeader>Embed Project Boost</SectionHeader>
        <SectionDes>
          Copy and paste the following HTML code into the place on your website where you would like this Project Boost
          to show up:
        </SectionDes>
        <EmbedCode>{embedCode}</EmbedCode>
        <BoostButton onClick={() => setCopied(copyToClipboard(embedCode))}>Copy</BoostButton> {copied && "Copied!"}
      </Section>
      <SectionCenter>
        <BoostShare boostId={props.boostId} newsroom={props.newsroomName} title={props.boostTitle} />
      </SectionCenter>
      <SectionCenter>
        <BoostButton to={"/boosts/" + props.boostId}>View Boost</BoostButton>
      </SectionCenter>
    </>
  );
};
