"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dev_utils_1 = require("@0xproject/dev-utils");
var providerConfigs = { shouldUseInProcessGanache: true };
var provider = dev_utils_1.web3Factory.getRpcProvider(providerConfigs);
exports.provider = provider;
//# sourceMappingURL=provider.js.map