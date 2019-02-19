import * as React from "react";
import { UserInfo } from "./UserInfo";

// TODO(jorgelo): Get rid of me in production!

export class AuthHome extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <UserInfo />
      </>
    );
  }
}
