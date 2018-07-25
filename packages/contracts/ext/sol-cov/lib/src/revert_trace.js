"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0xproject/utils");
var ethereum_types_1 = require("ethereum-types");
var _ = require("lodash");
var utils_2 = require("./utils");
function getRevertTrace(structLogs, startAddress) {
    var evmCallStack = [];
    var addressStack = [startAddress];
    if (_.isEmpty(structLogs)) {
        return [];
    }
    var normalizedStructLogs = utils_2.utils.normalizeStructLogs(structLogs);
    // tslint:disable-next-line:prefer-for-of
    for (var i = 0; i < normalizedStructLogs.length; i++) {
        var structLog = normalizedStructLogs[i];
        if (structLog.depth !== addressStack.length - 1) {
            throw new Error("Malformed trace. Trace depth doesn't match call stack depth");
        }
        // After that check we have a guarantee that call stack is never empty
        // If it would: callStack.length - 1 === structLog.depth === -1
        // That means that we can always safely pop from it
        if (utils_2.utils.isCallLike(structLog.op)) {
            var currentAddress = _.last(addressStack);
            var jumpAddressOffset = 1;
            var newAddress = utils_2.utils.getAddressFromStackEntry(structLog.stack[structLog.stack.length - jumpAddressOffset - 1]);
            // Sometimes calls don't change the execution context (current address). When we do a transfer to an
            // externally owned account - it does the call and immediately returns because there is no fallback
            // function. We manually check if the call depth had changed to handle that case.
            var nextStructLog = normalizedStructLogs[i + 1];
            if (nextStructLog.depth !== structLog.depth) {
                addressStack.push(newAddress);
                evmCallStack.push({
                    address: currentAddress,
                    structLog: structLog,
                });
            }
        }
        else if (utils_2.utils.isEndOpcode(structLog.op) && structLog.op !== ethereum_types_1.OpCode.Revert) {
            // Just like with calls, sometimes returns/stops don't change the execution context (current address).
            var nextStructLog = normalizedStructLogs[i + 1];
            if (_.isUndefined(nextStructLog) || nextStructLog.depth !== structLog.depth) {
                evmCallStack.pop();
                addressStack.pop();
            }
            if (structLog.op === ethereum_types_1.OpCode.SelfDestruct) {
                // After contract execution, we look at all sub-calls to external contracts, and for each one, fetch
                // the bytecode and compute the coverage for the call. If the contract is destroyed with a call
                // to `selfdestruct`, we are unable to fetch it's bytecode and compute coverage.
                // TODO: Refactor this logic to fetch the sub-called contract bytecode before the selfdestruct is called
                // in order to handle this edge-case.
                utils_1.logUtils.warn("Detected a selfdestruct. Sol-cov currently doesn't support that scenario. We'll just skip the trace part for a destructed contract");
            }
        }
        else if (structLog.op === ethereum_types_1.OpCode.Revert) {
            evmCallStack.push({
                address: _.last(addressStack),
                structLog: structLog,
            });
            return evmCallStack;
        }
        else if (structLog.op === ethereum_types_1.OpCode.Create) {
            // TODO: Extract the new contract address from the stack and handle that scenario
            utils_1.logUtils.warn("Detected a contract created from within another contract. Sol-cov currently doesn't support that scenario. We'll just skip that trace");
            return [];
        }
        else {
            if (structLog !== _.last(normalizedStructLogs)) {
                var nextStructLog = normalizedStructLogs[i + 1];
                if (nextStructLog.depth === structLog.depth) {
                    continue;
                }
                else if (nextStructLog.depth === structLog.depth - 1) {
                    addressStack.pop();
                }
                else {
                    throw new Error('Malformed trace. Unexpected call depth change');
                }
            }
        }
    }
    if (evmCallStack.length !== 0) {
        utils_1.logUtils.warn('Malformed trace. Call stack non empty at the end. (probably out of gas)');
    }
    return [];
}
exports.getRevertTrace = getRevertTrace;
//# sourceMappingURL=revert_trace.js.map