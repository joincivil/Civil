import * as React from "react";
import { EthAddress } from "@joincivil/typescript-types";
import { CivilContext, ICivilContext, MetaMaskModal, ModalHeading } from "@joincivil/components";
import { useKirbySelector } from "@kirby-web3/ethereum-react";
import { StyledAuthHeader } from "./authStyledComponents";

export interface AuthWeb3Props {
  messagePrefix?: string;
  header?: JSX.Element | string;
  buttonOnly?: boolean;
  onOuterClicked?(): void;
  onAuthenticated?(address: EthAddress): void;
  onSignUpContinue?(): void;
  onSignUpUserAlreadyExists?(): void;
  onLogInNoUserExists?(): void;
  onUserSelectSignUp?(): void;
  onUserSelectLogIn?(): void;
}

const USER_ALREADY_EXISTS = "GraphQL error: User already exists with this identifier";
const NO_USER_EXISTS = "GraphQL error: signature invalid or not signed up";
const CANCELLED = "cancelled";
const SWITCH_TO_SIGNUP = "switch to sign up";
const SWITCH_TO_LOGIN = "switch to log in";

export const AuthWeb3: React.FunctionComponent<AuthWeb3Props> = (props: AuthWeb3Props) => {
  // context
  const civilCtx = React.useContext<ICivilContext>(CivilContext);
  const civilUser = civilCtx.currentUser;
  const userAccount = civilUser && civilUser.ethAddress;

  // kirby state
  const trustedWebState = useKirbySelector((state: any) => {
    return state.trustedweb;
  });
  const { auth, loadingAuth } = trustedWebState;

  // state
  const [isSignRejectionOpen, setisSignRejectionOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
  const [onErrContinue, setOnErrContinue] = React.useState<{ cb(): void } | undefined>(undefined);

  console.log("render me timbers", trustedWebState);

  // effects
  React.useEffect(() => {
    if (auth) {
      kirbyLogin().catch(err => {
        console.log("kirbyLogin error");
      });
    } else if (!auth && !loadingAuth && userAccount) {
      console.log("auth changed, logging out user", userAccount);
      civilCtx.auth.logout();
    }
  }, [trustedWebState]);

  async function kirbyLogin(): Promise<void> {
    try {
      if (props.messagePrefix === "Log in to Civil") {
        await civilCtx.auth.authenticate(auth);
      } else {
        await civilCtx.auth.signup(auth);
      }
      if (props.onAuthenticated) {
        props.onAuthenticated(auth.signer);
      }
      if (props.onSignUpContinue) {
        props.onSignUpContinue();
      }
    } catch (err) {
      if (err.toString().includes(USER_ALREADY_EXISTS)) {
        setErrorMessage(err);
        setOnErrContinue({ cb: props.onSignUpUserAlreadyExists });
      } else if (err.toString().includes(NO_USER_EXISTS)) {
        setErrorMessage(err);
        setOnErrContinue({ cb: props.onLogInNoUserExists });
      } else if (err.toString().includes(CANCELLED)) {
        setOnErrContinue({ cb: props.onOuterClicked });
        if (props.onOuterClicked) {
          props.onOuterClicked();
        }
      } else if (err.toString().includes(SWITCH_TO_SIGNUP)) {
        if (props.onUserSelectSignUp) {
          props.onUserSelectSignUp();
        }
      } else if (err.toString().includes(SWITCH_TO_LOGIN)) {
        if (props.onUserSelectLogIn) {
          props.onUserSelectLogIn();
        }
      } else {
        setErrorMessage(err);
        setOnErrContinue({ cb: props.onOuterClicked });
      }
    }
  }

  return (
    <>
      {renderSignRejectionModal()}
      {renderSaveErrorModal()}
    </>
  );

  function renderSignRejectionModal(): JSX.Element | null {
    if (!isSignRejectionOpen) {
      return null;
    }

    return (
      <MetaMaskModal
        waiting={false}
        denied={true}
        denialText="To authenticate that you own your wallet address, you need to sign the message in your MetaMask wallet."
        cancelTransaction={cancelTransaction}
      >
        <ModalHeading>Failed to authenticate your wallet address</ModalHeading>
      </MetaMaskModal>
    );
  }

  function renderSaveErrorModal(): JSX.Element | null {
    if (!errorMessage) {
      return null;
    }

    console.log("rendering error message", errorMessage);
    const err = errorMessage.toString();
    let bodyText = `Something went wrong when authenticating your wallet address (${errorMessage}). Please try again later.`;
    if (err.includes(USER_ALREADY_EXISTS)) {
      bodyText = "A user with this Ethereum address already exists. You will now be redirected to Log In.";
    } else if (err.includes(NO_USER_EXISTS)) {
      bodyText = "No user with this Ethereum address was found. You will now be redirected to Sign Up.";
    }

    return (
      <div>
        <StyledAuthHeader>Log in to Civil</StyledAuthHeader>
        <MetaMaskModal alert={true} bodyText={bodyText} cancelTransaction={cancelTransaction}>
          <ModalHeading>Failed to save your wallet address</ModalHeading>
        </MetaMaskModal>
      </div>
    );
  }

  function cancelTransaction(): void {
    console.log("calling cancelTransaction");
    if (onErrContinue) {
      onErrContinue.cb();
    }
    setErrorMessage(undefined);
    setOnErrContinue(undefined);
    setisSignRejectionOpen(false);
  }
};

export default AuthWeb3;
