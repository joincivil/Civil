"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0xproject/utils");
var ethereumjs_util_1 = require("ethereumjs-util");
var fs = require("fs");
var istanbul_1 = require("istanbul");
var _ = require("lodash");
var loglevel_1 = require("loglevel");
var mkdirp = require("mkdirp");
var constants_1 = require("./constants");
var source_maps_1 = require("./source_maps");
var utils_2 = require("./utils");
var mkdirpAsync = utils_1.promisify(mkdirp);
/**
 * TraceCollector is used by CoverageSubprovider to compute code coverage based on collected trace data.
 */
var TraceCollector = /** @class */ (function () {
    /**
     * Instantiates a TraceCollector instance
     * @param artifactAdapter Adapter for used artifacts format (0x, truffle, giveth, etc.)
     * @param isVerbose If true, we will log any unknown transactions. Otherwise we will ignore them
     * @param singleFileSubtraceHandler A handler function for computing partial coverage for a single file & subtrace
     */
    function TraceCollector(artifactAdapter, isVerbose, singleFileSubtraceHandler) {
        this._collector = new istanbul_1.Collector();
        this._artifactAdapter = artifactAdapter;
        this._logger = loglevel_1.getLogger('sol-cov');
        this._logger.setLevel(isVerbose ? loglevel_1.levels.TRACE : loglevel_1.levels.ERROR);
        this._singleFileSubtraceHandler = singleFileSubtraceHandler;
    }
    TraceCollector.prototype.writeOutputAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var finalCoverage, stringifiedCoverage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        finalCoverage = this._collector.getFinalCoverage();
                        stringifiedCoverage = JSON.stringify(finalCoverage, null, '\t');
                        return [4 /*yield*/, mkdirpAsync('coverage')];
                    case 1:
                        _a.sent();
                        fs.writeFileSync('coverage/coverage.json', stringifiedCoverage);
                        return [2 /*return*/];
                }
            });
        });
    };
    TraceCollector.prototype.computeSingleTraceCoverageAsync = function (traceInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, isContractCreation, bytecode, contractData, errMsg, bytecodeHex, sourceMap, pcToSourceRange, fileIndex, singleFileCoverageForTrace;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!_.isUndefined(this._contractsData)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this._artifactAdapter.collectContractsDataAsync()];
                    case 1:
                        _a._contractsData = _b.sent();
                        _b.label = 2;
                    case 2:
                        isContractCreation = traceInfo.address === constants_1.constants.NEW_CONTRACT;
                        bytecode = isContractCreation
                            ? traceInfo.bytecode
                            : traceInfo.runtimeBytecode;
                        contractData = utils_2.utils.getContractDataIfExists(this._contractsData, bytecode);
                        if (_.isUndefined(contractData)) {
                            errMsg = isContractCreation
                                ? "Unknown contract creation transaction"
                                : "Transaction to an unknown address: " + traceInfo.address;
                            this._logger.warn(errMsg);
                            return [2 /*return*/];
                        }
                        bytecodeHex = ethereumjs_util_1.stripHexPrefix(bytecode);
                        sourceMap = isContractCreation ? contractData.sourceMap : contractData.sourceMapRuntime;
                        pcToSourceRange = source_maps_1.parseSourceMap(contractData.sourceCodes, sourceMap, bytecodeHex, contractData.sources);
                        for (fileIndex = 0; fileIndex < contractData.sources.length; fileIndex++) {
                            singleFileCoverageForTrace = this._singleFileSubtraceHandler(contractData, traceInfo.subtrace, pcToSourceRange, fileIndex);
                            this._collector.add(singleFileCoverageForTrace);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return TraceCollector;
}());
exports.TraceCollector = TraceCollector;
//# sourceMappingURL=trace_collector.js.map