"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Resolver = /** @class */ (function () {
    function Resolver() {
    }
    Resolver.prototype.resolve = function (importPath) {
        var contractSourceIfExists = this.resolveIfExists(importPath);
        if (_.isUndefined(contractSourceIfExists)) {
            throw new Error("Failed to resolve " + importPath);
        }
        return contractSourceIfExists;
    };
    return Resolver;
}());
exports.Resolver = Resolver;
//# sourceMappingURL=resolver.js.map