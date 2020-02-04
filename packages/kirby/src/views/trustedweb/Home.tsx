import * as React from "react";
import { CoreContext, CenteredPage, useKirbySelector } from "@kirby-web3/child-react";
import { ViewPlugin } from "@kirby-web3/child-core";
import { TrustedWebChildPlugin, Profile, CurrentUser } from "@kirby-web3/plugin-trustedweb";
import { ProfileHeader } from "./ProfileHeader";
import { LoggedOut } from "./auth/LoggedOut";
import { EphemeralUpgrade } from "./EphemeralUpgrade";
import { BorderlessButton } from "@joincivil/elements";
import { SyncDevice } from "./auth/SyncDevice";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { SelectProfile } from "./SelectProfile";

export const Home: React.FC = () => {
  const ctx = React.useContext(CoreContext);
  const trustedweb = ctx.core.plugins.trustedweb as TrustedWebChildPlugin;
  const viewPlugin = ctx.core.plugins.view as ViewPlugin;

  const profiles: Profile[] = useKirbySelector((state: any) => {
    if (!state.trustedweb.currentUser) {
      return;
    }
    return state.trustedweb.currentUser.profiles;
  });

  const currentUser: CurrentUser | undefined = useKirbySelector((state: any) => state.trustedweb.currentUser);

  const [view, setView] = React.useState("home");

  React.useEffect(() => {
    viewPlugin.onParentClick(() => {
      viewPlugin.completeView();
    });
  }, [ctx, viewPlugin, trustedweb]);

  async function onProfileSelected(selectedProfile: Profile): Promise<Profile> {
    await trustedweb.changeProfile(selectedProfile);
    setView("home");
    return selectedProfile;
  }

  if (!currentUser) {
    return <LoggedOut />;
  }

  let body;

  if (view === "sync-device") {
    const entropy = trustedweb.getEntropy();
    body = (
      <div>
        {currentUser && !currentUser.ephemeral ? <SyncDevice entropy={entropy} cancel={() => setView("home")} /> : null}
      </div>
    );
  } else if (view === "login") {
    body = (
      <div>
        <Login
          plugin={trustedweb}
          requirePopup={true}
          onBackClicked={() => setView("home")}
          onSuccess={() => setView("profiles")}
        />
      </div>
    );
  } else if (view === "signup") {
    body = (
      <div>
        <Signup plugin={trustedweb} onBackClicked={() => setView("home")} onSuccess={() => setView("profiles")} />
      </div>
    );
  } else if (!currentUser.selectedProfile || view === "profiles") {
    body = (
      <SelectProfile
        profiles={profiles}
        onProfileSelected={onProfileSelected}
        createProfile={name => trustedweb.createProfile(name)}
        goToLogin={() => setView("login")}
        isEphemeral={currentUser.ephemeral}
      />
    );
  } else if (view === "home") {
    let header;
    if (currentUser.selectedProfile) {
      console.log("render profile header", currentUser, currentUser!.selectedProfile);
      header = (
        <ProfileHeader profile={currentUser!.selectedProfile} onProfileChangeRequest={() => setView("profiles")} />
      );
    }

    let ephemeral;
    if (currentUser.ephemeral && currentUser.selectedProfile) {
      ephemeral = <EphemeralUpgrade goToSignup={() => setView("signup")} goToLogin={() => setView("login")} />;
    }

    body = (
      <>
        {header}
        {ephemeral}
      </>
    );
  } else {
    body = (
      <div>
        {currentUser && !currentUser.ephemeral ? (
          <BorderlessButton onClick={() => setView("sync-device")}>Sync Another Device</BorderlessButton>
        ) : null}
      </div>
    );
  }

  return <CenteredPage>{body}</CenteredPage>;
};
