#!/usr/bin/env node
import yargs = require("yargs");
import { isValidAddress, toBuffer } from "ethereumjs-util";
import { ActionSigner } from "./lib/actionsigner";
import BN = require("bn.js");

const result = yargs
  .env("SIGNING_SERVER")
  .option("mnemonic", {
    alias: "m",
    describe: "mnemonic to generate private key",
    requiresArg: true,
    coerce: mnemonic => ActionSigner.fromMnemonic(mnemonic),
  })
  .option("userGroups", {
    alias: "u",
    describe: "User Groups Ethereum address",
    string: true,
    requiresArg: true,
    coerce: address => {
      if (!isValidAddress(address)) {
        throw new Error("userGroups is not a valid address");
      }
      return toBuffer(address);
    },
  })
  .demandOption(["mnemonic", "userGroups"])
  .command({
    command: "union <groupA> <groupB>",
    describe: "signs a force union message between groups A and B",
    handler: args => {
      if (!isValidAddress(args.groupA) || !isValidAddress(args.groupB)) {
        throw new Error("Groups are not valid addresses");
      }
      const groupA = toBuffer(args.groupA);
      const groupB = toBuffer(args.groupB);
      console.log(args.m.signUnion(args.u, groupA, groupB));
    },
  })
  .command({
    command: "groupSize <nonce> <size>",
    describe: "signs a max group size message",
    builder: args => args.coerce("nonce", nonce => new BN(nonce)).coerce("size", size => new BN(size)),
    handler: args => {
      console.log(args.m.signMaxGroupSize(args.u, args.nonce, args.size));
    },
  })
  .strict()
  .demandCommand().argv;
