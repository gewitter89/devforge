/* ============================================================
   DevForge Tool — Password Generator
   Generate secure passwords with entropy analysis
   ============================================================ */

DevForge.registerTool({
  id: 'password-generator',
  name: 'Password Generator',
  description: 'Generate cryptographically secure passwords with strength analysis',
  category: 'generators',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/></svg>',
  tags: ['password', 'generator', 'security', 'random', 'crypto', 'entropy'],

  render() {
    return `
      <div class="tool-full">
        <!-- Length Control -->
        <div class="tool-group">
          <label>Password Length</label>
          <div style="display:flex;align-items:center;gap:var(--space-md);">
            <input type="range" id="password-generator-slider" min="8" max="128" value="20"
              style="flex:1;accent-color:#8b5cf6;cursor:pointer;">
            <input type="number" id="password-generator-length" min="8" max="128" value="20"
              class="tool-input" style="width:80px;text-align:center;height:38px;">
          </div>
        </div>

        <!-- Character Options -->
        <div class="tool-options" style="flex-wrap:wrap;gap:var(--space-md);">
          <label class="tool-checkbox">
            <input type="checkbox" id="password-generator-upper" checked> Uppercase (A-Z)
          </label>
          <label class="tool-checkbox">
            <input type="checkbox" id="password-generator-lower" checked> Lowercase (a-z)
          </label>
          <label class="tool-checkbox">
            <input type="checkbox" id="password-generator-numbers" checked> Numbers (0-9)
          </label>
          <label class="tool-checkbox">
            <input type="checkbox" id="password-generator-symbols" checked> Symbols (!@#$...)
          </label>
          <label class="tool-checkbox">
            <input type="checkbox" id="password-generator-ambiguous"> Exclude Ambiguous (0O1lI|)
          </label>
        </div>

        <!-- Custom Exclude -->
        <div class="tool-group">
          <label>Exclude Custom Characters</label>
          <input type="text" id="password-generator-exclude" class="tool-input"
            placeholder='e.g. {}[]()/"' style="font-family:'JetBrains Mono',monospace;font-size:0.85rem;">
        </div>

        <!-- Generated Password -->
        <div class="tool-group">
          <label>Generated Password</label>
          <div class="tool-inline-result" style="font-size:1.1rem;padding:var(--space-md) var(--space-lg);min-height:52px;">
            <span id="password-generator-output" style="flex:1;word-break:break-all;letter-spacing:0.5px;"></span>
            <span class="copy-icon" id="password-generator-copy" style="cursor:pointer;">${DevForge.COPY_ICON}</span>
          </div>
        </div>

        <!-- Strength & Entropy -->
        <div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-md);flex-wrap:wrap;">
          <div style="flex:1;min-width:200px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
              <span style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;">Strength</span>
              <span id="password-generator-strength-label" style="font-size:0.8rem;font-weight:600;"></span>
            </div>
            <div class="strength-meter" style="height:6px;">
              <div class="strength-meter-fill" id="password-generator-meter" style="width:0%;"></div>
            </div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.75rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:600;">Entropy</span>
            <div id="password-generator-entropy" style="font-size:1rem;font-weight:700;font-family:'JetBrains Mono',monospace;color:var(--text-accent);"></div>
          </div>
        </div>

        <!-- Actions -->
        <div class="tool-actions">
          <button class="tool-btn tool-btn-primary" id="password-generator-generate">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Generate New
          </button>
        </div>

        <!-- Bulk Generation -->
        <div class="tool-group" style="margin-top:var(--space-md);">
          <label style="display:flex;align-items:center;gap:var(--space-md);">
            Bulk Generate
            <input type="number" id="password-generator-bulk-count" min="2" max="50" value="5"
              class="tool-input" style="width:70px;height:32px;text-align:center;font-size:0.8rem;">
            <span style="font-size:0.8rem;color:var(--text-tertiary);">passwords</span>
            <button class="tool-btn tool-btn-sm" id="password-generator-bulk-btn">Generate</button>
            <button class="tool-btn tool-btn-sm" id="password-generator-bulk-copy" style="display:none;">Copy All</button>
          </label>
          <div id="password-generator-bulk-output" class="tool-result" style="min-height:0;max-height:300px;overflow-y:auto;display:none;font-size:0.82rem;margin-top:var(--space-sm);"></div>
        </div>
      </div>
    `;
  },

  init() {
    const slider = document.getElementById('password-generator-slider');
    const lengthInput = document.getElementById('password-generator-length');
    const upperCb = document.getElementById('password-generator-upper');
    const lowerCb = document.getElementById('password-generator-lower');
    const numbersCb = document.getElementById('password-generator-numbers');
    const symbolsCb = document.getElementById('password-generator-symbols');
    const ambiguousCb = document.getElementById('password-generator-ambiguous');
    const excludeInput = document.getElementById('password-generator-exclude');
    const output = document.getElementById('password-generator-output');
    const copyBtn = document.getElementById('password-generator-copy');
    const genBtn = document.getElementById('password-generator-generate');
    const meter = document.getElementById('password-generator-meter');
    const strengthLabel = document.getElementById('password-generator-strength-label');
    const entropyEl = document.getElementById('password-generator-entropy');
    const bulkBtn = document.getElementById('password-generator-bulk-btn');
    const bulkCount = document.getElementById('password-generator-bulk-count');
    const bulkOutput = document.getElementById('password-generator-bulk-output');
    const bulkCopy = document.getElementById('password-generator-bulk-copy');

    const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWER = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBERS = '0123456789';
    const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    const AMBIGUOUS = '0O1lI|';

    function getCharset() {
      let chars = '';
      if (upperCb.checked) chars += UPPER;
      if (lowerCb.checked) chars += LOWER;
      if (numbersCb.checked) chars += NUMBERS;
      if (symbolsCb.checked) chars += SYMBOLS;

      if (ambiguousCb.checked) {
        chars = chars.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
      }

      const exclude = excludeInput.value;
      if (exclude) {
        chars = chars.split('').filter(c => !exclude.includes(c)).join('');
      }

      return [...new Set(chars.split(''))].join('');
    }

    function generatePassword(len) {
      const charset = getCharset();
      if (charset.length === 0) return '';
      const array = new Uint32Array(len);
      crypto.getRandomValues(array);
      return Array.from(array, v => charset[v % charset.length]).join('');
    }

    function calcEntropy(len) {
      const charset = getCharset();
      if (charset.length === 0) return 0;
      return Math.floor(len * Math.log2(charset.length));
    }

    function getStrength(entropy) {
      if (entropy < 40) return { label: 'Weak', color: '#ef4444', pct: 20 };
      if (entropy < 60) return { label: 'Fair', color: '#f59e0b', pct: 40 };
      if (entropy < 80) return { label: 'Strong', color: '#22c55e', pct: 70 };
      return { label: 'Very Strong', color: '#06b6d4', pct: 100 };
    }

    function generate() {
      const len = parseInt(lengthInput.value) || 20;
      const password = generatePassword(len);
      if (!password) {
        output.textContent = 'Select at least one character type';
        meter.style.width = '0%';
        strengthLabel.textContent = '';
        entropyEl.textContent = '0 bits';
        return;
      }
      output.textContent = password;

      const entropy = calcEntropy(len);
      const strength = getStrength(entropy);
      meter.style.width = strength.pct + '%';
      meter.style.background = strength.color;
      strengthLabel.textContent = strength.label;
      strengthLabel.style.color = strength.color;
      entropyEl.textContent = entropy + ' bits';
    }

    // Sync slider & number input
    slider.addEventListener('input', () => {
      lengthInput.value = slider.value; generate(); 
    });
    lengthInput.addEventListener('input', () => {
      const v = Math.max(8, Math.min(128, parseInt(lengthInput.value) || 8));
      slider.value = v;
      generate();
    });

    // Checkboxes & exclude
    [upperCb, lowerCb, numbersCb, symbolsCb, ambiguousCb].forEach(cb => cb.addEventListener('change', generate));
    excludeInput.addEventListener('input', generate);

    // Generate button
    genBtn.addEventListener('click', generate);

    // Copy
    copyBtn.addEventListener('click', () => {
      const text = output.textContent;
      if (text && text !== 'Select at least one character type') {
        DevForge.copyToClipboard(text);
      }
    });

    // Bulk generation
    bulkBtn.addEventListener('click', () => {
      const count = Math.max(2, Math.min(50, parseInt(bulkCount.value) || 5));
      const len = parseInt(lengthInput.value) || 20;
      const passwords = [];
      for (let i = 0; i < count; i++) {
        passwords.push(generatePassword(len));
      }
      bulkOutput.textContent = passwords.join('\n');
      bulkOutput.style.display = 'block';
      bulkCopy.style.display = 'inline-flex';
    });

    bulkCopy.addEventListener('click', () => {
      DevForge.copyToClipboard(bulkOutput.textContent);
    });

    // Initial generation
    generate();
  }
});
