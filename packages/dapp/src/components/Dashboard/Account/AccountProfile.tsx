import * as React from "react";
import { colors, fonts, mediaQueries, Button } from "@joincivil/components";

export interface AccountProfileProps {
  history?: any;
  match?: any;
}

export const AccountProfile: React.FunctionComponent<AccountProfileProps> = props => {
  return (
  <>
    <>Edit profile</>
    <>Edit your profile and account settings. Your profile picture and username will be displayed on your profile.</>
    <Button>Save Changes</Button>
  </>
  );
};
