"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var fs = require("fs");
var _ = require("lodash");
require("mocha");
var path = require("path");
var collect_coverage_entries_1 = require("../src/collect_coverage_entries");
var utils_1 = require("../src/utils");
var expect = chai.expect;
describe('Collect coverage entries', function () {
    describe('#collectCoverageEntries', function () {
        it('correctly collects coverage entries for Simplest contract', function () {
            var simplestContractBaseName = 'Simplest.sol';
            var simplestContractFileName = path.resolve(__dirname, 'fixtures/contracts', simplestContractBaseName);
            var simplestContract = fs.readFileSync(simplestContractFileName).toString();
            var coverageEntries = collect_coverage_entries_1.collectCoverageEntries(simplestContract);
            expect(coverageEntries.fnMap).to.be.deep.equal({});
            expect(coverageEntries.branchMap).to.be.deep.equal({});
            expect(coverageEntries.statementMap).to.be.deep.equal({});
            expect(coverageEntries.modifiersStatementIds).to.be.deep.equal([]);
        });
        it('correctly collects coverage entries for SimpleStorage contract', function () {
            var simpleStorageContractBaseName = 'SimpleStorage.sol';
            var simpleStorageContractFileName = path.resolve(__dirname, 'fixtures/contracts', simpleStorageContractBaseName);
            var simpleStorageContract = fs.readFileSync(simpleStorageContractFileName).toString();
            var coverageEntries = collect_coverage_entries_1.collectCoverageEntries(simpleStorageContract);
            var fnIds = _.keys(coverageEntries.fnMap);
            expect(coverageEntries.fnMap[fnIds[0]].name).to.be.equal('set');
            // tslint:disable-next-line:custom-no-magic-numbers
            expect(coverageEntries.fnMap[fnIds[0]].line).to.be.equal(5);
            var setFunction = "function set(uint x) {\n        storedData = x;\n    }";
            expect(utils_1.utils.getRange(simpleStorageContract, coverageEntries.fnMap[fnIds[0]].loc)).to.be.equal(setFunction);
            expect(coverageEntries.fnMap[fnIds[1]].name).to.be.equal('get');
            // tslint:disable-next-line:custom-no-magic-numbers
            expect(coverageEntries.fnMap[fnIds[1]].line).to.be.equal(8);
            var getFunction = "function get() constant returns (uint retVal) {\n        return storedData;\n    }";
            expect(utils_1.utils.getRange(simpleStorageContract, coverageEntries.fnMap[fnIds[1]].loc)).to.be.equal(getFunction);
            expect(coverageEntries.branchMap).to.be.deep.equal({});
            var statementIds = _.keys(coverageEntries.statementMap);
            expect(utils_1.utils.getRange(simpleStorageContract, coverageEntries.statementMap[statementIds[1]])).to.be.equal('storedData = x');
            expect(utils_1.utils.getRange(simpleStorageContract, coverageEntries.statementMap[statementIds[3]])).to.be.equal('return storedData;');
            expect(coverageEntries.modifiersStatementIds).to.be.deep.equal([]);
        });
        it('correctly collects coverage entries for AllSolidityFeatures contract', function () {
            var simpleStorageContractBaseName = 'AllSolidityFeatures.sol';
            var simpleStorageContractFileName = path.resolve(__dirname, 'fixtures/contracts', simpleStorageContractBaseName);
            var simpleStorageContract = fs.readFileSync(simpleStorageContractFileName).toString();
            var coverageEntries = collect_coverage_entries_1.collectCoverageEntries(simpleStorageContract);
            var fnDescriptions = _.values(coverageEntries.fnMap);
            var fnNames = _.map(fnDescriptions, function (fnDescription) { return fnDescription.name; });
            var expectedFnNames = [
                'f',
                'c',
                'test',
                'getChoice',
                'Base',
                'Derived',
                'f',
                'f',
                '',
                'g',
                'setData',
                'getData',
                'sendHalf',
                'insert',
                'remove',
                'contains',
                'iterate_start',
                'iterate_valid',
                'iterate_advance',
                'iterate_get',
                'insert',
                'sum',
                'restricted',
                'DualIndex',
                'set',
                'transfer_ownership',
                'lookup',
                '',
                '',
                'sum',
                'someFunction',
                'fun',
                'at',
                'test',
                'get',
                'returnNumber',
                'alloc',
                'ham',
                'getMyTuple',
                'ham',
                'abstain',
                'foobar',
                'foobar',
                'a',
            ];
            expect(fnNames).to.be.deep.equal(expectedFnNames);
            var branchDescriptions = _.values(coverageEntries.branchMap);
            var branchLines = _.map(branchDescriptions, function (branchDescription) { return branchDescription.line; });
            // tslint:disable-next-line:custom-no-magic-numbers
            expect(branchLines).to.be.deep.equal([94, 115, 119, 130, 151, 187]);
            var branchTypes = _.map(branchDescriptions, function (branchDescription) { return branchDescription.type; });
            expect(branchTypes).to.be.deep.equal(['if', 'if', 'if', 'if', 'binary-expr', 'if']);
        });
        it('correctly ignores all coverage entries for Ignore contract', function () {
            var solcovIgnoreContractBaseName = 'SolcovIgnore.sol';
            var solcovIgnoreContractFileName = path.resolve(__dirname, 'fixtures/contracts', solcovIgnoreContractBaseName);
            var solcovIgnoreContract = fs.readFileSync(solcovIgnoreContractFileName).toString();
            var coverageEntries = collect_coverage_entries_1.collectCoverageEntries(solcovIgnoreContract);
            var fnIds = _.keys(coverageEntries.fnMap);
            expect(fnIds.length).to.be.equal(1);
            expect(coverageEntries.fnMap[fnIds[0]].name).to.be.equal('set');
            // tslint:disable-next-line:custom-no-magic-numbers
            expect(coverageEntries.fnMap[fnIds[0]].line).to.be.equal(6);
            var setFunction = "function set(uint x) public {\n        /* solcov ignore next */\n        storedData = x;\n    }";
            expect(utils_1.utils.getRange(solcovIgnoreContract, coverageEntries.fnMap[fnIds[0]].loc)).to.be.equal(setFunction);
            expect(coverageEntries.branchMap).to.be.deep.equal({});
            var statementIds = _.keys(coverageEntries.statementMap);
            expect(utils_1.utils.getRange(solcovIgnoreContract, coverageEntries.statementMap[statementIds[0]])).to.be.equal(setFunction);
            expect(statementIds.length).to.be.equal(1);
            expect(coverageEntries.modifiersStatementIds.length).to.be.equal(0);
        });
    });
});
//# sourceMappingURL=collect_coverage_entries_test.js.map