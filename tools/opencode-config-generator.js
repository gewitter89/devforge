/* ============================================================
   DevForge — OpenCode Config Generator
   Generates opencode.jsonc with extended context limits
   ============================================================ */

(function () {
  'use strict';

  if (!window.DevForge) return;

  DevForge.registerTool({
    id: 'opencode-config-generator',
    name: 'OpenCode Config Generator',
    description: 'Generate opencode.jsonc with 1M context limits, custom providers and model routing. Free LLM optimized.',
    category: 'ai',
    icon: '⚙️',
    tags: ['opencode', 'llm', 'ai', 'config', 'deepseek', 'qwen', 'context', 'cursor', 'cline', 'free api'],

    render: function () {
      return `
        <style>
          .ocg-container { padding: var(--space-md); }
          .ocg-section {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-md);
            padding: var(--space-md);
            margin-bottom: var(--space-md);
          }
          .ocg-section h3 {
            font-size: 0.95rem;
            font-weight: 600;
            margin-bottom: var(--space-sm);
            color: var(--text-primary);
          }
          .ocg-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--space-sm);
          }
          .ocg-model-card {
            position: relative;
            background: var(--bg-secondary);
            border: 2px solid var(--border-primary);
            border-radius: var(--radius-md);
            padding: var(--space-sm) var(--space-md);
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .ocg-model-card:hover {
            border-color: var(--border-accent);
            transform: translateY(-1px);
          }
          .ocg-model-card.selected {
            border-color: var(--text-accent);
            background: rgba(139,92,246,0.08);
          }
          .ocg-model-card input[type="checkbox"] {
            position: absolute;
            top: 8px;
            right: 8px;
          }
          .ocg-model-name {
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--text-primary);
            margin-bottom: 2px;
          }
          .ocg-model-meta {
            font-size: 0.75rem;
            color: var(--text-secondary);
          }
          .ocg-input-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-sm);
            margin-bottom: var(--space-sm);
          }
          .ocg-label {
            display: block;
            font-size: 0.8rem;
            font-weight: 500;
            margin-bottom: 4px;
            color: var(--text-secondary);
          }
          .ocg-input {
            width: 100%;
            padding: 8px 12px;
            background: var(--bg-input);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-sm);
            color: var(--text-primary);
            font-size: 0.875rem;
            font-family: 'JetBrains Mono', monospace;
          }
          .ocg-input:focus {
            outline: none;
            border-color: var(--border-accent);
          }
          .ocg-presets {
            display: flex;
            gap: var(--space-xs);
            flex-wrap: wrap;
            margin-bottom: var(--space-sm);
          }
          .ocg-preset {
            padding: 4px 10px;
            font-size: 0.75rem;
            background: var(--bg-secondary);
            border: 1px solid var(--border-primary);
            border-radius: 999px;
            cursor: pointer;
            color: var(--text-secondary);
            transition: all 0.15s ease;
          }
          .ocg-preset:hover {
            border-color: var(--border-accent);
            color: var(--text-accent);
          }
          .ocg-output-wrap {
            position: relative;
            background: #0d1117;
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-md);
            padding: var(--space-md);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            line-height: 1.5;
            color: #c9d1d9;
            white-space: pre;
            overflow-x: auto;
            max-height: 420px;
          }
          .ocg-output-wrap .k { color: #ff7b72; }
          .ocg-output-wrap .s { color: #a5d6ff; }
          .ocg-output-wrap .n { color: #ffa657; }
          .ocg-copy-float {
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 6px 12px;
            background: var(--text-accent);
            color: white;
            border: none;
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.15s ease;
          }
          .ocg-copy-float:hover { opacity: 0.85; }
          .ocg-actions {
            display: flex;
            gap: var(--space-sm);
            margin-top: var(--space-md);
          }
          .ocg-btn {
            flex: 1;
            padding: 10px 16px;
            border-radius: var(--radius-md);
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            border: 1px solid var(--border-primary);
            transition: all 0.15s ease;
          }
          .ocg-btn-primary {
            background: var(--text-accent);
            color: white;
            border: none;
          }
          .ocg-btn-primary:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }
          .ocg-btn-secondary {
            background: transparent;
            color: var(--text-primary);
          }
          .ocg-btn-secondary:hover {
            background: var(--bg-tertiary);
          }
          .ocg-info {
            font-size: 0.75rem;
            color: var(--text-tertiary);
            margin-top: var(--space-sm);
            line-height: 1.5;
          }
        </style>

        <div class="ocg-container">
          <div class="ocg-section">
            <h3>📦 Select Free LLM Models</h3>
            <div class="ocg-grid" id="ocg-models"></div>
          </div>

          <div class="ocg-section">
            <h3>🪟 Context Window Presets</h3>
            <div class="ocg-presets" id="ocg-presets"></div>
            <div class="ocg-input-row">
              <div>
                <label class="ocg-label">Context Limit (tokens)</label>
                <input class="ocg-input" type="number" id="ocg-context" value="1000000" min="4000" max="2000000">
              </div>
              <div>
                <label class="ocg-label">Output Limit (tokens)</label>
                <input class="ocg-input" type="number" id="ocg-output" value="64000" min="1000" max="128000">
              </div>
            </div>
          </div>

          <div class="ocg-section">
            <h3>⚡ Compaction Settings</h3>
            <div class="ocg-input-row">
              <div>
                <label class="ocg-label">Reserved Tokens</label>
                <input class="ocg-input" type="number" id="ocg-reserved" value="100000">
              </div>
              <div>
                <label class="ocg-label">Preserve Recent Tokens</label>
                <input class="ocg-input" type="number" id="ocg-recent" value="50000">
              </div>
            </div>
            <div class="ocg-input-row">
              <div>
                <label class="ocg-label">Tail Turns</label>
                <input class="ocg-input" type="number" id="ocg-tail" value="10">
              </div>
              <div>
                <label class="ocg-label">Auto Compaction</label>
                <select class="ocg-input" id="ocg-auto">
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>
          </div>

          <div class="ocg-section">
            <h3>📄 Generated opencode.jsonc</h3>
            <div class="ocg-output-wrap" id="ocg-output">
              <button class="ocg-copy-float" id="ocg-copy">📋 Copy</button>
              <pre id="ocg-json"></pre>
            </div>
            <div class="ocg-info">
              💾 Save as <code>opencode/opencode.jsonc</code> → opencode reads native config<br>
              🎯 Works with: OpenCode, Cline, Cursor (OpenAI-compatible providers)<br>
              ⚠️ API still needs to accept 1M tokens — config only disables opencode-side truncation
            </div>
          </div>

          <div class="ocg-actions">
            <button class="ocg-btn ocg-btn-primary" id="ocg-generate">🚀 Regenerate Config</button>
            <button class="ocg-btn ocg-btn-secondary" id="ocg-download">⬇️ Download .jsonc</button>
          </div>
        </div>
      `;
    },

    init: function () {
      const MODELS = [
        { id: 'deepseek-v4-flash-free', name: 'DeepSeek V4 Flash Free', native: '128K', best: 'coding, fast', defaultOutput: 64000 },
        { id: 'qwen3.6-plus-free', name: 'Qwen 3.6 Plus Free', native: '256K', best: 'reasoning, context', defaultOutput: 32000 },
        { id: 'glm-5.2-free', name: 'GLM 5.2 Free', native: '128K', best: 'multilingual, balanced', defaultOutput: 32000 },
        { id: 'fable5-free', name: 'Fable 5 Free', native: '200K', best: 'long-form writing', defaultOutput: 32000 },
        { id: 'gemma-4-26b-free', name: 'Gemma 4 26B Free', native: '128K', best: 'text, summaries', defaultOutput: 16000 },
        { id: 'llama-3.3-70b-free', name: 'Llama 3.3 70B Free', native: '128K', best: 'general, instruct', defaultOutput: 16000 },
      ];

      const PRESETS = [
        { label: 'Native (128K)', value: 128000 },
        { label: 'Extended (256K)', value: 256000 },
        { label: 'Huge (500K)', value: 500000 },
        { label: '🔥 1M (GIG Method)', value: 1000000 },
      ];

      const selected = new Set(['deepseek-v4-flash-free', 'qwen3.6-plus-free']);

      function renderModels() {
        const container = document.getElementById('ocg-models');
        container.innerHTML = MODELS.map(m => {
          const checked = selected.has(m.id);
          return `
            <label class="ocg-model-card ${checked ? 'selected' : ''}" data-id="${m.id}">
              <input type="checkbox" ${checked ? 'checked' : ''}>
              <div class="ocg-model-name">${m.name}</div>
              <div class="ocg-model-meta">Native: ${m.native} • ${m.best}</div>
            </label>
          `;
        }).join('');

        container.querySelectorAll('.ocg-model-card').forEach(card => {
          card.addEventListener('click', e => {
            if (e.target.tagName === 'INPUT') {
              e.preventDefault();
            }
            const id = card.dataset.id;
            if (selected.has(id)) selected.delete(id);
            else selected.add(id);
            renderModels();
            generate();
          });
        });
      }

      function renderPresets() {
        const container = document.getElementById('ocg-presets');
        container.innerHTML = PRESETS.map(p =>
          `<button class="ocg-preset" data-value="${p.value}">${p.label}</button>`
        ).join('');

        container.querySelectorAll('.ocg-preset').forEach(btn => {
          btn.addEventListener('click', () => {
            document.getElementById('ocg-context').value = btn.dataset.value;
            generate();
          });
        });
      }

      function buildConfig() {
        const context = parseInt(document.getElementById('ocg-context').value) || 1000000;
        const outputLimit = parseInt(document.getElementById('ocg-output').value) || 64000;
        const reserved = parseInt(document.getElementById('ocg-reserved').value) || 100000;
        const recent = parseInt(document.getElementById('ocg-recent').value) || 50000;
        const tail = parseInt(document.getElementById('ocg-tail').value) || 10;
        const auto = document.getElementById('ocg-auto').value === 'true';

        const models = {};
        selected.forEach(id => {
          const m = MODELS.find(x => x.id === id);
          models[id] = {
            limit: {
              context: context,
              output: Math.min(outputLimit, m ? m.defaultOutput : outputLimit)
            }
          };
        });

        return {
          compaction: {
            auto: auto,
            prune: false,
            reserved: reserved,
            tail_turns: tail,
            preserve_recent_tokens: recent
          },
          provider: {
            opencode: {
              models: models
            }
          }
        };
      }

      function highlight(json) {
        return json
          .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span class="k">$1</span>:')
          .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="s">$1</span>')
          .replace(/:\s*(-?\d+(?:\.\d+)?)/g, ': <span class="n">$1</span>')
          .replace(/:\s*(true|false|null)/g, ': <span class="n">$1</span>');
      }

      function generate() {
        const cfg = buildConfig();
        let json;
        if (Object.keys(cfg.provider.opencode.models).length === 0) {
          json = '// ⚠️ Select at least one model above to generate config\n';
          json += JSON.stringify(cfg.compaction, null, 2);
        } else {
          json = JSON.stringify(cfg, null, 2);
        }
        document.getElementById('ocg-json').innerHTML = highlight(json);
      }

      function download() {
        const cfg = buildConfig();
        const json = JSON.stringify(cfg, null, 2);
        const blob = new Blob([json], { type: 'application/jsonc' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'opencode.jsonc';
        a.click();
        URL.revokeObjectURL(url);
        if (window.DevForge && DevForge.toast) DevForge.toast('✓ Downloaded opencode.jsonc');
      }

      renderModels();
      renderPresets();
      generate();

      document.getElementById('ocg-generate').addEventListener('click', generate);
      document.getElementById('ocg-download').addEventListener('click', download);
      document.getElementById('ocg-copy').addEventListener('click', () => {
        const json = document.getElementById('ocg-json').innerText;
        if (window.DevForge) DevForge.copyToClipboard(json);
      });

      ['ocg-context', 'ocg-output', 'ocg-reserved', 'ocg-recent', 'ocg-tail', 'ocg-auto'].forEach(id => {
        document.getElementById(id).addEventListener('change', generate);
      });
    },

    destroy: function () {}
  });
})();
