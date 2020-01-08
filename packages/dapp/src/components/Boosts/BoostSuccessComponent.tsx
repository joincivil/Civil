import * as React from "react";
import { Link } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import { copyToClipboard, urlConstants as link } from "@joincivil/utils";
import styled from "styled-components";
import { DashboardNewsroomStripeConnect } from "@joincivil/components";
import {
  colors,
  mediaQueries,
  InvertedButton,
  buttonSizes,
  HollowGreenCheck,
  ShareTwitterIcon,
  ShareEmailIcon,
  LinkIcon,
} from "@joincivil/elements";
import { BoostEmbedIframe } from "@joincivil/sdk";

interface StyleProps {
  backgroundColor?: string;
}

export const BoostSuccessWrap = styled.div`
  margin: 130px auto;
  max-width: 900px;
  width: 100%;

  ${mediaQueries.MOBILE} {
    margin: 100px auto;
  }

  h2 {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 0.2px;
    line-height: 30px;
    margin: 0 0 10px;

    ${mediaQueries.MOBILE} {
      font-size: 22px;
    }
  }

  h3 {
    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
    margin: 0 0 10px;
  }
`;

const TextSmall = styled.p`
  font-size: 14px;
  line-height: 18px;
  margin-top: 0;
`;

const TextLarge = styled.p`
  font-size: 16px;
  line-height: 20px;
  margin-top: 0;
`;

const FlexWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 45px;

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;

const BoostSection = styled.div`
  padding: 0 0 0 60px;
  position: relative;
  width: 40%;

  svg {
    left: 0;
    position: absolute;
    top: 0;

    ${mediaQueries.MOBILE} {
      left: calc(50% - 24px);
    }
  }

  a {
    margin-right: 30px;
    &:last-of-type {
      margin-right: 0;
    }
  }

  ${mediaQueries.MOBILE} {
    padding: 60px 20px 30px;
    text-align: center;
    width: 100%;
  }
`;

const ShareSection = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 4px;
  padding: 15px;
  width: 50%;

  ${mediaQueries.MOBILE} {
    border-left: none;
    border-right: none;
    padding: 20px;
    width: 100%;
  }
`;

const ShareLinkFlex = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;

const ShareLink = styled.a`
  align-items: center;
  background-color: ${(props: StyleProps) => (props.backgroundColor ? props.backgroundColor : "#00c189")};
  border-radius: 3px;
  color: ${colors.basic.WHITE};
  display: flex;
  font-size: 13px;
  font-weight: 700;
  justify-content: center;
  letter-spacing: 0.2px;
  line-height: 14px;
  margin-right: 15px;
  opacity: 0.9;
  padding: 10px;
  text-align: center;
  transition: opacity 250ms;
  width: 130px;

  &:hover {
    opacity: 1;
  }

  svg {
    margin-right: 5px;
    vertical-align: middle;
  }

  ${mediaQueries.MOBILE} {
    margin: 0 auto 15px;
    max-width: 400px;
    width: 100%;
  }
`;

const ShareBtn = styled.button`
  align-items: center;
  background-color: #00c189;
  border: none;
  border-radius: 3px;
  color: ${colors.basic.WHITE};
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 700;
  justify-content: center;
  letter-spacing: 0.2px;
  line-height: 14px;
  margin-right: 15px;
  opacity: 0.9;
  padding: 10px;
  text-align: center;
  transition: opacity 250ms;
  width: 130px;

  &:hover {
    opacity: 1;
  }

  svg {
    margin-right: 5px;
    vertical-align: middle;
  }

  ${mediaQueries.MOBILE} {
    margin: 0 auto 15px;
    max-width: 400px;
    width: 100%;
  }
`;

const StripeSection = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_5};
  margin: 0 0 45px;
  padding: 30px;

  ${mediaQueries.MOBILE} {
    padding: 20px;
  }
`;

const EmbedSection = styled.div`
  padding-left: 30px;

  ${mediaQueries.MOBILE} {
    padding-left: 0;
    margin: 0 20px;
  }
`;

const EmbedCode = styled.pre`
  border: 1px solid ${colors.accent.CIVIL_GRAY_5};
  border-radius: 3px;
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  font-size: 13px;
  letter-spacing: -0.14px;
  line-height: 24px;
  padding: 13px;
  white-space: pre-wrap;
  word-break: break-word;
`;

export interface BoostSuccessProps {
  boostId: string;
  editMode?: boolean;
  newsroomAddress: string;
  newsroom: string;
  title: string;
  isStripeConnected: boolean;
}

