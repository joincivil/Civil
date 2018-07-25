"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var isPush = function (inst) { return inst >= constants_1.constants.PUSH1 && inst <= constants_1.constants.PUSH32; };
var pushDataLength = function (inst) { return inst - constants_1.constants.PUSH1 + 1; };
var instructionLength = function (inst) { return (isPush(inst) ? pushDataLength(inst) + 1 : 1); };
exports.getPcToInstructionIndexMapping = function (bytecode) {
    var result = {};
    var byteIndex = 0;
    var instructionIndex = 0;
    while (byteIndex < bytecode.length) {
        var instruction = bytecode[byteIndex];
        var length_1 = instructionLength(instruction);
        result[byteIndex] = instructionIndex;
        byteIndex += length_1;
        instructionIndex += 1;
    }
    return result;
};
//# sourceMappingURL=instructions.js.map