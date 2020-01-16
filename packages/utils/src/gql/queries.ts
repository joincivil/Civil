import gql from "graphql-tag";

export const CHALLENGE_FRAGMENT = gql`
  fragment ChallengeFragment on Challenge {
    challengeID
    listingAddress
    statement
    rewardPool
    challenger
    resolved
    stake
    totalTokens
    poll {
      commitEndDate
      revealEndDate
      voteQuorum
      votesFor
      votesAgainst
    }
    requestAppealExpiry
    lastUpdatedDateTs
    appeal {
      requester
      appealFeePaid
      appealPhaseExpiry
      appealGranted
      appealOpenToChallengeExpiry
      statement
      appealChallengeID
      appealGrantedStatementURI
      appealChallenge {
        challengeID
        statement
        rewardPool
        challenger
        resolved
        stake
        totalTokens
        poll {
          commitEndDate
          revealEndDate
          voteQuorum
          votesFor
          votesAgainst
        }
      }
    }
  }
`;

export const LISTING_FRAGMENT = gql`
  fragment ListingFragment on Listing {
    name
    owner
    ownerAddresses
    contractAddress
    whitelisted
    lastGovState
    lastUpdatedDate
    charter {
      uri
      contentID
      revisionID
      signature
      author
      contentHash
      timestamp
    }
    channel {
      handle
    }
    unstakedDeposit
    appExpiry
    approvalDate
    challengeID
    challenge {
      ...ChallengeFragment
    }
    prevChallenge {
      ...ChallengeFragment
    }
  }
  ${CHALLENGE_FRAGMENT}
`;

export const CONTENT_REVISION_FRAGMENT = gql`
  fragment ContentRevisionFragment on ContentRevision {
    listingAddress
    editorAddress
    contractContentId
    contractRevisionId
    revisionUri
    revisionDate
  }
`;

export const LISTING_QUERY = gql`
  query($addr: String, $handle: String) {
    tcrListing(addr: $addr, handle: $handle) {
      ...ListingFragment
    }
  }
  ${LISTING_FRAGMENT}
`;

export const LISTING_WITH_CHARTER_REVISIONS_QUERY = gql`
  query($addr: String, $handle: String) {
    tcrListing(addr: $addr, handle: $handle) {
      ...ListingFragment
    }
    charterRevisions: articles(addr: $addr, handle: $handle, contentID: 0) {
      ...ContentRevisionFragment
    }
  }
  ${LISTING_FRAGMENT}
  ${CONTENT_REVISION_FRAGMENT}
`;

export const NEWSROOM_CHARTER_REVISIONS = gql`
  query($addr: String!) {
    charterRevisions: articles(addr: $addr, contentID: 0) {
      ...ContentRevisionFragment
    }
  }
  ${CONTENT_REVISION_FRAGMENT}
`;

export const CHALLENGE_QUERY = gql`
  query($challengeID: Int!) {
    challenge(id: $challengeID) {
      ...ChallengeFragment
    }
  }
  ${CHALLENGE_FRAGMENT}
`;

export const POLL_QUERY = gql`
  query($input: Int!) {
    poll(pollID: $input) {
      commitEndDate
      revealEndDate
      voteQuorum
      votesFor
      votesAgainst
    }
  }
`;

export const USER_CHALLENGE_DATA_QUERY = gql`
  query($userAddr: String!, $pollID: Int!) {
    userChallengeData(userAddr: $userAddr, pollID: $pollID) {
      pollID
      pollRevealDate
      pollType
      userDidCommit
      userDidReveal
      didUserCollect
      didUserRescue
      didCollectAmount
      isVoterWinner
      pollIsPassed
      salt
      choice
      numTokens
      voterReward
      parentChallengeID
    }
  }
`;

export const PARAMETERS_QUERY = gql`
  query Parameters($input: [String!]) {
    parameters: parameters(paramNames: $input) {
      paramName
      value
    }
  }
`;
