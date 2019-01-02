import * as React from "react";

export interface ArticleIndexIconProps {
  color?: string;
  size?: number;
}

export const ArticleIndexIcon = (props: ArticleIndexIconProps): JSX.Element => {
  const color = props.color || "#444444";
  const size = props.size || 24;
  return (
    <svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fill-rule="evenodd">
        <path d="m0 0h24v24h-24z" opacity=".3" />
        <path
          d="m10.0732422 0 5.9267578 6.11658537v10.88536583c0 1.0989268-.9 1.9980488-2 1.9980488h-12.01c-1.1 0-1.99-.899122-1.99-1.9980488l.08324219-15.00390242c0-1.09892683.89-1.99804878 1.99-1.99804878zm-8.0732422 17.0019512h12v-10.98926827h-5v-3.89512195h-7zm2.5-6.0126829 3.5-3.99609757 3.5 3.99609757h-2.23125v3.9780488h-2.5375v-3.9780488z"
          fill={color}
          fill-rule="nonzero"
          transform="translate(4 3)"
        />
      </g>
    </svg>
  );
};
