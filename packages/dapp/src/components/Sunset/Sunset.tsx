import * as React from "react";
import styled from "styled-components";
import { mediaQueries } from "@joincivil/elements";
import heroImgUrl from "../images/storyfeed-banner-2x.png";
import civilImgUrl from "../images/img-civil.png";

export const SunsetWrap = styled.div`
  margin: 100px auto 40px;
  max-width: 1036px;
  padding: 0 20px;
  position: relative;
  width: 100%;

  ${mediaQueries.MOBILE_SMALL} {
    padding: 0;
    margin: 55px auto 40px;
  }
`;

export const Banner = styled.div`
  img {
    width: 100%;
  }
`;

export const BodyText = styled.div`
  background-color: #fff;
  margin: 0 auto;
  max-width: 800px;
  padding: 40px 40px 0;
  position: relative;
  top: -50px;

  h1 {
    font-size: 48px;
    font-weight: 300;
    margin-top: 0;
    text-align: center;
  }

  p {
    font-size: 18px;
    line-height: 26px;
  }

  ${mediaQueries.MOBILE_SMALL} {
    padding: 40px 20px;
    top: 0;

    h1 {
      font-size: 28px;
    }
  }
`;

const Sunset: React.FunctionComponent = props => {
  return (
    <SunsetWrap>
      <Banner>
        <img src={heroImgUrl} />
      </Banner>
      <BodyText>
        <h1>Ending the Civil Journey</h1>
        <p>
          It's with a heavy heart that I announce the end of Civil. The Civil team and technology will be joining
          ConsenSys to build identity solutions on Ethereum.
        </p>
        <p>
          In 2016, Civil was founded on a moonshot mission to create a blockchain-based media platform for trustworthy
          journalism owned and operated by the public. We set out to decentralize how the news is vetted, how journalism
          is funded, and how we stay informed as a society. We were among the first startups in the world to experiment
          with blockchain and cryptocurrencies in the media space. We built innovative technology, supported
          award-winning journalists, and inspired many people all over the world with our vision for a more
          participatory media landscape. But ultimately, we failed to sustain ourselves independently.
        </p>
        <p>
          Several months ago, we started to develop products related to decentralized identity in the media and
          advertising space, which attracted enterprise interest for use cases such as trackable content licensing and
          transparent ad decisioning. This pivot led to closer coordination with ConsenSys and the team building
          solutions for identity and provenance tracking, which in turn started conversations about a strategic merger.
          We are excited to share that the Civil team and technology will join ConsenSys to be a part of these efforts.
          Although the journey for Civil is over, our new team continues to develop cutting-edge technology that I
          believe will contribute to building a better internet. This isn't the outcome we had envisioned, but
          nevertheless, we're proud of what we accomplished. We couldn’t have done it without the support of our
          passionate community.
        </p>
        <p>
          Newsrooms on Civil have always operated independently, and therefore will remain unaffected. The Civil
          Registry, Civil tokens, and other work are open-source and operational, but there will be no further active
          development or management on our part. The Civil Foundation's future is uncertain, but it is effectively in
          hibernation for now.
        </p>
        <p>
          Civil will always hold a special place in my heart. Our grand experiment did not achieve its mission, but we
          did succeed in bringing many people together around something radically different and in service of something
          deeply important. Our mission for journalism is more important now than ever. I'm grateful for our chance to
          make a difference.
        </p>
        <p>
          Thank you so much to all of our teammates, partners, newsrooms, and supporters. You made the journey
          unforgettable.
        </p>
        <p>
          Sincerely,
          <br />
          Matthew Iles, Civil CEO
        </p>
      </BodyText>
      <Banner>
        <img src={civilImgUrl} />
      </Banner>
    </SunsetWrap>
  );
};

export default Sunset;
