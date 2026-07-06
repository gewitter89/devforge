/* ============================================================
   DevForge Tool — JSON → TypeScript Interfaces
   Converts any JSON to TypeScript type definitions instantly.
   ============================================================ */

DevForge.registerTool({
  id: 'json-to-typescript',
  name: 'JSON → TypeScript',
  description: 'Convert JSON objects into TypeScript interface definitions',
  category: 'generators',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="12" y1="2" x2="12" y2="22"/></svg>',
  tags: ['json', 'typescript', 'types', 'interfaces', 'converter', 'schema'],

  render() {
    return `
      <div class="tool-options" style="margin-bottom:12px;">
        <div class="tool-option">
          <label>Interface name</label>
          <input type="text" id="j2ts-name" class="tool-input" value="RootType" style="max-width:160px;height:34px;">
        </div>
        <div class="tool-option">
          <label>Optional fields</label>
          <input type="checkbox" id="j2ts-optional">
        </div>
        <div class="tool-option">
          <label>Export</label>
          <input type="checkbox" id="j2ts-export" checked>
        </div>
      </div>
      <div class="tool-split">
        <div class="tool-group">
          <label>JSON Input</label>
          <textarea id="j2ts-input" class="tool-textarea" placeholder='{
  "name": "DevForge",
  "version": "2.0",
  "tools": ["json", "hash"],
  "config": { "dark": true, "lang": "en" }
}' spellcheck="false"></textarea>
        </div>
        <div class="tool-group">
          <label>TypeScript Output</label>
          <pre id="j2ts-output" class="tool-result" style="min-height:220px;overflow:auto;white-space:pre;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.5;"></pre>
        </div>
      </div>
      <div class="tool-actions">
        <button class="tool-btn-primary" id="j2ts-convert">⚡ Convert</button>
        <button class="tool-btn" id="j2ts-copy">⧉ Copy</button>
        <button class="tool-btn" id="j2ts-demo">💡 Demo</button>
        <button class="tool-btn" id="j2ts-clear">✕ Clear</button>
      </div>
    `;
  },

  init() {
    const input = document.getElementById('j2ts-input');
    const output = document.getElementById('j2ts-output');
    const nameInput = document.getElementById('j2ts-name');
    const optCheckbox = document.getElementById('j2ts-optional');
    const expCheckbox = document.getElementById('j2ts-export');

    const t = k => (window.i18n ? window.i18n.t(k) : k);

    const DEMO = JSON.stringify({
      id: 42,
      username: 'gewitter89',
      email: 'dev@devforge.dev',
      isActive: true,
      roles: ['admin', 'editor'],
      profile: {
        firstName: 'John',
        age: 30,
        settings: { theme: 'dark', notifications: true }
      }
    }, null, 2);

    function detectType(value) {
      if (value === null) return 'null';
      if (Array.isArray(value)) {
        if (value.length === 0) return 'unknown[]';
        const types = new Set(value.map(detectType));
        if (types.size === 1) return `${[...types][0]}[]`;
        return `(${[...types].join(' | ')})[]`;
      }
      if (typeof value === 'object') return '__OBJECT__';
      if (typeof value === 'string') return 'string';
      if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number';
      if (typeof value === 'boolean') return 'boolean';
      return 'unknown';
    }

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function toPascalCase(str) {
      return str.replace(/[^a-zA-Z0-9]/g, ' ').split(/\s+/).map(capitalize).join('');
    }

    function generate(obj, name, indent, isOptional, isExport, interfaces) {
      const fields = [];
      const subInterfaces = [];
      const opt = isOptional ? '?' : '';

      for (const [key, value] of Object.entries(obj)) {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
        let type = detectType(value);

        if (type === '__OBJECT__') {
          const subName = toPascalCase(key);
          subInterfaces.push(generate(value, subName, indent + 2, isOptional, false, interfaces));
          type = subName;
        }

        fields.push(`${indent}${safeKey}${opt}: ${type};`);
      }

      const keyword = isExport ? 'export interface' : 'interface';
      const lines = [...subInterfaces, `${keyword} ${name} {\n${fields.join('\n')}\n}`];
      return lines.join('\n\n');
    }

    function convert() {
      const raw = input.value.trim();
      if (!raw) {
        output.textContent = '';
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        const name = nameInput.value.trim() || 'RootType';
        const isOptional = optCheckbox.checked;
        const isExport = expCheckbox.checked;

        if (Array.isArray(parsed)) {
          const elemName = name;
          let inner = parsed[0] ? detectType(parsed[0]) : 'unknown';
          if (parsed[0] && typeof parsed[0] === 'object' && !Array.isArray(parsed[0])) {
            inner = elemName + 'Item';
            const result = generate(parsed[0], inner, '  ', isOptional, isExport, []);
            output.textContent = result + `\n\n${isExport ? 'export ' : ''}type ${elemName} = ${inner}[];`;
          } else {
            output.textContent = `${isExport ? 'export ' : ''}type ${elemName} = ${inner}[];`;
          }
        } else if (typeof parsed === 'object' && parsed !== null) {
          output.textContent = generate(parsed, name, '  ', isOptional, isExport, []);
        } else {
          output.textContent = `${isExport ? 'export ' : ''}type ${name} = ${detectType(parsed)};`;
        }

        if (window.SoundFX) window.SoundFX.playSuccess();
      } catch (err) {
        output.innerHTML = `<span style="color:var(--danger,#ef4444)">❌ ${err.message}</span>`;
        if (window.SoundFX) window.SoundFX.playError();
      }
    }

    input.addEventListener('input', () => {
      clearTimeout(input._timer);
      input._timer = setTimeout(convert, 300);
    });
    [nameInput, optCheckbox, expCheckbox].forEach(el => el.addEventListener('change', convert));

    document.getElementById('j2ts-convert').addEventListener('click', convert);
    document.getElementById('j2ts-copy').addEventListener('click', () => DevForge.copyToClipboard(output.textContent));
    document.getElementById('j2ts-demo').addEventListener('click', () => {
      input.value = DEMO;
      convert();
    });
    document.getElementById('j2ts-clear').addEventListener('click', () => {
      input.value = '';
      output.textContent = '';
    });

    document.getElementById('j2ts-demo').textContent = '💡 ' + (t('loadDemo') || 'Demo');
    document.getElementById('j2ts-clear').textContent = '✕ ' + (t('clear') || 'Clear');
    document.getElementById('j2ts-copy').textContent = '⧉ ' + (t('copy') || 'Copy');
  }
});
