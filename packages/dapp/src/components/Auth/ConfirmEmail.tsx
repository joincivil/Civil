import * as React from "react";
import { ConfirmEmailToken } from "@joincivil/components";
import { RouteComponentProps } from "react-router-dom";

export interface ConfirmEmailTokenProps extends Partial<RouteComponentProps> {
  token?: string;
  onConfirmEmailContinue?(): void;
}

const ConfirmEmail: React.FunctionComponent<ConfirmEmailTokenProps> = ({ token, onConfirmEmailContinue }) => {
  if (!token) {
    return <></>;
  }
  return <ConfirmEmailToken token={token} onEmailConfirmContinue={onConfirmEmailContinue} />;
};

export default ConfirmEmail;
