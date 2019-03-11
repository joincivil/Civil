export const FAQ_BASE_URL = "https://help.civil.co";

export const enum routes {
  REGISTRY_HOME = "/registry/:listingType/:subListingType?",
  REGISTRY_HOME_ROOT = "/registry",
  HOMEPAGE = "/",
  CONTRACT_ADDRESSES = "/contract-addresses",
  LISTING = "/listing/:listingAddress",
  SUBMIT_CHALLENGE = "/listing/:listingAddress/submit-challenge",
  SUBMIT_APPEAL_CHALLENGE = "/listing/:listingAddress/submit-appeal-challenge",
  REQUEST_APPEAL = "/listing/:listingAddress/request-appeal",
  CHALLENGE = "/listing/:listingAddress/challenge/:challengeID",
  CREATE_NEWSROOM = "/create-newsroom",
  NEWSROOM_MANAGEMENT = "/mgmt/:newsroomAddress",
  NEWSROOM_MANAGEMENT_V1 = "/mgmt-v1/:newsroomAddress",
  PARAMETERIZER = "/parameterizer",
  APPLY_TO_REGISTRY = "/apply-to-registry/:action?",
  GOVERNMENT = "/government",
  DASHBOARD = "/dashboard/:activeDashboardTab/:activeDashboardSubTab?",
  DASHBOARD_ROOT = "/dashboard",
  AUTH = "/auth",
  TOKEN_STOREFRONT = "/tokens",
}

export const enum links {
  CONSTITUTION = "https://civil.co/constitution",
  FOUNDATION = "https://civilfound.org",
  APPLY = "https://civil.co/join-as-a-newsroom",
  BECOME_A_MEMBER = "https://civil.co/become-a-member",
  JOIN_AS_NEWSROOM = "https://civil.co/join-as-a-newsroom",
  CODE_OF_CONDUCT = "https://civil.co/code-of-conduct",
  CONTACT = "https://civil.co/contact",
  FAQ_REGISTRY = "/hc/en-us/categories/360001542132-Registry",
  FAQ_COMMUNITY_VETTING_PROCESS = "/hc/en-us/articles/360024853311-What-is-the-Civil-Registry-community-vetting-process-for-a-Newsroom-",
  FAQ_CAN_REJECTED_NEWSROOMS_REAPPLY = "/hc/en-us/articles/360024545152-Can-rejected-Newsrooms-re-apply-to-the-Civil-Registry-",
  FAQ_HOW_TO_CHALLENGE = "/hc/en-us/articles/360024546932-How-do-I-challenge-a-Newsroom-",
  FAQ_HOW_TO_VOTE = "/hc/en-us/articles/360024855271-How-do-I-vote-in-a-challenge-",
  FAQ_HOW_TO_APPEAL = "/hc/en-us/articles/360024855191-How-do-I-request-an-appeal-to-the-Civil-Council-",
  FAQ_HOW_TO_UPDATE_NEWSROOM_STATUS = "/hc/en-us/articles/360024545012-How-do-I-update-a-Newsroom-s-status-on-the-Civil-Registry-",
  FAQ_WHAT_IS_SMART_CONTRACT = "/hc/en-us/articles/360016463832-What-is-a-newsroom-smart-contract-",
  FAQ_WHAT_IS_PLCR_CONTRACT = "/hc/en-us/articles/360024544932-What-is-Civil-s-voting-smart-contract-",
}

export const enum registryListingTypes {
  APPROVED = "approved",
  IN_PROGRESS = "in-progress",
  REJECTED = "rejected",
}

export const enum registrySubListingTypes {
  IN_APPLICATION = "new-applications",
  UNDER_CHALLENGE = "under-challenge",
  UNDER_APPEAL = "under-appeal",
  UNDER_APPEAL_CHALLENGE = "under-appeal-challenge",
  READY_TO_UPDATE = "ready-to-update",
}

export type TRegistryListingType =
  | registryListingTypes.APPROVED
  | registryListingTypes.IN_PROGRESS
  | registryListingTypes.REJECTED;

export type TRegistrySubListingType =
  | registrySubListingTypes.IN_APPLICATION
  | registrySubListingTypes.UNDER_CHALLENGE
  | registrySubListingTypes.UNDER_APPEAL
  | registrySubListingTypes.UNDER_APPEAL_CHALLENGE
  | registrySubListingTypes.READY_TO_UPDATE;

export const enum dashboardTabs {
  TASKS = "tasks",
  NEWSROOMS = "newsrooms",
  CHALLENGES = "challenges",
  ACTIVITY = "activity",
}

export const enum dashboardSubTabs {
  TASKS_ALL = "all",
  TASKS_REVEAL_VOTE = "reveal-vote",
  TASKS_CLAIM_REWARDS = "claim-rewards",
  TASKS_RESCUE_TOKENS = "rescue-tokens",
  TASKS_TRANSFER_VOTING_TOKENS = "transfer-voting-tokens",
  CHALLENGES_COMPLETED = "completed",
  CHALLENGES_STAKED = "completed",
}

export type TDashboardTab =
  | dashboardTabs.TASKS
  | dashboardTabs.NEWSROOMS
  | dashboardTabs.CHALLENGES
  | dashboardTabs.ACTIVITY;

export type TDashboardSubTab =
  | dashboardSubTabs.TASKS_ALL
  | dashboardSubTabs.TASKS_REVEAL_VOTE
  | dashboardSubTabs.TASKS_CLAIM_REWARDS
  | dashboardSubTabs.TASKS_RESCUE_TOKENS
  | dashboardSubTabs.TASKS_TRANSFER_VOTING_TOKENS
  | dashboardSubTabs.CHALLENGES_COMPLETED
  | dashboardSubTabs.CHALLENGES_STAKED;
