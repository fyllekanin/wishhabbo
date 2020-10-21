
import * as Lint from 'tslint';
import * as ts from 'typescript';

// Exported class always should be named "Rule" and extends Lint.Rules.AbstractRule
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Incorrect REST method accessor';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walker(sourceFile, 'rest-method-accessor', this.getOptions()))
    }
}

class Walker extends Lint.AbstractWalker<any> {

    public walk(sourceFile: ts.SourceFile): void {
        ts.forEachChild(sourceFile, this.visitMethodDeclaration.bind(this));
    }

    private visitMethodDeclaration(node: ts.MethodDeclaration) {
        if (this.isNonPublic(node) && this.isRestMethod(node)) {
            this.addFailureAtNode(node, 'REST method accessor needs to be public');
        }
    }

    private isRestMethod(node: ts.MethodDeclaration): boolean {
        const restDecorators = ['Get', 'Put', 'Post', 'Delete'];
        const isRestDecorator = (decorator: ts.Decorator) => {
            /* if (!ts.isIdentifier(decorator.expression)) {
                return false;
            } */
            console.log(decorator.expression.getFullText());
            return restDecorators.includes(decorator.expression.getText());
        };
        if (node.getFullText() === 'private async getArticle (req: InternalRequest, res: Response): Promise<void> {') {
            console.log(node);
        }
        return (node.decorators || []).some(isRestDecorator);
    }

    private isNonPublic(node: ts.MethodDeclaration): boolean {
        if (!node.modifiers) {
            return true;
        }

        const kinds = node.modifiers.map(modifier => modifier.kind);
        return kinds.includes(ts.SyntaxKind.PrivateKeyword) || kinds.includes(ts.SyntaxKind.ProtectedKeyword);
    }
}