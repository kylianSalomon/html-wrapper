"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactRefactorCommands = exports.reactRefactorCommands = void 0;
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const reactUtils_1 = require("./reactUtils");
exports.reactRefactorCommands = [
    "react-wrapper.wrapWith",
    "react-wrapper.unwrapComponent",
];
class ReactRefactorCommands {
    constructor(context) {
        // Register refactoring provider
        const refactoringProvider = vscode.languages.registerCodeActionsProvider(["javascriptreact", "typescriptreact"], {
            provideCodeActions(document, range, context) {
                // Try to find components in selection first
                let components = (0, reactUtils_1.findReactComponents)(document, range);
                // If no components found in selection, try to find component at cursor position
                if (components.length === 0) {
                    const component = (0, reactUtils_1.findReactComponentAtPosition)(document, range.start);
                    if (component) {
                        components = [component];
                    }
                }
                if (components.length === 0) {
                    return [];
                }
                const actions = [];
                // Wrap with Component action
                const wrapAction = new vscode.CodeAction("Wrap with Component", vscode.CodeActionKind.Refactor);
                wrapAction.command = {
                    command: "react-wrapper.wrapWith",
                    title: "Wrap with Component",
                };
                actions.push(wrapAction);
                // Only show unwrap action if there's exactly one component
                if (components.length === 1) {
                    const unwrapAction = new vscode.CodeAction("Unwrap Component", vscode.CodeActionKind.Refactor);
                    unwrapAction.command = {
                        command: "react-wrapper.unwrapComponent",
                        title: "Unwrap Component",
                    };
                    actions.push(unwrapAction);
                }
                return actions;
            },
        }, {
            providedCodeActionKinds: [vscode.CodeActionKind.Refactor],
        });
        context.subscriptions.push(refactoringProvider);
        // Register commands
        for (const id of exports.reactRefactorCommands) {
            context.subscriptions.push(vscode.commands.registerCommand(id, () => this.applyRefactoring(id)));
        }
    }
    async applyRefactoring(refactorType) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        // Try to find components in selection first
        let components = (0, reactUtils_1.findReactComponents)(editor.document, editor.selection);
        // If no components found in selection, try to find component at cursor position
        if (components.length === 0) {
            const component = (0, reactUtils_1.findReactComponentAtPosition)(editor.document, editor.selection.active);
            if (component) {
                components = [component];
            }
        }
        if (components.length === 0) {
            vscode.window.showErrorMessage("No React components found at cursor position or in selection");
            return;
        }
        switch (refactorType) {
            case "react-wrapper.wrapWith": {
                const result = (0, reactUtils_1.wrapComponents)(editor.document, components);
                await editor.edit((editBuilder) => {
                    editBuilder.replace(new vscode.Range(editor.document.positionAt(0), editor.document.positionAt(editor.document.getText().length)), result.newText);
                });
                // Position cursor between the empty tags
                const cursorPosition = editor.document.positionAt(result.cursorPosition);
                editor.selection = new vscode.Selection(cursorPosition, cursorPosition);
                break;
            }
            case "react-wrapper.unwrapComponent": {
                if (components.length !== 1) {
                    vscode.window.showErrorMessage("Please select a single component to unwrap");
                    return;
                }
                const newText = (0, reactUtils_1.unwrapComponent)(editor.document, components[0]);
                await editor.edit((editBuilder) => {
                    editBuilder.replace(new vscode.Range(editor.document.positionAt(0), editor.document.positionAt(editor.document.getText().length)), newText);
                });
                break;
            }
        }
    }
}
exports.ReactRefactorCommands = ReactRefactorCommands;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "react-wrapper" is now active!');
    new ReactRefactorCommands(context);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map