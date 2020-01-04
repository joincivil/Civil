export enum embedRoutes {
  STORY_BOOST = "/embed/boost/story/:boostId",
  BOOST = "/embed/boost/:boostId/:payment?",
}

export enum routes {
  REGISTRY_HOME = "/registry/:listingType/:subListingType?",
  REGISTRY_HOME_ROOT = "/registry",
  HOMEPAGE = "/",
  CONTRACT_ADDRESSES = "/contract-addresses",
  LISTING = "/listing/:listingAddress/:activeTab?",
  SUBMIT_CHALLENGE = "/listing/:listingAddress/submit-challenge",
  SUBMIT_APPEAL_CHALLENGE = "/listing/:listingAddress/submit-appeal-challenge",
  REQUEST_APPEAL = "/listing/:listingAddress/request-appeal",
  CHALLENGE = "/listing/:listingAddress/challenge/:challengeID",
  CREATE_NEWSROOM = "/create-newsroom",
  NEWSROOM_MANAGEMENT_V1 = "/mgmt-v1/:newsroomAddress",
  PARAMETERIZER = "/parameterizer",
  APPLY_TO_REGISTRY = "/apply-to-registry/:action?",
  GOVERNMENT = "/government",
  DASHBOARD = "/dashboard/:activeDashboardTab/:activeDashboardSubTab?",
  DASHBOARD_ROOT = "/dashboard",
  AUTH = "/auth",
  AUTH_SIGNUP = "/auth/signup",
  AUTH_SIGNUP_WEB3 = "/auth/signup/web3",
  AUTH_LOGIN = "/auth/login",
  AUTH_LOGIN_WEB3 = "/auth/login/web3",
  AUTH_LOGOUT = "/auth/logout",
  WALLET_HOME = "/auth/wallet",
  CONFIRM_EMAIL = "/auth/confirm-email",
  TOKEN_STOREFRONT = "/tokens",
  BOOST_FEED = "/boosts",
  BOOST = "/boosts/:boostId",
  BOOST_EDIT = "/boosts/:boostId/edit",
  BOOST_PAYMENT = "/boosts/:boostId/payment",
  CHANNEL_ADMIN = "/admin/:reference",
  MANAGE_NEWSROOM = "/manage-newsroom/:newsroomAddress/:activeTab?",
  SET_HANDLE = "/auth/set-handle",
  STORY_FEED = "/storyfeed/:postId?",
  STORY_BOOST_PAYMENT = "/storyfeed/:postId/payment",
  STORY_BOOST_NEWSROOM = "/storyfeed/:postId/newsroom",
  GET_STARTED = "/get-started",
}

export enum registryListingTypes {
  APPROVED = "approved",
  IN_PROGRESS = "in-progress",
  REJECTED = "rejected",
}

export enum registrySubListingTypes {
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

export enum dashboardTabs {
  TASKS = "tasks",
  NEWSROOMS = "newsrooms",
  CHALLENGES = "challenges",
  ACTIVITY = "activity",
}

export enum dashboardSubTabs {
  TASKS_ALL = "all",
  TASKS_REVEAL_VOTE = "reveal-vote",
  TASKS_CLAIM_REWARDS = "claim-rewards",
  TASKS_RESCUE_TOKENS = "rescue-tokens",
  TASKS_TRANSFER_VOTING_TOKENS = "transfer-voting-tokens",
  CHALLENGES_COMPLETED = "completed",
  CHALLENGES_STAKED = "staked",
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

export enum listingTabs {
  CHARTER = "charter",
  DISCUSSIONS = "discussions",
  HISTORY = "history",
  BOOSTS = "boosts",
  OWNER = "owner-actions",
}

export type TListingTab =
  | listingTabs.CHARTER
  | listingTabs.DISCUSSIONS
  | listingTabs.HISTORY
  | listingTabs.BOOSTS
  | listingTabs.OWNER;
