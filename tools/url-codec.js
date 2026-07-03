/* ============================================================
   DevForge Tool — URL Encoder / Decoder & Parser
   ============================================================ */

DevForge.registerTool({
  id: 'url-codec',
  name: 'URL Encode/Decode',
  description: 'URL encode & decode strings, parse URLs into components, and build query strings',
  category: 'encoders',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  tags: ['url', 'encode', 'decode', 'uri', 'percent', 'query string', 'parse'],

  render() {
    return `
      <div class="tool-options" style="margin-bottom:12px;">
        <div class="tool-option">
          <label>Mode</label>
          <select id="url-codec-mode">
            <option value="component" selected>encodeURIComponent</option>
            <option value="uri">encodeURI</option>
          </select>
        </div>
      </div>
      <div class="tool-split">
        <div class="tool-group">
          <label>Input (Decoded)</label>
          <textarea id="url-codec-input" class="tool-textarea" placeholder="Enter text to URL-encode, e.g.:\nHello World! Special chars: @#$%^&*\nhttps://example.com/path?name=John Doe&city=New York" spellcheck="false"></textarea>
        </div>
        <div class="tool-group">
          <label>Output (Encoded)</label>
          <textarea id="url-codec-output" class="tool-textarea" placeholder="URL-encoded output will appear here..." spellcheck="false" readonly></textarea>
        </div>
      </div>
      <div class="tool-actions">
        <button class="tool-btn-primary" id="url-codec-encode">🔒 Encode</button>
        <button class="tool-btn" id="url-codec-decode">🔓 Decode</button>
        <button class="tool-btn" id="url-codec-swap">⇄ Swap</button>
        <button class="tool-btn" id="url-codec-copy">⧉ Copy</button>
        <button class="tool-btn" id="url-codec-clear">✕ Clear</button>
      </div>

      <!-- URL Parser Section -->
      <div style="margin-top:28px;border-top:1px solid var(--border);padding-top:20px;">
        <h3 style="margin:0 0 12px;font-size:15px;font-weight:600;">🔍 URL Parser</h3>
        <div class="tool-group">
          <label>Full URL</label>
          <input type="text" id="url-codec-parse-input" class="tool-input" placeholder="https://example.com:8080/path/page?key=value&name=test#section" spellcheck="false">
        </div>
        <button class="tool-btn-primary tool-btn-sm" id="url-codec-parse-btn" style="margin:8px 0 14px;">Parse URL</button>
        <div id="url-codec-parse-result" style="font-size:13px;"></div>
      </div>

      <!-- Query String Builder -->
      <div style="margin-top:28px;border-top:1px solid var(--border);padding-top:20px;">
        <h3 style="margin:0 0 12px;font-size:15px;font-weight:600;">🔧 Query String Builder</h3>
        <div id="url-codec-qs-rows"></div>
        <div class="tool-actions" style="margin-top:8px;">
          <button class="tool-btn-sm tool-btn" id="url-codec-qs-add">+ Add Parameter</button>
          <button class="tool-btn-sm tool-btn-primary" id="url-codec-qs-build">Build Query String</button>
        </div>
        <div id="url-codec-qs-result" class="tool-inline-result" style="margin-top:10px;display:none;">
          <code id="url-codec-qs-output" style="flex:1;word-break:break-all;font-size:13px;"></code>
          <span class="copy-icon" id="url-codec-qs-copy" title="Copy query string">${DevForge.COPY_ICON}</span>
        </div>
      </div>
    `;
  },

  init() {
    const input = document.getElementById('url-codec-input');
    const output = document.getElementById('url-codec-output');
    const modeSel = document.getElementById('url-codec-mode');

    function encodeFn(text) {
      return modeSel.value === 'component' ? encodeURIComponent(text) : encodeURI(text);
    }

    function decodeFn(text) {
      return modeSel.value === 'component' ? decodeURIComponent(text) : decodeURI(text);
    }

    function encode() {
      const raw = input.value;
      if (!raw) { output.value = ''; return; }
      try {
        output.value = encodeFn(raw);
      } catch (e) {
        output.value = '❌ ' + e.message;
      }
    }

    function decode() {
      const raw = input.value.trim();
      if (!raw) { output.value = ''; return; }
      try {
        output.value = decodeFn(raw);
      } catch (e) {
        output.value = '❌ ' + e.message;
      }
    }

    // Real-time encode on input
    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(encode, 150);
    });

    modeSel.addEventListener('change', encode);

    document.getElementById('url-codec-encode').addEventListener('click', encode);
    document.getElementById('url-codec-decode').addEventListener('click', () => {
      // Decode: use input value, put decoded in output
      const raw = input.value.trim();
      if (!raw) return;
      try {
        output.value = decodeFn(raw);
      } catch (e) {
        output.value = '❌ ' + e.message;
      }
    });

    document.getElementById('url-codec-swap').addEventListener('click', () => {
      const tmp = input.value;
      input.value = output.value;
      output.value = tmp;
    });

    document.getElementById('url-codec-copy').addEventListener('click', () => {
      if (output.value) DevForge.copyToClipboard(output.value);
      else DevForge.toast('Nothing to copy', 'error');
    });

    document.getElementById('url-codec-clear').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      input.focus();
    });

    // ---- URL Parser ----
    const parseInput = document.getElementById('url-codec-parse-input');
    const parseResult = document.getElementById('url-codec-parse-result');

    function escHtml(s) {
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function parseURL() {
      const raw = parseInput.value.trim();
      if (!raw) { parseResult.innerHTML = ''; return; }

      try {
        const url = new URL(raw);

        let paramsHtml = '';
        if (url.searchParams && [...url.searchParams].length > 0) {
          paramsHtml = `
            <table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:13px;">
              <thead>
                <tr style="text-align:left;border-bottom:1px solid var(--border);">
                  <th style="padding:4px 8px;opacity:.6;">Key</th>
                  <th style="padding:4px 8px;opacity:.6;">Value</th>
                </tr>
              </thead>
              <tbody>
                ${[...url.searchParams].map(([k, v]) =>
                  `<tr style="border-bottom:1px solid var(--border);">
                    <td style="padding:4px 8px;font-family:'JetBrains Mono',monospace;color:var(--accent);">${escHtml(k)}</td>
                    <td style="padding:4px 8px;font-family:'JetBrains Mono',monospace;">${escHtml(v)}</td>
                  </tr>`
                ).join('')}
              </tbody>
            </table>
          `;
        }

        const rows = [
          ['Protocol', url.protocol],
          ['Host', url.host],
          ['Hostname', url.hostname],
          ['Port', url.port || '(default)'],
          ['Pathname', url.pathname],
          ['Search', url.search || '(none)'],
          ['Hash', url.hash || '(none)'],
          ['Origin', url.origin],
        ];

        parseResult.innerHTML = `
          <div style="display:grid;grid-template-columns:120px 1fr;gap:4px 12px;font-family:'JetBrains Mono',monospace;">
            ${rows.map(([label, val]) => `
              <span style="opacity:.6;font-size:12px;text-transform:uppercase;padding:3px 0;">${label}</span>
              <span style="padding:3px 0;word-break:break-all;">${escHtml(val)}</span>
            `).join('')}
          </div>
          ${paramsHtml ? '<h4 style="margin:14px 0 4px;font-size:13px;font-weight:600;">Query Parameters</h4>' + paramsHtml : ''}
        `;
      } catch (e) {
        parseResult.innerHTML = '<span style="color:#f87171;">❌ Invalid URL: ' + escHtml(e.message) + '</span>';
      }
    }

    document.getElementById('url-codec-parse-btn').addEventListener('click', parseURL);
    parseInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') parseURL(); });
    parseInput.addEventListener('input', () => {
      clearTimeout(parseInput._t);
      parseInput._t = setTimeout(parseURL, 300);
    });

    // ---- Query String Builder ----
    const qsRows = document.getElementById('url-codec-qs-rows');
    const qsResult = document.getElementById('url-codec-qs-result');
    const qsOutput = document.getElementById('url-codec-qs-output');

    function createQSRow(key, value) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:8px;margin-bottom:6px;align-items:center;';
      row.innerHTML = `
        <input type="text" class="tool-input" placeholder="key" value="${escHtml(key || '')}" style="flex:1;" data-qs="key">
        <input type="text" class="tool-input" placeholder="value" value="${escHtml(value || '')}" style="flex:1;" data-qs="value">
        <button class="tool-btn-sm tool-btn" data-qs="remove" title="Remove" style="padding:4px 8px;">✕</button>
      `;
      row.querySelector('[data-qs="remove"]').addEventListener('click', () => { row.remove(); buildQS(); });
      // Real-time build
      row.querySelectorAll('input').forEach(inp => inp.addEventListener('input', buildQS));
      qsRows.appendChild(row);
    }

    function buildQS() {
      const rows = qsRows.querySelectorAll('div');
      const params = [];
      rows.forEach(row => {
        const key = row.querySelector('[data-qs="key"]').value.trim();
        const val = row.querySelector('[data-qs="value"]').value;
        if (key) params.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
      });
      if (params.length) {
        const qs = '?' + params.join('&');
        qsOutput.textContent = qs;
        qsResult.style.display = 'flex';
      } else {
        qsResult.style.display = 'none';
      }
    }

    document.getElementById('url-codec-qs-add').addEventListener('click', () => createQSRow('', ''));
    document.getElementById('url-codec-qs-build').addEventListener('click', buildQS);
    document.getElementById('url-codec-qs-copy').addEventListener('click', () => {
      if (qsOutput.textContent) DevForge.copyToClipboard(qsOutput.textContent);
    });
    document.getElementById('url-codec-qs-copy').style.cursor = 'pointer';

    // Add 2 initial rows
    createQSRow('', '');
    createQSRow('', '');
  }
});
