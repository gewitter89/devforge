<![CDATA[# Contributing to DevForge

First off — **thank you!** 🎉 Whether you're fixing a typo, reporting a bug, or building an entire new tool, every contribution matters. DevForge is built by people like you.

## Table of Contents

- [Getting Started](#getting-started)
- [How to Add a New Tool](#how-to-add-a-new-tool)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Recognition](#recognition)

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- A text editor (VS Code recommended)
- Git
- (Optional) Node.js for running a local dev server

### Setup

```bash
# 1. Fork the repo on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/devforge.git
cd devforge

# 3. Open in browser — that's it!
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux

# Or use a local server (recommended to avoid CORS issues)
npx serve .
# → http://localhost:3000
```

No build step. No `npm install`. No configuration files. Just code.

---

## How to Add a New Tool

Adding a tool to DevForge is designed to be **easy and fun**. Each tool is a single JavaScript file that calls `DevForge.registerTool()`.

### Step 1: Copy the template

```bash
cp templates/tool-template.js tools/your-tool-name.js
```

### Step 2: Implement your tool

Open your new file and fill in the registration object:

```js
DevForge.registerTool({
  // Unique identifier (kebab-case, must be unique across all tools)
  id: 'your-tool-name',

  // Display name shown in the catalog and tool header
  name: 'Your Tool Name',

  // Short description (one sentence, shown on tool card)
  description: 'Briefly describe what this tool does',

  // Category — determines which sidebar group it appears under
  // Options: 'formatters', 'generators', 'converters', 'encoders', 'text', 'web'
  category: 'converters',

  // SVG icon — should use 24x24 viewBox, stroke-based, currentColor
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <!-- your icon paths here -->
         </svg>`,

  // Tags for search (users can find your tool by typing these words)
  tags: ['keyword1', 'keyword2', 'keyword3'],

  // render() returns the HTML string for the tool's UI
  render() {
    return `
      <div class="tool-split">
        <div class="tool-group">
          <label>Input</label>
          <textarea class="tool-textarea" id="your-tool-input"
                    placeholder="Paste something here..."></textarea>
        </div>
        <div class="tool-group">
          <label>Output</label>
          <div class="tool-result" id="your-tool-output">
            Result will appear here
          </div>
        </div>
      </div>
      <div class="tool-actions">
        <button class="tool-btn-primary" id="your-tool-process">Process</button>
        <button class="tool-btn" id="your-tool-copy">Copy</button>
      </div>
    `;
  },

  // init() is called after the UI is rendered — attach event listeners here
  init() {
    const input = document.getElementById('your-tool-input');
    const output = document.getElementById('your-tool-output');
    const processBtn = document.getElementById('your-tool-process');
    const copyBtn = document.getElementById('your-tool-copy');

    function process() {
      const value = input.value;
      if (!value.trim()) {
        output.textContent = 'Enter some input above';
        output.classList.remove('success', 'error');
        return;
      }
      try {
        // Your processing logic here
        const result = value.toUpperCase(); // Example
        output.textContent = result;
        output.classList.add('success');
        output.classList.remove('error');
      } catch (err) {
        output.textContent = 'Error: ' + err.message;
        output.classList.add('error');
        output.classList.remove('success');
      }
    }

    // Real-time processing on input
    input.addEventListener('input', process);
    processBtn.addEventListener('click', process);
    copyBtn.addEventListener('click', () => {
      DevForge.copyToClipboard(output.textContent);
    });
  }
});
```

### Step 3: Register in `index.html`

Add a `<script>` tag at the bottom of `index.html`, inside the `<!-- Tools -->` section:

```html
<script src="tools/your-tool-name.js" defer></script>
```

### Step 4: Test it!

1. Open DevForge in your browser
2. Your tool should appear in the catalog
3. Click it and verify everything works
4. Check the browser console for errors

### Step 5: Open a PR

Push your changes and open a Pull Request. That's all there is to it! 🎉

---

## CSS Classes Available

DevForge provides pre-built CSS classes so your tool looks consistent with the rest:

| Class | Purpose |
|-------|---------|
| `.tool-split` | 2-column grid layout (input \| output) |
| `.tool-full` | Single column layout |
| `.tool-group` | Wrapper for label + input/textarea |
| `.tool-group label` | Uppercase styled label |
| `.tool-textarea` | Styled monospace textarea |
| `.tool-input` | Styled text input |
| `.tool-result` | Output display area (monospace, pre-wrap) |
| `.tool-result.success` | Green border for success state |
| `.tool-result.error` | Red border + red text for error state |
| `.tool-actions` | Button row container |
| `.tool-btn` | Secondary button |
| `.tool-btn-primary` | Gradient primary button |
| `.tool-btn-sm` | Small button variant |
| `.tool-options` | Options row |
| `.tool-option` | Label + select/input pair |
| `.tool-checkbox` | Label wrapping a checkbox |
| `.tool-inline-result` | Single-line result with copy icon |

### Utility functions

| Function | Description |
|----------|-------------|
| `DevForge.copyToClipboard(text)` | Copies text and shows a toast notification |
| `DevForge.toast(message, type)` | Shows a toast (`'success'`, `'error'`, or `'info'`) |
| `DevForge.COPY_ICON` | SVG string for a copy icon button |

---

## Code Style Guidelines

- **No external dependencies** — everything must work with vanilla JS
- **Prefix all DOM IDs** with your tool's `id` to avoid collisions (e.g., `json-input`, `base64-output`)
- **Process in real-time** where possible (on `input` event, not just on button click)
- **Handle errors gracefully** — show error messages in the UI, don't just `console.log`
- **Use `const` and `let`**, never `var`
- **Use template literals** for HTML strings
- **Use single quotes** for JS strings (except template literals)
- Keep your tool **self-contained** in a single file — no imports, no modules
- Use **2-space indentation**
- Add comments for complex logic

---

## Pull Request Process

1. **Fork** the repo and create a new branch from `main`:
   ```bash
   git checkout -b feat/my-new-tool
   ```

2. **Make your changes** — add/modify tool files

3. **Test locally** — make sure:
   - [ ] The tool loads without console errors
   - [ ] The tool appears in the catalog
   - [ ] All features work as expected
   - [ ] Both light and dark themes look good
   - [ ] The layout is responsive (resize your browser)

4. **Commit** with a descriptive message:
   ```bash
   git commit -m "feat: add regex tester tool"
   ```

5. **Push** and open a Pull Request against `main`

6. **Fill out** the PR template — describe what you changed and why

We aim to review PRs within **48 hours**. Don't be discouraged if we request changes — it's all in the spirit of making DevForge better together!

---

## Reporting Issues

### Bug Reports

Use the [bug report template](https://github.com/your-username/devforge/issues/new?template=bug_report.yml) and include:

- **What happened** — clear description of the bug
- **Steps to reproduce** — numbered steps to trigger the bug
- **Expected behavior** — what should have happened instead
- **Browser & OS** — e.g., Chrome 120 on Windows 11
- **Screenshots** — if applicable

### Feature Requests

Use the [feature request template](https://github.com/your-username/devforge/issues/new?template=feature_request.yml) and describe:

- What problem it solves
- How you envision it working
- Any alternatives you've considered

### Proposing a New Tool

Use the [new tool template](https://github.com/your-username/devforge/issues/new?template=new_tool.yml) — this is the fastest way to get feedback before you start coding!

---

## Recognition

All contributors are recognized in the project README via the [All Contributors](https://allcontributors.org/) specification. Contributions of any kind are welcome:

- 💻 Code (new tools, bug fixes, improvements)
- 📖 Documentation
- 🐛 Bug reports
- 💡 Ideas and feature suggestions
- 🎨 Design improvements
- 🌍 Translations

---

## Questions?

If something in this guide is unclear, please [open an issue](https://github.com/your-username/devforge/issues) — improving contributor experience is always a priority.

**Happy forging!** ⚒️
]]>
