import * as React from "react";
import { Helmet } from "react-helmet";

export interface HelmetHelperProps {
  title?: string;
  description?: string;
  image?: string;
  meta?: { [key: string]: string };
}

export const HelmetHelper: React.FunctionComponent<HelmetHelperProps> = props => {
  const meta: { [key: string]: string | undefined } = {
    "og:title": props.title,
    "twitter:title": props.title,
    "og:description": props.description,
    "twitter:description": props.description,
    "og:image": props.image,
    "twitter:image": props.image,
    ...props.meta,
  };

  return (
    <Helmet title={props.title}>
      {Object.keys(meta).map(
        metaName => meta[metaName] && <meta key={metaName} property={metaName} content={meta[metaName]} />,
      )}
    </Helmet>
  );
};
