/* ============================================================
   DevForge Tool — AI Context Packager
   Aggregates multiple source files into a single structured Markdown block
   for easy copying into LLMs (Claude, ChatGPT, Gemini). 100% local.
   ============================================================ */

DevForge.registerTool({
  id: 'ai-packager',
  name: 'AI Context Packager',
  description: 'Combine multiple code files into a single structured Markdown text optimized for AI prompts.',
  category: 'text',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  tags: ['ai', 'context', 'packager', 'prompt', 'files', 'combine'],
  
  render() {
    return `
      <div class="tool-split">
        <div class="tool-group">
          <label for="ai-packager-files">Upload or Drag Source Files</label>
          <input type="file" id="ai-packager-files" class="tool-input" multiple style="padding-top:8px; height: auto; min-height: 44px;">
          
          <div style="background:var(--bg-input); padding:var(--space-md); border-radius:var(--radius-md); border:1px solid var(--border-primary); margin-top:var(--space-sm);">
            <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-tertiary); font-weight:bold; display:block; margin-bottom:var(--space-xs);">Files Queue</span>
            <ul id="ai-packager-queue" style="font-size:0.8rem; color:var(--text-secondary); max-height: 180px; overflow-y:auto; padding-left:14px; list-style:square;">
              <li style="color:var(--text-tertiary);">No files selected</li>
            </ul>
          </div>

          <div class="tool-actions">
            <button class="tool-btn tool-btn-primary" id="ai-packager-generate">Build Prompt Context</button>
            <button class="tool-btn" id="ai-packager-clear">Clear</button>
          </div>
        </div>

        <div class="tool-group">
          <label>Bundled Markdown Output</label>
          <textarea id="ai-packager-output" class="tool-textarea" readonly placeholder="Output Markdown context will appear here... (ready to copy into ChatGPT/Claude)" style="min-height: 340px; font-size:0.82rem;"></textarea>
          <div class="tool-actions" style="margin-top:var(--space-sm);">
            <button class="tool-btn" id="ai-packager-copy">Copy to Clipboard</button>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const fileInput = document.getElementById('ai-packager-files');
    const queueList = document.getElementById('ai-packager-queue');
    const generateBtn = document.getElementById('ai-packager-generate');
    const clearBtn = document.getElementById('ai-packager-clear');
    const outputArea = document.getElementById('ai-packager-output');
    const copyBtn = document.getElementById('ai-packager-copy');

    let loadedFiles = [];

    const t = (k) => window.i18n ? window.i18n.t(k) : k;
    if (clearBtn) clearBtn.textContent = t('clear');
    if (copyBtn) copyBtn.textContent = t('copy');

    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      loadedFiles = loadedFiles.concat(files);
      updateQueue();
    });

    function updateQueue() {
      if (loadedFiles.length === 0) {
        queueList.innerHTML = '<li style="color:var(--text-tertiary);">No files selected</li>';
        return;
      }

      queueList.innerHTML = loadedFiles.map((file, idx) => `
        <li style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>📄 <strong>${file.name}</strong> (${formatBytes(file.size)})</span>
          <span style="color:var(--color-error); cursor:pointer; font-weight:bold; padding:0 6px;" data-index="${idx}">✕</span>
        </li>
      `).join('');

      // Wire remove actions
      queueList.querySelectorAll('span[data-index]').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.dataset.index);
          loadedFiles.splice(idx, 1);
          updateQueue();
          if (window.SoundFX) window.SoundFX.playClick();
        });
      });
    }

    generateBtn.addEventListener('click', async () => {
      if (loadedFiles.length === 0) {
        DevForge.toast('Please upload some files first', 'error');
        return;
      }

      let markdown = '';
      markdown += `## Project Context Files Bundle\n`;
      markdown += `This context contains ${loadedFiles.length} files. Please use them to answer questions or write code.\n\n`;

      for (let file of loadedFiles) {
        markdown += `### File: \`${file.name}\`\n`;
        markdown += `\`\`\`${getFileExtension(file.name)}\n`;
        try {
          const text = await readFileAsText(file);
          markdown += text.trim() + `\n`;
        } catch (err) {
          markdown += `[Error reading file content: ${err.message}]\n`;
        }
        markdown += `\`\`\`\n\n`;
      }

      outputArea.value = markdown;
      if (window.SoundFX) window.SoundFX.playSuccess();
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 45, origin: { y: 0.8 } });
      }
    });

    copyBtn.addEventListener('click', () => {
      if (!outputArea.value) {
        DevForge.toast('Nothing to copy', 'error');
        return;
      }
      DevForge.copyToClipboard(outputArea.value);
    });

    clearBtn.addEventListener('click', () => {
      fileInput.value = '';
      loadedFiles = [];
      updateQueue();
      outputArea.value = '';
      if (window.SoundFX) window.SoundFX.playClick();
    });

    // Helper functions
    function readFileAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('File reading error'));
        reader.readAsText(file);
      });
    }

    function getFileExtension(filename) {
      return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2) || 'text';
    }

    function formatBytes(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
  }
});
