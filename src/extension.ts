// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  findReactComponentAtPosition,
  findReactComponents,
  wrapComponents,
  unwrapComponent,
} from "./reactUtils";

export const reactRefactorCommands = [
  "html-wrapper.wrapWith",
  "html-wrapper.unwrapComponent",
];

export class ReactRefactorCommands {
  constructor(context: vscode.ExtensionContext) {
    // Register refactoring provider
    const refactoringProvider = vscode.languages.registerCodeActionsProvider(
      ["javascriptreact", "typescriptreact", "html"],
      {
        provideCodeActions(document, range, context) {
          // Try to find components in selection first
          let components = findReactComponents(document, range);

          // If no components found in selection, try to find component at cursor position
          if (components.length === 0) {
            const component = findReactComponentAtPosition(
              document,
              range.start
            );
            if (component) {
              components = [component];
            }
          }

          if (components.length === 0) {
            return [];
          }

          const actions: vscode.CodeAction[] = [];

          // Wrap with Component action
          const wrapAction = new vscode.CodeAction(
            "Wrap with Element",
            vscode.CodeActionKind.Refactor
          );
          wrapAction.command = {
            command: "html-wrapper.wrapWith",
            title: "Wrap with Element",
          };
          actions.push(wrapAction);

          // Only show unwrap action if there's exactly one component
          if (components.length === 1) {
            const unwrapAction = new vscode.CodeAction(
              "Unwrap Element",
              vscode.CodeActionKind.Refactor
            );
            unwrapAction.command = {
              command: "html-wrapper.unwrapComponent",
              title: "Unwrap Element",
            };
            actions.push(unwrapAction);
          }

          return actions;
        },
      },
      {
        providedCodeActionKinds: [vscode.CodeActionKind.Refactor],
      }
    );
    context.subscriptions.push(refactoringProvider);

    // Register commands
    for (const id of reactRefactorCommands) {
      context.subscriptions.push(
        vscode.commands.registerCommand(id, () => this.applyRefactoring(id))
      );
    }
  }

  private async applyRefactoring(refactorType: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Try to find components in selection first
    let components = findReactComponents(editor.document, editor.selection);

    // If no components found in selection, try to find component at cursor position
    if (components.length === 0) {
      const component = findReactComponentAtPosition(
        editor.document,
        editor.selection.active
      );
      if (component) {
        components = [component];
      }
    }

    if (components.length === 0) {
      vscode.window.showErrorMessage(
        "No HTML/JSX elements found at cursor position or in selection"
      );
      return;
    }

    switch (refactorType) {
      case "html-wrapper.wrapWith": {
        const result = wrapComponents(editor.document, components);
        await editor.edit((editBuilder) => {
          editBuilder.replace(
            new vscode.Range(
              editor.document.positionAt(0),
              editor.document.positionAt(editor.document.getText().length)
            ),
            result.newText
          );
        });

        // Position cursor between the empty tags
        const cursorPosition = editor.document.positionAt(
          result.cursorPosition
        );
        editor.selection = new vscode.Selection(cursorPosition, cursorPosition);
        break;
      }
      case "html-wrapper.unwrapComponent": {
        if (components.length !== 1) {
          vscode.window.showErrorMessage(
            "Please select a single element to unwrap"
          );
          return;
        }
        const newText = unwrapComponent(editor.document, components[0]);
        await editor.edit((editBuilder) => {
          editBuilder.replace(
            new vscode.Range(
              editor.document.positionAt(0),
              editor.document.positionAt(editor.document.getText().length)
            ),
            newText
          );
        });
        break;
      }
    }
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "html-wrapper" is now active!');
  new ReactRefactorCommands(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
