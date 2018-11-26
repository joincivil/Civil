import * as React from "react";
import styled from "styled-components";
import { fonts, colors } from "@joincivil/components";
import { RosterMember } from "@joincivil/core";

export interface ListingCharterRosterMemberProps {
  member: RosterMember;
}
export interface ListingCharterRosterMemberState {
  bioExpanded: boolean;
}

const Wrapper = styled.div`
  display: flex;
  margin: 40px 0 48px;
`;

const Avatar = styled.img`
  width: 125px;
  height: 125px;
  min-width: 125px;
  min-height: 125px;
  border-radius: 50%;
  object-fit: cover;
`;
const Text = styled.div`
  display: inline-block;
  padding-left: 32px;
  font-family: ${fonts.SANS_SERIF};
`;

const Name = styled.h4`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: -0.39px;
  color: ${colors.primary.BLACK};
  margin: 0;
`;
const Role = styled.div`
  font-size: 15px;
  line-height: 24px;
  letter-spacing: -0.32px;
  color: ${colors.accent.CIVIL_GRAY_2};
`;

const Link = styled.a`
  color: ${colors.accent.CIVIL_BLUE};
  &:hover {
    color: ${colors.accent.CIVIL_BLUE_FADED};
  }
`;
const Twitter = styled(Link)`
  display: block;
  margin-top: -5px;
  font-size: 15px;
  letter-spacing: -0.32px;
`;

const Bio = styled.div`
  margin-top: 6px;
`;

// TODO(toby) temporary til we have one designed/picked
const DEFAULT_AVATAR_URL = "https://i.imgur.com/cQx23vk.jpg";

class ListingCharterRosterMember extends React.Component<
  ListingCharterRosterMemberProps,
  ListingCharterRosterMemberState
> {
  constructor(props: ListingCharterRosterMemberProps) {
    super(props);
    this.state = {
      bioExpanded: false, // ch2679 (300 chars)
    };
  }

  public render(): JSX.Element {
    const { member } = this.props;

    let twitterHandle;
    if (member.socialUrls && member.socialUrls.twitter) {
      const matches = member.socialUrls.twitter.match(/twitter\.com\/(?:#!\/)?([^\/#\?]+)/);
      if (matches && matches[1]) {
        twitterHandle = matches[1];
      }
    }

    return (
      <Wrapper>
        <Avatar src={member.avatarUrl || DEFAULT_AVATAR_URL} alt={member.name} />
        <Text>
          <Name>{member.name}</Name>
          <Role>{member.role}</Role>
          {twitterHandle && (
            <Twitter href={member.socialUrls!.twitter} target="_blank">
              @{twitterHandle}
            </Twitter>
          )}
          <Bio>
            {this.plainTextToPs(member.bio)}
          </Bio>
        </Text>
      </Wrapper>
    );
  }

  /* Input plain text with possible line breaks, output as <p> tags. */
  private plainTextToPs = (text: string): JSX.Element => {
    if (!text) {
      return <></>;
    }
    return (
      <>
        {text
          .split("\n")
          .filter(line => !!line)
          .map((line, i) => <p key={i}>{line}</p>)}
      </>
    );
  };
}

export default ListingCharterRosterMember;
