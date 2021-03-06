import * as React from "react";

const UserAccount = React.lazy(async () => import(/* webpackChunkName: "user-account" */ "./UserAccount"));

export const UserAccountContainer: React.FunctionComponent = () => {
  return (
    <React.Suspense fallback={<></>}>
      <UserAccount />
    </React.Suspense>
  );
};

export default UserAccountContainer;
