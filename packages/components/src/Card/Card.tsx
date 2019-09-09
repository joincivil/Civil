import * as React from "react";

import { StyledCardClickable } from "./CardStyledComponents";

export interface CardClickableProps {
  disabled?: boolean;
  onClick?(...args: any[]): void;
}

export const CardClickable: React.FunctionComponent<CardClickableProps> = props => {
  const onClick = (...args: any[]) => {
    if (!props.disabled && props.onClick) {
      props.onClick(...args);
    }
  };
  return <StyledCardClickable onClick={onClick}>{props.children}</StyledCardClickable>;
};
