import * as React from "react";
import styled from "styled-components";
import { links } from "../../helpers/links";
import { colors, mediaQueries } from "@joincivil/elements";
import heroImgUrl from "../images/storyfeed-banner-2x.png";
import heroImgMobileUrl from "../images/storyfeed-banner-mobile-2x.png";

export const StoryFeedMarqueeWrap = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin: 100px auto 40px;
  max-width: 1036px;
  padding: 0 20px;
  width: 100%;

  ${mediaQueries.MOBILE_SMALL} {
    padding: 0;
    margin: 55px auto 40px;
  }
`;

export const StoryFeedMarqueeHeader = styled.div`
  justify-content: flex-end;
  display: flex;
  padding-left: 50px;
  position: relative;
  width: 100%;

  ${mediaQueries.MOBILE_SMALL} {
    display: block;
    padding-left: 0;
  }
`;

export const StoryFeedMarqueeText = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_5};
  left: 10px;
  padding: 20px 20px 25px 75px;
  position: absolute;
  top: 55px;
  width: 390px;

  h1 {
    font-size: 32px;
    font-weight: 300;
    letter-spacing: -0.1px;
    line-height: 40px;
    margin: 0 0 5px;
  }

  a {
    color: ${colors.primary.BLACK};
    font-size: 14px;
    line-height: 21px;
    text-decoration: underline;

    &:hover {
      color: ${colors.accent.CIVIL_BLUE};
    }
  }

  ${mediaQueries.MOBILE_SMALL} {
    left: 0;
    padding: 30px 20px;
    position: relative;
    top: 0;
    width: 100%;

    h1 {
      font-size: 22px;
      font-weight: 400;
      letter-spacing: -0.07px;
      line-height: 27.5px;
      margin: 0;
    }

    a {
      font-size: 13px;
      line-height: 21px;
    }
  }
`;

export const MarqueeImage = styled.div`
  img {
    width: 100%;
  }

  ${mediaQueries.MOBILE_SMALL} {
    display: none;
  }
`;

export const MarqueeImageMobile = styled.div`
  display: none;
  img {
    width: 100%;
  }

  ${mediaQueries.MOBILE_SMALL} {
    display: block;
  }
`;

export const MarqueeColFlex = styled.div`
  color: ${colors.accent.CIVIL_GRAY_2};
  display: flex;
  justify-content: space-around;
  margin: 20px 0 30px;
  text-align: center;
`;

export const MarqueeCol = styled.div`
  width: 280px;

  label {
    font-size: 15px;
    line-height: 21px;
  }

  p {
    font-size: 13px;
    line-height: 21px;
    margin: 5px 0 0;
  }

  ${mediaQueries.MOBILE_SMALL} {
    display: none;

    &.sf-discover {
      display: block;
      margin: 0 auto;
    }
  }
`;

export const StoryFeedMarquee: React.FunctionComponent = props => {
  return (
    <StoryFeedMarqueeWrap>
      <StoryFeedMarqueeHeader>
        <StoryFeedMarqueeText>
          <h1>Discover trusted news on Civil.</h1>
          <a href={links.MARKETING_SITE} target="_blank">
            Learn what we stand for
          </a>
        </StoryFeedMarqueeText>
        <MarqueeImage>
          <img src={heroImgUrl} />
        </MarqueeImage>
        <MarqueeImageMobile>
          <img src={heroImgMobileUrl} />
        </MarqueeImageMobile>
      </StoryFeedMarqueeHeader>
      <MarqueeColFlex>
        <MarqueeCol className="sf-discover">
          <label>Discover</label>
          <p>Explore stories from Civil newsrooms around the world.</p>
        </MarqueeCol>
        <MarqueeCol>
          <label>Trust</label>
          <p>Every newsroom is held to the highest standards of journalism.</p>
        </MarqueeCol>
        <MarqueeCol>
          <label>Support</label>
          <p>Give independent journalism a financial boost in just a few taps.</p>
        </MarqueeCol>
      </MarqueeColFlex>
    </StoryFeedMarqueeWrap>
  );
};
