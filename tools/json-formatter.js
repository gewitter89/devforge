/* ============================================================
   DevForge Tool — JSON Formatter & Validator
   ============================================================ */

DevForge.registerTool({
  id: 'json-formatter',
  name: 'JSON Formatter',
  description: 'Format, minify, and validate JSON with syntax highlighting',
  category: 'formatters',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h2"/><path d="M4 10h2"/><path d="M4 14h2"/><path d="M4 18h2"/><path d="M8 6h12"/><path d="M8 10h12"/><path d="M8 14h8"/><path d="M8 18h10"/></svg>',
  tags: ['json', 'format', 'beautify', 'minify', 'validate', 'pretty print'],

  render() {
    return `
      <div class="tool-options" style="margin-bottom:12px;">
        <div class="tool-option">
          <label>Indent</label>
          <select id="json-formatter-indent">
            <option value="2" selected>2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab</option>
          </select>
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-left:auto;font-size:13px;opacity:.7;">
          <span id="json-formatter-status" style="display:inline-flex;align-items:center;gap:4px;"></span>
          <span id="json-formatter-lines" style="margin-left:10px;"></span>
        </div>
      </div>
      <div class="tool-split">
        <div class="tool-group">
          <label>Input JSON</label>
          <textarea id="json-formatter-input" class="tool-textarea" placeholder='{\n  "name": "DevForge",\n  "version": "1.0.0",\n  "tools": ["json", "base64", "hash"]\n}' spellcheck="false"></textarea>
        </div>
        <div class="tool-group">
          <label>Output</label>
          <div id="json-formatter-output" class="tool-result" style="min-height:220px;overflow:auto;white-space:pre;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.5;tab-size:2;"></div>
        </div>
      </div>
      <div class="tool-actions">
        <button class="tool-btn-primary" id="json-formatter-format">✦ Format</button>
        <button class="tool-btn" id="json-formatter-minify">⊟ Minify</button>
        <button class="tool-btn" id="json-formatter-copy">⧉ Copy</button>
        <button class="tool-btn" id="json-formatter-demo"></button>
        <button class="tool-btn" id="json-formatter-clear">✕ Clear</button>
      </div>
    `;
  },

  init() {
    const input = document.getElementById('json-formatter-input');
    const output = document.getElementById('json-formatter-output');
    const indentSel = document.getElementById('json-formatter-indent');
    const status = document.getElementById('json-formatter-status');
    const linesEl = document.getElementById('json-formatter-lines');
    const demoBtn = document.getElementById('json-formatter-demo');
    const clearBtn = document.getElementById('json-formatter-clear');
    const copyBtn = document.getElementById('json-formatter-copy');

    const t = k => (window.i18n ? window.i18n.t(k) : k);

    // Apply translations to UI buttons
    if (demoBtn) demoBtn.textContent = t('loadDemo');
    if (clearBtn) clearBtn.textContent = '✕ ' + t('clear');
    if (copyBtn) copyBtn.textContent = '⧉ ' + t('copy');

    let lastFormatted = '';

    const DEMO_JSON = {
      project: 'DevForge',
      type: 'Developer Toolkit',
      meta: {
        stars: 0,
        license: 'MIT',
        active: true
      },
      tags: ['open-source', 'web-tools', 'vanilla-js'],
      features: [
        '15+ built-in utilities',
        'i18n multi-language support',
        'Command palette CLI mode',
        'Local private execution'
      ]
    };

    function getIndent() {
      const v = indentSel.value;
      return v === 'tab' ? '\t' : Number(v);
    }

    function syntaxHighlight(json) {
      // Escape HTML
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      return json.replace(
        /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
          let color = '#b5cea8'; // number — green
          let style = '';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              // key
              color = '#9cdcfe';
              style = 'font-weight:500;';
            } else {
              // string value
              color = '#ce9178';
            }
          } else if (/true|false/.test(match)) {
            color = '#569cd6';
          } else if (/null/.test(match)) {
            color = '#c586c0';
            style = 'font-style:italic;';
          }
          return '<span style="color:' + color + ';' + style + '">' + match + '</span>';
        }
      );
    }

    function countLines(text) {
      if (!text) return 0;
      return text.split('\n').length;
    }

    function updateStatus(valid, errorMsg) {
      if (valid) {
        status.innerHTML = '<span style="color:#4ade80;">● Valid JSON</span>';
      } else {
        status.innerHTML = '<span style="color:#f87171;">● ' + escapeHtml(errorMsg) + '</span>';
      }
    }

    function escapeHtml(s) {
      return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function updateLines(text) {
      const c = countLines(text);
      linesEl.textContent = text ? c + ' line' + (c !== 1 ? 's' : '') : '';
    }

    function formatJSON() {
      const raw = input.value.trim();
      if (!raw) {
        output.textContent = '';
        status.innerHTML = '';
        linesEl.textContent = '';
        lastFormatted = '';
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        const indent = getIndent();
        const formatted = JSON.stringify(parsed, null, indent);
        lastFormatted = formatted;
        output.innerHTML = syntaxHighlight(formatted);
        output.classList.remove('error');
        output.classList.add('success');
        updateStatus(true);
        updateLines(formatted);
      } catch (e) {
        const msg = e.message;
        output.textContent = '❌ ' + msg;
        output.classList.remove('success');
        output.classList.add('error');
        updateStatus(false, msg);
        lastFormatted = '';
        linesEl.textContent = '';
      }
    }

    function minifyJSON() {
      const raw = input.value.trim();
      if (!raw) return;

      try {
        const parsed = JSON.parse(raw);
        const minified = JSON.stringify(parsed);
        lastFormatted = minified;
        output.innerHTML = syntaxHighlight(minified);
        output.classList.remove('error');
        output.classList.add('success');
        updateStatus(true);
        updateLines(minified);
      } catch (e) {
        output.textContent = '❌ ' + e.message;
        output.classList.remove('success');
        output.classList.add('error');
        updateStatus(false, e.message);
        lastFormatted = '';
      }
    }

    // Real-time validation on input
    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(formatJSON, 200);
    });

    indentSel.addEventListener('change', formatJSON);

    document.getElementById('json-formatter-format').addEventListener('click', formatJSON);
    document.getElementById('json-formatter-minify').addEventListener('click', minifyJSON);

    document.getElementById('json-formatter-copy').addEventListener('click', () => {
      if (lastFormatted) {
        DevForge.copyToClipboard(lastFormatted);
      } else {
        DevForge.toast('Nothing to copy', 'error');
      }
    });

    document.getElementById('json-formatter-demo').addEventListener('click', () => {
      input.value = JSON.stringify(DEMO_JSON, null, 2);
      formatJSON();
      if (window.SoundFX) window.SoundFX.playSuccess();
      if (window.confetti) {
        window.confetti({ particleCount: 40, spread: 35, origin: { y: 0.8 } });
      }
    });

    document.getElementById('json-formatter-clear').addEventListener('click', () => {
      input.value = '';
      output.innerHTML = '';
      output.classList.remove('success', 'error');
      status.innerHTML = '';
      linesEl.textContent = '';
      lastFormatted = '';
      input.focus();
      if (window.SoundFX) window.SoundFX.playClick();
    });

    // Process if there's initial content
    if (input.value.trim()) formatJSON();
  }
});
