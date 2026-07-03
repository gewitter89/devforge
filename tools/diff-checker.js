/* ============================================================
   DevForge — Diff Checker Tool
   Provides line-by-line text comparison (side-by-side) with inline highlights
   ============================================================ */

DevForge.registerTool({
  id: 'diff-checker',
  name: 'Diff Checker',
  description: 'Compare two text files side-by-side or inline to find differences instantly.',
  category: 'text',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18 2.5a2.5 2.5 0 0 1 3.5 3.5L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  tags: ['diff', 'compare', 'text-diff', 'lines', 'match'],
  
  render() {
    return `
      <div class="tool-full">
        <!-- Texts Inputs Grid -->
        <div class="tool-split">
          <div class="tool-group">
            <label for="diff-original">Original Text (Left)</label>
            <textarea id="diff-original" class="tool-textarea" placeholder="Paste original text here..." style="min-height: 180px;"></textarea>
          </div>
          <div class="tool-group">
            <label for="diff-modified">Modified Text (Right)</label>
            <textarea id="diff-modified" class="tool-textarea" placeholder="Paste modified text here..." style="min-height: 180px;"></textarea>
          </div>
        </div>

        <!-- Mode controls -->
        <div class="tool-actions" style="margin-top: 0; margin-bottom: var(--space-md);">
          <button class="tool-btn tool-btn-primary" id="diff-compare-btn">Compare Texts</button>
          <button class="tool-btn" id="diff-clear-btn">Clear Both</button>
        </div>

        <!-- Result Display -->
        <div class="tool-group">
          <label>Comparison Results</label>
          <div id="diff-results" style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-md); background:var(--bg-input); padding:var(--space-md); border-radius:var(--radius-md); border:1px solid var(--border-primary); max-height:480px; overflow-y:auto; font-family:'JetBrains Mono', monospace; font-size:0.8rem; line-height:1.6;">
            <div style="color:var(--text-tertiary);">Compare outputs will appear here...</div>
            <div></div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const originalText = document.getElementById('diff-original');
    const modifiedText = document.getElementById('diff-modified');
    const compareBtn = document.getElementById('diff-compare-btn');
    const clearBtn = document.getElementById('diff-clear-btn');
    const resultsDiv = document.getElementById('diff-results');

    const clean = () => {
      originalText.value = '';
      modifiedText.value = '';
      resultsDiv.innerHTML = '<div style="color:var(--text-tertiary);">Compare outputs will appear here...</div><div></div>';
    };

    const performDiff = () => {
      const leftLines = originalText.value.split('\n');
      const rightLines = modifiedText.value.split('\n');

      let leftHTML = '';
      let rightHTML = '';

      const maxLines = Math.max(leftLines.length, rightLines.length);

      for (let i = 0; i < maxLines; i++) {
        const left = leftLines[i] !== undefined ? leftLines[i] : null;
        const right = rightLines[i] !== undefined ? rightLines[i] : null;

        const lineNum = i + 1;

        if (left === right) {
          // Lines match
          leftHTML += `<div style="padding:2px var(--space-sm); border-bottom:1px solid rgba(255,255,255,0.01); display:flex;"><span style="color:var(--text-tertiary); width:30px; display:inline-block; user-select:none; margin-right:8px;">${lineNum}</span><span>${escapeHTML(left || '')}</span></div>`;
          rightHTML += `<div style="padding:2px var(--space-sm); border-bottom:1px solid rgba(255,255,255,0.01); display:flex;"><span style="color:var(--text-tertiary); width:30px; display:inline-block; user-select:none; margin-right:8px;">${lineNum}</span><span>${escapeHTML(right || '')}</span></div>`;
        } else if (left !== null && right === null) {
          // Line deleted from modified
          leftHTML += `<div style="background:rgba(239,68,68,0.15); border-left:3px solid var(--color-error); padding:2px var(--space-sm); display:flex;"><span style="color:rgba(239,68,68,0.5); width:30px; display:inline-block; user-select:none; margin-right:8px;">${lineNum}</span><span>- ${escapeHTML(left)}</span></div>`;
          rightHTML += `<div style="background:rgba(255,255,255,0.02); padding:2px var(--space-sm); color:var(--text-tertiary); display:flex;"><span style="color:var(--text-tertiary); width:30px; display:inline-block; user-select:none; margin-right:8px;">-</span><span></span></div>`;
        } else if (left === null && right !== null) {
          // Line added to modified
          leftHTML += `<div style="background:rgba(255,255,255,0.02); padding:2px var(--space-sm); color:var(--text-tertiary); display:flex;"><span style="color:var(--text-tertiary); width:30px; display:inline-block; user-select:none; margin-right:8px;">-</span><span></span></div>`;
          rightHTML += `<div style="background:rgba(34,197,94,0.15); border-left:3px solid var(--color-success); padding:2px var(--space-sm); display:flex;"><span style="color:rgba(34,197,94,0.5); width:30px; display:inline-block; user-select:none; margin-right:8px;">${lineNum}</span><span>+ ${escapeHTML(right)}</span></div>`;
        } else {
          // Lines modified (replaced)
          leftHTML += `<div style="background:rgba(239,68,68,0.1); border-left:3px solid var(--color-error); padding:2px var(--space-sm); display:flex;"><span style="color:rgba(239,68,68,0.5); width:30px; display:inline-block; user-select:none; margin-right:8px;">${lineNum}</span><span>- ${escapeHTML(left)}</span></div>`;
          rightHTML += `<div style="background:rgba(34,197,94,0.1); border-left:3px solid var(--color-success); padding:2px var(--space-sm); display:flex;"><span style="color:rgba(34,197,94,0.5); width:30px; display:inline-block; user-select:none; margin-right:8px;">${lineNum}</span><span>+ ${escapeHTML(right)}</span></div>`;
        }
      }

      resultsDiv.innerHTML = `
        <div style="overflow-x:auto; border-right:1px solid var(--border-primary);">${leftHTML}</div>
        <div style="overflow-x:auto;">${rightHTML}</div>
      `;

      if (window.SoundFX) window.SoundFX.playSuccess();
    };

    function escapeHTML(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    compareBtn.addEventListener('click', performDiff);
    clearBtn.addEventListener('click', () => {
      clean();
      if (window.SoundFX) window.SoundFX.playClick();
    });
  }
});
