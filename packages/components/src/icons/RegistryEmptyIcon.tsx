import * as React from "react";

export interface RegistryEmptyProps {
  height?: number;
  width?: number;
}

export const RegistryEmptyIcon: React.SFC<RegistryEmptyProps> = props => {
  const width = (props.width || 350).toString();
  const height = (props.height || 155).toString();
  return (
    <svg width={`${width}px`} height={`${height}px`} viewBox="0 0 350 155" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-546.000000, -398.000000)">
          <g transform="translate(546.000000, 398.000000)">
            <rect fill="#E9E9EA" x="0" y="140" width="350" height="3" />
            <rect stroke="#C4C2C0" strokeWidth="3" fill="#FFFFFF" x="78.5" y="1.5" width="193" height="152" />
            <rect stroke="#C4C2C0" strokeWidth="2" fill="#FFFFFF" x="96" y="19" width="158" height="54" />
            <g transform="translate(166.000000, 38.000000)" fill="#C4C2C0">
              <path
                d="M12.8888889,0 C15.6444444,0 17.7777778,2.13333333 17.7777778,4.88888889 C17.7777778,8.17777778 14.6666667,10.9333333 10.1333333,15.1111111 L8.88888889,16.2666667 L7.64444444,15.1111111 C3.02222222,11.0222222 0,8.26666667 0,4.88888889 C0,2.13333333 2.13333333,0 4.88888889,0 C6.4,0 7.91111111,0.711111111 8.88888889,1.86666667 C9.86666667,0.711111111 11.3777778,0 12.8888889,0 Z"
                id="Shape"
              />
            </g>
            <polygon fill="#C4C2C0" points="95 82 255 82 255 92 95 92" />
            <polygon fill="#C4C2C0" points="95 100 255 100 255 110 95 110" />
            <polygon fill="#C4C2C0" points="95 118 255 118 255 128 95 128" />
          </g>
        </g>
      </g>
    </svg>
  );
};
