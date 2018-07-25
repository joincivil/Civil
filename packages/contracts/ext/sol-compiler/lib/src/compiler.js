"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("@0xproject/assert");
var sol_resolver_1 = require("@0xproject/sol-resolver");
var utils_1 = require("@0xproject/utils");
var chalk_1 = require("chalk");
var ethUtil = require("ethereumjs-util");
var fs = require("fs");
var _ = require("lodash");
var path = require("path");
var requireFromString = require("require-from-string");
var semver = require("semver");
var solc = require("solc");
var compiler_options_schema_1 = require("./schemas/compiler_options_schema");
var bin_paths_1 = require("./solc/bin_paths");
var compiler_1 = require("./utils/compiler");
var constants_1 = require("./utils/constants");
var fs_wrapper_1 = require("./utils/fs_wrapper");
var utils_2 = require("./utils/utils");
var ALL_CONTRACTS_IDENTIFIER = '*';
var ALL_FILES_IDENTIFIER = '*';
var SOLC_BIN_DIR = path.join(__dirname, '..', '..', 'solc_bin');
var DEFAULT_CONTRACTS_DIR = path.resolve('contracts');
var DEFAULT_ARTIFACTS_DIR = path.resolve('artifacts');
// Solc compiler settings cannot be configured from the commandline.
// If you need this configured, please create a `compiler.json` config file
// with your desired configurations.
var DEFAULT_COMPILER_SETTINGS = {
    optimizer: {
        enabled: false,
    },
    outputSelection: (_a = {},
        _a[ALL_FILES_IDENTIFIER] = (_b = {},
            _b[ALL_CONTRACTS_IDENTIFIER] = ['abi', 'evm.bytecode.object'],
            _b),
        _a),
};
var CONFIG_FILE = 'compiler.json';
/**
 * The Compiler facilitates compiling Solidity smart contracts and saves the results
 * to artifact files.
 */
