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
var ethereumjs_util_1 = require("ethereumjs-util");
var _ = require("lodash");
var loglevel_1 = require("loglevel");
var constants_1 = require("./constants");
var get_source_range_snippet_1 = require("./get_source_range_snippet");
var revert_trace_1 = require("./revert_trace");
var source_maps_1 = require("./source_maps");
var trace_collection_subprovider_1 = require("./trace_collection_subprovider");
var utils_1 = require("./utils");
/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine) subprovider interface.
 * It is used to report call stack traces whenever a revert occurs.
 */
var RevertTraceSubprovider = /** @class */ (function (_super) {
    __extends(RevertTraceSubprovider, _super);
    /**
     * Instantiates a RevertTraceSubprovider instance
     * @param artifactAdapter Adapter for used artifacts format (0x, truffle, giveth, etc.)
     * @param defaultFromAddress default from address to use when sending transactions
     * @param isVerbose If true, we will log any unknown transactions. Otherwise we will ignore them
     */
    function RevertTraceSubprovider(artifactAdapter, defaultFromAddress, isVerbose) {
        if (isVerbose === void 0) { isVerbose = true; }
        var _this = this;
        var traceCollectionSubproviderConfig = {
            shouldCollectTransactionTraces: true,
            shouldCollectGasEstimateTraces: true,
            shouldCollectCallTraces: true,
        };
        _this = _super.call(this, defaultFromAddress, traceCollectionSubproviderConfig) || this;
        _this._artifactAdapter = artifactAdapter;
        _this._logger = loglevel_1.getLogger('sol-cov');
        _this._logger.setLevel(isVerbose ? loglevel_1.levels.TRACE : loglevel_1.levels.ERROR);
        return _this;
    }
    // tslint:disable-next-line:no-unused-variable
    RevertTraceSubprovider.prototype._recordTxTraceAsync = function (address, data, txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var trace, evmCallStack;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._web3Wrapper.awaitTransactionMinedAsync(txHash, 0)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._web3Wrapper.getTransactionTraceAsync(txHash, {
                                disableMemory: true,
                                disableStack: false,
                                disableStorage: true,
                            })];
                    case 2:
                        trace = _a.sent();
                        evmCallStack = revert_trace_1.getRevertTrace(trace.structLogs, address);
                        if (!(evmCallStack.length > 0)) return [3 /*break*/, 4];
                        // if getRevertTrace returns a call stack it means there was a
                        // revert.
                        return [4 /*yield*/, this._printStackTraceAsync(evmCallStack)];
                    case 3:
                        // if getRevertTrace returns a call stack it means there was a
                        // revert.
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RevertTraceSubprovider.prototype._printStackTraceAsync = function (evmCallStack) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var sourceSnippets, _a, evmCallStack_1, evmCallStack_1_1, evmCallStackEntry, isContractCreation, bytecode, contractData, errMsg, bytecodeHex, sourceMap, pcToSourceRange, sourceRange, pc, fileIndex, sourceSnippet, e_1_1, filteredSnippets, e_1, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        sourceSnippets = [];
                        if (!_.isUndefined(this._contractsData)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this._artifactAdapter.collectContractsDataAsync()];
                    case 1:
                        _a._contractsData = _c.sent();
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 7, 8, 9]);
                        evmCallStack_1 = __values(evmCallStack), evmCallStack_1_1 = evmCallStack_1.next();
                        _c.label = 3;
                    case 3:
                        if (!!evmCallStack_1_1.done) return [3 /*break*/, 6];
                        evmCallStackEntry = evmCallStack_1_1.value;
                        isContractCreation = evmCallStackEntry.address === constants_1.constants.NEW_CONTRACT;
                        if (isContractCreation) {
                            this._logger.error('Contract creation not supported');
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, this._web3Wrapper.getContractCodeAsync(evmCallStackEntry.address)];
                    case 4:
                        bytecode = _c.sent();
                        contractData = utils_1.utils.getContractDataIfExists(this._contractsData, bytecode);
                        if (_.isUndefined(contractData)) {
                            errMsg = isContractCreation
                                ? "Unknown contract creation transaction"
                                : "Transaction to an unknown address: " + evmCallStackEntry.address;
                            this._logger.warn(errMsg);
                            return [3 /*break*/, 5];
                        }
                        bytecodeHex = ethereumjs_util_1.stripHexPrefix(bytecode);
                        sourceMap = isContractCreation ? contractData.sourceMap : contractData.sourceMapRuntime;
                        pcToSourceRange = source_maps_1.parseSourceMap(contractData.sourceCodes, sourceMap, bytecodeHex, contractData.sources);
                        sourceRange = undefined;
                        pc = evmCallStackEntry.structLog.pc;
                        // Sometimes there is not a mapping for this pc (e.g. if the revert
                        // actually happens in assembly). In that case, we want to keep
                        // searching backwards by decrementing the pc until we find a
                        // mapped source range.
                        while (_.isUndefined(sourceRange) && pc > 0) {
                            sourceRange = pcToSourceRange[pc];
                            pc -= 1;
                        }
                        if (_.isUndefined(sourceRange)) {
                            this._logger.warn("could not find matching sourceRange for structLog: " + JSON.stringify(_.omit(evmCallStackEntry.structLog, 'stack')));
                            return [3 /*break*/, 5];
                        }
                        fileIndex = contractData.sources.indexOf(sourceRange.fileName);
                        sourceSnippet = get_source_range_snippet_1.getSourceRangeSnippet(sourceRange, contractData.sourceCodes[fileIndex]);
                        if (sourceSnippet !== null) {
                            sourceSnippets.push(sourceSnippet);
                        }
                        _c.label = 5;
                    case 5:
                        evmCallStack_1_1 = evmCallStack_1.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (evmCallStack_1_1 && !evmCallStack_1_1.done && (_b = evmCallStack_1.return)) _b.call(evmCallStack_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 9:
                        filteredSnippets = filterSnippets(sourceSnippets);
                        if (filteredSnippets.length > 0) {
                            this._logger.error('\n\nStack trace for REVERT:\n');
                            _.forEach(_.reverse(filteredSnippets), function (snippet) {
                                var traceString = getStackTraceString(snippet);
                                _this._logger.error(traceString);
                            });
                            this._logger.error('\n');
                        }
                        else {
                            this._logger.error('REVERT detected but could not determine stack trace');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return RevertTraceSubprovider;
}(trace_collection_subprovider_1.TraceCollectionSubprovider));
exports.RevertTraceSubprovider = RevertTraceSubprovider;
// removes duplicates and if statements
function filterSnippets(sourceSnippets) {
    if (sourceSnippets.length === 0) {
        return [];
    }
    var results = [sourceSnippets[0]];
    var prev = sourceSnippets[0];
    try {
        for (var sourceSnippets_1 = __values(sourceSnippets), sourceSnippets_1_1 = sourceSnippets_1.next(); !sourceSnippets_1_1.done; sourceSnippets_1_1 = sourceSnippets_1.next()) {
            var sourceSnippet = sourceSnippets_1_1.value;
            if (sourceSnippet.type === 'IfStatement') {
                continue;
            }
            else if (sourceSnippet.source === prev.source) {
                prev = sourceSnippet;
                continue;
            }
            results.push(sourceSnippet);
            prev = sourceSnippet;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (sourceSnippets_1_1 && !sourceSnippets_1_1.done && (_a = sourceSnippets_1.return)) _a.call(sourceSnippets_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return results;
    var e_2, _a;
}
function getStackTraceString(sourceSnippet) {
    var result = sourceSnippet.fileName + ":" + sourceSnippet.range.start.line + ":" + sourceSnippet.range.start.column;
    var snippetString = getSourceSnippetString(sourceSnippet);
    if (snippetString !== '') {
        result += ":\n        " + snippetString;
    }
    return result;
}
function getSourceSnippetString(sourceSnippet) {
    switch (sourceSnippet.type) {
        case 'ContractDefinition':
            return "contract " + sourceSnippet.name;
        case 'FunctionDefinition':
            return "function " + sourceSnippet.name;
        default:
            return "" + sourceSnippet.source;
    }
}
//# sourceMappingURL=revert_trace_subprovider.js.map