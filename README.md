# HTML Wrapper Extension

A VS Code extension that provides HTML/React element refactoring tools similar to Flutter's wrap/remove functionality. This extension helps you quickly wrap elements with other elements or unwrap them while preserving their children. It works with both HTML elements and React components.

## Features

- **Wrap with Element**: Easily wrap any HTML element(s) or React component(s) with another element
- **Unwrap Element**: Remove a wrapper element while preserving its children
- **Smart Indentation**: Automatically handles proper indentation when wrapping elements
- **Cursor Positioning**: Places cursor in the right position for immediate element name typing
- **Multi-Element Selection**: Wrap multiple elements at once with a single wrapper
- **Flexible Selection**: Works with both cursor position and text selection
- **HTML & React Support**: Works with both HTML elements and React components

## Usage

### Wrap with Element

You can wrap elements in two ways:

#### Method 1: Using Cursor Position

1. Place your cursor on an HTML element or React component
2. Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux) to open the refactor menu
3. Select "Wrap with Element"
4. The element will be wrapped with empty tags `<>...</>`
5. The cursor will be positioned between the `<` and `>` characters
6. Type your element name

#### Method 2: Using Text Selection

1. Select one or more HTML elements or React components
2. Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux) to open the refactor menu
3. Select "Wrap with Element"
4. The selected element(s) will be wrapped with empty tags `<>...</>`
5. The cursor will be positioned between the `<` and `>` characters
6. Type your element name

Example with single element:

```html
<!-- Before -->
<div>Hello World</div>

<!-- After (cursor positioned after <) -->
<|>
  <div>Hello World</div>
</>
```

Example with multiple elements:

```html
<!-- Before -->
<div>First</div>
<div>Second</div>
<div>Third</div>

<!-- After (cursor positioned after <) -->
<|>
  <div>First</div>
  <div>Second</div>
  <div>Third</div>
</>
```

Example with React component:

```jsx
// Before
<div className="container">
  <p>Hello World</p>
</div>

// After (cursor positioned after <)
<|>
  <div className="container">
    <p>Hello World</p>
  </div>
</>
```

### Unwrap Element

1. Place your cursor on a wrapper element
2. Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux) to open the refactor menu
3. Select "Unwrap Element"
4. The wrapper element will be removed while preserving its children

Example:

```html
<!-- Before -->
<div>
  <span>Hello</span>
  <span>World</span>
</div>

<!-- After -->
<span>Hello</span>
<span>World</span>
```

## Requirements

- VS Code version 1.96.0 or higher
- HTML files or React project with JSX/TSX files

## Extension Settings

This extension does not contribute any settings.

## Known Issues

None at the moment.

## Release Notes

### 0.0.2

- Added support for wrapping multiple elements at once
- Improved element selection handling
- Fixed unwrap functionality to properly handle element content
- Restored support for wrapping elements using cursor position
- Added support for HTML files
- Renamed extension to HTML Wrapper to better reflect its capabilities

### 0.0.1

Initial release of HTML Wrapper Extension with basic wrap and unwrap functionality.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions, please file them in the [GitHub issues](https://github.com/kylianSalomon/html-wrapper).

## Credits

Inspired by Flutter's component refactoring tools.

Thanks to **Louis Harismendy** that designed the extension icon.

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
