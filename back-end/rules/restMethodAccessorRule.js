"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Rule = void 0;
var Lint = require("tslint");
var ts = require("typescript");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new Walker(sourceFile, 'rest-method-accessor', this.getOptions()));
    };
    Rule.FAILURE_STRING = 'Incorrect REST method accessor';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var Walker = /** @class */ (function (_super) {
    __extends(Walker, _super);
    function Walker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Walker.prototype.walk = function (sourceFile) {
        ts.forEachChild(sourceFile, this.visitMethodDeclaration.bind(this));
    };
    Walker.prototype.visitMethodDeclaration = function (node) {
        if (this.isNonPublic(node) && this.isRestMethod(node)) {
            this.addFailureAtNode(node, 'REST method accessor needs to be public');
        }
        ts.forEachChild(node, this.visitMethodDeclaration.bind(this));
    };
    Walker.prototype.isRestMethod = function (node) {
        var isRestDecorator = function (decorator) {
            return decorator.expression.getText()
                .match(/(Get\((.*?)\))|(Post\((.*?)\))|(Delete\((.*?)\))|(Put\((.*?)\))/);
        };
        return (node.decorators || []).some(isRestDecorator);
    };
    Walker.prototype.isNonPublic = function (node) {
        if (!node.modifiers) {
            return false;
        }
        var kinds = node.modifiers.map(function (modifier) { return modifier.kind; });
        return kinds.includes(ts.SyntaxKind.PrivateKeyword) || kinds.includes(ts.SyntaxKind.ProtectedKeyword);
    };
    return Walker;
}(Lint.AbstractWalker));
