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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var dirtyChai = require("dirty-chai");
var _ = require("lodash");
require("mocha");
var compiler_1 = require("../src/utils/compiler");
var fs_wrapper_1 = require("../src/utils/fs_wrapper");
chai.use(dirtyChai);
var expect = chai.expect;
describe('Compiler utils', function () {
    describe('#getNormalizedErrorMessage', function () {
        it('normalizes the error message', function () {
            var errMsg = 'base/Token.sol:6:46: Warning: Unused local variable';
            var normalizedErrMsg = compiler_1.getNormalizedErrMsg(errMsg);
            expect(normalizedErrMsg).to.be.equal('Token.sol:6:46: Warning: Unused local variable');
        });
    });
    describe('#createDirIfDoesNotExistAsync', function () {
        it('creates artifacts dir', function () { return __awaiter(_this, void 0, void 0, function () {
            var artifactsDir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        artifactsDir = __dirname + "/artifacts";
                        expect(fs_wrapper_1.fsWrapper.doesPathExistSync(artifactsDir)).to.be.false();
                        return [4 /*yield*/, compiler_1.createDirIfDoesNotExistAsync(artifactsDir)];
                    case 1:
                        _a.sent();
                        expect(fs_wrapper_1.fsWrapper.doesPathExistSync(artifactsDir)).to.be.true();
                        fs_wrapper_1.fsWrapper.rmdirSync(artifactsDir);
                        expect(fs_wrapper_1.fsWrapper.doesPathExistSync(artifactsDir)).to.be.false();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#parseSolidityVersionRange', function () {
        it('correctly parses the version range', function () {
            expect(compiler_1.parseSolidityVersionRange('pragma solidity ^0.0.1;')).to.be.equal('^0.0.1');
            expect(compiler_1.parseSolidityVersionRange('\npragma solidity 0.0.1;')).to.be.equal('0.0.1');
            expect(compiler_1.parseSolidityVersionRange('pragma solidity <=1.0.1;')).to.be.equal('<=1.0.1');
            expect(compiler_1.parseSolidityVersionRange('pragma solidity   ~1.0.1;')).to.be.equal('~1.0.1');
        });
        // TODO: For now that doesn't work. This will work after we switch to a grammar-based parser
        it.skip('correctly parses the version range with comments', function () {
            expect(compiler_1.parseSolidityVersionRange('// pragma solidity ~1.0.1;\npragma solidity ~1.0.2;')).to.be.equal('~1.0.2');
        });
    });
    describe('#parseDependencies', function () {
        it('correctly parses Exchange dependencies', function () { return __awaiter(_this, void 0, void 0, function () {
            var path, source, dependencies, expectedDependencies;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = __dirname + "/fixtures/contracts/Exchange.sol";
                        return [4 /*yield*/, fs_wrapper_1.fsWrapper.readFileAsync(path, {
                                encoding: 'utf8',
                            })];
                    case 1:
                        source = _a.sent();
                        dependencies = compiler_1.parseDependencies({ source: source, path: path });
                        expectedDependencies = [
                            'zeppelin-solidity/contracts/token/ERC20/ERC20.sol',
                            'packages/sol-compiler/lib/test/fixtures/contracts/TokenTransferProxy.sol',
                            'packages/sol-compiler/lib/test/fixtures/contracts/base/SafeMath.sol',
                        ];
                        _.each(expectedDependencies, function (expectedDepdency) {
                            var foundDependency = _.find(dependencies, function (dependency) { return _.endsWith(dependency, expectedDepdency); });
                            expect(foundDependency, expectedDepdency + " not found").to.not.be.undefined();
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('correctly parses TokenTransferProxy dependencies', function () { return __awaiter(_this, void 0, void 0, function () {
            var path, source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = __dirname + "/fixtures/contracts/TokenTransferProxy.sol";
                        return [4 /*yield*/, fs_wrapper_1.fsWrapper.readFileAsync(path, {
                                encoding: 'utf8',
                            })];
                    case 1:
                        source = _a.sent();
                        expect(compiler_1.parseDependencies({ source: source, path: path })).to.be.deep.equal([
                            'zeppelin-solidity/contracts/ownership/Ownable.sol',
                            'zeppelin-solidity/contracts/token/ERC20/ERC20.sol',
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        // TODO: For now that doesn't work. This will work after we switch to a grammar-based parser
        it.skip('correctly parses commented out dependencies', function () { return __awaiter(_this, void 0, void 0, function () {
            var path, source;
            return __generator(this, function (_a) {
                path = '';
                source = "// import \"./TokenTransferProxy.sol\";";
                expect(compiler_1.parseDependencies({ path: path, source: source })).to.be.deep.equal([]);
                return [2 /*return*/];
            });
        }); });
    });
});
//# sourceMappingURL=compiler_utils_test.js.map