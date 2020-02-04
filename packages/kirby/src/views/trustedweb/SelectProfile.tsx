import * as React from "react";
import styled from "styled-components";
import makeBlockie from "ethereum-blockies-base64";

import { Profile } from "@kirby-web3/plugin-trustedweb";
import { Button, buttonSizes, colors } from "@joincivil/elements";
import { CoreContext } from "@kirby-web3/child-react";
import { ViewPlugin } from "@kirby-web3/child-core";

import { SectionHeading, WindowContainer, WindowHeader, SmallerText } from "./common";

const Avatar = styled.img`
  margin: 0 5px;
  border-radius: 50%;
  height: 35px;
  width: 35px;
`;

export const Section = styled.div`
  margin-bottom: 20px;
`;

const ProfileItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px;
  align-items: center;
  :hover {
    background-color: #dfdfdf;
  }
  > :nth-child(2) {
    flex-grow: 1;
  }
  cursor: pointer;
`;
enum statuses {
  INIT,
  CHANGE_START,
  CHANGE_DONE,
  CREATE_START,
  CREATE_DONE,
}

export const AddProfileAvatar = () => {
  const blockie = makeBlockie("add profile");
  return <Avatar src={blockie} height={35} width={35} alt={"add profile"} />;
};

export interface AddProfileProps {
  createProfile(name: string): Promise<Profile>;
}

const AddProfileContainer = styled(Section)`
  margin-top: 10px;
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
`;

export const AddProfile: React.FunctionComponent<AddProfileProps> = ({ createProfile }) => {
  const nameRef = React.useRef<any>(null);
  const [, setStatus] = React.useState<statuses>(statuses.INIT);

  async function doCreateProfile(): Promise<void> {
    if (nameRef === null) {
      throw new Error("null ref");
    }

    const value = nameRef.current.value;
    setStatus(statuses.CREATE_START);
    await createProfile(value);
    setStatus(statuses.CREATE_DONE);
    nameRef.current.value = "";
    setActive(false);
  }

  const [isActive, setActive] = React.useState(false);

  if (isActive) {
    return (
      <AddProfileContainer>
        <SectionHeading>Or add a new profile</SectionHeading>
        <ProfileItemContainer>
          <AddProfileAvatar />
          <input type="text" ref={nameRef} />
          <Button onClick={doCreateProfile} size={buttonSizes.SMALL}>
            Create Profile
          </Button>
        </ProfileItemContainer>
      </AddProfileContainer>
    );
  }

  return (
    <AddProfileContainer onClick={() => setActive(true)}>
      <SectionHeading>Or add a new profile</SectionHeading>
      <ProfileItemContainer>
        <AddProfileAvatar />
        <small>Create a new profile to use different personas across sites. (Work, Home, Games, etc)</small>
      </ProfileItemContainer>
    </AddProfileContainer>
  );
};

const ProfileSubheader: React.FunctionComponent<any> = ({ isEphemeral }) => {
  return (
    <Section>
      {isEphemeral ? (
        <>
          <SmallerText>
            You are using a guest trusted web account. It will be deleted if you clear your cookies.
          </SmallerText>
        </>
      ) : (
        undefined
      )}
      <SectionHeading>Use an existing profile</SectionHeading>
    </Section>
  );
};

const TermsContainer = styled.div`
  color: ${colors.accent.CIVIL_GRAY_2};
  margin-bottom: 20px;
  font-size: 12px;
  font-weight: normal;
  line-height: 18px;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  > div {
    max-width: 70%;
  }
`;
const TermsAndConditions = () => {
  return (
    <TermsContainer>
      <div>
        By continuing you accept Civil's <a href="#todo">Terms of Use</a> and <a href="#todo">Privacy Policy</a>.
      </div>
    </TermsContainer>
  );
};

interface ProfileItemProps {
  profile: Profile;
  blockie: string;
  onSelect(): void;
}
const ProfileItem: React.FunctionComponent<ProfileItemProps> = ({ profile, blockie, onSelect }) => {
  return (
    <ProfileItemContainer onClick={onSelect}>
      <Avatar src={blockie} height={35} width={35} alt={profile.address} />
      <span>{profile.name}</span>
    </ProfileItemContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  > div {
    max-width: 80%;
  }
`;

// SELECT PROFILE
interface SelectProfileProps {
  profiles: Profile[];
  isEphemeral: boolean;
  goToLogin(): void;
  createProfile(name: string): Promise<Profile>;
  onProfileSelected(profile: Profile): Promise<Profile>;
}
export const SelectProfile: React.FunctionComponent<SelectProfileProps> = ({
  profiles,
  isEphemeral,
  goToLogin,
  createProfile,
  onProfileSelected,
}) => {
  const ctx = React.useContext(CoreContext);
  const viewPlugin = ctx.core.plugins.view as ViewPlugin;
  const [, setStatus] = React.useState<statuses>(statuses.INIT);

  const blockies = React.useMemo(() => {
    if (!profiles) {
      return [];
    }
    return profiles.map(acct => makeBlockie("did:ethr:" + acct.address));
  }, [profiles]);

  async function changeProfile(profile: Profile): Promise<void> {
    setStatus(statuses.CHANGE_START);
    await onProfileSelected(profile);
    setStatus(statuses.CHANGE_DONE);
  }

  if (!profiles) {
    return <div>loading profiles...</div>;
  }
  if (profiles.length === 0) {
    return (
      <div>
        <div>you don't have any profiles yet</div>
        <div>enter your profile name:</div>
        {/* <input type="text" ref={nameRef} />
        <Button onClick={doCreateProfile} size={buttonSizes.SMALL}>
          Create Profile
        </Button> */}
      </div>
    );
  }
  return (
    <WindowContainer>
      <WindowHeader title="Select a profile" onCloseSelected={() => viewPlugin.completeView()} />
      <ProfileSubheader isEphemeral={isEphemeral} />
      {profiles.map((profile, idx) => (
        <ProfileItem
          key={profile.address}
          profile={profile}
          onSelect={() => changeProfile(profile)}
          blockie={blockies[idx]}
        />
      ))}
      <AddProfile createProfile={createProfile} />
      <TermsAndConditions />
      {isEphemeral ? (
        <LoginContainer>
          <div>
            Already have an account?{" "}
            <a href="#" onClick={goToLogin}>
              Log in
            </a>
          </div>
        </LoginContainer>
      ) : (
        undefined
      )}
    </WindowContainer>
  );
};
