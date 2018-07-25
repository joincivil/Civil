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
var utils_1 = require("@0xproject/utils");
var ethereum_types_1 = require("ethereum-types");
var ethereumjs_util_1 = require("ethereumjs-util");
var _ = require("lodash");
// This is the minimum length of valid contract bytecode. The Solidity compiler
// metadata is 86 bytes. If you add the '0x' prefix, we get 88.
var MIN_CONTRACT_BYTECODE_LENGTH = 88;
exports.utils = {
    compareLineColumn: function (lhs, rhs) {
        return lhs.line !== rhs.line ? lhs.line - rhs.line : lhs.column - rhs.column;
    },
    removeHexPrefix: function (hex) {
        var hexPrefix = '0x';
        return hex.startsWith(hexPrefix) ? hex.slice(hexPrefix.length) : hex;
    },
    isRangeInside: function (childRange, parentRange) {
        return (exports.utils.compareLineColumn(parentRange.start, childRange.start) <= 0 &&
            exports.utils.compareLineColumn(childRange.end, parentRange.end) <= 0);
    },
    bytecodeToBytecodeRegex: function (bytecode) {
        var bytecodeRegex = bytecode
            .replace(/_.*_/, '.*')
            .replace(/.{86}$/, '')
            .replace(/^0x730000000000000000000000000000000000000000/, '0x73........................................');
        // HACK: Node regexes can't be longer that 32767 characters. Contracts bytecode can. We just truncate the regexes. It's safe in practice.
        var MAX_REGEX_LENGTH = 32767;
        var truncatedBytecodeRegex = bytecodeRegex.slice(0, MAX_REGEX_LENGTH);
        return truncatedBytecodeRegex;
    },
    getContractDataIfExists: function (contractsData, bytecode) {
        if (!bytecode.startsWith('0x')) {
            throw new Error("0x hex prefix missing: " + bytecode);
        }
        var contractData = _.find(contractsData, function (contractDataCandidate) {
            var bytecodeRegex = exports.utils.bytecodeToBytecodeRegex(contractDataCandidate.bytecode);
            // If the bytecode is less than the minimum length, we are probably
            // dealing with an interface. This isn't what we're looking for.
            if (bytecodeRegex.length < MIN_CONTRACT_BYTECODE_LENGTH) {
                return false;
            }
            var runtimeBytecodeRegex = exports.utils.bytecodeToBytecodeRegex(contractDataCandidate.runtimeBytecode);
            if (runtimeBytecodeRegex.length < MIN_CONTRACT_BYTECODE_LENGTH) {
                return false;
            }
            // We use that function to find by bytecode or runtimeBytecode. Those are quasi-random strings so
            // collisions are practically impossible and it allows us to reuse that code
            return !_.isNull(bytecode.match(bytecodeRegex)) || !_.isNull(bytecode.match(runtimeBytecodeRegex));
        });
        return contractData;
    },
    isCallLike: function (op) {
        return _.includes([ethereum_types_1.OpCode.CallCode, ethereum_types_1.OpCode.StaticCall, ethereum_types_1.OpCode.Call, ethereum_types_1.OpCode.DelegateCall], op);
    },
    isEndOpcode: function (op) {
        return _.includes([ethereum_types_1.OpCode.Return, ethereum_types_1.OpCode.Stop, ethereum_types_1.OpCode.Revert, ethereum_types_1.OpCode.Invalid, ethereum_types_1.OpCode.SelfDestruct], op);
    },
    getAddressFromStackEntry: function (stackEntry) {
        var hexBase = 16;
        return utils_1.addressUtils.padZeros(new utils_1.BigNumber(ethereumjs_util_1.addHexPrefix(stackEntry)).toString(hexBase));
    },
    normalizeStructLogs: function (structLogs) {
        if (structLogs[0].depth === 1) {
            // Geth uses 1-indexed depth counter whilst ganache starts from 0
            var newStructLogs = _.map(structLogs, function (structLog) { return (__assign({}, structLog, { depth: structLog.depth - 1 })); });
            return newStructLogs;
        }
        return structLogs;
    },
    getRange: function (sourceCode, range) {
        var lines = sourceCode.split('\n').slice(range.start.line - 1, range.end.line);
        lines[lines.length - 1] = lines[lines.length - 1].slice(0, range.end.column);
        lines[0] = lines[0].slice(range.start.column);
        return lines.join('\n');
    },
};
//# sourceMappingURL=utils.js.map