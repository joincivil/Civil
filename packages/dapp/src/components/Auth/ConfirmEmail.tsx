import * as React from "react";
import { ConfirmEmailToken, ICivilContext, CivilContext } from "@joincivil/components";
import { RouteComponentProps } from "react-router-dom";

export interface ConfirmEmailTokenProps extends Partial<RouteComponentProps> {
  token?: string;
  onConfirmEmailContinue?(): void;
}

const ConfirmEmail: React.FunctionComponent<ConfirmEmailTokenProps> = ({ token, onConfirmEmailContinue }) => {
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  if (!token) {
    return <></>;
  }
  return (
    <ConfirmEmailToken
      token={token}
      onEmailConfirmContinue={onConfirmEmailContinue}
      onMutationSuccess={async () => {
        await civilContext.auth.handleInitialState();
      }}
    />
  );
};

export default ConfirmEmail;