var Compiler = /** @class */ (function () {
    /**
     * Instantiates a new instance of the Compiler class.
     * @return An instance of the Compiler class.
     */
    function Compiler(opts) {
        assert_1.assert.doesConformToSchema('opts', opts, compiler_options_schema_1.compilerOptionsSchema);
        // TODO: Look for config file in parent directories if not found in current directory
        var config = fs.existsSync(CONFIG_FILE)
            ? JSON.parse(fs.readFileSync(CONFIG_FILE).toString())
            : {};
        var passedOpts = opts || {};
        assert_1.assert.doesConformToSchema('compiler.json', config, compiler_options_schema_1.compilerOptionsSchema);
        this._contractsDir = passedOpts.contractsDir || config.contractsDir || DEFAULT_CONTRACTS_DIR;
        this._solcVersionIfExists = passedOpts.solcVersion || config.solcVersion;
        this._compilerSettings = passedOpts.compilerSettings || config.compilerSettings || DEFAULT_COMPILER_SETTINGS;
        this._artifactsDir = passedOpts.artifactsDir || config.artifactsDir || DEFAULT_ARTIFACTS_DIR;
        this._specifiedContracts = passedOpts.contracts || config.contracts || ALL_CONTRACTS_IDENTIFIER;
        this._nameResolver = new sol_resolver_1.NameResolver(path.resolve(this._contractsDir));
        var resolver = new sol_resolver_1.FallthroughResolver();
        resolver.appendResolver(new sol_resolver_1.URLResolver());
        var packagePath = path.resolve('');
        resolver.appendResolver(new sol_resolver_1.NPMResolver(packagePath));
        resolver.appendResolver(new sol_resolver_1.RelativeFSResolver(this._contractsDir));
        resolver.appendResolver(new sol_resolver_1.FSResolver());
        resolver.appendResolver(this._nameResolver);
        this._resolver = resolver;
    }
    /**
     * Compiles selected Solidity files found in `contractsDir` and writes JSON artifacts to `artifactsDir`.
     */
    Compiler.prototype.compileAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contractNamesToCompile, allContracts, contractNamesToCompile_1, contractNamesToCompile_1_1, contractNameToCompile, e_1_1, e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, compiler_1.createDirIfDoesNotExistAsync(this._artifactsDir)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, compiler_1.createDirIfDoesNotExistAsync(SOLC_BIN_DIR)];
                    case 2:
                        _b.sent();
                        contractNamesToCompile = [];
                        if (this._specifiedContracts === ALL_CONTRACTS_IDENTIFIER) {
                            allContracts = this._nameResolver.getAll();
                            contractNamesToCompile = _.map(allContracts, function (contractSource) {
                                return path.basename(contractSource.path, constants_1.constants.SOLIDITY_FILE_EXTENSION);
                            });
                        }
                        else {
                            contractNamesToCompile = this._specifiedContracts;
                        }
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 8, 9, 10]);
                        contractNamesToCompile_1 = __values(contractNamesToCompile), contractNamesToCompile_1_1 = contractNamesToCompile_1.next();
                        _b.label = 4;
                    case 4:
                        if (!!contractNamesToCompile_1_1.done) return [3 /*break*/, 7];
                        contractNameToCompile = contractNamesToCompile_1_1.value;
                        return [4 /*yield*/, this._compileContractAsync(contractNameToCompile)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        contractNamesToCompile_1_1 = contractNamesToCompile_1.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (contractNamesToCompile_1_1 && !contractNamesToCompile_1_1.done && (_a = contractNamesToCompile_1.return)) _a.call(contractNamesToCompile_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Compiles contract and saves artifact to artifactsDir.
     * @param fileName Name of contract with '.sol' extension.
     */
    Compiler.prototype._compileContractAsync = function (contractName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var contractSource, absoluteContractPath, currentArtifactIfExists, sourceTreeHashHex, shouldCompile, currentArtifact, isUserOnLatestVersion, didCompilerSettingsChange, didSourceChange, solcVersion, solcVersionRange, availableCompilerVersions, fullSolcVersion, compilerBinFilename, solcjs, isCompilerAvailableLocally, url, response, SUCCESS_STATUS, solcInstance, standardInput, compiled, SOLIDITY_WARNING_1, errors, warnings, compiledData, sourceCodes, contractVersion, newArtifact, currentArtifact, artifactString, currentArtifactPath, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        contractSource = this._resolver.resolve(contractName);
                        absoluteContractPath = path.join(this._contractsDir, contractSource.path);
                        return [4 /*yield*/, compiler_1.getContractArtifactIfExistsAsync(this._artifactsDir, contractName)];
                    case 1:
                        currentArtifactIfExists = _b.sent();
                        sourceTreeHashHex = "0x" + this._getSourceTreeHash(absoluteContractPath).toString('hex');
                        shouldCompile = false;
                        if (_.isUndefined(currentArtifactIfExists)) {
                            shouldCompile = true;
                        }
                        else {
                            currentArtifact = currentArtifactIfExists;
                            isUserOnLatestVersion = currentArtifact.schemaVersion === constants_1.constants.LATEST_ARTIFACT_VERSION;
                            didCompilerSettingsChange = !_.isEqual(currentArtifact.compiler.settings, this._compilerSettings);
                            didSourceChange = currentArtifact.sourceTreeHashHex !== sourceTreeHashHex;
                            shouldCompile = !isUserOnLatestVersion || didCompilerSettingsChange || didSourceChange;
                        }
                        if (!shouldCompile) {
                            return [2 /*return*/];
                        }
                        solcVersion = this._solcVersionIfExists;
                        if (_.isUndefined(solcVersion)) {
                            solcVersionRange = compiler_1.parseSolidityVersionRange(contractSource.source);
                            availableCompilerVersions = _.keys(bin_paths_1.binPaths);
                            solcVersion = semver.maxSatisfying(availableCompilerVersions, solcVersionRange);
                        }
                        fullSolcVersion = bin_paths_1.binPaths[solcVersion];
                        compilerBinFilename = path.join(SOLC_BIN_DIR, fullSolcVersion);
                        isCompilerAvailableLocally = fs.existsSync(compilerBinFilename);
                        if (!isCompilerAvailableLocally) return [3 /*break*/, 2];
                        solcjs = fs.readFileSync(compilerBinFilename).toString();
                        return [3 /*break*/, 5];
                    case 2:
                        utils_1.logUtils.log("Downloading " + fullSolcVersion + "...");
                        url = "" + constants_1.constants.BASE_COMPILER_URL + fullSolcVersion;
                        return [4 /*yield*/, utils_1.fetchAsync(url)];
                    case 3:
                        response = _b.sent();
                        SUCCESS_STATUS = 200;
                        if (response.status !== SUCCESS_STATUS) {
                            throw new Error("Failed to load " + fullSolcVersion);
                        }
                        return [4 /*yield*/, response.text()];
                    case 4:
                        solcjs = _b.sent();
                        fs.writeFileSync(compilerBinFilename, solcjs);
                        _b.label = 5;
                    case 5:
                        solcInstance = solc.setupMethods(requireFromString(solcjs, compilerBinFilename));
                        utils_1.logUtils.log("Compiling " + contractName + " with Solidity v" + solcVersion + "...");
                        standardInput = {
                            language: 'Solidity',
                            sources: (_a = {},
                                _a[contractSource.path] = {
                                    content: contractSource.source,
                                },
                                _a),
                            settings: this._compilerSettings,
                        };
                        compiled = JSON.parse(solcInstance.compileStandardWrapper(JSON.stringify(standardInput), function (importPath) {
                            var sourceCodeIfExists = _this._resolver.resolve(importPath);
                            return { contents: sourceCodeIfExists.source };
                        }));
                        if (!_.isUndefined(compiled.errors)) {
                            SOLIDITY_WARNING_1 = 'warning';
                            errors = _.filter(compiled.errors, function (entry) { return entry.severity !== SOLIDITY_WARNING_1; });
                            warnings = _.filter(compiled.errors, function (entry) { return entry.severity === SOLIDITY_WARNING_1; });
                            if (!_.isEmpty(errors)) {
                                errors.forEach(function (error) {
                                    var normalizedErrMsg = compiler_1.getNormalizedErrMsg(error.formattedMessage || error.message);
                                    utils_1.logUtils.log(chalk_1.default.red(normalizedErrMsg));
                                });
                                process.exit(1);
                            }
                            else {
                                warnings.forEach(function (warning) {
                                    var normalizedWarningMsg = compiler_1.getNormalizedErrMsg(warning.formattedMessage || warning.message);
                                    utils_1.logUtils.log(chalk_1.default.yellow(normalizedWarningMsg));
                                });
                            }
                        }
                        compiledData = compiled.contracts[contractSource.path][contractName];
                        if (_.isUndefined(compiledData)) {
                            throw new Error("Contract " + contractName + " not found in " + contractSource.path + ". Please make sure your contract has the same name as it's file name");
                        }
                        if (!_.isUndefined(compiledData.evm)) {
                            if (!_.isUndefined(compiledData.evm.bytecode) && !_.isUndefined(compiledData.evm.bytecode.object)) {
                                compiledData.evm.bytecode.object = ethUtil.addHexPrefix(compiledData.evm.bytecode.object);
                            }
                            if (!_.isUndefined(compiledData.evm.deployedBytecode) &&
                                !_.isUndefined(compiledData.evm.deployedBytecode.object)) {
                                compiledData.evm.deployedBytecode.object = ethUtil.addHexPrefix(compiledData.evm.deployedBytecode.object);
                            }
                        }
                        sourceCodes = _.mapValues(compiled.sources, function (_1, sourceFilePath) { return _this._resolver.resolve(sourceFilePath).source; });
                        contractVersion = {
                            compilerOutput: compiledData,
                            sources: compiled.sources,
                            sourceCodes: sourceCodes,
                            sourceTreeHashHex: sourceTreeHashHex,
                            compiler: {
                                name: 'solc',
                                version: fullSolcVersion,
                                settings: this._compilerSettings,
                            },
                        };
                        if (!_.isUndefined(currentArtifactIfExists)) {
                            currentArtifact = currentArtifactIfExists;
                            newArtifact = __assign({}, currentArtifact, contractVersion);
                        }
                        else {
                            newArtifact = __assign({ schemaVersion: constants_1.constants.LATEST_ARTIFACT_VERSION, contractName: contractName }, contractVersion, { networks: {} });
                        }
                        artifactString = utils_2.utils.stringifyWithFormatting(newArtifact);
                        currentArtifactPath = this._artifactsDir + "/" + contractName + ".json";
                        return [4 /*yield*/, fs_wrapper_1.fsWrapper.writeFileAsync(currentArtifactPath, artifactString)];
                    case 6:
                        _b.sent();
                        utils_1.logUtils.log(contractName + " artifact saved!");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the source tree hash for a file and its dependencies.
     * @param fileName Name of contract file.
     */
    Compiler.prototype._getSourceTreeHash = function (importPath) {
        var _this = this;
        var contractSource = this._resolver.resolve(importPath);
        var dependencies = compiler_1.parseDependencies(contractSource);
        var sourceHash = ethUtil.sha3(contractSource.source);
        if (dependencies.length === 0) {
            return sourceHash;
        }
        else {
            var dependencySourceTreeHashes = _.map(dependencies, function (dependency) {
                return _this._getSourceTreeHash(dependency);
            });
            var sourceTreeHashesBuffer = Buffer.concat(__spread([sourceHash], dependencySourceTreeHashes));
            var sourceTreeHash = ethUtil.sha3(sourceTreeHashesBuffer);
            return sourceTreeHash;
        }
    };
    return Compiler;
}());
exports.Compiler = Compiler;
var _a, _b;
//# sourceMappingURL=compiler.js.map