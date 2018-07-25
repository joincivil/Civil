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
var _ = require("lodash");
var constants_1 = require("./constants");
var trace_1 = require("./trace");
var trace_collection_subprovider_1 = require("./trace_collection_subprovider");
// TraceInfoSubprovider is extended by subproviders which need to work with one
// TraceInfo at a time. It has one abstract method: _handleTraceInfoAsync, which
// is called for each TraceInfo.
var TraceInfoSubprovider = /** @class */ (function (_super) {
    __extends(TraceInfoSubprovider, _super);
    function TraceInfoSubprovider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TraceInfoSubprovider.prototype._recordTxTraceAsync = function (address, data, txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var trace, tracesByContractAddress, subcallAddresses, subcallAddresses_1, subcallAddresses_1_1, subcallAddress, traceInfo, traceForThatSubcall, runtimeBytecode, traceForThatSubcall, e_1_1, subcallAddresses_2, subcallAddresses_2_1, subcallAddress, runtimeBytecode, traceForThatSubcall, traceInfo, e_2_1, e_1, _a, e_2, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._web3Wrapper.awaitTransactionMinedAsync(txHash, 0)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, this._web3Wrapper.getTransactionTraceAsync(txHash, {
                                disableMemory: true,
                                disableStack: false,
                                disableStorage: true,
                            })];
                    case 2:
                        trace = _c.sent();
                        tracesByContractAddress = trace_1.getTracesByContractAddress(trace.structLogs, address);
                        subcallAddresses = _.keys(tracesByContractAddress);
                        if (!(address === constants_1.constants.NEW_CONTRACT)) return [3 /*break*/, 14];
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 11, 12, 13]);
                        subcallAddresses_1 = __values(subcallAddresses), subcallAddresses_1_1 = subcallAddresses_1.next();
                        _c.label = 4;
                    case 4:
                        if (!!subcallAddresses_1_1.done) return [3 /*break*/, 10];
                        subcallAddress = subcallAddresses_1_1.value;
                        traceInfo = void 0;
                        if (!(subcallAddress === 'NEW_CONTRACT')) return [3 /*break*/, 5];
                        traceForThatSubcall = tracesByContractAddress[subcallAddress];
                        traceInfo = {
                            subtrace: traceForThatSubcall,
                            txHash: txHash,
                            address: subcallAddress,
                            bytecode: data,
                        };
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this._web3Wrapper.getContractCodeAsync(subcallAddress)];
                    case 6:
                        runtimeBytecode = _c.sent();
                        traceForThatSubcall = tracesByContractAddress[subcallAddress];
                        traceInfo = {
                            subtrace: traceForThatSubcall,
                            txHash: txHash,
                            address: subcallAddress,
                            runtimeBytecode: runtimeBytecode,
                        };
                        _c.label = 7;
                    case 7: return [4 /*yield*/, this._handleTraceInfoAsync(traceInfo)];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9:
                        subcallAddresses_1_1 = subcallAddresses_1.next();
                        return [3 /*break*/, 4];
                    case 10: return [3 /*break*/, 13];
                    case 11:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 12:
                        try {
                            if (subcallAddresses_1_1 && !subcallAddresses_1_1.done && (_a = subcallAddresses_1.return)) _a.call(subcallAddresses_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 13: return [3 /*break*/, 22];
                    case 14:
                        _c.trys.push([14, 20, 21, 22]);
                        subcallAddresses_2 = __values(subcallAddresses), subcallAddresses_2_1 = subcallAddresses_2.next();
                        _c.label = 15;
                    case 15:
                        if (!!subcallAddresses_2_1.done) return [3 /*break*/, 19];
                        subcallAddress = subcallAddresses_2_1.value;
                        return [4 /*yield*/, this._web3Wrapper.getContractCodeAsync(subcallAddress)];
                    case 16:
                        runtimeBytecode = _c.sent();
                        traceForThatSubcall = tracesByContractAddress[subcallAddress];
                        traceInfo = {
                            subtrace: traceForThatSubcall,
                            txHash: txHash,
                            address: subcallAddress,
                            runtimeBytecode: runtimeBytecode,
                        };
                        return [4 /*yield*/, this._handleTraceInfoAsync(traceInfo)];
                    case 17:
                        _c.sent();
                        _c.label = 18;
                    case 18:
                        subcallAddresses_2_1 = subcallAddresses_2.next();
                        return [3 /*break*/, 15];
                    case 19: return [3 /*break*/, 22];
                    case 20:
                        e_2_1 = _c.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 22];
                    case 21:
                        try {
                            if (subcallAddresses_2_1 && !subcallAddresses_2_1.done && (_b = subcallAddresses_2.return)) _b.call(subcallAddresses_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    return TraceInfoSubprovider;
}(trace_collection_subprovider_1.TraceCollectionSubprovider));
exports.TraceInfoSubprovider = TraceInfoSubprovider;
//# sourceMappingURL=trace_info_subprovider.js.map