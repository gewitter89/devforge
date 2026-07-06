/* ============================================================
   DevForge Tool — Regex Tester
   Live regex testing with match highlighting and capture groups.
   ============================================================ */

DevForge.registerTool({
  id: 'regex-tester',
  name: 'Regex Tester',
  description: 'Test regular expressions with live highlighting and capture groups',
  category: 'text',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>',
  tags: ['regex', 'regexp', 'regular-expression', 'test', 'match', 'groups'],

  render() {
    return `
      <div class="tool-options" style="margin-bottom:12px;gap:8px;">
        <div style="flex:1;display:flex;align-items:center;gap:4px;">
          <span style="font-weight:700;font-size:18px;opacity:.6;">/</span>
          <input type="text" id="rx-pattern" class="tool-input" placeholder="\\b\\w+@\\w+\\.\\w{2,}\\b" style="flex:1;font-family:'JetBrains Mono',monospace;">
          <span style="font-weight:700;font-size:18px;opacity:.6;">/</span>
          <input type="text" id="rx-flags" class="tool-input" value="g" placeholder="gi" style="max-width:60px;height:34px;font-family:monospace;">
        </div>
        <div class="tool-option" style="gap:8px;">
          <label><input type="checkbox" id="rx-realtime" checked> Live</label>
        </div>
      </div>
      <div class="tool-split" style="gap:var(--space-md);">
        <div class="tool-group" style="flex:1;">
          <label>Test string</label>
          <textarea id="rx-input" class="tool-textarea" style="min-height:160px;font-family:'JetBrains Mono',monospace;font-size:13px;">hello world@example.com and john.doe@gmail.com are valid emails.</textarea>
        </div>
        <div class="tool-group" style="flex:1;">
          <label>Result (matches highlighted)</label>
          <div id="rx-output" class="tool-result" style="min-height:120px;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.6;white-space:pre-wrap;"></div>
        </div>
      </div>
      <div id="rx-matches" style="margin-top:12px;font-size:13px;color:var(--text-secondary);"></div>
      <div class="tool-actions">
        <button class="tool-btn-primary" id="rx-test">Test</button>
        <button class="tool-btn" id="rx-replace">Replace</button>
        <button class="tool-btn" id="rx-clear">Clear</button>
      </div>
      <div id="rx-replace-panel" style="display:none;margin-top:12px;">
        <div class="tool-option" style="gap:8px;">
          <label>Replace with</label>
          <input type="text" id="rx-replace-with" class="tool-input" placeholder="$1 or text">
          <button class="tool-btn-primary" id="rx-do-replace" style="height:34px;">Replace</button>
        </div>
        <pre id="rx-replace-output" class="tool-result" style="margin-top:8px;min-height:60px;white-space:pre-wrap;font-family:'JetBrains Mono',monospace;font-size:13px;"></pre>
      </div>
    `;
  },

  init() {
    const $ = id => document.getElementById(id);
    const t = k => (window.i18n ? window.i18n.t(k) : k);
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const COLORS = ['#22c55e33', '#3b82f633', '#a855f733', '#fb923c33', '#ec489933'];

    function test() {
      const pattern = $('rx-pattern').value,
        flags = $('rx-flags').value,
        text = $('rx-input').value;
      if (!pattern) {
        $('rx-output').innerHTML = esc(text);
        $('rx-matches').innerHTML = '';
        return;
      }
      let re;
      try {
        re = new RegExp(pattern, flags);
      } catch (err) {
        $('rx-output').innerHTML =
          `<span style="color:var(--danger,#f44)">❌ ${esc(err.message)}</span>`;
        return;
      }

      const matches = [];
      const clone = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
      let m;
      while ((m = clone.exec(text)) !== null) {
        matches.push({ start: m.index, end: m.index + m[0].length, groups: m });
        if (m.index === clone.lastIndex) clone.lastIndex++;
        if (matches.length > 200) break;
      }

      let html = '',
        cursor = 0;
      matches.forEach((match, i) => {
        if (match.start > cursor) html += esc(text.slice(cursor, match.start));
        html += `<mark style="background:${COLORS[i % 5]};padding:1px 2px;border-radius:2px;">${esc(match.groups[0])}</mark>`;
        cursor = match.end;
      });
      if (cursor < text.length) html += esc(text.slice(cursor));
      $('rx-output').innerHTML = html;

      const lines = matches
        .map((m, i) => `#${i + 1} "<b>${esc(m.groups[0])}</b>" [${m.start}..${m.end}]`)
        .join('<br>');
      $('rx-matches').innerHTML =
        `<div style="font-weight:600;margin-bottom:6px;">${matches.length} match${matches.length === 1 ? '' : 'es'}</div>${lines}`;
      if (window.SoundFX && matches.length > 0) window.SoundFX.playSuccess();
    }

    let timer;
    ['rx-pattern', 'rx-flags', 'rx-input'].forEach(id => {
      $(id).addEventListener('input', () => {
        if ($('rx-realtime').checked) {
          clearTimeout(timer);
          timer = setTimeout(test, 150);
        }
      });
    });

    $('rx-test').addEventListener('click', test);
    $('rx-replace').addEventListener('click', () => {
      const p = $('rx-replace-panel');
      p.style.display = p.style.display === 'none' ? 'block' : 'none';
    });
    $('rx-do-replace').addEventListener('click', () => {
      try {
        const re = new RegExp($('rx-pattern').value, $('rx-flags').value);
        $('rx-replace-output').textContent = $('rx-input').value.replace(
          re,
          $('rx-replace-with').value
        );
      } catch (err) {
        $('rx-replace-output').innerHTML =
          `<span style="color:var(--danger,#f44)">❌ ${esc(err.message)}</span>`;
      }
    });
    $('rx-clear').addEventListener('click', () => {
      ['rx-pattern', 'rx-input'].forEach(id => ($(id).value = ''));
      $('rx-output').innerHTML = '';
      $('rx-matches').innerHTML = '';
    });

    $('rx-clear').textContent = '✕ ' + (t('clear') || 'Clear');
    test();
  }
});
