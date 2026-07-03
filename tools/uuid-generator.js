DevForge.registerTool({
  id: 'uuid-generator',
  name: 'UUID Generator',
  description: 'Generate cryptographically secure UUID v4 and v7 identifiers.',
  category: 'generators',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  tags: ['uuid', 'guid', 'unique id', 'random', 'v4', 'v7', 'identifier'],

  render() {
    const isRu = (window.i18n && window.i18n.lang === 'ru');
    return `
      <div class="tool-full">
        <div class="tool-options" style="margin-bottom:16px;flex-wrap:wrap;">
          <div class="tool-option">
            <label>${isRu ? 'Количество' : 'Quantity'}</label>
            <input type="number" id="uuid-gen-qty" class="tool-input" value="5" min="1" max="100" style="width:80px;">
          </div>
          
          <div class="tool-option">
            <label>${isRu ? 'Версия' : 'Version'}</label>
            <select id="uuid-gen-ver" style="padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-primary); background: var(--bg-input); color: var(--text-primary); font-size: 0.85rem; outline: none; cursor: pointer;">
              <option value="v4">UUID v4 (Random)</option>
              <option value="v7">UUID v7 (Time-Ordered)</option>
            </select>
          </div>

          <label class="tool-checkbox">
            <input type="checkbox" id="uuid-gen-uppercase">
            ${isRu ? 'Верхний регистр' : 'Uppercase'}
          </label>
          <label class="tool-checkbox">
            <input type="checkbox" id="uuid-gen-hyphens" checked>
            ${isRu ? 'Дефисы' : 'Hyphens'}
          </label>
          <div style="margin-left:auto;display:flex;gap:8px;">
            <button class="tool-btn-primary" id="uuid-gen-generate">⟳ ${isRu ? 'Создать' : 'Generate'}</button>
            <button class="tool-btn" id="uuid-gen-copyall">${isRu ? 'Копировать всё' : 'Copy All'}</button>
          </div>
        </div>

        <div id="uuid-gen-list" style="display:flex;flex-direction:column;gap:6px;"></div>

        <p style="margin-top:14px;font-size:12px;opacity:.5;">
          ${isRu 
            ? 'UUID генерируются на основе безопасных псевдослучайных чисел API <code>crypto.getRandomValues()</code>.' 
            : 'UUIDs are generated using <code>crypto.getRandomValues()</code> — cryptographically secure random values.'
          }
        </p>
      </div>
    `;
  },

  init() {
    const qtyInput = document.getElementById('uuid-gen-qty');
    const versionSelect = document.getElementById('uuid-gen-ver');
    const uppercaseChk = document.getElementById('uuid-gen-uppercase');
    const hyphensChk = document.getElementById('uuid-gen-hyphens');
    const listEl = document.getElementById('uuid-gen-list');

    function generateUUIDv4() {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      return bytesToUuid(bytes);
    }

    function generateUUIDv7() {
      // RFC 9562 UUID v7 (Unix millisecond timestamp + random bits)
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      
      const timestamp = Date.now();
      
      // Timestamp takes up the first 48 bits (6 bytes)
      bytes[0] = (timestamp / 0x10000000000) & 0xff;
      bytes[1] = (timestamp / 0x100000000) & 0xff;
      bytes[2] = (timestamp / 0x1000000) & 0xff;
      bytes[3] = (timestamp / 0x10000) & 0xff;
      bytes[4] = (timestamp / 0x100) & 0xff;
      bytes[5] = timestamp & 0xff;

      // Set version (0111 = 7) and variant (10xx = 2)
      bytes[6] = (bytes[6] & 0x0f) | 0x70;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;

      return bytesToUuid(bytes);
    }

    function bytesToUuid(bytes) {
      const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'));
      return [
        hex.slice(0, 4).join(''),
        hex.slice(4, 6).join(''),
        hex.slice(6, 8).join(''),
        hex.slice(8, 10).join(''),
        hex.slice(10, 16).join('')
      ].join('-');
    }

    function formatUUID(uuid) {
      let result = uuid;
      if (!hyphensChk.checked) {
        result = result.replace(/-/g, '');
      }
      if (uppercaseChk.checked) {
        result = result.toUpperCase();
      }
      return result;
    }

    function generate() {
      let qty = parseInt(qtyInput.value, 10);
      if (isNaN(qty) || qty < 1) qty = 1;
      if (qty > 100) qty = 100;
      qtyInput.value = qty;

      listEl.innerHTML = '';
      const version = versionSelect.value;

      for (let i = 0; i < qty; i++) {
        const raw = version === 'v7' ? generateUUIDv7() : generateUUIDv4();
        const uuid = formatUUID(raw);

        const row = document.createElement('div');
        row.className = 'tool-inline-result';
        row.innerHTML = `
          <span style="opacity:.4;font-size:12px;min-width:28px;text-align:right;">${i + 1}.</span>
          <code style="flex:1;font-size:13.5px;letter-spacing:.3px;word-break:break-all;">${uuid}</code>
          <span class="copy-icon" title="Copy UUID" style="cursor:pointer;">${DevForge.COPY_ICON}</span>
        `;

        row.querySelector('.copy-icon').addEventListener('click', () => {
          DevForge.copyToClipboard(uuid);
        });

        listEl.appendChild(row);
      }
    }

    document.getElementById('uuid-gen-generate').addEventListener('click', () => {
      generate();
      if (window.SoundFX) window.SoundFX.playSuccess();
    });

    document.getElementById('uuid-gen-copyall').addEventListener('click', () => {
      const uuids = Array.from(listEl.querySelectorAll('code')).map(el => el.textContent);
      if (uuids.length) {
        DevForge.copyToClipboard(uuids.join('\n'));
      } else {
        const isRu = (window.i18n && window.i18n.lang === 'ru');
        DevForge.toast(isRu ? 'Сначала сгенерируйте UUID' : 'Generate UUIDs first', 'error');
      }
    });

    uppercaseChk.addEventListener('change', () => {
      listEl.querySelectorAll('code').forEach(el => {
        let text = el.textContent;
        el.textContent = uppercaseChk.checked ? text.toUpperCase() : text.toLowerCase();
      });
    });

    hyphensChk.addEventListener('change', () => {
      listEl.querySelectorAll('code').forEach(el => {
        let text = el.textContent;
        if (hyphensChk.checked) {
          const clean = text.replace(/-/g, '');
          el.textContent = [clean.slice(0,8), clean.slice(8,12), clean.slice(12,16), clean.slice(16,20), clean.slice(20)].join('-');
        } else {
          el.textContent = text.replace(/-/g, '');
        }
      });
    });

    qtyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') generate();
    });

    generate();
  }
});
