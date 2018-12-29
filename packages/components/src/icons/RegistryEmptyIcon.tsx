import * as React from "react";

export interface RegistryEmptyProps {
  height?: number;
  width?: number;
}

export const RegistryEmptyIcon: React.SFC<RegistryEmptyProps> = props => {
  const width = (props.width || 350).toString();
  const height = (props.height || 155).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 350 155" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect y="140" width="350" height="3" fill="#E9E9EA" />
        <rect strokeWidth="3" x="78.5" y="1.5" width="193" height="152" fill="#FFF" stroke="#C4C2C0" />
        <rect strokeWidth="2" x="96" y="19" width="158" height="54" fill="#FFF" stroke="#C4C2C0" />
        <g fill="#C4C2C0">
          <path d="M178.889 38C181.644 38 183.778 40.133 183.778 42.889 183.778 46.178 180.667 48.933 176.133 53.111L174.889 54.267 173.644 53.111C169.022 49.022 166 46.267 166 42.889 166 40.133 168.133 38 170.889 38 172.4 38 173.911 38.711 174.889 39.867 175.867 38.711 177.378 38 178.889 38Z" />
        </g>
        <polygon points="95 82 255 82 255 92 95 92" fill="#C4C2C0" />
        <polygon points="95 100 255 100 255 110 95 110" fill="#C4C2C0" />
        <polygon points="95 118 255 118 255 128 95 128" fill="#C4C2C0" />
      </g>
    </svg>
  );
};
