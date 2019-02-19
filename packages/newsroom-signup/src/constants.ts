export enum charterQuestions {
  PURPOSE = "purpose",
  STRUCTURE = "structure",
  REVENUE = "revenue",
  ENCUMBRANCES = "encumbrances",
  MISCELLANEOUS = "miscellaneous",
}

export const questionsCopy = {
  [charterQuestions.PURPOSE]: "Please describe your newsroom's mission or purpose.",
  [charterQuestions.STRUCTURE]: "What is your newsroom's ownership structure? (e.g. non-profit, for-profit, co-op)",
  [charterQuestions.REVENUE]:
    "What are your newsroom's current or planned revenue sources? (ex: membership, subscriptions, advertising, sponsored content, promoted links)",
  [charterQuestions.ENCUMBRANCES]:
    "Does anything get in the way of your ability to report independently? Are there any conflicts of interest that voters should be aware of?",
  [charterQuestions.MISCELLANEOUS]:
    "Is there anything else the Civil community should know about your Newsroom to support its inclusion on the Registry?",
};
