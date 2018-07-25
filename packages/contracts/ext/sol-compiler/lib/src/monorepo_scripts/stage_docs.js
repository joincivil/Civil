"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monorepo_scripts_1 = require("@0xproject/monorepo-scripts");
var packageJSON = require("../package.json");
var tsConfigJSON = require("../tsconfig.json");
var cwd = __dirname + "/..";
// tslint:disable-next-line:no-floating-promises
monorepo_scripts_1.postpublishUtils.publishDocsToStagingAsync(packageJSON, tsConfigJSON, cwd);
//# sourceMappingURL=stage_docs.js.map