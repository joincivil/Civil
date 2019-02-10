import * as React from "react";
import { BookreaderIcon } from "../icons/BookreaderIcon";
import { BrainIcon } from "../icons/BrainIcon";
import { ExamIcon } from "../icons/ExamIcon";

export const WelcomeScreenContent = [
  {
    title: "Be an informed Civil member",
    description: "Follow our short tutorial designed to help you better understand how to use Civil tokens (CVL).",
    icon: <BookreaderIcon />,
    btn: "Next",
  },
  {
    title: "Understand complex topics, fast",
    description:
      "We’ll help bridge your knowledge gaps so you feel comfortable in the exciting new world of cryptocurrency.",
    icon: <BrainIcon />,
    btn: "Next",
  },
  {
    title: "Apply your new knowledge",
    description:
      "Take a short quiz at the end of each section to test your understanding before you use, share or buy Civil tokens.",
    icon: <ExamIcon />,
    btn: "Continue",
  },
];
