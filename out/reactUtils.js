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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findReactComponentAtPosition = findReactComponentAtPosition;
exports.findReactComponents = findReactComponents;
exports.wrapComponents = wrapComponents;
exports.unwrapComponent = unwrapComponent;
exports.removeComponent = removeComponent;
exports.getIndentation = getIndentation;
const vscode = __importStar(require("vscode"));
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
function findReactComponentAtPosition(document, position) {
    const text = document.getText();
    const offset = document.offsetAt(position);
    try {
        const ast = (0, parser_1.parse)(text, {
            sourceType: "module",
            plugins: ["jsx", "typescript"],
        });
        let component = null;
        (0, traverse_1.default)(ast, {
            JSXElement(path) {
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
    }
    catch (error) {
        console.error("Error parsing React component:", error);
        return null;
    }
}
function findReactComponents(document, range) {
    const text = document.getText();
    const startOffset = document.offsetAt(range.start);
    const endOffset = document.offsetAt(range.end);
    try {
        const ast = (0, parser_1.parse)(text, {
            sourceType: "module",
            plugins: ["jsx", "typescript"],
        });
        const components = [];
        (0, traverse_1.default)(ast, {
            JSXElement(path) {
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
    }
    catch (error) {
        console.error("Error parsing React components:", error);
        return [];
    }
}
function wrapComponents(document, components) {
    if (components.length === 0) {
        throw new Error("No components to wrap");
    }
    const text = document.getText();
    const firstComponent = components[0];
    const lastComponent = components[components.length - 1];
    const beforeComponents = text.substring(0, firstComponent.start);
    const afterComponents = text.substring(lastComponent.end);
    const indentation = getIndentation(document, document.positionAt(firstComponent.start).line);
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
function unwrapComponent(document, component) {
    const text = document.getText();
    const beforeComponent = text.substring(0, component.start);
    const afterComponent = text.substring(component.end);
    // Extract the content between the opening and closing tags
    const content = component.text
        .replace(/^<[^>]*>/, "")
        .replace(/<\/[^>]*>$/, "");
    return `${beforeComponent}${content}${afterComponent}`;
}
function removeComponent(document, component) {
    const text = document.getText();
    const beforeComponent = text.substring(0, component.start);
    const afterComponent = text.substring(component.end);
    return `${beforeComponent}${afterComponent}`;
}
function getIndentation(document, line) {
    const lineText = document.lineAt(line).text;
    return lineText.match(/^\s*/)?.[0] || "";
}
//# sourceMappingURL=reactUtils.js.map