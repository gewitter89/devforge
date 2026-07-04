/* ============================================================
   DevForge Tool — Markdown Preview
   Real-time Markdown to HTML preview with built-in parser
   ============================================================ */

DevForge.registerTool({
  id: 'markdown-preview',
  name: 'Markdown Preview',
  description: 'Real-time Markdown editor with beautiful styled preview',
  category: 'formatters',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  tags: ['markdown', 'preview', 'editor', 'md', 'html', 'formatter'],

  render() {
    return `
      <div class="tool-split" style="gap:0;">
        <!-- Editor -->
        <div class="tool-group" style="position:relative;">
          <label style="display:flex;justify-content:space-between;align-items:center;">
            <span>Markdown Editor</span>
            <span id="markdown-preview-stats" style="font-size:0.7rem;color:var(--text-tertiary);font-weight:400;text-transform:none;letter-spacing:0;"></span>
          </label>
          <textarea id="markdown-preview-input" class="tool-textarea"
            style="min-height:500px;resize:none;tab-size:2;font-size:0.84rem;line-height:1.7;"
            placeholder="# Hello World

Write your **Markdown** here...

## Features
- Headers (h1-h6)
- **Bold** and *italic* text
- ~~Strikethrough~~
- \`inline code\` and code blocks
- [Links](https://example.com)
- ![Images](url)
- Lists (ordered & unordered)
- > Blockquotes
- Tables
- Horizontal rules

---

| Feature | Status |
| ------- | ------ |
| Headers | ✅ |
| Bold    | ✅ |
| Tables  | ✅ |
"></textarea>
        </div>
        <!-- Preview -->
        <div class="tool-group">
          <label>Preview</label>
          <div id="markdown-preview-output" style="min-height:500px;padding:var(--space-lg);background:var(--bg-input);border:1px solid var(--border-primary);border-radius:var(--radius-md);overflow:auto;line-height:1.7;">
            <p style="color:var(--text-tertiary);font-style:italic;">Start typing Markdown to see the preview...</p>
          </div>
        </div>
      </div>

      <!-- Scoped Preview Styles -->
      <style>
        #markdown-preview-output h1 { font-size:1.8rem; font-weight:700; margin:0 0 0.6em; padding-bottom:0.3em; border-bottom:2px solid var(--border-primary); color:var(--text-primary); }
        #markdown-preview-output h2 { font-size:1.4rem; font-weight:700; margin:1.2em 0 0.5em; padding-bottom:0.25em; border-bottom:1px solid var(--border-primary); color:var(--text-primary); }
        #markdown-preview-output h3 { font-size:1.15rem; font-weight:600; margin:1em 0 0.4em; color:var(--text-primary); }
        #markdown-preview-output h4 { font-size:1rem; font-weight:600; margin:0.8em 0 0.3em; color:var(--text-primary); }
        #markdown-preview-output h5 { font-size:0.9rem; font-weight:600; margin:0.8em 0 0.3em; color:var(--text-secondary); }
        #markdown-preview-output h6 { font-size:0.85rem; font-weight:600; margin:0.8em 0 0.3em; color:var(--text-tertiary); }
        #markdown-preview-output p { margin:0 0 0.8em; color:var(--text-primary); font-size:0.92rem; }
        #markdown-preview-output strong { font-weight:700; color:var(--text-primary); }
        #markdown-preview-output em { font-style:italic; }
        #markdown-preview-output del { text-decoration:line-through; color:var(--text-tertiary); }
        #markdown-preview-output code { font-family:'JetBrains Mono',monospace; background:rgba(139,92,246,0.1); padding:2px 6px; border-radius:4px; font-size:0.82rem; color:var(--text-accent); }
        #markdown-preview-output pre { background:var(--bg-tertiary); border:1px solid var(--border-primary); border-radius:var(--radius-sm); padding:var(--space-md); margin:0.8em 0; overflow-x:auto; }
        #markdown-preview-output pre code { background:none; padding:0; color:var(--text-primary); font-size:0.82rem; }
        #markdown-preview-output a { color:var(--text-accent); text-decoration:underline; text-underline-offset:2px; }
        #markdown-preview-output a:hover { opacity:0.8; }
        #markdown-preview-output img { max-width:100%; border-radius:var(--radius-sm); margin:0.5em 0; }
        #markdown-preview-output ul, #markdown-preview-output ol { padding-left:1.5em; margin:0 0 0.8em; }
        #markdown-preview-output ul { list-style:disc; }
        #markdown-preview-output ol { list-style:decimal; }
        #markdown-preview-output li { margin:0.25em 0; font-size:0.92rem; color:var(--text-primary); }
        #markdown-preview-output blockquote { border-left:3px solid var(--text-accent); padding:0.5em 1em; margin:0.8em 0; background:rgba(139,92,246,0.04); border-radius:0 var(--radius-sm) var(--radius-sm) 0; color:var(--text-secondary); font-style:italic; }
        #markdown-preview-output blockquote p { margin:0; }
        #markdown-preview-output hr { border:none; height:2px; background:var(--border-primary); margin:1.5em 0; border-radius:1px; }
        #markdown-preview-output table { width:100%; border-collapse:collapse; margin:0.8em 0; font-size:0.85rem; }
        #markdown-preview-output th { background:var(--bg-tertiary); font-weight:600; text-align:left; padding:8px 12px; border:1px solid var(--border-primary); color:var(--text-primary); }
        #markdown-preview-output td { padding:8px 12px; border:1px solid var(--border-primary); color:var(--text-primary); }
        #markdown-preview-output tr:nth-child(even) td { background:rgba(139,92,246,0.02); }
      </style>
    `;
  },

  init() {
    const input = document.getElementById('markdown-preview-input');
    const output = document.getElementById('markdown-preview-output');
    const stats = document.getElementById('markdown-preview-stats');

    // Lightweight Markdown parser
    function parseMarkdown(md) {
      let html = '';
      const lines = md.split('\n');
      let i = 0;
      let inCodeBlock = false;
      let codeBlockContent = '';
      let codeBlockLang = '';

      while (i < lines.length) {
        const line = lines[i];

        // Code blocks (fenced)
        if (line.trim().startsWith('```')) {
          if (!inCodeBlock) {
            inCodeBlock = true;
            codeBlockLang = line.trim().slice(3).trim();
            codeBlockContent = '';
            i++;
            continue;
          } else {
            inCodeBlock = false;
            html += `<pre><code>${escapeHtml(codeBlockContent.replace(/\n$/, ''))}</code></pre>\n`;
            i++;
            continue;
          }
        }

        if (inCodeBlock) {
          codeBlockContent += line + '\n';
          i++;
          continue;
        }

        // Blank line
        if (line.trim() === '') {
          i++;
          continue;
        }

        // Horizontal rule
        if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line.trim())) {
          html += '<hr>\n';
          i++;
          continue;
        }

        // Headers
        const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headerMatch) {
          const level = headerMatch[1].length;
          html += `<h${level}>${parseInline(headerMatch[2])}</h${level}>\n`;
          i++;
          continue;
        }

        // Blockquote
        if (line.trim().startsWith('>')) {
          let bqLines = [];
          while (
            i < lines.length &&
            (lines[i].trim().startsWith('>') ||
              (lines[i].trim() !== '' && bqLines.length > 0 && !lines[i].trim().startsWith('#')))
          ) {
            if (lines[i].trim().startsWith('>')) {
              bqLines.push(lines[i].trim().replace(/^>\s?/, ''));
            } else if (lines[i].trim() !== '') {
              bqLines.push(lines[i].trim());
            } else {
              break;
            }
            i++;
          }
          html += `<blockquote><p>${parseInline(bqLines.join(' '))}</p></blockquote>\n`;
          continue;
        }

        // Table
        if (i + 1 < lines.length && /^\|?[\s]*-{3,}/.test(lines[i + 1]) && line.includes('|')) {
          const headerCells = line
            .split('|')
            .map(c => c.trim())
            .filter(c => c !== '');
          html += '<table><thead><tr>';
          headerCells.forEach(c => (html += `<th>${parseInline(c)}</th>`));
          html += '</tr></thead><tbody>\n';
          i += 2; // skip header and separator
          while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
            const cells = lines[i]
              .split('|')
              .map(c => c.trim())
              .filter(c => c !== '');
            html += '<tr>';
            cells.forEach(c => (html += `<td>${parseInline(c)}</td>`));
            html += '</tr>\n';
            i++;
          }
          html += '</tbody></table>\n';
          continue;
        }

        // Unordered list
        if (/^\s*[-*+]\s+/.test(line)) {
          html += '<ul>\n';
          while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
            html += `<li>${parseInline(lines[i].replace(/^\s*[-*+]\s+/, ''))}</li>\n`;
            i++;
          }
          html += '</ul>\n';
          continue;
        }

        // Ordered list
        if (/^\s*\d+[.)]\s+/.test(line)) {
          html += '<ol>\n';
          while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
            html += `<li>${parseInline(lines[i].replace(/^\s*\d+[.)]\s+/, ''))}</li>\n`;
            i++;
          }
          html += '</ol>\n';
          continue;
        }

        // Paragraph (collect consecutive non-empty lines)
        let paraLines = [];
        while (
          i < lines.length &&
          lines[i].trim() !== '' &&
          !lines[i].trim().startsWith('#') &&
          !lines[i].trim().startsWith('>') &&
          !lines[i].trim().startsWith('```') &&
          !/^\s*[-*+]\s+/.test(lines[i]) &&
          !/^\s*\d+[.)]\s+/.test(lines[i]) &&
          !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i].trim())
        ) {
          paraLines.push(lines[i]);
          i++;
        }
        if (paraLines.length > 0) {
          html += `<p>${parseInline(paraLines.join('<br>'))}</p>\n`;
        }
      }

      // Close unclosed code block
      if (inCodeBlock) {
        html += `<pre><code>${escapeHtml(codeBlockContent.replace(/\n$/, ''))}</code></pre>\n`;
      }

      return html;
    }

    function escapeHtml(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function parseInline(text) {
      // Images (before links to avoid conflict)
      text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

      // Links
      text = text.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>'
      );

      // Inline code (before bold/italic to avoid conflicts)
      text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

      // Bold + Italic
      text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
      text = text.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');

      // Bold
      text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

      // Italic
      text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
      text = text.replace(/_(.+?)_/g, '<em>$1</em>');

      // Strikethrough
      text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');

      return text;
    }

    function updatePreview() {
      const md = input.value;
      if (!md.trim()) {
        output.innerHTML =
          '<p style="color:var(--text-tertiary);font-style:italic;">Start typing Markdown to see the preview...</p>';
        stats.textContent = '';
        return;
      }

      output.innerHTML = parseMarkdown(md);

      // Stats
      const words = md
        .trim()
        .split(/\s+/)
        .filter(w => w).length;
      const chars = md.length;
      const lineCount = md.split('\n').length;
      stats.textContent = `${lineCount} lines · ${words} words · ${chars} chars`;
    }

    input.addEventListener('input', updatePreview);

    // Tab key support in editor
    input.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.value = input.value.substring(0, start) + '  ' + input.value.substring(end);
        input.selectionStart = input.selectionEnd = start + 2;
        updatePreview();
      }
    });
  }
});
