import * as React from "react";
import { CoreContext, useSelector as useKirbySelector, CenteredPage } from "@kirby-web3/child-react";
import { SignatureInterceptorPlugin, ProviderTypes } from "@kirby-web3/plugin-ethereum";
import { RouteComponentProps } from "@reach/router";

export const SignatureConfirm: React.FunctionComponent<RouteComponentProps> = () => {
  // context
  const ctx = React.useContext(CoreContext);
  const sig = ctx.core.plugins.signatureInterceptor as SignatureInterceptorPlugin;

  // state
  const [isPending, setPending] = React.useState(false);

  // kirby selectors
  const providerType = useKirbySelector((state: any) => state.ethereum.providerType);
  const plaintext = useKirbySelector((state: any) => {
    if (state.signatureInterceptor.requests && state.signatureInterceptor.requests[0]) {
      return state.signatureInterceptor.requests[0].plaintext;
    }
  });

  // memos
  React.useMemo(() => {
    // these providers will prompt the user through their own UI
    if ([ProviderTypes.METAMASK, ProviderTypes.PORTIS].indexOf(providerType) > -1) {
      sig.approveAction();
      setPending(true);
    }
  }, []);

  if (isPending) {
    return <></>;
  }

  return (
    <CenteredPage>
      <small>signature requested:</small>
      <div>{plaintext}</div>
      <div>
        <button onClick={() => sig.approveAction()}>approve</button>
        <button onClick={() => sig.rejectAction()}>reject</button>
      </div>
    </CenteredPage>
  );
};
