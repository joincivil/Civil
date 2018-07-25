"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var collect_coverage_entries_1 = require("./collect_coverage_entries");
var trace_collector_1 = require("./trace_collector");
var trace_info_subprovider_1 = require("./trace_info_subprovider");
var utils_1 = require("./utils");
/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine) subprovider interface.
 * It's used to compute your code coverage while running solidity tests.
 */
var CoverageSubprovider = /** @class */ (function (_super) {
    __extends(CoverageSubprovider, _super);
    /**
     * Instantiates a CoverageSubprovider instance
     * @param artifactAdapter Adapter for used artifacts format (0x, truffle, giveth, etc.)
     * @param defaultFromAddress default from address to use when sending transactions
     * @param isVerbose If true, we will log any unknown transactions. Otherwise we will ignore them
     */
    function CoverageSubprovider(artifactAdapter, defaultFromAddress, isVerbose) {
        if (isVerbose === void 0) { isVerbose = true; }
        var _this = this;
        var traceCollectionSubproviderConfig = {
            shouldCollectTransactionTraces: true,
            shouldCollectGasEstimateTraces: true,
            shouldCollectCallTraces: true,
        };
        _this = _super.call(this, defaultFromAddress, traceCollectionSubproviderConfig) || this;
        _this._coverageCollector = new trace_collector_1.TraceCollector(artifactAdapter, isVerbose, exports.coverageHandler);
        return _this;
    }
    CoverageSubprovider.prototype._handleTraceInfoAsync = function (traceInfo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._coverageCollector.computeSingleTraceCoverageAsync(traceInfo)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Write the test coverage results to a file in Istanbul format.
     */
    CoverageSubprovider.prototype.writeCoverageAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._coverageCollector.writeOutputAsync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CoverageSubprovider;
}(trace_info_subprovider_1.TraceInfoSubprovider));
exports.CoverageSubprovider = CoverageSubprovider;
/**
 * Computed partial coverage for a single file & subtrace.
 * @param contractData      Contract metadata (source, srcMap, bytecode)
 * @param subtrace          A subset of a transcation/call trace that was executed within that contract
 * @param pcToSourceRange   A mapping from program counters to source ranges
 * @param fileIndex         Index of a file to compute coverage for
 * @return Partial istanbul coverage for that file & subtrace
 */
exports.coverageHandler = function (contractData, subtrace, pcToSourceRange, fileIndex) {
    var absoluteFileName = contractData.sources[fileIndex];
    var coverageEntriesDescription = collect_coverage_entries_1.collectCoverageEntries(contractData.sourceCodes[fileIndex]);
    // if the source wasn't provided for the fileIndex, we can't cover the file
    if (_.isUndefined(coverageEntriesDescription)) {
        return {};
    }
    var sourceRanges = _.map(subtrace, function (structLog) { return pcToSourceRange[structLog.pc]; });
    sourceRanges = _.compact(sourceRanges); // Some PC's don't map to a source range and we just ignore them.
    // By default lodash does a shallow object comparasion. We JSON.stringify them and compare as strings.
    sourceRanges = _.uniqBy(sourceRanges, function (s) { return JSON.stringify(s); }); // We don't care if one PC was covered multiple times within a single transaction
    sourceRanges = _.filter(sourceRanges, function (sourceRange) { return sourceRange.fileName === absoluteFileName; });
    var branchCoverage = {};
    var branchIds = _.keys(coverageEntriesDescription.branchMap);
    try {
        for (var branchIds_1 = __values(branchIds), branchIds_1_1 = branchIds_1.next(); !branchIds_1_1.done; branchIds_1_1 = branchIds_1.next()) {
            var branchId = branchIds_1_1.value;
            var branchDescription = coverageEntriesDescription.branchMap[branchId];
            var isBranchCoveredByBranchIndex = _.map(branchDescription.locations, function (location) {
                var isBranchCovered = _.some(sourceRanges, function (range) { return utils_1.utils.isRangeInside(range.location, location); });
                var timesBranchCovered = Number(isBranchCovered);
                return timesBranchCovered;
            });
            branchCoverage[branchId] = isBranchCoveredByBranchIndex;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (branchIds_1_1 && !branchIds_1_1.done && (_a = branchIds_1.return)) _a.call(branchIds_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var statementCoverage = {};
    var statementIds = _.keys(coverageEntriesDescription.statementMap);
    var _loop_1 = function (statementId) {
        var statementDescription = coverageEntriesDescription.statementMap[statementId];
        var isStatementCovered = _.some(sourceRanges, function (range) {
            return utils_1.utils.isRangeInside(range.location, statementDescription);
        });
        var timesStatementCovered = Number(isStatementCovered);
        statementCoverage[statementId] = timesStatementCovered;
    };
    try {
        for (var statementIds_1 = __values(statementIds), statementIds_1_1 = statementIds_1.next(); !statementIds_1_1.done; statementIds_1_1 = statementIds_1.next()) {
            var statementId = statementIds_1_1.value;
            _loop_1(statementId);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (statementIds_1_1 && !statementIds_1_1.done && (_b = statementIds_1.return)) _b.call(statementIds_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    var functionCoverage = {};
    var functionIds = _.keys(coverageEntriesDescription.fnMap);
    var _loop_2 = function (fnId) {
        var functionDescription = coverageEntriesDescription.fnMap[fnId];
        var isFunctionCovered = _.some(sourceRanges, function (range) {
            return utils_1.utils.isRangeInside(range.location, functionDescription.loc);
        });
        var timesFunctionCovered = Number(isFunctionCovered);
        functionCoverage[fnId] = timesFunctionCovered;
    };
    try {
        for (var functionIds_1 = __values(functionIds), functionIds_1_1 = functionIds_1.next(); !functionIds_1_1.done; functionIds_1_1 = functionIds_1.next()) {
            var fnId = functionIds_1_1.value;
            _loop_2(fnId);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (functionIds_1_1 && !functionIds_1_1.done && (_c = functionIds_1.return)) _c.call(functionIds_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    var _loop_3 = function (modifierStatementId) {
        if (statementCoverage[modifierStatementId]) {
            return "continue";
        }
        var modifierDescription = coverageEntriesDescription.statementMap[modifierStatementId];
        var enclosingFunction = _.find(coverageEntriesDescription.fnMap, function (functionDescription) {
            return utils_1.utils.isRangeInside(modifierDescription, functionDescription.loc);
        });
        var isModifierCovered = _.some(coverageEntriesDescription.statementMap, function (statementDescription, statementId) {
            var isInsideTheModifierEnclosingFunction = utils_1.utils.isRangeInside(statementDescription, enclosingFunction.loc);
            var isCovered = statementCoverage[statementId];
            return isInsideTheModifierEnclosingFunction && isCovered;
        });
        var timesModifierCovered = Number(isModifierCovered);
        statementCoverage[modifierStatementId] = timesModifierCovered;
    };
    try {
        // HACK: Solidity doesn't emit any opcodes that map back to modifiers with no args, that's why we map back to the
        // function range and check if there is any covered statement within that range.
        for (var _d = __values(coverageEntriesDescription.modifiersStatementIds), _e = _d.next(); !_e.done; _e = _d.next()) {
            var modifierStatementId = _e.value;
            _loop_3(modifierStatementId);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
        }
        finally { if (e_4) throw e_4.error; }
    }
    var partialCoverage = (_g = {},
        _g[absoluteFileName] = __assign({}, coverageEntriesDescription, { path: absoluteFileName, f: functionCoverage, s: statementCoverage, b: branchCoverage }),
        _g);
    return partialCoverage;
    var e_1, _a, e_2, _b, e_3, _c, e_4, _f, _g;
};
//# sourceMappingURL=coverage_subprovider.js.map