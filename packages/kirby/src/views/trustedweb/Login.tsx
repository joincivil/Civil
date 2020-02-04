import * as React from "react";
import { TrustedWebChildPlugin } from "@kirby-web3/plugin-trustedweb";
import { BorderlessButton, TextInput, buttonSizes, DarkButton } from "@joincivil/elements";
import { WindowContainer, WindowHeader } from "./common";
import { CoreContext } from "@kirby-web3/child-react";
import { ViewPlugin } from "@kirby-web3/child-core";

export interface LoginProps {
  plugin: TrustedWebChildPlugin;
  requirePopup: boolean;
  onBackClicked(): void;
  onSuccess(): void;
}

export const Login: React.FunctionComponent<LoginProps> = ({ plugin, requirePopup, onSuccess, onBackClicked }) => {
  const ctx = React.useContext(CoreContext);

  const viewPlugin = ctx.core.plugins.view as ViewPlugin;
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const [error, setError] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);

  async function checkPassword(): Promise<void> {
    try {
      setLoading(true);
      await plugin.login(email, password);
      setLoading(false);
      onSuccess();
    } catch (err) {
      console.log("login error", err);
      setLoading(false);
      setError("Your email or password were incorrect.");
    }
  }

  function doSetPassword(val: string): void {
    setPassword(val);
    if (error) {
      setError(undefined);
    }
  }

  function popLogin(): void {
    const popupWindow = window.open(
      `${window.location.origin}/popups/login`,
      "CivilKirbyLogin",
      "location=0,status=0,width=600,height=400,dependent=1",
    );
    const interval = window.setInterval(() => {
      if (popupWindow!.closed) {
        window.clearInterval(interval);
        popupComplete().catch(err => {
          console.log("error finishing callback", err);
        });
      }
    }, 1000);
  }

  async function popupComplete(): Promise<void> {
    await plugin.startup();
    onSuccess();
  }

  if (requirePopup) {
    return (
      <WindowContainer>
        <div>TODO: update copy</div>
        <div>we need to pop a new window to make sure this is not a phishing attempt</div>
        <div>be sure to confirm the domain name of the window</div>
        <div>
          <DarkButton onClick={popLogin}>Login</DarkButton>
        </div>
      </WindowContainer>
    );
  }

  return (
    <WindowContainer>
      <WindowHeader title="Log in to your account" onCloseSelected={() => viewPlugin.completeView()} />
      <TextInput
        name="email"
        value={email}
        onChange={(_, val) => setEmail(val)}
        placeholder="Email address"
        disabled={loading}
      />
      <TextInput
        type="password"
        name="password"
        value={password}
        onChange={(_, val) => doSetPassword(val)}
        placeholder="Password"
        disabled={loading}
        invalid={error !== undefined}
        invalidMessage={error}
      />
      <BorderlessButton size={buttonSizes.SMALL} onClick={checkPassword}>
        Log in
      </BorderlessButton>
    </WindowContainer>
  );
};
