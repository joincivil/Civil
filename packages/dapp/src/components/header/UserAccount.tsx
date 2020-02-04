import * as React from "react";

import {
  NavBarButton,
  StyledVisibleIfLoggedInLink,
  NavUser,
  CvlContainer,
  AvatarContainer,
  UserAvatar,
  HandleContainer,
  UserAvatarFigure,
} from "./styledComponents";
import { ICivilContext, CivilContext, ClipLoader, Arrow } from "@joincivil/components";
import { KirbyEthereum, KirbyEthereumContext, useKirbySelector } from "@kirby-web3/ethereum-react";
import { NavLinkDashboardText } from "./textComponents";
import { NavLink } from "./NavLink";

const UserAccount: React.FunctionComponent = props => {
  // context
  const kirby = React.useContext<KirbyEthereum>(KirbyEthereumContext);
  const civilCtx = React.useContext<ICivilContext>(CivilContext);
  if (civilCtx === null) {
    // context still loading
    return <></>;
  }

  // redux
  const civilUser = civilCtx.currentUser;

  // kirby
  const { auth, loadingAuth } = useKirbySelector((state: any) => {
    return state.trustedweb;
  });

  React.useEffect(() => {
    async function doAuth(): Promise<void> {
      // remove `did` field from object
      const { did, ephemeral, ...data } = auth;
      // TODO(dankins): hack to get signer, this breaks if DID rotates key or if not ethr did method
      data.signer = did.replace("did:ethr:", "").toLowerCase();
      try {
        await civilCtx.auth.authenticate(data);
      } catch (err) {
        console.log("authenticate error", err.message);
        if (err.message === "GraphQL error: signature invalid or not signed up") {
          await civilCtx.auth.signup(data);
        }
      }
    }

    if (auth) {
      doAuth().catch(err => {
        console.log("error doing auth", err);
      });
    }
  }, [auth]);

  if (loadingAuth) {
    return <ClipLoader size={10} />;
  }

  function onAuthenticatePressed(): void {
    kirby.trustedweb.requestAuthentication();
  }

  if (civilUser) {
    const userAccountElRef = React.createRef<HTMLDivElement>();

    const tiny72AvatarDataUrl = civilUser.userChannel!.tiny72AvatarDataUrl;
    const showFigure = !tiny72AvatarDataUrl;
    const handle = civilUser.userChannel!.handle;
    const initial = handle ? handle.charAt(0) : "?";

    return (
      <>
        <StyledVisibleIfLoggedInLink>
          <NavLink to="/dashboard">
            <NavLinkDashboardText />
          </NavLink>
        </StyledVisibleIfLoggedInLink>
        <div ref={userAccountElRef}>
          <NavUser onClick={() => kirby.trustedweb.showHome()}>
            <CvlContainer>
              <AvatarContainer>
                {tiny72AvatarDataUrl && <UserAvatar src={civilUser.userChannel!.tiny72AvatarDataUrl} />}
                {showFigure && <UserAvatarFigure>{initial}</UserAvatarFigure>}
              </AvatarContainer>
              <HandleContainer>{civilUser.userChannel!.handle}</HandleContainer>
              <Arrow isOpen={false} />
            </CvlContainer>
          </NavUser>
        </div>
      </>
    );
  } else if (civilCtx.auth.loading) {
    return <ClipLoader size={10} />;
  }

  return (
    <>
      <NavBarButton onClick={onAuthenticatePressed}>Login / Signup</NavBarButton>
    </>
  );
};

export default UserAccount;
