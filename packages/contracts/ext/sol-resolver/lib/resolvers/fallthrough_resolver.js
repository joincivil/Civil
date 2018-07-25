"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var resolver_1 = require("./resolver");
var FallthroughResolver = /** @class */ (function (_super) {
    __extends(FallthroughResolver, _super);
    function FallthroughResolver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._resolvers = [];
        return _this;
    }
    FallthroughResolver.prototype.appendResolver = function (resolver) {
        this._resolvers.push(resolver);
    };
    FallthroughResolver.prototype.resolveIfExists = function (importPath) {
        try {
            for (var _a = __values(this._resolvers), _b = _a.next(); !_b.done; _b = _a.next()) {
                var resolver = _b.value;
                var contractSourceIfExists = resolver.resolveIfExists(importPath);
                if (!_.isUndefined(contractSourceIfExists)) {
                    return contractSourceIfExists;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return undefined;
        var e_1, _c;
    };
    return FallthroughResolver;
}(resolver_1.Resolver));
exports.FallthroughResolver = FallthroughResolver;
//# sourceMappingURL=fallthrough_resolver.js.map