#!/usr/bin/env node
import yargs = require("yargs");
import { Civil, TwoStepEthTransaction } from "@joincivil/core";
import { infuraProvider } from "@joincivil/dev-utils";
import { isValidAddress, toBuffer } from "ethereumjs-util";
import * as http from "http";
import * as Koa from "koa";
import * as json from "koa-json";
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
  .option("host", {
    alias: "h",
    describe: "server host to bind to",
    default: "0.0.0.0",
    requiresArg: true,
  })
  .option("mnemonic", {
    alias: "m",
    describe: "mnemonic to generate private key",
    requiresArg: true,
    demandOption: true,
  })
  .option("nodeEndpoint", {
    describe: "Ethereum node url",
    requiresArg: true,
    demandOption: true,
  })
  .strict().argv;

const host = args.host;
const port = Number.parseInt(args.port, 10);
const actionSigner = ActionSigner.fromMnemonic(args.mnemonic);

const provider = infuraProvider(args.mnemonic, args.nodeEndpoint);
const civil = new Civil({ web3Provider: provider });

const app = new Koa();

app.use(logger());
app.use(json());

app.use(
  route.get("/union/:groupA/:groupB", async (ctx, groupA, groupB) => {
    if (!isValidAddress(groupA) || !isValidAddress(groupB)) {
      throw new Error("Invalid address");
    }
    // Due to interactions with core, web3 doesn't have a default account when trying to send tx
    // Ensure it's set for the first time
    await civil.accountStream.first().toPromise();
    const userGroups = await civil.userGroupsSingletonTrusted();
    const signature = actionSigner.signUnion(toBuffer(userGroups.address), toBuffer(groupA), toBuffer(groupB));
    const twoStep: TwoStepEthTransaction = await userGroups.forceUnion(groupA, groupB, signature);
    ctx.body = { txHash: twoStep.txHash };
  }),
);
app.use(
  route.get("/groupSize/:size", async (ctx, size) => {
    // Due to interactions with core, web3 doesn't have a default account when trying to send tx
    // Ensure it's set for the first time
    await civil.accountStream.first().toPromise();
    const userGroups = await civil.userGroupsSingletonTrusted();
    const nonce = await userGroups.getMaxGroupSizeUpdateNonce();
    const signature = actionSigner.signMaxGroupSize(toBuffer(userGroups.address), new BN(nonce), new BN(size));
    const twoStep: TwoStepEthTransaction = await userGroups.setMaxGroupSize(Number.parseInt(size, 10), signature);
    ctx.body = { txHash: twoStep.txHash };
  }),
);

http.createServer(app.callback()).listen(port, host);
console.log(`Listening on ${host}:${port}`);
