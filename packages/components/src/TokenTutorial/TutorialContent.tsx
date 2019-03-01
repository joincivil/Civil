import * as React from "react";
import { TrendsIcon } from "../icons/TrendsIcon";
import { NetworkIcon } from "../icons/NetworkIcon";
import { TokenWalletIcon } from "../icons/TokenWalletIcon";
import {
  Topic1Intro,
  Topic2Intro,
  Topic3Intro,
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
    name: "How to use Civil tokens",
    description: "Learn about Civil tokens and their intended uses within the Civil network",
    quizId: "topic1",
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
          },
          {
            text: "The Civil Constitution",
          },
          {
            text: "The Civil Registry",
          },
        ],
        answer: "The Civil Constitution",
      },
      {
        question: "Which of these actions are required for newsrooms to gain access to the Civil Registry?",
        options: [
          {
            text: "Complete a Newsroom application",
          },
          {
            text: "Sign the Civil Constitution",
          },
          {
            text: "Stake deposit of Civil tokens",
          },
          {
            text: "All of the above",
          },
        ],
        answer: "All of the above",
      },
      {
        question: "Which of the following best illustrates the purpose of Civil tokens?",
        options: [
          {
            text: "Civil tokens are used to apply, challenge, vote or appeal in community governance decisions.",
          },
          {
            text: "Civil tokens are used to invest in newsrooms.",
          },
          {
            text: "Civil tokens are used to publish articles on the Civil platform.",
          },
        ],
        answer: "Civil tokens are used to apply, challenge, vote or appeal in community governance decisions.",
      },
      {
        question: "What is the best way to earn Civil tokens on the Civil Registry?",
        options: [
          {
            text: "By participating in all the challenges and appeals",
          },
          {
            text: "By voting among the majority in a community decision",
          },
          {
            text: "All of the above",
          },
        ],
        answer: "All of the above",
      },
    ],
    completed: {
      header: "Nice! You’ve completed Topic 1",
      content: "Only two more topics to go. Let’s keep going!",
      btnText: "Continue on to Topic 2",
    },
  },
  {
    name: "Purchasing, storing and using Civil tokens",
    description: "Learn basic concepts of Ether, gas, digital wallets, keys, and seed phrases",
    quizId: "topic2",
    icon: <TokenWalletIcon height={48} width={42} />,
    tutorialIntro: {
      header: "Topic 2: Purchasing, storing and using Civil tokens",
      content: <Topic2Intro />,
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
          },
          {
            text:
              "The gas is not returned to Sally, but is paid to miners who must validate and execute the transaction regardless if it fails or succeeds.",
          },
          {
            text: "I don’t know what gas is.",
          },
        ],
        answer:
          "The gas is not returned to Sally, but is paid to miners who must validate and execute the transaction regardless if it fails or succeeds.",
      },
      {
        question: "What is the best way to store your seed phrase to ensure the security of your account?",
        options: [
          {
            text: "Copy the seed phrase into a document and email it to yourself.",
          },
          {
            text: "Save the seed phrase in a document, store in the cloud.",
          },
          {
            text: "Write down the seed phrase on two duplicate pieces of paper and store in two different places.",
          },
        ],
        answer: "Write down the seed phrase on two duplicate pieces of paper and store in two different places.",
      },
      {
        question:
          "Select the type of wallet that allows you to perform this action: You personally sign all transactions while your private key is never exposed to the Internet.",
        options: [
          {
            text: "Hardware wallet or “cold wallet”",
          },
          {
            text: "Software wallet or “hot wallet”",
          },
        ],
        answer: "Hardware wallet or “cold wallet”",
      },
      {
        question:
          "Select the type of wallet that allows you to perform this action: You personally sign all transactions while connected to the internet.",
        options: [
          {
            text: "Hardware wallet or “cold wallet”",
          },
          {
            text: "Software wallet or “hot wallet”",
          },
        ],
        answer: "Software wallet or “hot wallet”",
      },
    ],
    completed: {
      header: "Huzzah! You crushed Topic 2",
      content: "You’re doing really well. Keep going!",
      btnText: "Continue on to Topic 3",
    },
  },
  {
    name: "Things to consider before buying Civil tokens",
    description: "Learn how to responsibly manage cryptocurrency",
    quizId: "topic3",
    icon: <TrendsIcon />,
    tutorialIntro: {
      header: "Topic 3: Things to consider before buying Civil tokens",
      content: <Topic3Intro />,
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
          },
          {
            text: "Civil token prices fluctuate based on total demand and circulating supply of tokens in the market.",
          },
          {
            text: "Civil token prices fluctuate based on the speed of Ethereum network traffic.",
          },
        ],
        answer: "Civil token prices fluctuate based on total demand and circulating supply of tokens in the market.",
      },
      {
        question: "Which of the following is important when purchasing a token?",
        options: [
          {
            text: "Network value of a token",
          },
          {
            text: "Purpose or usage of the token",
          },
          {
            text: "Amount of money spent by others on tokens",
          },
        ],
        answer: "Purpose or usage of the token",
      },
      {
        question: "How much is safe to consider spending on Civil tokens?",
        options: [
          {
            text: "A maximum of half of one paycheck",
          },
          {
            text: "1% of your total net worth, if not an accredited investor",
          },
          {
            text: "No more than you can afford to lose if Civil tokens lost all value",
          },
        ],
        answer: "No more than you can afford to lose if Civil tokens lost all value",
      },
      {
        question:
          "Is anyone except for you responsible for creating any type of financial return for you in association with your purchase of CVL tokens?",
        options: [
          {
            text: "Civil Media is responsible.",
          },
          {
            text: "Solely I am responsible.",
          },
        ],
        answer: "Solely I am responsible.",
      },
    ],
    completed: {
      header: "Congrats! You’ve completed the Civil tutorial",
      content:
        "You’ve proved that you understand Civil and how Civil token works. Now you’re eligible to use, share and buy Civil tokens.",
      btnText: "Buy Civil Tokens",
    },
  },
];
