/* ============================================================
   DevForge Tool — Base64 Encoder / Decoder
   ============================================================ */

DevForge.registerTool({
  id: 'base64-codec',
  name: 'Base64 Encode/Decode',
  description: 'Encode text to Base64 or decode Base64 to text with UTF-8 support',
  category: 'encoders',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>',
  tags: ['base64', 'encode', 'decode', 'binary', 'text', 'utf8'],

  render() {
    return `
      <div class="tool-options" style="margin-bottom:12px;">
        <div class="tool-option">
          <label>Mode</label>
          <select id="base64-mode">
            <option value="encode" selected>Encode</option>
            <option value="decode">Decode</option>
          </select>
        </div>
        <div class="tool-option">
          <label>File → Base64</label>
          <input type="file" id="base64-file" style="font-size:12px;max-width:200px;">
        </div>
        <div style="margin-left:auto;display:flex;align-items:center;gap:8px;font-size:13px;opacity:.7;">
          <span id="base64-size"></span>
        </div>
      </div>
      <div class="tool-split">
        <div class="tool-group">
          <label id="base64-input-label">Input (Text)</label>
          <textarea id="base64-input" class="tool-textarea" placeholder="Enter text to encode to Base64..." spellcheck="false"></textarea>
        </div>
        <div class="tool-group">
          <label id="base64-output-label">Output (Base64)</label>
          <textarea id="base64-output" class="tool-textarea" placeholder="Base64 output will appear here..." spellcheck="false" readonly></textarea>
        </div>
      </div>
      <div class="tool-actions">
        <button class="tool-btn-primary" id="base64-encode-btn">🔒 Encode</button>
        <button class="tool-btn" id="base64-decode-btn">🔓 Decode</button>
        <button class="tool-btn" id="base64-swap-btn">⇄ Swap</button>
        <button class="tool-btn" id="base64-copy-btn">⧉ Copy Output</button>
        <button class="tool-btn" id="base64-clear-btn">✕ Clear</button>
      </div>
    `;
  },

  init() {
    const input = document.getElementById('base64-input');
    const output = document.getElementById('base64-output');
    const modeSel = document.getElementById('base64-mode');
    const sizeEl = document.getElementById('base64-size');
    const fileInput = document.getElementById('base64-file');
    const inputLabel = document.getElementById('base64-input-label');
    const outputLabel = document.getElementById('base64-output-label');

    function utf8ToBase64(str) {
      return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
    }

    function base64ToUtf8(b64) {
      return decodeURIComponent(
        atob(b64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    }

    function updateSize(text) {
      const bytes = new Blob([text]).size;
      if (bytes < 1024) {
        sizeEl.textContent = bytes + ' bytes';
      } else if (bytes < 1048576) {
        sizeEl.textContent = (bytes / 1024).toFixed(1) + ' KB';
      } else {
        sizeEl.textContent = (bytes / 1048576).toFixed(2) + ' MB';
      }
    }

    function updateLabels() {
      const mode = modeSel.value;
      if (mode === 'encode') {
        inputLabel.textContent = 'Input (Text)';
        outputLabel.textContent = 'Output (Base64)';
        input.placeholder = 'Enter text to encode to Base64...';
      } else {
        inputLabel.textContent = 'Input (Base64)';
        outputLabel.textContent = 'Output (Text)';
        input.placeholder = 'Enter Base64 string to decode...';
      }
    }

    function encode() {
      const raw = input.value;
      if (!raw) { output.value = ''; sizeEl.textContent = ''; return; }
      try {
        const result = utf8ToBase64(raw);
        output.value = result;
        updateSize(result);
      } catch (e) {
        output.value = '❌ Encoding error: ' + e.message;
        sizeEl.textContent = '';
      }
    }

    function decode() {
      const raw = input.value.trim();
      if (!raw) { output.value = ''; sizeEl.textContent = ''; return; }
      try {
        const result = base64ToUtf8(raw);
        output.value = result;
        updateSize(result);
      } catch (e) {
        output.value = '❌ Invalid Base64 string: ' + e.message;
        sizeEl.textContent = '';
      }
    }

    function process() {
      if (modeSel.value === 'encode') {
        encode();
      } else {
        decode();
      }
    }

    // Real-time conversion
    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(process, 150);
    });

    modeSel.addEventListener('change', () => {
      updateLabels();
      process();
    });

    document.getElementById('base64-encode-btn').addEventListener('click', () => {
      modeSel.value = 'encode';
      updateLabels();
      encode();
    });

    document.getElementById('base64-decode-btn').addEventListener('click', () => {
      modeSel.value = 'decode';
      updateLabels();
      decode();
    });

    document.getElementById('base64-swap-btn').addEventListener('click', () => {
      const tmp = input.value;
      input.value = output.value;
      output.value = tmp;
      // Toggle mode
      modeSel.value = modeSel.value === 'encode' ? 'decode' : 'encode';
      updateLabels();
      process();
    });

    document.getElementById('base64-copy-btn').addEventListener('click', () => {
      if (output.value && !output.value.startsWith('❌')) {
        DevForge.copyToClipboard(output.value);
      } else {
        DevForge.toast('Nothing to copy', 'error');
      }
    });

    document.getElementById('base64-clear-btn').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      sizeEl.textContent = '';
      fileInput.value = '';
      input.focus();
    });

    // File to Base64
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      modeSel.value = 'encode';
      updateLabels();

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1] || reader.result;
        input.value = '[File: ' + file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)]';
        output.value = base64;
        updateSize(base64);
        DevForge.toast('File converted to Base64', 'success');
      };
      reader.onerror = () => {
        DevForge.toast('Failed to read file', 'error');
      };
      reader.readAsDataURL(file);
    });

    updateLabels();
  }
});
