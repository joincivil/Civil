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
var _ = require("lodash");
var path = require("path");
var fs_wrapper_1 = require("./fs_wrapper");
/**
 * Gets contract data on network or returns if an artifact does not exist.
 * @param artifactsDir Path to the artifacts directory.
 * @param contractName Name of contract.
 * @return Contract data on network or undefined.
 */
function getContractArtifactIfExistsAsync(artifactsDir, contractName) {
    return __awaiter(this, void 0, void 0, function () {
        var contractArtifact, currentArtifactPath, opts, contractArtifactString, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentArtifactPath = artifactsDir + "/" + contractName + ".json";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    opts = {
                        encoding: 'utf8',
                    };
                    return [4 /*yield*/, fs_wrapper_1.fsWrapper.readFileAsync(currentArtifactPath, opts)];
                case 2:
                    contractArtifactString = _a.sent();
                    contractArtifact = JSON.parse(contractArtifactString);
                    return [2 /*return*/, contractArtifact];
                case 3:
                    err_1 = _a.sent();
                    utils_1.logUtils.log("Artifact for " + contractName + " does not exist");
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getContractArtifactIfExistsAsync = getContractArtifactIfExistsAsync;
/**
 * Creates a directory if it does not already exist.
 * @param artifactsDir Path to the directory.
 */
function createDirIfDoesNotExistAsync(dirPath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!fs_wrapper_1.fsWrapper.doesPathExistSync(dirPath)) return [3 /*break*/, 2];
                    utils_1.logUtils.log("Creating directory at " + dirPath + "...");
                    return [4 /*yield*/, fs_wrapper_1.fsWrapper.mkdirpAsync(dirPath)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.createDirIfDoesNotExistAsync = createDirIfDoesNotExistAsync;
/**
 * Searches Solidity source code for compiler version range.
 * @param  source Source code of contract.
 * @return Solc compiler version range.
 */
function parseSolidityVersionRange(source) {
    var SOLIDITY_VERSION_RANGE_REGEX = /pragma\s+solidity\s+(.*);/;
    var solcVersionRangeMatch = source.match(SOLIDITY_VERSION_RANGE_REGEX);
    if (_.isNull(solcVersionRangeMatch)) {
        throw new Error('Could not find Solidity version range in source');
    }
    var solcVersionRange = solcVersionRangeMatch[1];
    return solcVersionRange;
}
exports.parseSolidityVersionRange = parseSolidityVersionRange;
/**
 * Normalizes the path found in the error message. If it cannot be normalized
 * the original error message is returned.
 * Example: converts 'base/Token.sol:6:46: Warning: Unused local variable'
 *          to 'Token.sol:6:46: Warning: Unused local variable'
 * This is used to prevent logging the same error multiple times.
 * @param  errMsg An error message from the compiled output.
 * @return The error message with directories truncated from the contract path.
 */
function getNormalizedErrMsg(errMsg) {
    var SOLIDITY_FILE_EXTENSION_REGEX = /(.*\.sol)/;
    var errPathMatch = errMsg.match(SOLIDITY_FILE_EXTENSION_REGEX);
    if (_.isNull(errPathMatch)) {
        // This can occur if solidity outputs a general warning, e.g
        // Warning: This is a pre-release compiler version, please do not use it in production.
        return errMsg;
    }
    var errPath = errPathMatch[0];
    var baseContract = path.basename(errPath);
    var normalizedErrMsg = errMsg.replace(errPath, baseContract);
    return normalizedErrMsg;
}
exports.getNormalizedErrMsg = getNormalizedErrMsg;
/**
 * Parses the contract source code and extracts the dendencies
 * @param  source Contract source code
 * @return List of dependendencies
 */
function parseDependencies(contractSource) {
    // TODO: Use a proper parser
    var source = contractSource.source;
    var IMPORT_REGEX = /(import\s)/;
    var DEPENDENCY_PATH_REGEX = /"([^"]+)"/; // Source: https://github.com/BlockChainCompany/soljitsu/blob/master/lib/shared.js
    var dependencies = [];
    var lines = source.split('\n');
    _.forEach(lines, function (line) {
        if (!_.isNull(line.match(IMPORT_REGEX))) {
            var dependencyMatch = line.match(DEPENDENCY_PATH_REGEX);
            if (!_.isNull(dependencyMatch)) {
                var dependencyPath = dependencyMatch[1];
                if (dependencyPath.startsWith('.')) {
                    dependencyPath = path.join(path.dirname(contractSource.path), dependencyPath);
                }
                dependencies.push(dependencyPath);
            }
        }
    });
    return dependencies;
}
exports.parseDependencies = parseDependencies;
//# sourceMappingURL=compiler.js.map