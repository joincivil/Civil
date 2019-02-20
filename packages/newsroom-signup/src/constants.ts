export enum charterQuestions {
  PURPOSE = "purpose",
  STRUCTURE = "structure",
  REVENUE = "revenue",
  ENCUMBRANCES = "encumbrances",
  MISCELLANEOUS = "miscellaneous",
}

export const questionsCopy = {
  [charterQuestions.PURPOSE]: "Please describe your newsroom's mission or purpose.",
  [charterQuestions.STRUCTURE]:
    "What is your Newsroom's ownership structure? e.g. not-for-profit, privately owned commercial enterprise, etc.",
  [charterQuestions.REVENUE]:
    "What are your Newsroom's current or planned revenue sources? e.g. membership, subscriptions, advertising, sponsored content",
  [charterQuestions.ENCUMBRANCES]:
    "Do you have any conflicts of interests that may impact your editorial independence? e.g. advocacy organization, commercial interests, corporate ownership",
  [charterQuestions.MISCELLANEOUS]:
    "Is there anything else the Civil community should know about your Newsroom to support its inclusion on the Registry?",
};
