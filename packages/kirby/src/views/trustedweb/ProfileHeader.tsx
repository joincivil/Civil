import * as React from "react";
import styled from "styled-components";
import makeBlockie from "ethereum-blockies-base64";
import { Profile, CurrentUser, TrustedWebChildPlugin } from "@kirby-web3/plugin-trustedweb";
import { BorderlessButton, buttonSizes, DarkButton } from "@joincivil/elements";
import { useKirbySelector, CoreContext } from "@kirby-web3/child-react";

const ProfileHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 5px;
  border-bottom: 1px solid #dfdfdf;
  margin-bottom: 5px;
  > :nth-child(2) {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    > small {
      font-size: 12px;
      color: grey;
    }
    > span {
      font-size: 22px;
    }
  }
  > img {
    padding: 0 5px;
  }
`;

export interface ProfileHeaderProps {
  profile: Profile;
  onProfileChangeRequest?(): void;
}

export const ProfileHeader: React.FunctionComponent<ProfileHeaderProps> = ({ profile, onProfileChangeRequest }) => {
  const ctx = React.useContext(CoreContext);
  const trustedweb = ctx.core.plugins.trustedweb as TrustedWebChildPlugin;
  const currentUser: CurrentUser | undefined = useKirbySelector((state: any) => state.trustedweb.currentUser);

  const blockie = React.useMemo(() => {
    return makeBlockie("did:ethr:" + profile.address);
  }, [profile]);

  function logout(): void {
    trustedweb.logout();
  }

  return (
    <ProfileHeaderContainer>
      <img src={blockie} height={35} width={35} alt={"did:ethr:" + profile.address} />
      <div>
        <small>Selected Profile</small>
        <span>{profile.name}</span>
      </div>
      <div>
        {onProfileChangeRequest ? (
          <DarkButton size={buttonSizes.SMALL} onClick={onProfileChangeRequest}>
            Change
          </DarkButton>
        ) : null}

        {currentUser && !currentUser.ephemeral ? (
          <BorderlessButton size={buttonSizes.SMALL} onClick={logout}>
            Logout
          </BorderlessButton>
        ) : (
          undefined
        )}
      </div>
    </ProfileHeaderContainer>
  );
};
