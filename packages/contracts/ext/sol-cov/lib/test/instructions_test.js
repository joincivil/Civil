"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
require("mocha");
var constants_1 = require("../src/constants");
var instructions_1 = require("../src/instructions");
var expect = chai.expect;
describe('instructions', function () {
    describe('#getPcToInstructionIndexMapping', function () {
        it('correctly maps pcs to instruction indexed', function () {
            // tslint:disable-next-line:custom-no-magic-numbers
            var bytecode = new Uint8Array([constants_1.constants.PUSH1, 42, constants_1.constants.PUSH2, 1, 2, constants_1.constants.TIMESTAMP]);
            var pcToInstruction = instructions_1.getPcToInstructionIndexMapping(bytecode);
            var expectedPcToInstruction = { '0': 0, '2': 1, '5': 2 };
            expect(pcToInstruction).to.be.deep.equal(expectedPcToInstruction);
        });
    });
});
//# sourceMappingURL=instructions_test.js.map