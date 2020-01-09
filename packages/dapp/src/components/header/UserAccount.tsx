import * as React from "react";

import { NavLink } from "./NavLink";
import {
  Arrow,
  AvatarContainer,
  CvlContainer,
  UserAvatar,
  NavUser,
  StyledVisibleIfLoggedInLink,
  NavBarButton,
  BorderlessNavBarButton,
  HandleContainer,
  UserAvatarFigure,
} from "./styledComponents";
import { NavLinkDashboardText } from "./textComponents";
import { ICivilContext, CivilContext, ClipLoader } from "@joincivil/components";
import { useDispatch } from "react-redux";
import { showWeb3LoginModal, showWeb3SignupModal } from "../../redux/actionCreators/ui";
import NavDrawer from "./NavDrawer";

const UserAccount: React.FunctionComponent = props => {
  // context
  const civilCtx = React.useContext<ICivilContext>(CivilContext);
  if (civilCtx === null) {
    // context still loading
    return <></>;
  }

  // redux
  const dispatch = useDispatch();

  const civilUser = civilCtx.currentUser;
  const userAccount = civilUser && civilUser.ethAddress;

  // state
  const [isUserDrawerOpen, setUserDrawerOpen] = React.useState(false);
  const toggleDrawer = () => {
    if (userAccount) {
      setUserDrawerOpen(!isUserDrawerOpen);
    }
  };

  async function onLoginPressed(): Promise<any> {
    dispatch!(await showWeb3LoginModal());
  }
  async function onSignupPressed(): Promise<any> {
    dispatch!(await showWeb3SignupModal());
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
          <NavUser onClick={(ev: any) => toggleDrawer()}>
            <CvlContainer>
              <AvatarContainer>
                {tiny72AvatarDataUrl && <UserAvatar src={civilUser.userChannel!.tiny72AvatarDataUrl} />}
                {showFigure && <UserAvatarFigure>{initial}</UserAvatarFigure>}
              </AvatarContainer>
              <HandleContainer>{civilUser.userChannel!.handle}</HandleContainer>
              <Arrow isOpen={isUserDrawerOpen} />
            </CvlContainer>
          </NavUser>
        </div>
        {isUserDrawerOpen && (
          <NavDrawer userAccountElRef={userAccountElRef} handleOutsideClick={() => setUserDrawerOpen(false)} />
        )}
      </>
    );
  } else if (civilCtx.auth.loading) {
    return <ClipLoader size={10} />;
  }

  return (
    <>
      <BorderlessNavBarButton onClick={onLoginPressed}>Log In</BorderlessNavBarButton>
      <NavBarButton onClick={onSignupPressed}>Sign Up</NavBarButton>
    </>
  );
};

export default UserAccount;
