import * as React from "react";
import { colors } from "../styleConstants";

export interface ArticleIndexPanelProps {
  color?: string;
  height?: number;
  width?: number;
}

export const ArticleIndexPanelIcon: React.SFC<ArticleIndexPanelProps> = props => {
  const color = props.color || colors.primary.BLACK;
  const width = (props.width || 18).toString();
  const height = (props.height || 18).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <path d="m0 0h18v18h-18z" opacity=".3" />
        <g fill={color} fillOpacity=".5" fillRule="nonzero">
          <path
            d="m12 9.07439826-1.5 1.43373974v-5.17480467h-3.75v-2.97061012h-5.25v11.35156249h3.52038574l1.49697153 1.5238095h-5.02485727c-.825 0-1.4925-.6857142-1.4925-1.5238095l.06243164-11.44270832c0-.83809524.6675-1.52380952 1.4925-1.52380952h6l4.44506836 4.66480654z"
            transform="translate(3 1)"
          />
          <path d="m15.52 11.5-3.591 3.877-1.449-1.559-.98 1.057 2.429 2.625 4.571-4.943z" />
        </g>
      </g>
    </svg>
  );
};
