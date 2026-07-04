/* ============================================================
   DevForge Tool — Hash Generator
   ============================================================ */

DevForge.registerTool({
  id: 'hash-generator',
  name: 'Hash Generator',
  description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly',
  category: 'generators',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  tags: ['hash', 'md5', 'sha1', 'sha256', 'sha512', 'checksum', 'digest'],

  render() {
    const algorithms = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

    let hashResultsHtml = algorithms.map(algo => {
      const id = 'hash-gen-' + algo.toLowerCase().replace('-', '');
      return `
        <div class="tool-inline-result" style="margin-bottom:8px;">
          <span style="min-width:70px;font-weight:600;color:var(--accent);font-size:12px;text-transform:uppercase;letter-spacing:.5px;">${algo}</span>
          <code id="${id}" style="flex:1;word-break:break-all;font-size:13px;opacity:.85;min-height:18px;">—</code>
          <span class="copy-icon" data-hash-id="${id}" title="Copy ${algo} hash">${DevForge.COPY_ICON}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="tool-full">
        <div class="tool-group">
          <label>Input Text</label>
          <textarea id="hash-gen-input" class="tool-textarea" placeholder="Type or paste text here to generate hashes in real-time..." spellcheck="false" style="min-height:140px;"></textarea>
        </div>
        <div class="tool-options" style="margin-bottom:12px;">
          <label class="tool-checkbox">
            <input type="checkbox" id="hash-gen-uppercase">
            Uppercase output
          </label>
          <span style="margin-left:auto;font-size:13px;opacity:.6;" id="hash-gen-inputsize"></span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${hashResultsHtml}
        </div>
        <div class="tool-actions" style="margin-top:14px;">
          <button class="tool-btn" id="hash-gen-copyall">⧉ Copy All</button>
          <button class="tool-btn" id="hash-gen-clear">✕ Clear</button>
        </div>
      </div>
    `;
  },

  init() {
    const input = document.getElementById('hash-gen-input');
    const uppercaseChk = document.getElementById('hash-gen-uppercase');
    const sizeEl = document.getElementById('hash-gen-inputsize');

    // ---- MD5 Implementation (RFC 1321) ----
    function md5(string) {
      function md5cycle(x, k) {
        let a = x[0], b = x[1], c = x[2], d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936);   d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);    b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);    d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);  b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);    d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);      b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);   d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510);    d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);   b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);    d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);  b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);     d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);   b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);  d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);   b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558);       d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);  b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);   d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);   b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);    d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);   b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);    d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);   b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844);    d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);   d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);    b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);    d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);  b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);    d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);    b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
      }
      function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); 
      }
      function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t); 
      }
      function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t); 
      }
      function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t); 
      }
      function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t); 
      }
      function add32(a, b) {
        return (a + b) & 0xFFFFFFFF; 
      }

      function md5blk(s) {
        const md5blks = [];
        for (let i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
      }

      let n = string.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
      for (i = 64; i <= n; i += 64) {
        md5cycle(state, md5blk(string.substring(i - 64, i))); 
      }
      string = string.substring(i - 64);
      const tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      for (i = 0; i < string.length; i++) {
        tail[i >> 2] |= string.charCodeAt(i) << ((i % 4) << 3); 
      }
      tail[i >> 2] |= 0x80 << ((i % 4) << 3);
      if (i > 55) {
        md5cycle(state, tail); for (i = 0; i < 16; i++) tail[i] = 0; 
      }
      tail[14] = n * 8;
      md5cycle(state, tail);

      const hex_chr = '0123456789abcdef';
      let s = '';
      for (i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          s += hex_chr.charAt((state[i] >> (j * 8 + 4)) & 0x0f) + hex_chr.charAt((state[i] >> (j * 8)) & 0x0f);
        }
      }
      return s;
    }

    // ---- SHA via SubtleCrypto ----
    async function shaHash(algo, text) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    const hashAlgos = [
      { name: 'MD5', id: 'hash-gen-md5', fn: (text) => Promise.resolve(md5(text)) },
      { name: 'SHA-1', id: 'hash-gen-sha1', fn: (text) => shaHash('SHA-1', text) },
      { name: 'SHA-256', id: 'hash-gen-sha256', fn: (text) => shaHash('SHA-256', text) },
      { name: 'SHA-384', id: 'hash-gen-sha384', fn: (text) => shaHash('SHA-384', text) },
      { name: 'SHA-512', id: 'hash-gen-sha512', fn: (text) => shaHash('SHA-512', text) },
    ];

    async function generateHashes() {
      const text = input.value;
      const upper = uppercaseChk.checked;

      if (!text) {
        hashAlgos.forEach(h => {
          document.getElementById(h.id).textContent = '—';
        });
        sizeEl.textContent = '';
        return;
      }

      const bytes = new Blob([text]).size;
      sizeEl.textContent = bytes + ' bytes input';

      for (const algo of hashAlgos) {
        try {
          let hash = await algo.fn(text);
          if (upper) hash = hash.toUpperCase();
          document.getElementById(algo.id).textContent = hash;
        } catch (e) {
          document.getElementById(algo.id).textContent = 'Error';
        }
      }
    }

    // Real-time hashing
    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(generateHashes, 150);
    });

    uppercaseChk.addEventListener('change', generateHashes);

    // Copy individual hash
    document.querySelectorAll('[data-hash-id]').forEach(icon => {
      icon.style.cursor = 'pointer';
      icon.addEventListener('click', () => {
        const hashEl = document.getElementById(icon.dataset.hashId);
        const text = hashEl.textContent;
        if (text && text !== '—' && text !== 'Error') {
          DevForge.copyToClipboard(text);
        }
      });
    });

    // Copy all
    document.getElementById('hash-gen-copyall').addEventListener('click', () => {
      const lines = hashAlgos.map(h => {
        const v = document.getElementById(h.id).textContent;
        return h.name + ': ' + v;
      }).join('\n');
      DevForge.copyToClipboard(lines);
    });

    // Clear
    document.getElementById('hash-gen-clear').addEventListener('click', () => {
      input.value = '';
      hashAlgos.forEach(h => {
        document.getElementById(h.id).textContent = '—'; 
      });
      sizeEl.textContent = '';
      input.focus();
    });
  }
});
