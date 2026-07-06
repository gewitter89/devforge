/* ============================================================
   DevForge Tool — Meta Tags Generator
   Generate SEO + Open Graph + Twitter meta tags in one click.
   ============================================================ */

DevForge.registerTool({
  id: 'meta-tags-generator',
  name: 'Meta Tags Generator',
  description: 'Generate SEO, Open Graph, and Twitter Card meta tags',
  category: 'generators',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  tags: ['seo', 'meta', 'open-graph', 'twitter', 'og', 'head', 'html'],

  render() {
    return `
      <div class="tool-split" style="gap:var(--space-md)">
        <div class="tool-group" style="flex:1;">
          <label>Page title</label>
          <input type="text" id="mt-title" class="tool-input" placeholder="DevForge — Free Browser Dev Toolkit">

          <label style="margin-top:8px;">Description</label>
          <textarea id="mt-desc" class="tool-textarea" style="min-height:80px;" placeholder="25 free, offline-capable browser developer tools. No ads, no tracking, privacy-first."></textarea>

          <label style="margin-top:8px;">URL</label>
          <input type="text" id="mt-url" class="tool-input" placeholder="https://devforge.dev">

          <label style="margin-top:8px;">Image URL</label>
          <input type="text" id="mt-image" class="tool-input" placeholder="https://devforge.dev/og-image.png">

          <label style="margin-top:8px;">Site name</label>
          <input type="text" id="mt-site" class="tool-input" placeholder="DevForge">

          <label style="margin-top:8px;">Twitter handle</label>
          <input type="text" id="mt-twitter" class="tool-input" placeholder="@devforge">

          <div class="tool-option" style="margin-top:8px;">
            <label>Twitter card</label>
            <select id="mt-card" class="tool-input" style="max-width:160px;height:34px;">
              <option value="summary_large_image" selected>Summary Large Image</option>
              <option value="summary">Summary</option>
            </select>
          </div>
        </div>

        <div class="tool-group" style="flex:1;">
          <label>Generated HTML (copy into &lt;head&gt;)</label>
          <pre id="mt-output" class="tool-result" style="min-height:300px;overflow:auto;white-space:pre;font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.5;"></pre>
        </div>
      </div>

      <div class="tool-actions">
        <button class="tool-btn-primary" id="mt-generate">⚡ Generate</button>
        <button class="tool-btn" id="mt-copy">⧉ Copy</button>
        <button class="tool-btn" id="mt-demo">💡 Demo</button>
        <button class="tool-btn" id="mt-clear">✕ Clear</button>
      </div>
    `;
  },

  init() {
    const $ = id => document.getElementById(id);
    const t = k => (window.i18n ? window.i18n.t(k) : k);

    function generate() {
      const title = $('mt-title').value.trim();
      const desc = $('mt-desc').value.trim();
      const url = $('mt-url').value.trim();
      const img = $('mt-image').value.trim();
      const site = $('mt-site').value.trim();
      const twitter = $('mt-twitter').value.trim();
      const card = $('mt-card').value;

      const lines = [];
      const esc = s => s.replace(/"/g, '&quot;');

      lines.push('<!-- Basic -->');
      if (title) {
        lines.push(`<title>${esc(title)}</title>`);
        lines.push(`<meta name="description" content="${esc(desc || title)}">`);
      }

      lines.push('');
      lines.push('<!-- Open Graph / Facebook -->');
      lines.push(`<meta property="og:type" content="website">`);
      if (url) lines.push(`<meta property="og:url" content="${esc(url)}">`);
      if (title) lines.push(`<meta property="og:title" content="${esc(title)}">`);
      if (desc) lines.push(`<meta property="og:description" content="${esc(desc)}">`);
      if (img) lines.push(`<meta property="og:image" content="${esc(img)}">`);
      if (site) lines.push(`<meta property="og:site_name" content="${esc(site)}">`);

      lines.push('');
      lines.push('<!-- Twitter Card -->');
      lines.push(`<meta name="twitter:card" content="${card}">`);
      if (url) lines.push(`<meta name="twitter:url" content="${esc(url)}">`);
      if (title) lines.push(`<meta name="twitter:title" content="${esc(title)}">`);
      if (desc) lines.push(`<meta name="twitter:description" content="${esc(desc)}">`);
      if (img) lines.push(`<meta name="twitter:image" content="${esc(img)}">`);
      if (twitter) lines.push(`<meta name="twitter:site" content="${esc(twitter)}">`);

      lines.push('');
      lines.push('<!-- Canonical + PWA -->');
      if (url) lines.push(`<link rel="canonical" href="${esc(url)}">`);
      lines.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
      lines.push(`<meta name="theme-color" content="#0f172a">`);

      $('mt-output').textContent = lines.join('\n');
    }

    ['mt-title', 'mt-desc', 'mt-url', 'mt-image', 'mt-site', 'mt-twitter', 'mt-card'].forEach(id => {
      $(id).addEventListener('input', generate);
      $(id).addEventListener('change', generate);
    });

    $('mt-generate').addEventListener('click', generate);
    $('mt-copy').addEventListener('click', () => DevForge.copyToClipboard($('mt-output').textContent));
    $('mt-demo').addEventListener('click', () => {
      $('mt-title').value = 'DevForge — Free Browser Dev Toolkit';
      $('mt-desc').value = '25 free, offline-capable browser developer tools. No ads, no tracking. Privacy-first developer toolkit.';
      $('mt-url').value = 'https://gewitter89.github.io/devforge/';
      $('mt-image').value = 'https://gewitter89.github.io/devforge/og.png';
      $('mt-site').value = 'DevForge';
      $('mt-twitter').value = '@gewitter89';
      generate();
    });
    $('mt-clear').addEventListener('click', () => {
      ['mt-title', 'mt-desc', 'mt-url', 'mt-image', 'mt-site', 'mt-twitter'].forEach(id => ($(id).value = ''));
      $('mt-output').textContent = '';
    });

    $('mt-demo').textContent = '💡 ' + (t('loadDemo') || 'Demo');
    $('mt-clear').textContent = '✕ ' + (t('clear') || 'Clear');
    $('mt-copy').textContent = '⧉ ' + (t('copy') || 'Copy');
  }
});
