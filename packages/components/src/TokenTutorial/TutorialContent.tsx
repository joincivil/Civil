import * as React from "react";
import { TrendsIcon } from "../icons/TrendsIcon";
import { NetworkIcon } from "../icons/NetworkIcon";
import { TokenWalletIcon } from "../icons/TokenWalletIcon";
import {
  Topic1Intro,
  Topic1Tutorial1,
  Topic1Tutorial2,
  Topic1Tutorial3,
  Topic1Tutorial4,
  Topic1Tutorial5,
  Topic2Tutorial1,
  Topic2Tutorial2,
  Topic2Tutorial3,
  Topic2Tutorial4,
  Topic2Tutorial5,
  Topic2Tutorial6,
  Topic2Tutorial7,
  Topic2Tutorial8,
  Topic3Tutorial1,
  Topic3Tutorial2,
  Topic3Tutorial3,
} from "./TokenTutorialTextComponents";

export const TutorialContent = [
  {
    name: "Topic 1: How to use Civil tokens",
    description: "Learn about CVL tokens and their intended uses within the Civil network.",
    icon: <NetworkIcon />,
    tutorialIntro: {
      header: "Topic 1: How to use Civil tokens",
      content: <Topic1Intro />,
    },
    tutorials: [
      {
        content: <Topic1Tutorial1 />,
      },
      {
        content: <Topic1Tutorial2 />,
      },
      {
        content: <Topic1Tutorial3 />,
      },
      {
        content: <Topic1Tutorial4 />,
      },
      {
        content: <Topic1Tutorial5 />,
      },
    ],
    questions: [
      {
        question: "Which of the following documents sets the standard for ethical journalism on Civil?",
        options: [
          {
            text: "The Civil White Paper",
            result: "",
          },
          {
            text: "The Civil Constitution",
            result: "correct",
          },
          {
            text: "The Civil Registry",
            result: "",
          },
        ],
      },
      {
        question: "Which of these actions are required for newsrooms to gain access to the Civil Registry?",
        options: [
          {
            text: "Complete a Newsroom application",
            result: "",
          },
          {
            text: "Sign the Civil Constitution",
            result: "",
          },
          {
            text: "Stake deposit of Civil tokens",
            result: "",
          },
          {
            text: "All of the above",
            result: "correct",
          },
        ],
      },
      {
        question: "Which of the following best illustrates the purpose of Civil tokens?",
        options: [
          {
            text: "Civil tokens are used to apply, challenge, vote or appeal in community governance decisions.",
            result: "correct",
          },
          {
            text: "Civil tokens are used to invest in newsrooms.",
            result: "",
          },
          {
            text: "Civil tokens are used to publish articles on the Civil platform.",
            result: "",
          },
        ],
      },
      {
        question: "What is the best way to earn Civil tokens on the Civil Registry?",
        options: [
          {
            text: "By participating in all the challenges and appeals",
            result: "",
          },
          {
            text: "By voting among the majority in a community decision",
            result: "",
          },
          {
            text: "All of the above",
            result: "correct",
          },
        ],
      },
    ],
    completed: {
      header: "Nice! You’ve completed Topic 1",
      content:
        "Buying tokens, like any financial decision, is a risk. The price of tokens can fluctuate depending on various factors. It’ a good rule of thumb to look at the team behind the token – the founders, the advisors – as well as the token design and its supply.  It’s also important to diversify your portfolio across many investment vehicles – crypto assets and non-crypto assets.",
    },
  },
  {
    name: "Topic 2: Purchasing, storing, using Civil tokens",
    description: "Learn basic concepts of ETH, gas, digital wallets, keys, and recovery seed phrases.",
    icon: <TokenWalletIcon height={48} width={42} />,
    tutorialIntro: {
      header: "Topic 2: Purchasing, storing, using Civil tokens",
      content: "TKTKT",
    },
    tutorials: [
      {
        content: <Topic2Tutorial1 />,
      },
      {
        content: <Topic2Tutorial2 />,
      },
      {
        content: <Topic2Tutorial3 />,
      },
      {
        content: <Topic2Tutorial4 />,
      },
      {
        content: <Topic2Tutorial5 />,
      },
      {
        content: <Topic2Tutorial6 />,
      },
      {
        content: <Topic2Tutorial7 />,
      },
      {
        content: <Topic2Tutorial8 />,
      },
    ],
    questions: [
      {
        question:
          "Sally sends a transaction on Ethereum with the gas limit set too low causing an “out of gas” error. As a result, her transaction failed. What happens to the gas fee that she spent on that transaction?",
        options: [
          {
            text: "The gas fee is returned to Sally because the transaction didn’t go through.",
            result: "",
          },
          {
            text:
              "The gas is not returned to Sally, but is paid to miners who must validate and execute the transaction regardless if it fails or succeeds.",
            result: "correct",
          },
          {
            text: "I don’t know what gas is.",
            result: "",
          },
        ],
      },
      {
        question: "What is the best way to store your seed phrase to ensure the security of your account?",
        options: [
          {
            text: "Copy the seed phrase into a document and email it to yourself.",
            result: "",
          },
          {
            text: "Save the seed phrase in a document, store in the cloud.",
            result: "",
          },
          {
            text: "Write down the seed phrase on two duplicate pieces of paper and store in two different places.",
            result: "correct",
          },
        ],
      },
      {
        question:
          "Select the type of wallet that allows you to perform this action: You personally sign all transactions while your private key is never exposed to the Internet.",
        options: [
          {
            text: "Hardware wallet or “cold wallet”",
            result: "correct",
          },
          {
            text: "Software wallet or “hot wallet”",
            result: "",
          },
        ],
      },
      {
        question:
          "Select the type of wallet that allows you to perform this action: You personally sign all transactions while connected to the Internet.",
        options: [
          {
            text: "Hardware wallet or “cold wallet”",
            result: "",
          },
          {
            text: "Software wallet or “hot wallet”",
            result: "correct",
          },
        ],
      },
      {
        question:
          "Select the type of wallet that allows you to perform this action: You do not hold the private key to your wallet, and your tokens are stored in a server connected to the Internet.",
        options: [
          {
            text: "Hardware wallet or “cold wallet”",
            result: "",
          },
          {
            text: "Software wallet or “hot wallet”",
            result: "correct",
          },
        ],
      },
    ],
    completed: {
      header: "Nice! You’ve completed Topic 2",
      content: "TKTKT",
    },
  },
  {
    name: "Topic 3: Things to consider before buying Civil tokens",
    description: "Learn about token price trends, token design, and potential risks.",
    icon: <TrendsIcon />,
    tutorialIntro: {
      header: "Topic 3: Things to consider before buying Civil tokens",
      content: "TKTKT",
    },
    tutorials: [
      {
        content: <Topic3Tutorial1 />,
      },
      {
        content: <Topic3Tutorial2 />,
      },
      {
        content: <Topic3Tutorial3 />,
      },
    ],
    questions: [
      {
        question: "Why do Civil token prices fluctuate?",
        options: [
          {
            text: "Civil token prices fluctuate based on how well the stock market is doing.",
            result: "",
          },
          {
            text: "Civil token prices fluctuate based on total demand and circulating supply of tokens in the market.",
            result: "correct",
          },
          {
            text: "Civil token prices fluctuate based on the speed of Ethereum network traffic.",
            result: "",
          },
        ],
      },
      {
        question: "Which of the following is important when purchasing a token?",
        options: [
          {
            text: "Network value of a token",
            result: "",
          },
          {
            text: "Purpose or usage of the token",
            result: "correct",
          },
          {
            text: "Amount of money spent by others on tokens",
            result: "",
          },
        ],
      },
      {
        question: "How much is safe to consider spending on Civil tokens?",
        options: [
          {
            text: "A maximum of half of one paycheck",
            result: "",
          },
          {
            text: "1% of your total net worth, if not an accredited investor",
            result: "",
          },
          {
            text: "No more than you can afford to lose if Civil tokens lost all value",
            result: "correct",
          },
        ],
      },
    ],
    completed: {
      header: "Nice! You’ve completed Topic 3",
      content: "TKTKT",
    },
  },
];
