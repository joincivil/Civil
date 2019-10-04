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
import { ICivilContext, CivilContext } from "@joincivil/components";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../../redux/reducers";
import { showWeb3LoginModal, showWeb3SignupModal } from "../../redux/actionCreators/ui";
import NavDrawer from "./NavDrawer";

function maybeAccount(state: State): any {
  const { user } = state.networkDependent;
  if (user.account && user.account.account && user.account.account !== "") {
    return user.account;
  }
}

const UserAccount: React.FunctionComponent = props => {
  // context
  const civilCtx = React.useContext<ICivilContext>(CivilContext);
  const civil = civilCtx.civil;

  // redux
  const dispatch = useDispatch();
  const account: any | undefined = useSelector(maybeAccount);

  const civilContext = React.useContext<ICivilContext>(CivilContext);
  const civilUser = civilContext.currentUser;
  const userAccount = account ? account.account : undefined;

  // state
  const [isUserDrawerOpen, setUserDrawerOpen] = React.useState(false);
  const toggleDrawer = () => setUserDrawerOpen(!isUserDrawerOpen);

  async function onLoginPressed(): Promise<any> {
    dispatch!(await showWeb3LoginModal());
  }
  async function onSignupPressed(): Promise<any> {
    dispatch!(await showWeb3SignupModal());
  }

  React.useEffect(() => {
    if (civilUser && !userAccount) {
      civilCtx.civil!.currentProviderEnable().catch(err => console.log("error enabling ethereum", err));
    }
  }, [civil, civilUser, userAccount]);

  if (civilUser) {
    const userAccountElRef = React.createRef<HTMLDivElement>();

    if (props.children) {
      child = React.cloneElement(props.children as React.ReactElement, {
        userAccountElRef,
      });
    }

    const tiny72AvatarDataUrl = civilUser.userChannel!.tiny72AvatarDataUrl;
    const showFigure = !tiny72AvatarDataUrl;

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
                {showFigure && <UserAvatarFigure />}
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
  }

  return (
    <>
      <BorderlessNavBarButton onClick={onLoginPressed}>Log In</BorderlessNavBarButton>
      <NavBarButton onClick={onSignupPressed}>Sign Up</NavBarButton>
    </>
  );
};

export default UserAccount;
