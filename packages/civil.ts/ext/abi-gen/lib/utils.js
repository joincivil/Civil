"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var types_1 = require("./types");
exports.utils = {
    solTypeToTsType: function (paramKind, solType) {
        var trailingArrayRegex = /\[\d*\]$/;
        if (solType.match(trailingArrayRegex)) {
            var arrayItemSolType = solType.replace(trailingArrayRegex, '');
            var arrayItemTsType = exports.utils.solTypeToTsType(paramKind, arrayItemSolType);
            var arrayTsType = arrayItemTsType + "[]";
            return arrayTsType;
        }
        else {
            var solTypeRegexToTsType = [
                { regex: '^string$', tsType: 'string' },
                { regex: '^address$', tsType: 'string' },
                { regex: '^bool$', tsType: 'boolean' },
                { regex: '^u?int\\d*$', tsType: 'BigNumber' },
                { regex: '^bytes\\d*$', tsType: 'string' },
            ];
            if (paramKind === types_1.ParamKind.Input) {
                // web3 allows to pass those an non-bignumbers and that's nice
                // but it always returns stuff as BigNumbers
                solTypeRegexToTsType.unshift({ regex: '^u?int(8|16|32)?$', tsType: 'number|BigNumber' });
            }
            for (var _i = 0, solTypeRegexToTsType_1 = solTypeRegexToTsType; _i < solTypeRegexToTsType_1.length; _i++) {
                var regexAndTxType = solTypeRegexToTsType_1[_i];
                var regex = regexAndTxType.regex, tsType = regexAndTxType.tsType;
                if (solType.match(regex)) {
                    return tsType;
                }
            }
            throw new Error("Unknown Solidity type found: " + solType);
        }
    },
    log: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, args); // tslint:disable-line:no-console
    },
    getPartialNameFromFileName: function (filename) {
        var name = path.parse(filename).name;
        return name;
    },
    getNamedContent: function (filename) {
        var name = exports.utils.getPartialNameFromFileName(filename);
        try {
            var content = fs.readFileSync(filename).toString();
            return {
                name: name,
                content: content,
            };
        }
        catch (err) {
            throw new Error("Failed to read " + filename + ": " + err);
        }
    },
};
//# sourceMappingURL=utils.js.map