import * as React from "react";
import { colors } from "../styleConstants";

export interface TokenWalletIconProps {
  height?: number;
  width?: number;
}

export const TokenWalletIcon: React.FunctionComponent<TokenWalletIconProps> = props => {
  const width = (props.width || 24).toString();
  const height = (props.height || 21).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 24 21" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill={colors.accent.CIVIL_BLUE} fillRule="evenodd">
        <path d="M22.179 13.216L22.179 5.049C22.179 4.253 21.531 3.608 20.732 3.608L17.357 3.608 17.357 1.301C17.355 0.901 17.169 0.523 16.853 0.277 16.536 0.03 16.123-0.058 15.732 0.038L1.35 3.608C0.589 3.658-0.002 4.289 0 5.049L0 18.501C0 19.297 0.648 19.942 1.446 19.942L15.429 19.942C17.348 21.377 20.034 21.187 21.731 19.496 23.427 17.805 23.618 15.129 22.179 13.216ZM15.964 0.965C16.068 0.936 16.179 0.96 16.263 1.028 16.347 1.093 16.395 1.195 16.393 1.301L16.393 3.608 5.361 3.608 15.964 0.965ZM1.446 18.981C1.18 18.981 0.964 18.766 0.964 18.501L0.964 5.049C0.964 4.783 1.18 4.568 1.446 4.568L20.732 4.568C20.998 4.568 21.214 4.783 21.214 5.049L21.214 12.255C19.295 10.821 16.609 11.011 14.912 12.702 13.216 14.392 13.025 17.069 14.464 18.981L1.446 18.981ZM18.321 19.942C16.191 19.942 14.464 18.222 14.464 16.099 14.464 13.976 16.191 12.255 18.321 12.255 20.452 12.255 22.179 13.976 22.179 16.099 22.179 18.222 20.452 19.942 18.321 19.942ZM20.732 16.099C20.732 16.364 20.516 16.579 20.25 16.579L18.804 16.579 18.804 18.021C18.804 18.286 18.588 18.501 18.321 18.501 18.055 18.501 17.839 18.286 17.839 18.021L17.839 16.579 16.393 16.579C16.127 16.579 15.911 16.364 15.911 16.099 15.911 15.833 16.127 15.618 16.393 15.618L17.839 15.618 17.839 14.177C17.839 13.912 18.055 13.697 18.321 13.697 18.588 13.697 18.804 13.912 18.804 14.177L18.804 15.618 20.25 15.618C20.516 15.618 20.732 15.833 20.732 16.099Z" />
      </g>
    </svg>
  );
};
