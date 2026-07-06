/* ============================================================
   DevForge Tool — CSS Box Shadow Generator
   Visual builder for box-shadow CSS properties.
   ============================================================ */

DevForge.registerTool({
  id: 'css-box-shadow',
  name: 'CSS Shadow Generator',
  description: 'Visually build box-shadow CSS with live preview',
  category: 'generators',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="7" cy="7" r="1" fill="currentColor"/></svg>',
  tags: ['css', 'box-shadow', 'shadow', 'visual-builder', 'design'],

  render() {
    const slider = (id, label, min, max, step, val) =>
      `<div class="tool-option" style="flex-direction:column;align-items:flex-start;gap:4px;margin-bottom:8px;width:100%;">
        <label style="font-size:13px;display:flex;justify-content:space-between;width:100%;">
          <span>${label}</span><span id="${id}-val" style="font-family:monospace;opacity:.7;">${val}px</span>
        </label>
        <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" style="width:100%;">
      </div>`;

    return `
      <div class="tool-split" style="gap:var(--space-xl);">
        <div class="tool-group" style="flex:1;">
          ${slider('bs-x', 'X Offset', -50, 50, 1, 0)}
          ${slider('bs-y', 'Y Offset', -50, 50, 1, 4)}
          ${slider('bs-blur', 'Blur Radius', 0, 100, 1, 10)}
          ${slider('bs-spread', 'Spread Radius', -50, 50, 1, 0)}

          <div class="tool-option" style="margin-top:12px;">
            <label>Color</label>
            <input type="color" id="bs-color" value="#000000" style="width:50px;height:34px;cursor:pointer;">
            <input type="text" id="bs-opacity" class="tool-input" value="0.33" style="max-width:70px;" placeholder="Opacity">
          </div>

          <div class="tool-option" style="margin-top:4px;">
            <label><input type="checkbox" id="bs-inset"> Inset shadow</label>
          </div>

          <label style="margin-top:16px;">CSS Output</label>
          <pre id="bs-output" class="tool-result" style="min-height:80px;white-space:pre-wrap;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.5;"></pre>
        </div>

        <div class="tool-group" style="flex:1;display:flex;align-items:center;justify-content:center;background:var(--bg-primary);border-radius:var(--radius-lg);min-height:320px;">
          <div id="bs-preview" style="width:200px;height:200px;background:var(--bg-secondary);border-radius:12px;transition:box-shadow .15s ease;"></div>
        </div>
      </div>

      <div class="tool-actions">
        <button class="tool-btn-primary" id="bs-copy">⧉ Copy CSS</button>
        <button class="tool-btn" id="bs-presets">🎨 Presets</button>
        <button class="tool-btn" id="bs-reset">↺ Reset</button>
      </div>
    `;
  },

  init() {
    const $ = id => document.getElementById(id);
    const t = k => (window.i18n ? window.i18n.t(k) : k);
    let presetIdx = 0;

    const PRESETS = [
      { x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1, inset: false },
      { x: 0, y: 10, blur: 15, spread: -3, color: '#000000', opacity: 0.1, inset: false },
      { x: 0, y: 20, blur: 25, spread: -5, color: '#000000', opacity: 0.1, inset: false },
      { x: 0, y: 0, blur: 30, spread: 0, color: '#3b82f6', opacity: 0.5, inset: false },
      { x: 0, y: 0, blur: 0, spread: 3, color: '#8b5cf6', opacity: 1, inset: false },
      { x: 5, y: 5, blur: 15, spread: 0, color: '#000000', opacity: 0.25, inset: false },
      { x: 0, y: 1, blur: 2, spread: 0, color: '#000000', opacity: 0.05, inset: false },
      { x: 0, y: 2, blur: 8, spread: 0, color: '#000000', opacity: 1, inset: true }
    ];

    function hexToRgb(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    }

    function update() {
      const x = +$('bs-x').value;
      const y = +$('bs-y').value;
      const blur = +$('bs-blur').value;
      const spread = +$('bs-spread').value;
      const inset = $('bs-inset').checked;
      const color = $('bs-color').value;
      const opacity = parseFloat($('bs-opacity').value) || 1;
      const { r, g, b } = hexToRgb(color);

      ['bs-x', 'bs-y', 'bs-blur', 'bs-spread'].forEach(id => {
        $(id + '-val').textContent = $(id).value + 'px';
      });

      const shadow = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${opacity})`;
      const css = `box-shadow: ${shadow};`;
      const webkit = `-webkit-box-shadow: ${shadow};`;
      const moz = `-moz-box-shadow: ${shadow};`;

      $('bs-preview').style.boxShadow = shadow;
      $('bs-output').textContent = `${webkit}\n${moz}\n${css}`;
    }

    ['bs-x', 'bs-y', 'bs-blur', 'bs-spread', 'bs-color', 'bs-opacity', 'bs-inset'].forEach(id => {
      $(id).addEventListener('input', update);
      $(id).addEventListener('change', update);
    });

    $('bs-copy').addEventListener('click', () =>
      DevForge.copyToClipboard($('bs-output').textContent)
    );
    $('bs-presets').addEventListener('click', () => {
      const p = PRESETS[presetIdx % PRESETS.length];
      $('bs-x').value = p.x;
      $('bs-y').value = p.y;
      $('bs-blur').value = p.blur;
      $('bs-spread').value = p.spread;
      $('bs-color').value = p.color;
      $('bs-opacity').value = p.opacity;
      $('bs-inset').checked = p.inset;
      presetIdx++;
      update();
    });
    $('bs-reset').addEventListener('click', () => {
      $('bs-x').value = 0;
      $('bs-y').value = 4;
      $('bs-blur').value = 10;
      $('bs-spread').value = 0;
      $('bs-color').value = '#000000';
      $('bs-opacity').value = 0.33;
      $('bs-inset').checked = false;
      update();
    });

    $('bs-copy').textContent = '⧉ ' + (t('copy') || 'Copy') + ' CSS';
    update();
  }
});
