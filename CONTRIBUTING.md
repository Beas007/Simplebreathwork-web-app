# Contributing Guidelines

## Project Setup

### File Structure
```bash
simplebreathwork-web-app/
├── scripts/
│   ├── app.js          # Core application logic
│   ├── page.js         # Page-specific functionality
│   └── template-loader.js  # Component loading system
├── styles/
│   └── main.css        # Global styles
└── components/
    ├── header.html     # Navigation component
    └── footer.html     # Footer component
```

### Code Style Guide

#### JavaScript
- Use `const` and `let` (avoid `var`)
- Follow camelCase naming convention
- Add JSDoc comments for functions
- Use 2 spaces for indentation
- Keep functions small and focused

```javascript
// Good example
const initializeTheme = () => {
  const themeToggle = document.getElementById('theme-toggle');
  // ...rest of code
};

// Bad example
var init = function() {
    // Too generic name, inconsistent spacing
}
```

#### CSS
- Use CSS variables for theming
- Follow BEM naming convention
- Group related properties
- Add comments for complex selectors

#### HTML
- Use semantic elements
- Include proper ARIA attributes
- Keep components modular
- Validate accessibility

### VS Code Setup

#### Required Extensions
- ESLint
- Prettier
- Live Server

#### Workspace Settings
```json
{
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "files.encoding": "utf8"
}
```

#### Mac Shortcuts
- Save: ⌘ + S
- Format: ⌘ + Shift + F
- Terminal: ⌘ + `
- Quick Open: ⌘ + P

### Git Workflow
```bash
# Start new feature
git checkout -b feature/name

# Commit changes
git add .
git commit -m "feat: description"

# Push changes
git push origin feature/name
```