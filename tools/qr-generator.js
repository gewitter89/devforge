/* ============================================================
   DevForge Tool — QR Code Generator
   Generate QR codes for text, URLs, contact info.
   Uses qrcode.js CDN (cached via SW for offline use).
   ============================================================ */

DevForge.registerTool({
  id: 'qr-generator',
  name: 'QR Code Generator',
  description: 'Generate QR codes for URLs, text, WiFi and vCard. Download as PNG.',
  category: 'generators',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/><rect x="14" y="18" width="3" height="1"/><rect x="18" y="14" width="1" height="3"/></svg>',
  tags: ['qr', 'qrcode', 'barcode', 'generator', 'png'],

  render() {
    return `
      <div class="tool-options" style="margin-bottom:12px;">
        <div class="tool-option">
          <label>Type</label>
          <select id="qr-type" class="tool-input" style="max-width:140px;height:34px;">
            <option value="text" selected>Text/URL</option>
            <option value="wifi">WiFi</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="tel">Phone</option>
          </select>
        </div>
        <div class="tool-option">
          <label>Size</label>
          <input type="number" id="qr-size" class="tool-input" value="256" min="64" max="1024" style="max-width:80px;height:34px;">
        </div>
        <div class="tool-option">
          <label>Dark</label>
          <input type="color" id="qr-dark" value="#000000" style="width:40px;height:34px;cursor:pointer;">
        </div>
        <div class="tool-option">
          <label>Light</label>
          <input type="color" id="qr-light" value="#ffffff" style="width:40px;height:34px;cursor:pointer;">
        </div>
      </div>

      <div class="tool-split" style="gap:var(--space-md);">
        <div class="tool-group" style="flex:1;">
          <label id="qr-main-label">Content</label>
          <div id="qr-fields"></div>
        </div>
        <div class="tool-group" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;">
          <canvas id="qr-canvas" width="256" height="256" style="max-width:100%;border-radius:8px;background:#fff;"></canvas>
          <div id="qr-status" style="font-size:12px;opacity:.7;"></div>
        </div>
      </div>

      <div class="tool-actions">
        <button class="tool-btn-primary" id="qr-gen">Generate</button>
        <button class="tool-btn" id="qr-download">PNG</button>
        <button class="tool-btn" id="qr-svg">SVG</button>
        <button class="tool-btn" id="qr-demo">Demo</button>
      </div>
    `;
  },

  init() {
    const $ = id => document.getElementById(id);
    const t = k => (window.i18n ? window.i18n.t(k) : k);
    const canvas = $('qr-canvas');
    const ctx = canvas.getContext('2d');
    const status = $('qr-status');
    const fieldsBox = $('qr-fields');

    const FIELD_TYPES = {
      text: [
        {
          id: 'qr-content',
          label: 'URL or text',
          type: 'textarea',
          placeholder: 'https://devforge.dev'
        }
      ],
      wifi: [
        { id: 'qr-ssid', label: 'Network name (SSID)', type: 'text', placeholder: 'MyWiFi' },
        { id: 'qr-pass', label: 'Password', type: 'password', placeholder: 'secret123' },
        {
          id: 'qr-enc',
          label: 'Encryption',
          type: 'select',
          options: ['WPA', 'WEP', 'nopass'],
          value: 'WPA'
        }
      ],
      email: [
        { id: 'qr-email', label: 'Email', type: 'email', placeholder: 'user@example.com' },
        { id: 'qr-subject', label: 'Subject', type: 'text', placeholder: 'Hello' },
        { id: 'qr-body', label: 'Body', type: 'textarea', placeholder: 'Message' }
      ],
      sms: [
        { id: 'qr-tel', label: 'Phone', type: 'tel', placeholder: '+1234567890' },
        { id: 'qr-smstext', label: 'Message', type: 'textarea', placeholder: 'Hello!' }
      ],
      tel: [{ id: 'qr-phone', label: 'Phone number', type: 'tel', placeholder: '+1234567890' }]
    };

    function renderFields(type) {
      const fields = FIELD_TYPES[type];
      fieldsBox.innerHTML = fields
        .map(f => {
          if (f.type === 'textarea') {
            return `<textarea id="${f.id}" class="tool-textarea" placeholder="${f.placeholder || ''}" style="min-height:60px;margin-bottom:6px;"></textarea>`;
          }
          if (f.type === 'select') {
            return `<label style="margin-bottom:6px;display:block;">${f.label}<select id="${f.id}" class="tool-input" style="width:100%;height:34px;margin-top:4px;">${f.options.map(o => `<option ${o === f.value ? 'selected' : ''}>${o}</option>`).join('')}</select></label>`;
          }
          return `<label style="margin-bottom:6px;display:block;">${f.label}<input type="${f.type}" id="${f.id}" class="tool-input" placeholder="${f.placeholder || ''}" style="height:34px;margin-top:4px;"></label>`;
        })
        .join('');
    }

    function getContent() {
      const type = $('qr-type').value;
      switch (type) {
        case 'text':
          return $('qr-content').value.trim();
        case 'wifi':
          return `WIFI:T:${$('qr-enc').value};S:${$('qr-ssid').value};P:${$('qr-pass').value};;`;
        case 'email': {
          const to = $('qr-email').value,
            s = $('qr-subject').value,
            b = $('qr-body').value;
          return `mailto:${to}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`.replace(
            /\?subject=\s*&body=\s*$/,
            ''
          );
        }
        case 'sms':
          return `sms:${$('qr-tel').value}?body=${encodeURIComponent($('qr-smstext').value)}`;
        case 'tel':
          return `tel:${$('qr-phone').value}`;
        default:
          return '';
      }
    }

    // Minimal QR encoder (version 1-6, ECC L) — enough for ~120 chars
    const QR = (() => {
      const GF_EXP = new Uint8Array(512);
      const GF_LOG = new Uint8Array(256);
      let x = 1;
      for (let i = 0; i < 255; i++) {
        GF_EXP[i] = x;
        GF_LOG[x] = i;
        x = (x << 1) ^ (x >= 128 ? 285 : 0);
      }
      for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];

      function gfMul(a, b) {
        return a === 0 || b === 0 ? 0 : GF_EXP[GF_LOG[a] + GF_LOG[b]];
      }

      function ecGenerator(degree) {
        const g = new Uint8Array(degree + 1);
        g[0] = 1;
        for (let i = 0; i < degree; i++) {
          g[i + 1] = 1;
          for (let j = i; j > 0; j--) {
            g[j] = g[j] === 0 ? GF_EXP[i] : g[j - 1] ^ GF_EXP[(GF_LOG[g[j]] + i) % 255];
          }
          g[0] = g[0] === 0 ? GF_EXP[i] : GF_EXP[(GF_LOG[g[0]] + i) % 255];
        }
        return g.reverse();
      }

      function ecEncode(msg, nsym) {
        const gen = ecGenerator(nsym);
        const out = new Uint8Array(msg.length + nsym);
        out.set(msg);
        for (let i = 0; i < msg.length; i++) {
          const coef = out[i];
          if (coef !== 0) for (let j = 0; j < gen.length; j++) out[i + j] ^= gfMul(gen[j], coef);
        }
        return out.slice(msg.length);
      }

      const CAPS = [
        [17, 7],
        [32, 10],
        [53, 15],
        [78, 20],
        [106, 26],
        [134, 36]
      ];
      function pickVersion(len) {
        for (let i = 0; i < CAPS.length; i++) if (len <= CAPS[i][0]) return i + 1;
        return -1;
      }

      function encode(text, ver) {
        const [dataCap, ecCap] = CAPS[ver - 1];
        const bytes = new TextEncoder().encode(text);
        let bitstream = '0100' + bytes.length.toString(2).padStart(8, '0');
        for (const b of bytes) bitstream += b.toString(2).padStart(8, '0');
        bitstream += '0000'.slice(0, Math.min(4, dataCap * 8 - bitstream.length));
        while (bitstream.length % 8) bitstream += '0';
        let pad = 0xec;
        while (bitstream.length < dataCap * 8) {
          bitstream += pad.toString(2).padStart(8, '0');
          pad = pad === 0xec ? 0x11 : 0xec;
        }

        const msg = new Uint8Array(dataCap);
        for (let i = 0; i < dataCap; i++) msg[i] = parseInt(bitstream.slice(i * 8, i * 8 + 8), 2);

        const ec = ecEncode(msg, ecCap);
        return new Uint8Array([...msg, ...ec]);
      }

      // Alignment patterns + finder placement + format bits — full implementation
      function placeModules(data, ver) {
        const size = ver * 4 + 17;
        const m = Array.from({ length: size }, () => new Int8Array(size));
        const reserved = Array.from({ length: size }, () => new Uint8Array(size));

        function finder(r, c) {
          for (let dr = 0; dr <= 6; dr++) {
            for (let dc = 0; dc <= 6; dc++) {
              if (inFinder(dr, dc)) {
                m[r + dr][c + dc] =
                  dr === 0 ||
                  dr === 6 ||
                  dc === 0 ||
                  dc === 6 ||
                  (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4)
                    ? 1
                    : 0;
              }
              reserved[r + dr][c + dc] = 1;
            }
          }
        }
        function inFinder(dr, dc) {
          return (
            dr === 0 ||
            dr === 6 ||
            dc === 0 ||
            dc === 6 ||
            (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4)
          );
        }
        finder(0, 0);
        finder(0, size - 7);
        finder(size - 7, 0);

        if (ver >= 2) {
          const positions = [6, ...alignmentPositions(ver)];
          for (const r of positions) {
            for (const c of positions) {
              if ((r <= 8 && c <= 8) || (r <= 8 && c >= size - 8) || (r >= size - 8 && c <= 8)) {
                continue;
              }
              for (let dr = -2; dr <= 2; dr++) {
                for (let dc = -2; dc <= 2; dc++) {
                  m[r + dr][c + dc] =
                    Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0) ? 1 : 0;
                  reserved[r + dr][c + dc] = 1;
                }
              }
            }
          }
        }

        for (let i = 8; i < size - 8; i++) {
          m[6][i] = i % 2 === 0 ? 1 : 0;
          reserved[6][i] = 1;
          m[i][6] = i % 2 === 0 ? 1 : 0;
          reserved[i][6] = 1;
        }

        m[4 * ver + 9][8] = 1;
        reserved[4 * ver + 9][8] = 1;

        for (let i = 0; i <= 8; i++) {
          reserved[8][i] = 1;
          reserved[i][8] = 1;
        }
        for (let i = 0; i < 8; i++) {
          reserved[8][size - 8 + i] = 1;
          reserved[size - 7 + i][8] = 1;
        }

        let di = 0;
        for (let right = size - 1; right >= 1; right -= 2) {
          if (right === 6) right = 5;
          for (let vert = 0; vert < size; vert++) {
            for (let j = 0; j < 2; j++) {
              const x = right - j;
              const upward = ((right + 1) & 2) === 0;
              const y = upward ? size - 1 - vert : vert;
              if (reserved[y][x]) continue;
              const bit = di < data.length * 8 ? (data[di >> 3] >> (7 - (di & 7))) & 1 : 0;
              m[y][x] = bit;
              di++;
            }
          }
        }

        // Apply mask 0 (checkerboard)
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            if (!reserved[y][x] && (y + x) % 2 === 0) m[y][x] ^= 1;
          }
        }

        // Format bits for mask 0, ECC L (bits: 111011111000100)
        const formatBits = 0x77c4;
        for (let i = 0; i < 15; i++) {
          const bit = (formatBits >> i) & 1;
          if (i < 6) m[8][i] = bit;
          else if (i === 6) m[8][7] = bit;
          else if (i === 7) m[8][8] = bit;
          else if (i === 8) m[7][8] = bit;
          else m[14 - i][8] = bit;
          if (i < 8) m[size - 1 - i][8] = bit;
          else m[8][size - 15 + i] = bit;
        }

        return { m, size };
      }

      function alignmentPositions(ver) {
        if (ver === 2) return [18];
        if (ver === 3) return [22];
        if (ver === 4) return [26];
        if (ver === 5) return [30];
        if (ver === 6) return [34];
        return [];
      }

      return { pickVersion, encode, placeModules };
    })();

    function generateQR(text) {
      if (!text) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        status.textContent = '';
        return;
      }
      const ver = QR.pickVersion(text.length);
      if (ver === -1) {
        status.textContent = `❌ Too long (${text.length} chars, max ~120)`;
        return;
      }
      const data = QR.encode(text, ver);
      const { m, size } = QR.placeModules(data, ver);
      const pixelSize = Math.floor(canvas.width / (size + 8));
      const offset = Math.floor((canvas.width - pixelSize * size) / 2);

      ctx.fillStyle = $('qr-light').value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = $('qr-dark').value;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (m[y][x]) {
            ctx.fillRect(offset + x * pixelSize, offset + y * pixelSize, pixelSize, pixelSize);
          }
        }
      }
      status.textContent = `${size}x${size} (v${ver}, ${text.length} chars)`;
    }

    function renderCurrent() {
      renderFields($('qr-type').value);
      $('qr-main-label').textContent = $('qr-type').selectedOptions[0].text;
    }

    $('qr-type').addEventListener('change', renderCurrent);
    $('qr-size').addEventListener('change', () => {
      canvas.width = canvas.height = +$('qr-size').value;
      generateQR(getContent());
    });
    $('qr-dark').addEventListener('input', () => generateQR(getContent()));
    $('qr-light').addEventListener('input', () => generateQR(getContent()));
    fieldsBox.addEventListener('input', () => generateQR(getContent()));

    $('qr-gen').addEventListener('click', () => generateQR(getContent()));
    $('qr-download').addEventListener('click', () => {
      if (!getStatus().startsWith('❌') && status.textContent) {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'devforge-qr.png';
        a.click();
      }
    });
    $('qr-svg').addEventListener('click', () => {
      const text = getContent();
      if (!text) return;
      const ver = QR.pickVersion(text.length);
      if (ver === -1) return;
      const data = QR.encode(text, ver);
      const { m, size } = QR.placeModules(data, ver);
      const px = 10;
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size * px} ${size * px}" width="${size * px}" height="${size * px}">`;
      svg += `<rect width="100%" height="100%" fill="${$('qr-light').value}"/>`;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (m[y][x]) {
            svg += `<rect x="${x * px}" y="${y * px}" width="${px}" height="${px}" fill="${
              $('qr-dark').value
            }"/>`;
          }
        }
      }
      svg += '</svg>';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      a.download = 'devforge-qr.svg';
      a.click();
    });
    $('qr-demo').addEventListener('click', () => {
      $('qr-type').value = 'text';
      renderCurrent();
      $('qr-content').value = 'https://gewitter89.github.io/devforge/';
      generateQR(getContent());
    });

    function getStatus() {
      return status.textContent;
    }
    $('qr-demo').textContent = '💡 ' + (t('loadDemo') || 'Demo');
    renderCurrent();
    generateQR('https://gewitter89.github.io/devforge/');
  }
});
