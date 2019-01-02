import * as React from "react";
import { colors } from "../styleConstants";

export const CommitVoteSuccessIcon: React.SFC = props => {
  const width = "100";
  const height = "100";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g>
          <circle fill={colors.accent.CIVIL_TEAL} fillRule="nonzero" cx="50" cy="50" r="50" />
          <path
            d="M76.9648161,58.739025 C76.8324286,58.3645671 76.4777232,58.1147746 76.0805547,58.1163057 L68.8632382,58.1163057 L68.8632382,47.5612138 C68.859811,45.6710843 67.3284117,44.139685 65.4382822,44.1362578 L64.1928436,44.1362578 L64.1928436,40.7362105 C64.1913991,39.4256443 63.6980442,38.163367 62.8104068,37.1991649 L44.8262738,18.6109943 C43.0489802,16.7756976 40.2144021,16.4718057 38.0884512,17.8886399 L29.4886979,23.6238845 C28.0027386,24.6045748 27.2090919,26.3491458 27.4461786,28.1136906 L29.1212935,40.9230263 C29.1483952,42.6365012 29.7740349,44.2865158 30.8898163,45.5871937 L33.9411407,49.1366936 L33.9411407,58.0976241 L27.9194453,58.0976241 C27.5222768,58.096093 27.1675714,58.3458856 27.0351839,58.7203434 L22.0534296,73.7091966 C21.9521365,73.9956895 21.9965347,74.3135495 22.1724531,74.5613219 C22.3483716,74.8090944 22.6338208,74.9558082 22.937691,74.9546351 L81.062309,74.9546351 C81.3661792,74.9558082 81.6516284,74.8090944 81.8275469,74.5613219 C82.0034653,74.3135495 82.0478635,73.9956895 81.9465704,73.7091966 L76.9648161,58.739025 Z M30.9894513,40.8545271 C30.9916511,40.8171963 30.9916511,40.7797684 30.9894513,40.7424377 L29.3081093,27.8770572 C29.1689969,26.8133664 29.6535096,25.7643964 30.5535478,25.1806827 L39.1221652,19.4454381 C40.497541,18.5289827 42.331198,18.7254459 43.4812002,19.9124776 L61.4591059,38.4757395 C62.023784,39.0931529 62.3369987,39.8995142 62.3371401,40.7362105 L62.3371401,44.111349 L45.05668,44.111349 L43.8112414,41.6951982 C43.5790965,41.2343476 43.0173127,41.0489449 42.5564621,41.2810898 C42.0956114,41.5132347 41.9102088,42.0750186 42.1423537,42.5358692 L49.1666273,56.4411908 C49.7919763,57.6843181 49.5870298,59.1842039 48.6511056,60.2139965 C47.7151815,61.2437891 46.2416496,61.5907247 44.9445905,61.0866767 L44.7390931,61.0057232 C44.0306158,60.7299759 43.4359842,60.2231128 43.0515239,59.5672416 L38.4122652,51.5839804 C38.253092,51.3106995 38.0696906,51.0522703 37.8642722,50.8118085 L32.3096162,44.3728911 C31.4676855,43.3929179 30.999987,42.1464574 30.9894513,40.8545271 Z M36.4382451,52.0634743 C36.5715056,52.2183614 36.6903174,52.3851148 36.7931951,52.5616497 L41.4137722,60.5075477 C42.0101855,61.5287868 42.9339649,62.3187169 44.0354204,62.7493372 L44.2409177,62.8302907 C44.8502171,63.0683287 45.4985196,63.1908093 46.1526659,63.1914679 C47.9664455,63.1844361 49.6474505,62.2393997 50.5960728,60.6934497 C51.5446952,59.1474997 51.6258562,57.2207707 50.8106062,55.6005198 L45.9969861,45.9795068 L65.4382822,45.9795068 C66.2980781,45.9795068 66.9950804,46.6765091 66.9950804,47.5363051 L66.9950804,67.1955529 L35.8092986,67.1955529 L35.8092986,51.3099839 L36.4382451,52.0634743 Z M24.2329471,73.0927045 L28.5919821,59.9720092 L33.9411407,59.9720092 L33.9411407,67.1955529 L31.2074031,67.1955529 C30.6915255,67.1955529 30.2733242,67.6137542 30.2733242,68.1296318 C30.2733242,68.6455093 30.6915255,69.0637107 31.2074031,69.0637107 L71.4599776,69.0637107 C71.9758552,69.0637107 72.3940566,68.6455093 72.3940566,68.1296318 C72.3940566,67.6137542 71.9758552,67.1955529 71.4599776,67.1955529 L68.8632382,67.1955529 L68.8632382,59.965782 L75.4017907,59.965782 L79.7608257,73.0864773 L24.2329471,73.0927045 Z"
            fill={colors.primary.BLACK}
            fillRule="nonzero"
          />
          <g transform="translate(74.000000, 71.000000)">
            <g>
              <g>
                <path
                  d="M12,0 C5.4,0 0,5.4 0,12 C0,18.6 5.4,24 12,24 C18.6,24 24,18.6 24,12 C24,5.4 18.6,0 12,0 L12,0 Z"
                  stroke={colors.basic.WHITE}
                  strokeWidth="3"
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
    </svg>
  );
};
