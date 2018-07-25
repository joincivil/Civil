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
var chai = require("chai");
var ethereum_types_1 = require("ethereum-types");
var _ = require("lodash");
require("mocha");
var trace_1 = require("../src/trace");
var expect = chai.expect;
var DEFAULT_STRUCT_LOG = {
    depth: 0,
    error: '',
    gas: 0,
    gasCost: 0,
    memory: [],
    op: ethereum_types_1.OpCode.Invalid,
    pc: 0,
    stack: [],
    storage: {},
};
function addDefaultStructLogFields(compactStructLog) {
    return __assign({}, DEFAULT_STRUCT_LOG, compactStructLog);
}
describe('Trace', function () {
    describe('#getTracesByContractAddress', function () {
        it('correctly splits trace by contract address', function () {
            var delegateCallAddress = '0x0000000000000000000000000000000000000002';
            var trace = [
                {
                    op: ethereum_types_1.OpCode.DelegateCall,
                    stack: [delegateCallAddress, '0x'],
                    depth: 0,
                },
                {
                    op: ethereum_types_1.OpCode.Return,
                    depth: 1,
                },
                {
                    op: ethereum_types_1.OpCode.Return,
                    depth: 0,
                },
            ];
            var fullTrace = _.map(trace, function (compactStructLog) { return addDefaultStructLogFields(compactStructLog); });
            var startAddress = '0x0000000000000000000000000000000000000001';
            var traceByContractAddress = trace_1.getTracesByContractAddress(fullTrace, startAddress);
            var expectedTraceByContractAddress = (_a = {},
                _a[startAddress] = [fullTrace[0], fullTrace[2]],
                _a[delegateCallAddress] = [fullTrace[1]],
                _a);
            expect(traceByContractAddress).to.be.deep.equal(expectedTraceByContractAddress);
            var _a;
        });
    });
});
//# sourceMappingURL=trace_test.js.map