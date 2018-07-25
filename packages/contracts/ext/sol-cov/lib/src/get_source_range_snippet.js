"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
Object.defineProperty(exports, "__esModule", { value: true });
var ethUtil = require("ethereumjs-util");
var _ = require("lodash");
var Parser = require("solidity-parser-antlr");
var utils_1 = require("./utils");
// Parsing source code for each transaction/code is slow and therefore we cache it
var parsedSourceByHash = {};
function getSourceRangeSnippet(sourceRange, sourceCode) {
    var sourceHash = ethUtil.sha3(sourceCode).toString('hex');
    if (_.isUndefined(parsedSourceByHash[sourceHash])) {
        parsedSourceByHash[sourceHash] = Parser.parse(sourceCode, { loc: true });
    }
    var astNode = parsedSourceByHash[sourceHash];
    var visitor = new ASTInfoVisitor();
    Parser.visit(astNode, visitor);
    var astInfo = visitor.getASTInfoForRange(sourceRange);
    if (astInfo === null) {
        return null;
    }
    var sourceCodeInRange = utils_1.utils.getRange(sourceCode, sourceRange.location);
    return __assign({}, astInfo, { range: astInfo.range, source: sourceCodeInRange, fileName: sourceRange.fileName });
}
exports.getSourceRangeSnippet = getSourceRangeSnippet;
// A visitor which collects ASTInfo for most nodes in the AST.
var ASTInfoVisitor = /** @class */ (function () {
    function ASTInfoVisitor() {
        this._astInfos = [];
    }
    ASTInfoVisitor.prototype.getASTInfoForRange = function (sourceRange) {
        // HACK(albrow): Sometimes the source range doesn't exactly match that
        // of astInfo. To work around that we try with a +/-1 offset on
        // end.column. If nothing matches even with the offset, we return null.
        var offset = {
            start: {
                line: 0,
                column: 0,
            },
            end: {
                line: 0,
                column: 0,
            },
        };
        var astInfo = this._getASTInfoForRange(sourceRange, offset);
        if (astInfo !== null) {
            return astInfo;
        }
        offset.end.column += 1;
        astInfo = this._getASTInfoForRange(sourceRange, offset);
        if (astInfo !== null) {
            return astInfo;
        }
        offset.end.column -= 2;
        astInfo = this._getASTInfoForRange(sourceRange, offset);
        if (astInfo !== null) {
            return astInfo;
        }
        return null;
    };
    ASTInfoVisitor.prototype.ContractDefinition = function (ast) {
        this._visitContractDefinition(ast);
    };
    ASTInfoVisitor.prototype.IfStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.FunctionDefinition = function (ast) {
        this._visitFunctionLikeDefinition(ast);
    };
    ASTInfoVisitor.prototype.ModifierDefinition = function (ast) {
        this._visitFunctionLikeDefinition(ast);
    };
    ASTInfoVisitor.prototype.ForStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.ReturnStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.BreakStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.ContinueStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.EmitStatement = function (ast /* TODO: Parser.EmitStatement */) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.VariableDeclarationStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.Statement = function (ast) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.WhileStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.SimpleStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.ThrowStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.DoWhileStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.ExpressionStatement = function (ast) {
        this._visitStatement(ast.expression);
    };
    ASTInfoVisitor.prototype.InlineAssemblyStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTInfoVisitor.prototype.ModifierInvocation = function (ast) {
        var BUILTIN_MODIFIERS = ['public', 'view', 'payable', 'external', 'internal', 'pure', 'constant'];
        if (!_.includes(BUILTIN_MODIFIERS, ast.name)) {
            this._visitStatement(ast);
        }
    };
    ASTInfoVisitor.prototype._visitStatement = function (ast) {
        this._astInfos.push({
            type: ast.type,
            node: ast,
            name: null,
            range: ast.loc,
        });
    };
    ASTInfoVisitor.prototype._visitFunctionLikeDefinition = function (ast) {
        this._astInfos.push({
            type: ast.type,
            node: ast,
            name: ast.name,
            range: ast.loc,
        });
    };
    ASTInfoVisitor.prototype._visitContractDefinition = function (ast) {
        this._astInfos.push({
            type: ast.type,
            node: ast,
            name: ast.name,
            range: ast.loc,
        });
    };
    ASTInfoVisitor.prototype._getASTInfoForRange = function (sourceRange, offset) {
        var offsetSourceRange = __assign({}, sourceRange, { location: {
                start: {
                    line: sourceRange.location.start.line + offset.start.line,
                    column: sourceRange.location.start.column + offset.start.column,
                },
                end: {
                    line: sourceRange.location.end.line + offset.end.line,
                    column: sourceRange.location.end.column + offset.end.column,
                },
            } });
        try {
            for (var _a = __values(this._astInfos), _b = _a.next(); !_b.done; _b = _a.next()) {
                var astInfo = _b.value;
                var astInfoRange = astInfo.range;
                if (astInfoRange.start.column === offsetSourceRange.location.start.column &&
                    astInfoRange.start.line === offsetSourceRange.location.start.line &&
                    astInfoRange.end.column === offsetSourceRange.location.end.column &&
                    astInfoRange.end.line === offsetSourceRange.location.end.line) {
                    return astInfo;
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
        return null;
        var e_1, _c;
    };
    return ASTInfoVisitor;
}());
//# sourceMappingURL=get_source_range_snippet.js.map