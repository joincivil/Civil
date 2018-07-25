"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethereum_types_1 = require("ethereum-types");
var _ = require("lodash");
var web3Abi = require("web3-eth-abi");
exports.encoder = {
    encodeConstructorArgsFromAbi: function (args, abi) {
        var constructorTypes = [];
        _.each(abi, function (element) {
            if (element.type === ethereum_types_1.AbiType.Constructor) {
                _.each(element.inputs, function (input) {
                    constructorTypes.push(input.type);
                });
            }
        });
        var encodedParameters = web3Abi.encodeParameters(constructorTypes, args);
        return encodedParameters;
    },
};
//# sourceMappingURL=encoder.js.map