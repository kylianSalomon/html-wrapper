import * as vscode from "vscode";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";
import { NodePath } from "@babel/traverse";

export interface ComponentInfo {
  start: number;
  end: number;
  text: string;
  parent?: ComponentInfo;
}

export interface WrapResult {
  newText: string;
  cursorPosition: number;
}

export function findReactComponentAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position
): ComponentInfo | null {
  const text = document.getText();
  const offset = document.offsetAt(position);

  try {
    const ast = parse(text, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    let component: ComponentInfo | null = null;

    traverse(ast, {
      JSXElement(path: NodePath<t.JSXElement>) {
        const node = path.node;
        const start = node.start || 0;
        const end = node.end || 0;

        if (offset >= start && offset <= end) {
          component = {
            start,
            end,
            text: text.substring(start, end),
          };
        }
      },
    });

    return component;
  } catch (error) {
    console.error("Error parsing React component:", error);
    return null;
  }
}

export function findReactComponents(
  document: vscode.TextDocument,
  range: vscode.Range
): ComponentInfo[] {
  const text = document.getText();
  const startOffset = document.offsetAt(range.start);
  const endOffset = document.offsetAt(range.end);

  try {
    const ast = parse(text, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    const components: ComponentInfo[] = [];

    traverse(ast, {
      JSXElement(path: NodePath<t.JSXElement>) {
        const node = path.node;
        const start = node.start || 0;
        const end = node.end || 0;

        if (start >= startOffset && end <= endOffset) {
          components.push({
            start,
            end,
            text: text.substring(start, end),
          });
        }
      },
    });

    return components;
  } catch (error) {
    console.error("Error parsing React components:", error);
    return [];
  }
}

export function wrapComponents(
  document: vscode.TextDocument,
  components: ComponentInfo[]
): WrapResult {
  if (components.length === 0) {
    throw new Error("No components to wrap");
  }

  const text = document.getText();
  const firstComponent = components[0];
  const lastComponent = components[components.length - 1];
  const beforeComponents = text.substring(0, firstComponent.start);
  const afterComponents = text.substring(lastComponent.end);

  const indentation = getIndentation(
    document,
    document.positionAt(firstComponent.start).line
  );
  const lineEnd = document.eol === vscode.EndOfLine.LF ? "\n" : "\r\n";

  const componentsText = components
    .map((comp) => `${indentation}  ${comp.text}`)
    .join(lineEnd);

  const newText = `${beforeComponents}<>${lineEnd}${componentsText}${lineEnd}${indentation}</>${afterComponents}`;
  const cursorPosition = firstComponent.start + 1; // Position after "<"

  return {
    newText,
    cursorPosition,
  };
}

export function unwrapComponent(
  document: vscode.TextDocument,
  component: ComponentInfo
): string {
  const text = document.getText();
  const beforeComponent = text.substring(0, component.start);
  const afterComponent = text.substring(component.end);

  // Extract the content between the opening and closing tags
  const content = component.text
    .replace(/^<[^>]*>/, "")
    .replace(/<\/[^>]*>$/, "");
  return `${beforeComponent}${content}${afterComponent}`;
}

export function removeComponent(
  document: vscode.TextDocument,
  component: ComponentInfo
): string {
  const text = document.getText();
  const beforeComponent = text.substring(0, component.start);
  const afterComponent = text.substring(component.end);

  return `${beforeComponent}${afterComponent}`;
}

export function getIndentation(
  document: vscode.TextDocument,
  line: number
): string {
  const lineText = document.lineAt(line).text;
  return lineText.match(/^\s*/)?.[0] || "";
}
