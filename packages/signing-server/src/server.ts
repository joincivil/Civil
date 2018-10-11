#!/usr/bin/env node
import yargs = require("yargs");
import { isValidAddress, toBuffer } from "ethereumjs-util";
import * as Koa from "koa";
import * as logger from "koa-logger";
import * as route from "koa-route";
import { ActionSigner } from "./lib/actionsigner";
import BN = require("bn.js");

const args = yargs
  .env("SIGNING_SERVER")
  .option("port", {
    alias: "p",
    describe: "server port to listen to",
    requiresArg: true,
    default: "8080",
  })
  .option("mnemonic", {
    alias: "m",
    describe: "mnemonic to generate private key",
    requiresArg: true,
    demandOption: true,
    coerce: mnemonic => ActionSigner.fromMnemonic(mnemonic),
  })
  .strict().argv;

const port = Number.parseInt(args.port, 10);
const actionSigner = args.mnemonic as ActionSigner;

const app = new Koa();

app.use(logger());

app.use(
  route.get("/union/:userGroup/:groupA/:groupB", async (ctx, userGroup, groupA, groupB) => {
    if (!isValidAddress(userGroup) || !isValidAddress(groupA) || !isValidAddress(groupB)) {
      throw new Error("Invalid address");
    }
    ctx.body = actionSigner.signUnion(toBuffer(userGroup), toBuffer(groupA), toBuffer(groupB));
  }),
);
app.use(
  route.get("/groupSize/:userGroup/:nonce/:size", async (ctx, userGroup, nonce, size) => {
    if (!isValidAddress(userGroup)) {
      throw new Error("Invalid address");
    }
    ctx.body = actionSigner.signMaxGroupSize(toBuffer(userGroup), new BN(nonce), new BN(size));
  }),
);

app.listen(port);
console.log(`Listening on port ${port}`);
