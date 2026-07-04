/* ============================================================
   DevForge Tool — Color Converter
   Convert between HEX, RGB, HSL, HSV with live preview
   ============================================================ */

DevForge.registerTool({
  id: 'color-converter',
  name: 'Color Converter',
  description: 'Convert colors between HEX, RGB, HSL, and HSV formats with live preview',
  category: 'converters',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 2a10 10 0 0 0 0 20"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
  tags: ['color', 'hex', 'rgb', 'hsl', 'hsv', 'converter', 'picker', 'css'],

  render() {
    return `
      <div class="tool-full">
        <!-- Color Input Section -->
        <div style="display:flex;gap:var(--space-lg);align-items:flex-start;flex-wrap:wrap;">
          <div style="flex:1;min-width:260px;">
            <div class="tool-group">
              <label>Color Input</label>
              <input type="text" id="color-converter-input" class="tool-input"
                placeholder="Enter color: #8b5cf6, rgb(139,92,246), hsl(263,90%,66%), red, etc."
                style="font-family:'JetBrains Mono',monospace;font-size:0.85rem;">
            </div>
            <div style="display:flex;align-items:center;gap:var(--space-md);margin-top:var(--space-md);">
              <label style="font-size:0.8rem;color:var(--text-secondary);font-weight:600;text-transform:uppercase;">Picker</label>
              <input type="color" id="color-converter-picker" value="#8b5cf6"
                style="width:60px;height:40px;border:none;padding:0;cursor:pointer;background:transparent;border-radius:var(--radius-sm);">
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:var(--space-sm);">
            <label style="font-size:0.8rem;color:var(--text-secondary);font-weight:600;text-transform:uppercase;">Preview</label>
            <div id="color-converter-swatch" class="color-swatch" style="width:100px;height:100px;background:#8b5cf6;box-shadow:0 4px 20px rgba(139,92,246,0.3);"></div>
          </div>
        </div>

        <!-- Format Outputs -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-md);">
          <div class="tool-group">
            <label>HEX</label>
            <div class="tool-inline-result">
              <span id="color-converter-hex" style="flex:1;">#8b5cf6</span>
              <span class="copy-icon" data-copy="hex">${DevForge.COPY_ICON}</span>
            </div>
          </div>
          <div class="tool-group">
            <label>RGB</label>
            <div class="tool-inline-result">
              <span id="color-converter-rgb" style="flex:1;">rgb(139, 92, 246)</span>
              <span class="copy-icon" data-copy="rgb">${DevForge.COPY_ICON}</span>
            </div>
          </div>
          <div class="tool-group">
            <label>HSL</label>
            <div class="tool-inline-result">
              <span id="color-converter-hsl" style="flex:1;">hsl(263, 90%, 66%)</span>
              <span class="copy-icon" data-copy="hsl">${DevForge.COPY_ICON}</span>
            </div>
          </div>
          <div class="tool-group">
            <label>HSV</label>
            <div class="tool-inline-result">
              <span id="color-converter-hsv" style="flex:1;">hsv(263, 63%, 96%)</span>
              <span class="copy-icon" data-copy="hsv">${DevForge.COPY_ICON}</span>
            </div>
          </div>
        </div>

        <!-- Related Colors -->
        <div class="tool-group">
          <label>Complementary & Analogous Colors</label>
          <div id="color-converter-related" style="display:flex;gap:var(--space-md);flex-wrap:wrap;"></div>
        </div>
      </div>
    `;
  },

  init() {
    const input = document.getElementById('color-converter-input');
    const picker = document.getElementById('color-converter-picker');
    const swatch = document.getElementById('color-converter-swatch');
    const hexOut = document.getElementById('color-converter-hex');
    const rgbOut = document.getElementById('color-converter-rgb');
    const hslOut = document.getElementById('color-converter-hsl');
    const hsvOut = document.getElementById('color-converter-hsv');
    const relatedEl = document.getElementById('color-converter-related');

    // CSS named colors (common subset)
    const CSS_COLORS = {
      aliceblue: '#f0f8ff',
      antiquewhite: '#faebd7',
      aqua: '#00ffff',
      aquamarine: '#7fffd4',
      azure: '#f0ffff',
      beige: '#f5f5dc',
      bisque: '#ffe4c4',
      black: '#000000',
      blanchedalmond: '#ffebcd',
      blue: '#0000ff',
      blueviolet: '#8a2be2',
      brown: '#a52a2a',
      burlywood: '#deb887',
      cadetblue: '#5f9ea0',
      chartreuse: '#7fff00',
      chocolate: '#d2691e',
      coral: '#ff7f50',
      cornflowerblue: '#6495ed',
      cornsilk: '#fff8dc',
      crimson: '#dc143c',
      cyan: '#00ffff',
      darkblue: '#00008b',
      darkcyan: '#008b8b',
      darkgoldenrod: '#b8860b',
      darkgray: '#a9a9a9',
      darkgreen: '#006400',
      darkkhaki: '#bdb76b',
      darkmagenta: '#8b008b',
      darkolivegreen: '#556b2f',
      darkorange: '#ff8c00',
      darkorchid: '#9932cc',
      darkred: '#8b0000',
      darksalmon: '#e9967a',
      darkseagreen: '#8fbc8f',
      darkslateblue: '#483d8b',
      darkslategray: '#2f4f4f',
      darkturquoise: '#00ced1',
      darkviolet: '#9400d3',
      deeppink: '#ff1493',
      deepskyblue: '#00bfff',
      dimgray: '#696969',
      dodgerblue: '#1e90ff',
      firebrick: '#b22222',
      floralwhite: '#fffaf0',
      forestgreen: '#228b22',
      fuchsia: '#ff00ff',
      gainsboro: '#dcdcdc',
      ghostwhite: '#f8f8ff',
      gold: '#ffd700',
      goldenrod: '#daa520',
      gray: '#808080',
      green: '#008000',
      greenyellow: '#adff2f',
      honeydew: '#f0fff0',
      hotpink: '#ff69b4',
      indianred: '#cd5c5c',
      indigo: '#4b0082',
      ivory: '#fffff0',
      khaki: '#f0e68c',
      lavender: '#e6e6fa',
      lavenderblush: '#fff0f5',
      lawngreen: '#7cfc00',
      lemonchiffon: '#fffacd',
      lightblue: '#add8e6',
      lightcoral: '#f08080',
      lightcyan: '#e0ffff',
      lightgoldenrodyellow: '#fafad2',
      lightgray: '#d3d3d3',
      lightgreen: '#90ee90',
      lightpink: '#ffb6c1',
      lightsalmon: '#ffa07a',
      lightseagreen: '#20b2aa',
      lightskyblue: '#87cefa',
      lightslategray: '#778899',
      lightsteelblue: '#b0c4de',
      lightyellow: '#ffffe0',
      lime: '#00ff00',
      limegreen: '#32cd32',
      linen: '#faf0e6',
      magenta: '#ff00ff',
      maroon: '#800000',
      mediumaquamarine: '#66cdaa',
      mediumblue: '#0000cd',
      mediumorchid: '#ba55d3',
      mediumpurple: '#9370db',
      mediumseagreen: '#3cb371',
      mediumslateblue: '#7b68ee',
      mediumspringgreen: '#00fa9a',
      mediumturquoise: '#48d1cc',
      mediumvioletred: '#c71585',
      midnightblue: '#191970',
      mintcream: '#f5fffa',
      mistyrose: '#ffe4e1',
      moccasin: '#ffe4b5',
      navajowhite: '#ffdead',
      navy: '#000080',
      oldlace: '#fdf5e6',
      olive: '#808000',
      olivedrab: '#6b8e23',
      orange: '#ffa500',
      orangered: '#ff4500',
      orchid: '#da70d6',
      palegoldenrod: '#eee8aa',
      palegreen: '#98fb98',
      paleturquoise: '#afeeee',
      palevioletred: '#db7093',
      papayawhip: '#ffefd5',
      peachpuff: '#ffdab9',
      peru: '#cd853f',
      pink: '#ffc0cb',
      plum: '#dda0dd',
      powderblue: '#b0e0e6',
      purple: '#800080',
      rebeccapurple: '#663399',
      red: '#ff0000',
      rosybrown: '#bc8f8f',
      royalblue: '#4169e1',
      saddlebrown: '#8b4513',
      salmon: '#fa8072',
      sandybrown: '#f4a460',
      seagreen: '#2e8b57',
      seashell: '#fff5ee',
      sienna: '#a0522d',
      silver: '#c0c0c0',
      skyblue: '#87ceeb',
      slateblue: '#6a5acd',
      slategray: '#708090',
      snow: '#fffafa',
      springgreen: '#00ff7f',
      steelblue: '#4682b4',
      tan: '#d2b48c',
      teal: '#008080',
      thistle: '#d8bfd8',
      tomato: '#ff6347',
      turquoise: '#40e0d0',
      violet: '#ee82ee',
      wheat: '#f5deb3',
      white: '#ffffff',
      whitesmoke: '#f5f5f5',
      yellow: '#ffff00',
      yellowgreen: '#9acd32'
    };

    // --- Conversion utilities ---
    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      const n = parseInt(hex, 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }

    function rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
    }

    function rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h,
        s,
        l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            break;
          case g:
            h = ((b - r) / d + 2) / 6;
            break;
          case b:
            h = ((r - g) / d + 4) / 6;
            break;
        }
      }
      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function hslToRgb(h, s, l) {
      h /= 360;
      s /= 100;
      l /= 100;
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    function rgbToHsv(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h,
        s,
        v = max;
      const d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max === min) {
        h = 0;
      } else {
        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            break;
          case g:
            h = ((b - r) / d + 2) / 6;
            break;
          case b:
            h = ((r - g) / d + 4) / 6;
            break;
        }
      }
      return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
    }

    // --- Parsing ---
    function parseColor(str) {
      str = str.trim().toLowerCase();

      // CSS named color
      if (CSS_COLORS[str]) {
        return hexToRgb(CSS_COLORS[str]);
      }

      // HEX
      const hexMatch = str.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
      if (hexMatch) {
        return hexToRgb(hexMatch[1]);
      }

      // RGB
      const rgbMatch = str.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
      if (rgbMatch) {
        return { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) };
      }

      // HSL
      const hslMatch = str.match(/^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/);
      if (hslMatch) {
        const rgb = hslToRgb(parseInt(hslMatch[1]), parseInt(hslMatch[2]), parseInt(hslMatch[3]));
        return rgb;
      }

      // HSV
      const hsvMatch = str.match(/^hsv\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/);
      if (hsvMatch) {
        const h = parseInt(hsvMatch[1]) / 360;
        const s = parseInt(hsvMatch[2]) / 100;
        const v = parseInt(hsvMatch[3]) / 100;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        let r, g, b;
        switch (i % 6) {
          case 0:
            r = v;
            g = t;
            b = p;
            break;
          case 1:
            r = q;
            g = v;
            b = p;
            break;
          case 2:
            r = p;
            g = v;
            b = t;
            break;
          case 3:
            r = p;
            g = q;
            b = v;
            break;
          case 4:
            r = t;
            g = p;
            b = v;
            break;
          case 5:
            r = v;
            g = p;
            b = q;
            break;
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
      }

      return null;
    }

    // --- Updating UI ---
    function updateFromRgb(r, g, b) {
      const hex = rgbToHex(r, g, b);
      const hsl = rgbToHsl(r, g, b);
      const hsv = rgbToHsv(r, g, b);

      hexOut.textContent = hex;
      rgbOut.textContent = `rgb(${r}, ${g}, ${b})`;
      hslOut.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      hsvOut.textContent = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;

      swatch.style.background = hex;
      swatch.style.boxShadow = `0 4px 20px ${hex}40`;
      picker.value = hex;

      renderRelated(hsl);
    }

    function renderRelated(hsl) {
      const colors = [
        { label: 'Complementary', h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l },
        { label: 'Analogous -30°', h: (hsl.h + 330) % 360, s: hsl.s, l: hsl.l },
        { label: 'Analogous +30°', h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l },
        { label: 'Triadic +120°', h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l },
        { label: 'Triadic -120°', h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l },
        { label: 'Split Comp.', h: (hsl.h + 150) % 360, s: hsl.s, l: hsl.l }
      ];

      relatedEl.innerHTML = colors
        .map(c => {
          const rgb = hslToRgb(c.h, c.s, c.l);
          const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
          return `
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;" class="color-converter-related-item" data-hex="${hex}">
            <div style="width:50px;height:50px;border-radius:var(--radius-md);background:${hex};border:2px solid var(--border-primary);box-shadow:0 2px 10px ${hex}30;transition:transform 0.15s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></div>
            <span style="font-size:0.65rem;color:var(--text-tertiary);font-weight:500;">${c.label}</span>
            <span style="font-size:0.7rem;color:var(--text-secondary);font-family:'JetBrains Mono',monospace;">${hex}</span>
          </div>`;
        })
        .join('');

      // Click to use related color
      relatedEl.querySelectorAll('.color-converter-related-item').forEach(el => {
        el.addEventListener('click', () => {
          const hex = el.dataset.hex;
          input.value = hex;
          const rgb = hexToRgb(hex);
          updateFromRgb(rgb.r, rgb.g, rgb.b);
        });
      });
    }

    // --- Events ---
    input.addEventListener('input', () => {
      const rgb = parseColor(input.value);
      if (rgb) updateFromRgb(rgb.r, rgb.g, rgb.b);
    });

    picker.addEventListener('input', () => {
      const rgb = hexToRgb(picker.value);
      input.value = picker.value;
      updateFromRgb(rgb.r, rgb.g, rgb.b);
    });

    // Copy buttons
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.copy;
        const map = { hex: hexOut, rgb: rgbOut, hsl: hslOut, hsv: hsvOut };
        if (map[type]) DevForge.copyToClipboard(map[type].textContent);
      });
    });

    // Initial render
    updateFromRgb(139, 92, 246);
  }
});
