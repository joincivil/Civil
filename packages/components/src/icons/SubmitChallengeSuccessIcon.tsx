import * as React from "react";
import { colors } from "../styleConstants";

export interface SubmitChallengeSuccessIconProps {
  height?: number;
  width?: number;
}

export const SubmitChallengeSuccessIcon: React.SFC<SubmitChallengeSuccessIconProps> = props => {
  const width = (props.width || 100).toString();
  const height = (props.height || 100).toString();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%">
          <stop stop-color={colors.primary.BLACK} stop-opacity="0" offset="0%" />
          <stop stop-color={colors.primary.BLACK} stop-opacity="0" offset="95%" />
          <stop stop-color={colors.primary.BLACK} stop-opacity="0.04" offset="100%" />
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%">
          <stop stop-color={colors.basic.WHITE} stop-opacity="0.8" offset="0%" />
          <stop stop-color={colors.basic.WHITE} stop-opacity="0.4" offset="4.9360058%" />
          <stop stop-color={colors.basic.WHITE} stop-opacity="0" offset="20%" />
          <stop stop-color={colors.basic.WHITE} stop-opacity="0" offset="100%" />
        </linearGradient>
        <rect x="0" y="0" width="558" height="657" />
        <filter x="-12.9%" y="-7.3%" width="125.8%" height="121.9%" filterUnits="objectBoundingBox">
          <feOffset dx="0" dy="24" in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur stdDeviation="12" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
          <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1" />
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.3 0"
            type="matrix"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          />
          <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2" />
          <feGaussianBlur stdDeviation="12" in="shadowOffsetOuter2" result="shadowBlurOuter2" />
          <feComposite in="shadowBlurOuter2" in2="SourceAlpha" operator="out" result="shadowBlurOuter2" />
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.22 0"
            type="matrix"
            in="shadowBlurOuter2"
            result="shadowMatrixOuter2"
          />
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1" />
            <feMergeNode in="shadowMatrixOuter2" />
          </feMerge>
        </filter>
      </defs>
      <g stroke="none" stroke-width="1" fill="none" fillRule="evenodd">
        <g transform="translate(-229.000000, -60.000000)">
          <g>
            <g>
              <use fill="black" fill-opacity="1" filter="url(#filter-4)" href="#path-3" />
              <rect
                stroke="url(#linearGradient-1)"
                stroke-width="0.5"
                stroke-linejoin="square"
                fill={colors.basic.WHITE}
                fillRule="evenodd"
                x="0.25"
                y="0.25"
                width="557.5"
                height="656.5"
              />
              <rect
                stroke="url(#linearGradient-2)"
                stroke-width="0.5"
                stroke-linejoin="square"
                x="0.25"
                y="0.25"
                width="557.5"
                height="656.5"
              />
            </g>
            <g transform="translate(229.000000, 60.000000)">
              <circle fill={colors.accent.CIVIL_TEAL} fillRule="nonzero" cx="50" cy="50" r="50" />
              <g transform="translate(9.000000, 18.000000)" fill={colors.primary.BLACK} fillRule="nonzero">
                <path d="M63.9166667,0 L20.5833333,0 C19.9850249,0 19.5,0.485024854 19.5,1.08333333 L19.5,19.5 L15.0583333,19.5 C12.0553912,19.4961409 9.20687238,20.8304533 7.28758333,23.14 C5.78142836,24.9516447 3.54762911,25.9996685 1.19166667,26 L0,26 L0,28.1666667 L1.19166667,28.1666667 C4.1946088,28.1705258 7.04312762,26.8362134 8.96241667,24.5266667 C10.4697831,22.7135642 12.7058924,21.6653879 15.06375,21.6666667 L19.3580833,21.6666667 L33.1391667,25.3424167 C33.8947918,25.545412 34.4699891,26.1592647 34.6234779,26.9264789 C34.7769667,27.693693 34.4822032,28.4815899 33.8628333,28.9596667 C33.3576061,29.3523327 32.6972125,29.4847324 32.0796667,29.3171667 L19.7795,26.0368333 C19.2824492,25.9038387 18.7604234,26.1388182 18.5304167,26.5990833 L17.6301667,28.3995833 C16.3813874,30.9195041 13.8081904,32.5098944 10.9958333,32.5 L8.66666667,32.5 L8.66666667,34.6666667 L10.9958333,34.6666667 C14.5796362,34.6769393 17.8658559,32.6746478 19.5,29.4850833 L19.5,49.8333333 L16.575,49.8333333 C14.0013255,49.8303564 11.5866343,48.5879276 10.088,46.4955833 C8.18378094,43.8344506 5.1139231,42.2539497 1.84166667,42.25 L0,42.25 L0,44.4166667 L1.84166667,44.4166667 C4.41534112,44.4196436 6.83003238,45.6620724 8.32866667,47.7544167 C10.2328857,50.4155494 13.3027436,51.9960503 16.575,52 L19.5,52 L19.5,63.9166667 C19.5,64.5149751 19.9850249,65 20.5833333,65 L63.9166667,65 C64.5149751,65 65,64.5149751 65,63.9166667 L65,1.08333333 C65,0.485024854 64.5149751,0 63.9166667,0 Z M62.8333333,62.8333333 L21.6666667,62.8333333 L21.6666667,28.782 L31.525,31.4101667 C32.792326,31.746362 34.143918,31.4751216 35.1834041,30.6759901 C36.2228902,29.8768586 36.8324541,28.6404105 36.8333333,27.32925 C36.8328336,25.4159862 35.5466831,23.7418572 33.6981667,23.2483333 L21.6666667,20.0416667 L21.6666667,2.16666667 L62.8333333,2.16666667 L62.8333333,62.8333333 Z" />
                <rect x="31" y="5" width="22" height="2" />
                <rect x="31" y="18" width="7" height="2" />
                <rect x="40" y="18" width="12" height="2" />
                <rect x="38" y="24" width="11" height="2" />
                <rect x="38" y="29" width="20" height="2" />
                <rect x="27" y="35" width="30" height="2" />
                <rect x="54" y="18" width="3" height="2" />
                <rect x="51" y="24" width="7" height="2" />
                <rect x="27" y="40" width="22" height="2" />
                <rect x="27" y="46" width="30" height="2" />
                <rect x="27" y="51" width="7" height="2" />
                <rect x="36" y="51" width="22" height="2" />
                <rect x="51" y="40" width="7" height="2" />
                <rect x="27" y="13" width="30" height="2" />
              </g>
              <g transform="translate(74.000000, 71.000000)">
                <g>
                  <g>
                    <path
                      d="M12,0 C5.4,0 0,5.4 0,12 C0,18.6 5.4,24 12,24 C18.6,24 24,18.6 24,12 C24,5.4 18.6,0 12,0 L12,0 Z"
                      stroke={colors.basic.WHITE}
                      stroke-width="3"
                      fill={colors.basic.WHITE}
                    />
                    <path
                      d="M12,0 C5.4,0 0,5.4 0,12 C0,18.6 5.4,24 12,24 C18.6,24 24,18.6 24,12 C24,5.4 18.6,0 12,0 L12,0 Z M9.6,18 L3.6,12 L5.28,10.32 L9.6,14.64 L18.72,5.52 L20.4,7.2 L9.6,18 L9.6,18 Z"
                      fill={colors.accent.CIVIL_BLUE}
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
