import * as React from "react";
import { buttonSizes, InvertedButton } from "../Button";
import { ListingSummaryComponentProps } from "./types";
import { ViewDetailsButtonText } from "./textComponents";

const SummaryActionButton: React.FunctionComponent<ListingSummaryComponentProps> = props => {
  return (
    <InvertedButton size={buttonSizes.SMALL} to={props.listingDetailURL}>
      <ButtonText {...props} />
    </InvertedButton>
  );
};

const ButtonText: React.FunctionComponent<ListingSummaryComponentProps> = props => {
  return <ViewDetailsButtonText />;
};

export default SummaryActionButton;
