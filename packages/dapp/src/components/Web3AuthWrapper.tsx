import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../redux/reducers";
import AuthWeb3Signup from "./Auth/AuthWeb3Signup";
import AuthWeb3Login from "./Auth/AuthWeb3Login";
import SetUsername from "./Auth/SetUsername";
import SetEmail from "./Auth/SetEmail";
import { hideWeb3AuthModal, showWeb3LoginModal, showWeb3SignupModal } from "../redux/actionCreators/ui";
import { setNetwork, setNetworkName } from "../redux/actionCreators/network";
import { ICivilContext, CivilContext } from "@joincivil/components";
import { setNetworkValue, setDefaultNetworkValue } from "@joincivil/utils";
import SetAvatar from "./Auth/SetAvatar";
import config from "../helpers/config";

export const Web3AuthWrapper: React.FunctionComponent = () => {
  // context
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  const civilUser = civilContext.currentUser;

  // redux
  const dispatch = useDispatch();
  const web3AuthType = useSelector((state: State) => state.web3AuthType);
  const showWeb3AuthModal = useSelector((state: State) => state.showWeb3AuthModal);
  const userAddress: string | undefined = useSelector(
    (state: State) =>
      state.networkDependent &&
      state.networkDependent.user &&
      state.networkDependent.user.account &&
      state.networkDependent.user.account.account,
  );

  React.useEffect(() => {
    setDefaultNetworkValue(parseInt(config.DEFAULT_ETHEREUM_NETWORK!, 10));
    const civil = civilContext.civil!;
    const networkSub = civil.networkStream.subscribe(onNetworkUpdated);
    const networkNameSub = civil.networkNameStream.subscribe(onNetworkNameUpdated);
    const accountSub = civil.accountStream.subscribe(onAccountUpdated);

    return function cleanup(): void {
      networkSub.unsubscribe();
      networkNameSub.unsubscribe();
      accountSub.unsubscribe();
    };
  }, [civilContext]);

  async function onNetworkUpdated(network: number): Promise<void> {
    dispatch!(setNetwork(network.toString()));
    setNetworkValue(network);
  }

  async function onNetworkNameUpdated(networkName: string): Promise<void> {
    dispatch!(setNetworkName(networkName));
  }

  const onAccountUpdated = async (account: string | undefined): Promise<void> => {
    const currentUser = civilContext.currentUser;
    if (
      account &&
      currentUser &&
      currentUser.ethAddress &&
      account.toLowerCase() !== currentUser.ethAddress.toLowerCase()
    ) {
      console.warn("web3 account does not match that of the logged in user, logging out", {
        web3Account: account,
        currentUserAccount: currentUser.ethAddress,
      });
      civilContext.auth.logout();
    }
  };

  const showWeb3Signup = showWeb3AuthModal && web3AuthType === "signup";
  const showWeb3Login = showWeb3AuthModal && web3AuthType === "login";
  let showSetHandle = false;
  let showSetAvatar = false;
  let showSetEmail = false;
  if (civilUser && civilUser.uid && civilUser.userChannel) {
    showSetHandle = !civilUser.userChannel.handle;
    if (!showSetHandle) {
      showSetAvatar = !civilUser.userChannelAvatarPromptSeen;
      if (!showSetAvatar) {
        showSetEmail = !civilUser.userChannelEmailPromptSeen;
      }
    }
  }
  let channelID;
  if (showSetHandle || showSetAvatar || showSetEmail) {
    channelID = civilUser.userChannel.id;
  }

  async function handleLoginClicked(): Promise<void> {
    dispatch(await showWeb3LoginModal());
  }

  async function handleSignUpClicked(): Promise<void> {
    dispatch(await showWeb3SignupModal());
  }

  async function handleOnOuterClicked(): Promise<void> {
    dispatch(await hideWeb3AuthModal());
  }

  async function handleOnSignupContinue(): Promise<void> {
    dispatch(await hideWeb3AuthModal());
  }

  async function handleOnLoginContinue(): Promise<void> {
    dispatch(await hideWeb3AuthModal());
  }

  async function handleSignUpUserExists(): Promise<void> {
    dispatch(await showWeb3LoginModal());
  }

  async function handleLogInNoUserExists(): Promise<void> {
    dispatch(await showWeb3SignupModal());
  }

  async function handleUserSelectSignUp(): Promise<void> {
    dispatch(await showWeb3SignupModal());
  }

  async function handleUserSelectLogIn(): Promise<void> {
    dispatch(await showWeb3LoginModal());
  }

  async function handleUpdateUser(): Promise<void> {
    return civilContext.auth.handleInitialState();
  }

  React.useEffect(() => {
    civilContext.auth.setShowWeb3Login(handleLoginClicked);
    civilContext.auth.setShowWeb3Signup(handleSignUpClicked);
  }, [dispatch]);

  React.useEffect(() => {
    civilContext.auth.setEnsureLoggedInUserEnabled(() => {
      if (civilContext.currentUser && !userAddress) {
        civilContext.civil!.currentProviderEnable().catch(err => console.error("error enabling ethereum", err));
      }
    });
  }, [civilContext.currentUser, userAddress]);

  return (
    <>
      {showWeb3Signup && (
        <AuthWeb3Signup
          onSignUpContinue={handleOnSignupContinue}
          onOuterClicked={handleOnOuterClicked}
          onLoginClicked={handleLoginClicked}
          onSignUpUserAlreadyExists={handleSignUpUserExists}
          onUserSelectLogIn={handleUserSelectLogIn}
        />
      )}
      {showWeb3Login && (
        <AuthWeb3Login
          onSignUpContinue={handleOnLoginContinue}
          onOuterClicked={handleOnOuterClicked}
          onSignUpClicked={handleSignUpClicked}
          onLogInNoUserExists={handleLogInNoUserExists}
          onUserSelectSignUp={handleUserSelectSignUp}
        />
      )}
      {showSetHandle && <SetUsername channelID={channelID} onSetHandleComplete={handleUpdateUser} />}
      {showSetAvatar && <SetAvatar channelID={channelID} onSetAvatarComplete={handleUpdateUser} />}
      {showSetEmail && <SetEmail channelID={channelID} onSetEmailComplete={handleUpdateUser} />}
    </>
  );
};
