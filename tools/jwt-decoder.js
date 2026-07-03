/* ============================================================
   DevForge — JWT Decoder & Debugger Tool
   Parses JSON Web Tokens (Header, Payload, Signature) on the fly
   ============================================================ */

DevForge.registerTool({
  id: 'jwt-decoder',
  name: 'JWT Decoder',
  description: 'Decode and analyze JSON Web Tokens (JWT) payload and expiration times instantly.',
  category: 'encoders',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  tags: ['jwt', 'token', 'decode', 'json', 'auth'],
  
  render() {
    return `
      <div class="tool-split">
        <div class="tool-group">
          <label for="jwt-input">Encoded JWT Token</label>
          <textarea id="jwt-input" class="tool-textarea" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE4OTA2MTAwMDB9..." style="min-height: 380px;"></textarea>
          <div class="tool-actions">
            <button class="tool-btn" id="jwt-demo-btn"></button>
            <button class="tool-btn" id="jwt-clear-btn">Clear</button>
          </div>
        </div>

        <div class="tool-group">
          <label>Decoded Token Components</label>
          
          <!-- Header panel -->
          <div style="margin-bottom:var(--space-md);">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:bold; color:#f43f5e; margin-bottom:4px; text-transform:uppercase;">
              <span>Header: Algorithm & Token Type</span>
            </div>
            <pre class="tool-result" id="jwt-header-out" style="min-height:90px; height:90px; border-color:rgba(244,63,94,0.2); overflow:auto;"></pre>
          </div>

          <!-- Payload panel -->
          <div style="margin-bottom:var(--space-md);">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:bold; color:#3b82f6; margin-bottom:4px; text-transform:uppercase;">
              <span>Payload: Data / Claims</span>
            </div>
            <pre class="tool-result" id="jwt-payload-out" style="min-height:160px; height:180px; border-color:rgba(59,130,246,0.2); overflow:auto;"></pre>
          </div>

          <!-- Metadata panel -->
          <div id="jwt-meta-panel" style="background:var(--bg-input); padding:var(--space-sm); border-radius:var(--radius-sm); border:1px solid var(--border-primary); display:none; font-size:0.8rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:var(--text-secondary);">Issued At (iat):</span>
              <span id="jwt-meta-issued" style="font-family:monospace; font-weight:500;">-</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-secondary);">Expires At (exp):</span>
              <span id="jwt-meta-expires" style="font-family:monospace; font-weight:500;">-</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const input = document.getElementById('jwt-input');
    const headerOut = document.getElementById('jwt-header-out');
    const payloadOut = document.getElementById('jwt-payload-out');
    const demoBtn = document.getElementById('jwt-demo-btn');
    const clearBtn = document.getElementById('jwt-clear-btn');
    const metaPanel = document.getElementById('jwt-meta-panel');
    const metaIssued = document.getElementById('jwt-meta-issued');
    const metaExpires = document.getElementById('jwt-meta-expires');

    const t = (k) => window.i18n ? window.i18n.t(k) : k;

    if (demoBtn) demoBtn.textContent = t('loadDemo');
    if (clearBtn) clearBtn.textContent = t('clear');

    const DEMO_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikdld2l0dGVyODkiLCJyb2xlIjoiY3JlYXRvciIsImlhdCI6MTc4MDIwOTYwMCwiZXhwIjoxOTEwMDc4NDAwfQ.dummy-signature-here";

    const cleanOut = () => {
      headerOut.textContent = '';
      payloadOut.textContent = '';
      metaPanel.style.display = 'none';
    };

    const base64UrlDecode = (str) => {
      // Add padding
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      while (str.length % 4) {
        str += '=';
      }
      return decodeURIComponent(atob(str).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    };

    const processJWT = () => {
      const token = input.value.trim();
      if (!token) {
        cleanOut();
        return;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        headerOut.innerHTML = '<span style="color:var(--color-error)">Invalid JWT: Token must contain exactly 2 dots (3 base64 parts)</span>';
        payloadOut.textContent = '';
        metaPanel.style.display = 'none';
        return;
      }

      try {
        const headerDecoded = base64UrlDecode(parts[0]);
        const payloadDecoded = base64UrlDecode(parts[1]);

        const headerObj = JSON.parse(headerDecoded);
        const payloadObj = JSON.parse(payloadDecoded);

        headerOut.textContent = JSON.stringify(headerObj, null, 2);
        payloadOut.textContent = JSON.stringify(payloadObj, null, 2);

        // Date metadata checks
        metaPanel.style.display = 'block';

        if (payloadObj.iat) {
          const iatDate = new Date(payloadObj.iat * 1000);
          metaIssued.textContent = iatDate.toLocaleString();
        } else {
          metaIssued.textContent = 'N/A';
        }

        if (payloadObj.exp) {
          const expDate = new Date(payloadObj.exp * 1000);
          const isExpired = expDate.getTime() < Date.now();
          const color = isExpired ? 'var(--color-error)' : 'var(--color-success)' ;
          const label = isExpired ? 'Expired' : 'Expires';
          
          metaExpires.innerHTML = `<span style="color:${color}; font-weight:bold;">${expDate.toLocaleString()} (${label})</span>`;
        } else {
          metaExpires.textContent = 'Never expires';
        }

      } catch (err) {
        headerOut.innerHTML = `<span style="color:var(--color-error)">Failed to decode token parts:\n${err.message}</span>`;
        payloadOut.textContent = '';
        metaPanel.style.display = 'none';
      }
    };

    input.addEventListener('input', processJWT);

    demoBtn.addEventListener('click', () => {
      input.value = DEMO_JWT;
      processJWT();
      if (window.SoundFX) window.SoundFX.playSuccess();
      if (window.confetti) {
        window.confetti({ particleCount: 40, spread: 35, origin: { y: 0.8 } });
      }
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      cleanOut();
      if (window.SoundFX) window.SoundFX.playClick();
    });

    // Auto process if pre-filled
    processJWT();
  }
});
