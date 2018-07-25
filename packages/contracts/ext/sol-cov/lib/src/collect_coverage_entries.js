"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethUtil = require("ethereumjs-util");
var _ = require("lodash");
var parser = require("solidity-parser-antlr");
var ast_visitor_1 = require("./ast_visitor");
var source_maps_1 = require("./source_maps");
var IGNORE_RE = /\/\*\s*solcov\s+ignore\s+next\s*\*\/\s*/gm;
// Parsing source code for each transaction/code is slow and therefore we cache it
var coverageEntriesBySourceHash = {};
exports.collectCoverageEntries = function (contractSource) {
    var sourceHash = ethUtil.sha3(contractSource).toString('hex');
    if (_.isUndefined(coverageEntriesBySourceHash[sourceHash]) && !_.isUndefined(contractSource)) {
        var ast = parser.parse(contractSource, { range: true });
        var locationByOffset = source_maps_1.getLocationByOffset(contractSource);
        var ignoreRangesBegingingAt = gatherRangesToIgnore(contractSource);
        var visitor = new ast_visitor_1.ASTVisitor(locationByOffset, ignoreRangesBegingingAt);
        parser.visit(ast, visitor);
        coverageEntriesBySourceHash[sourceHash] = visitor.getCollectedCoverageEntries();
    }
    var coverageEntriesDescription = coverageEntriesBySourceHash[sourceHash];
    return coverageEntriesDescription;
};
// Gather the start index of all code blocks preceeded by "/* solcov ignore next */"
function gatherRangesToIgnore(contractSource) {
    var ignoreRangesStart = [];
    var match;
    do {
        match = IGNORE_RE.exec(contractSource);
        if (match) {
            var matchLen = match[0].length;
            ignoreRangesStart.push(match.index + matchLen);
        }
    } while (match);
    return ignoreRangesStart;
}
//# sourceMappingURL=collect_coverage_entries.js.map