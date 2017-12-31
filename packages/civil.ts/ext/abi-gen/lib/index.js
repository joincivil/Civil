#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var fs = require("fs");
var glob_1 = require("glob");
var Handlebars = require("handlebars");
var _ = require("lodash");
var mkdirp = require("mkdirp");
var yargs = require("yargs");
var toSnakeCase = require("to-snake-case");
var types_1 = require("./types");
var utils_1 = require("./utils");
var ABI_TYPE_METHOD = 'function';
var ABI_TYPE_EVENT = 'event';
var MAIN_TEMPLATE_NAME = 'contract.mustache';
var args = yargs
    .option('abiGlob', {
    describe: 'Glob pattern to search for ABI JSON files',
    type: 'string',
    demand: true,
})
    .option('templates', {
    describe: 'Folder where to search for templates',
    type: 'string',
    demand: true,
})
    .option('output', {
    describe: 'Folder where to put the output files',
    type: 'string',
    demand: true,
})
    .argv;
function writeOutputFile(name, renderedTsCode) {
    var fileName = toSnakeCase(name);
    var filePath = args.output + "/" + fileName + ".ts";
    fs.writeFileSync(filePath, renderedTsCode);
    utils_1.utils.log("Created: " + chalk_1.default.bold(filePath));
}
Handlebars.registerHelper('parameterType', utils_1.utils.solTypeToTsType.bind(utils_1.utils, types_1.ParamKind.Input));
Handlebars.registerHelper('returnType', utils_1.utils.solTypeToTsType.bind(utils_1.utils, types_1.ParamKind.Output));
var partialTemplateFileNames = glob_1.sync(args.templates + "/partials/**/*.mustache");
for (var _i = 0, partialTemplateFileNames_1 = partialTemplateFileNames; _i < partialTemplateFileNames_1.length; _i++) {
    var partialTemplateFileName = partialTemplateFileNames_1[_i];
    var namedContent = utils_1.utils.getNamedContent(partialTemplateFileName);
    Handlebars.registerPartial(namedContent.name, namedContent.content);
}
var mainTemplate = utils_1.utils.getNamedContent(args.templates + "/" + MAIN_TEMPLATE_NAME);
var template = Handlebars.compile(mainTemplate.content);
var abiFileNames = glob_1.sync(args.abiGlob);
if (_.isEmpty(abiFileNames)) {
    utils_1.utils.log("" + chalk_1.default.red("No ABI files found."));
    utils_1.utils.log("Please make sure you've passed the correct folder name and that the files have\n               " + chalk_1.default.bold('*.json') + " extensions");
    process.exit(1);
}
else {
    utils_1.utils.log("Found " + chalk_1.default.green("" + abiFileNames.length) + " " + chalk_1.default.bold('ABI') + " files");
    mkdirp.sync(args.output);
}
for (var _a = 0, abiFileNames_1 = abiFileNames; _a < abiFileNames_1.length; _a++) {
    var abiFileName = abiFileNames_1[_a];
    var namedContent = utils_1.utils.getNamedContent(abiFileName);
    utils_1.utils.log("Processing: " + chalk_1.default.bold(namedContent.name) + "...");
    var parsedContent = JSON.parse(namedContent.content);
    var ABI = _.isArray(parsedContent) ?
        parsedContent : // ABI file
        parsedContent.abi; // Truffle contracts file
    if (_.isUndefined(ABI)) {
        utils_1.utils.log("" + chalk_1.default.red("ABI not found in " + abiFileName + "."));
        utils_1.utils.log("Please make sure your ABI file is either an array with ABI entries or an object with the abi key");
        process.exit(1);
    }
    var methodAbis = ABI.filter(function (abi) { return abi.type === ABI_TYPE_METHOD; });
    var methodsData = _.map(methodAbis, function (methodAbi) {
        _.map(methodAbi.inputs, function (input) {
            if (_.isEmpty(input.name)) {
                // Auto-generated getters don't have parameter names
                input.name = 'index';
            }
        });
        // This will make templates simpler
        var methodData = __assign({}, methodAbi, { singleReturnValue: methodAbi.outputs.length === 1 });
        return methodData;
    });
    var eventAbis = ABI.filter(function (abi) { return abi.type === ABI_TYPE_EVENT; });
    var contextData = {
        contractName: namedContent.name,
        methods: methodsData,
        events: eventAbis,
    };
    var renderedTsCode = template(contextData);
    writeOutputFile(namedContent.name, renderedTsCode);
}
//# sourceMappingURL=index.js.map