export const BoostSuccess: React.FunctionComponent<BoostSuccessProps> = props => {
  const [urlCopied, setUrlCopied] = React.useState(false);
  const [embedCopied, setEmbedCopied] = React.useState(false);
  const url = `/boosts/${props.boostId}`;

  const emailSubjectText = "Boost " + props.newsroom + "’s journalism.";
  const emailBodyText =
    "Hi there," +
    "\n\n" +
    "Exciting news! " +
    props.newsroom +
    " just launched a Boost -- and you can support this project in just a few clicks. Learn more:" +
    "\n\n" +
    props.title +
    "\n\n" +
    `${link.REGISTRY}` +
    url +
    "\n\n" +
    "Thanks for supporting independent journalism projects!";
  const emailShare = "mailto:?subject=" + encodeURI(emailSubjectText) + "&body=" + encodeURI(emailBodyText);

  const twitterShareText =
    props.newsroom +
    " launched a Boost! You can now support my newsroom’s project “" +
    props.title +
    "” in just a few clicks.";
  const twitterShare =
    "https://twitter.com/intent/tweet?text=" + encodeURI(twitterShareText) + "&url=" + `${link.REGISTRY}` + url;

  const embedCode = ReactDOMServer.renderToStaticMarkup(
    <BoostEmbedIframe
      iframeSrc={`${link.REGISTRY}/embed/boost/${props.boostId}`}
      fallbackUrl={`${link.REGISTRY}/boosts/${props.boostId}`}
      boostType="project"
      initialHeight={525}
    />,
  );

  return (
    <BoostSuccessWrap>
      <FlexWrap>
        <BoostSection>
          <HollowGreenCheck width={48} height={48} />
          <h2>Project Boost {props.editMode ? "Updated" : "Launched!"}</h2>
          {props.editMode ? (
            <TextSmall>
              Your Project Boost <b>“{props.title}”</b> has been updated successfully.
            </TextSmall>
          ) : (
            <>
              <TextSmall>
                Great work! Your Project Boost <b>“{props.title}”</b> has successfully launched and is live.{" "}
              </TextSmall>
              <TextSmall>
                <Link to={url}>View your Boost</Link>
                <Link to={url + "/edit"}>Edit your Boost</Link>
              </TextSmall>
            </>
          )}
        </BoostSection>
        <ShareSection>
          <TextLarge>
            <b>You can share this Boost!</b>
          </TextLarge>
          <TextLarge>Help get the word out about your Boost</TextLarge>
          <ShareLinkFlex>
            <ShareLink href={twitterShare} target="_blank" backgroundColor={"#1da1f2"}>
              <ShareTwitterIcon width={24} height={24} color={colors.basic.WHITE} />
              Tweet
            </ShareLink>
            <ShareLink href={emailShare} target="_blank">
              <ShareEmailIcon width={24} height={24} color={colors.basic.WHITE} />
              Email
            </ShareLink>
            <ShareBtn onClick={() => setUrlCopied(copyToClipboard(url))}>
              <LinkIcon width={24} height={24} color={colors.basic.WHITE} />
              Copy link
            </ShareBtn>{" "}
            {urlCopied && "Copied!"}
          </ShareLinkFlex>
        </ShareSection>
      </FlexWrap>
      {!props.isStripeConnected && (
        <StripeSection>
          <h3>Next, set up Stripe to accept credit card payments</h3>
          <TextLarge>
            Connect a Stripe account to allow readers to give you a Boost with credit cards. You can link your existing
            Stripe account or start a new one. Any payments sent with credit cards with automatically be deposited into
            your Stripe account.
          </TextLarge>
          <DashboardNewsroomStripeConnect newsroomAddress={props.newsroomAddress} />
        </StripeSection>
      )}
      <EmbedSection>
        <TextLarge>
          <b>Add this Project Boost to your site</b>
        </TextLarge>
        <TextLarge>
          You can add this Project Boost to your own site to help raise awareness with your audience. They’ll be able to
          support your Boost right on your page.
        </TextLarge>
        <TextSmall>
          Copy and paste the following HTML code into the place on your website where you would like this Project Boost
          to show up:
        </TextSmall>
        <EmbedCode>{embedCode}</EmbedCode>
        <InvertedButton size={buttonSizes.SMALL} onClick={() => setEmbedCopied(copyToClipboard(embedCode))}>
          Copy
        </InvertedButton>{" "}
        {embedCopied && "Copied!"}
      </EmbedSection>
    </BoostSuccessWrap>
  );
};
