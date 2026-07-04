/**
 * Multi-Provider AI Router Tool
 * Compare responses from multiple free LLM providers in parallel
 */

(function () {
  'use strict';

  const AIProviders = {
    openrouter: {
      name: 'OpenRouter',
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      models: [
        'z-ai/glm-4.5-air',
        'qwen/qwen3-235b-a22b:free',
        'meta-llama/llama-3.3-70b-instruct:free',
        'google/gemma-3-27b-it:free'
      ],
      requiresKey: true
    },
    groq: {
      name: 'Groq',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
      requiresKey: true
    },
    github: {
      name: 'GitHub Models',
      endpoint: 'https://models.inference.ai.azure.com/chat/completions',
      models: ['gpt-4o-mini', 'Phi-3.5-mini-instruct', 'Llama-3.3-70B-Instruct'],
      requiresKey: true
    },
    ollama: {
      name: 'Ollama (Local)',
      endpoint: 'http://localhost:11434/api/chat',
      models: ['llama3.3', 'qwen2.5', 'mistral', 'phi3'],
      requiresKey: false
    }
  };

  const MultiProviderRouter = {
    id: 'multi-provider-router',
    name: 'Multi-Provider AI Router',
    icon: '🔀',
    description: 'Compare LLM responses from multiple providers in parallel',
    category: 'AI',

    init: function () {
      this.apiKeys = JSON.parse(localStorage.getItem('devforge-ai-keys') || '{}');
    },

    render: function () {
      const t = key => (window.i18n && window.i18n.t ? window.i18n.t(key) : key);

      const providerCheckboxes = Object.entries(AIProviders)
        .map(
          ([key, provider]) => `
        <label class="provider-checkbox">
          <input type="checkbox" value="${key}" ${
            this.apiKeys[key] || !provider.requiresKey ? 'checked' : 'disabled'
          }>
          <span>${provider.name}</span>
          ${provider.requiresKey && !this.apiKeys[key] ? '<small>(API key required)</small>' : ''}
        </label>
      `
        )
        .join('');

      const modelSelects = Object.entries(AIProviders)
        .map(
          ([key, provider]) => `
        <div class="model-select-group" data-provider="${key}" style="display:none;">
          <label>${provider.name} Model:</label>
          <select class="model-select" data-provider="${key}">
            ${provider.models.map(m => `<option value="${m}">${m}</option>`).join('')}
          </select>
        </div>
      `
        )
        .join('');

      return `
        <div class="tool multi-provider-router">
          <style>
            .multi-provider-router {
              padding: 2rem;
              max-width: 1400px;
              margin: 0 auto;
            }
            .multi-provider-router h2 {
              color: var(--text-primary);
              margin-bottom: 0.5rem;
            }
            .description {
              color: var(--text-secondary);
              margin-bottom: 2rem;
            }
            .config-section {
              background: var(--bg-secondary);
              border-radius: 12px;
              padding: 1.5rem;
              margin-bottom: 1.5rem;
            }
            .provider-checkboxes {
              display: flex;
              gap: 1rem;
              flex-wrap: wrap;
              margin-bottom: 1rem;
            }
            .provider-checkbox {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 12px;
              background: var(--bg-primary);
              border-radius: 8px;
              cursor: pointer;
            }
            .provider-checkbox input[disabled] {
              opacity: 0.5;
            }
            .provider-checkbox small {
              color: var(--text-secondary);
              font-size: 0.8rem;
            }
            .model-select-group {
              margin-bottom: 1rem;
            }
            .model-select-group label {
              display: block;
              margin-bottom: 0.5rem;
              color: var(--text-primary);
              font-weight: 600;
            }
            .model-select {
              width: 100%;
              padding: 10px 14px;
              border: 2px solid var(--border-primary);
              border-radius: 8px;
              background: var(--bg-primary);
              color: var(--text-primary);
              font-size: 0.95rem;
            }
            .prompt-section {
              margin-bottom: 1.5rem;
            }
            .prompt-section label {
              display: block;
              margin-bottom: 0.5rem;
              color: var(--text-primary);
              font-weight: 600;
            }
            .prompt-textarea {
              width: 100%;
              min-height: 120px;
              padding: 14px;
              border: 2px solid var(--border-primary);
              border-radius: 8px;
              background: var(--bg-primary);
              color: var(--text-primary);
              font-size: 1rem;
              font-family: 'Monaco', 'Consolas', monospace;
              resize: vertical;
            }
            .compare-btn {
              width: 100%;
              padding: 14px 32px;
              background: linear-gradient(135deg, #8b5cf6, #a78bfa);
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: 700;
              font-size: 1.1rem;
              cursor: pointer;
              transition: transform 0.15s, box-shadow 0.15s;
              margin-bottom: 2rem;
            }
            .compare-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
            }
            .compare-btn:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
            .results-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
              gap: 1.5rem;
              margin-top: 2rem;
            }
            .result-card {
              background: var(--bg-secondary);
              border-radius: 12px;
              padding: 1.5rem;
              border-left: 4px solid var(--primary-color);
            }
            .result-card h3 {
              color: var(--text-primary);
              margin-bottom: 0.5rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .result-card .metrics {
              display: flex;
              gap: 1rem;
              margin-bottom: 1rem;
              font-size: 0.85rem;
            }
            .metric {
              padding: 4px 10px;
              background: var(--bg-tertiary);
              border-radius: 6px;
              color: var(--text-secondary);
            }
            .metric strong {
              color: var(--primary-color);
            }
            .result-content {
              background: var(--bg-primary);
              padding: 1rem;
              border-radius: 8px;
              color: var(--text-primary);
              font-size: 0.95rem;
              line-height: 1.6;
              max-height: 300px;
              overflow-y: auto;
              white-space: pre-wrap;
            }
            .loading-spinner {
              display: inline-block;
              width: 16px;
              height: 16px;
              border: 2px solid var(--border-primary);
              border-top-color: var(--primary-color);
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            .error-message {
              color: #ef4444;
              font-size: 0.9rem;
              margin-top: 0.5rem;
            }
            .api-key-input {
              width: 100%;
              padding: 10px 14px;
              border: 2px solid var(--border-primary);
              border-radius: 8px;
              background: var(--bg-primary);
              color: var(--text-primary);
              font-size: 0.9rem;
              margin-top: 0.5rem;
            }
            .export-buttons {
              display: flex;
              gap: 1rem;
              margin-top: 1.5rem;
            }
            .export-btn {
              padding: 10px 20px;
              background: var(--bg-tertiary);
              color: var(--text-primary);
              border: 2px solid var(--border-primary);
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.15s;
            }
            .export-btn:hover {
              background: var(--primary-color);
              color: white;
              border-color: var(--primary-color);
            }
          </style>

          <h2>🔀 ${t('routerTitle') || 'Multi-Provider AI Router'}</h2>
          <p class="description">${t('routerDesc') || 'Compare responses from multiple LLM providers in parallel'}</p>

          <div class="config-section">
            <h3>${t('selectProviders') || 'Select Providers'}</h3>
            <div class="provider-checkboxes">
              ${providerCheckboxes}
            </div>

            <h3>${t('selectModels') || 'Select Models'}</h3>
            ${modelSelects}

            <h3>${t('apiKeys') || 'API Keys (stored in localStorage)'}</h3>
            ${Object.entries(AIProviders)
              .filter(([, p]) => p.requiresKey)
              .map(
                ([key, provider]) => `
              <div class="api-key-group" style="margin-bottom: 1rem;">
                <label>${provider.name} API Key:</label>
                <input 
                  type="password" 
                  class="api-key-input" 
                  data-provider="${key}"
                  placeholder="${this.apiKeys[key] ? '••••••••' : 'sk-...'}"
                  value="${this.apiKeys[key] || ''}"
                />
              </div>
            `
              )
              .join('')}
          </div>

          <div class="prompt-section">
            <label for="router-prompt">${t('prompt') || 'Your Prompt:'}</label>
            <textarea id="router-prompt" class="prompt-textarea" placeholder="${t('promptPlaceholder') || 'Enter your prompt here...'}"></textarea>
          </div>

          <button class="compare-btn" id="compare-btn">
            ${t('compareBtn') || 'Compare Responses'}
          </button>

          <div class="results-grid" id="results-grid"></div>

          <div class="export-buttons" id="export-buttons" style="display:none;">
            <button class="export-btn" id="export-json">
              ${t('exportJson') || 'Export as JSON'}
            </button>
            <button class="export-btn" id="export-markdown">
              ${t('exportMarkdown') || 'Export as Markdown'}
            </button>
          </div>
        </div>
      `;
    },

    bindEvents: function () {
      const compareBtn = document.getElementById('compare-btn');
      const providerCheckboxes = document.querySelectorAll('.provider-checkbox input');
      const apiKeyInputs = document.querySelectorAll('.api-key-input');

      // Show/hide model selects based on checked providers
      providerCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const provider = checkbox.value;
          const selectGroup = document.querySelector(
            `.model-select-group[data-provider="${provider}"]`
          );
          if (selectGroup) {
            selectGroup.style.display = checkbox.checked ? 'block' : 'none';
          }
        });

        // Initialize visibility
        if (checkbox.checked) {
          const provider = checkbox.value;
          const selectGroup = document.querySelector(
            `.model-select-group[data-provider="${provider}"]`
          );
          if (selectGroup) selectGroup.style.display = 'block';
        }
      });

      // Save API keys
      apiKeyInputs.forEach(input => {
        input.addEventListener('change', () => {
          const provider = input.dataset.provider;
          const key = input.value.trim();
          if (key) {
            this.apiKeys[provider] = key;
          } else {
            delete this.apiKeys[provider];
          }
          localStorage.setItem('devforge-ai-keys', JSON.stringify(this.apiKeys));

          // Enable/disable checkbox
          const checkbox = document.querySelector(`.provider-checkbox input[value="${provider}"]`);
          if (checkbox && AIProviders[provider].requiresKey) {
            checkbox.disabled = !key;
            checkbox.checked = !!key;
          }
        });
      });

      // Compare button
      compareBtn.addEventListener('click', () => this.compareResponses());

      // Export buttons
      document
        .getElementById('export-json')
        .addEventListener('click', () => this.exportResults('json'));
      document
        .getElementById('export-markdown')
        .addEventListener('click', () => this.exportResults('markdown'));
    },

    async compareResponses() {
      const checkedProviders = Array.from(
        document.querySelectorAll('.provider-checkbox input:checked')
      ).map(cb => cb.value);

      if (checkedProviders.length === 0) {
        alert('Please select at least one provider');
        return;
      }

      const prompt = document.getElementById('router-prompt').value.trim();
      if (!prompt) {
        alert('Please enter a prompt');
        return;
      }

      const resultsGrid = document.getElementById('results-grid');
      const compareBtn = document.getElementById('compare-btn');
      const exportButtons = document.getElementById('export-buttons');

      // Show loading state
      resultsGrid.innerHTML = checkedProviders
        .map(
          provider => `
        <div class="result-card" data-provider="${provider}">
          <h3>
            ${AIProviders[provider].name}
            <span class="loading-spinner"></span>
          </h3>
          <div class="metrics"></div>
          <div class="result-content">Loading...</div>
        </div>
      `
        )
        .join('');

      compareBtn.disabled = true;
      exportButtons.style.display = 'none';

      this.lastResults = [];

      // Send parallel requests
      const promises = checkedProviders.map(provider => this.fetchResponse(provider, prompt));

      // Update results as they complete
      promises.forEach((promise, index) => {
        promise.then(result => {
          this.lastResults[index] = result;
          this.updateResultCard(provider, result);

          // Show export buttons when first result is in
          if (this.lastResults.filter(Boolean).length === 1) {
            exportButtons.style.display = 'flex';
          }
        });
      });

      // Wait for all to complete
      await Promise.all(promises);

      compareBtn.disabled = false;
    },

    async fetchResponse(provider, prompt) {
      const config = AIProviders[provider];
      const model = document.querySelector(`.model-select[data-provider="${provider}"]`).value;
      const startTime = Date.now();

      try {
        let response;

        if (provider === 'ollama') {
          // Ollama uses different format
          response = await fetch(config.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'user', content: prompt }],
              stream: false
            })
          });
        } else {
          // OpenAI-compatible APIs
          const headers = {
            'Content-Type': 'application/json'
          };

          const apiKey = this.apiKeys[provider];
          if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
          }

          if (provider === 'openrouter') {
            headers['HTTP-Referer'] = window.location.origin;
            headers['X-Title'] = 'DevForge Multi-Provider Router';
          }

          response = await fetch(config.endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 1000
            })
          });
        }

        const data = await response.json();
        const latency = Date.now() - startTime;

        let content, tokens;
        if (provider === 'ollama') {
          content = data.message?.content || 'No response';
          tokens = data.eval_count || 0;
        } else {
          content = data.choices?.[0]?.message?.content || 'No response';
          tokens = data.usage?.completion_tokens || 0;
        }

        return {
          provider: config.name,
          model: model,
          content: content,
          latency: latency,
          tokens: tokens,
          success: true
        };
      } catch (error) {
        return {
          provider: config.name,
          model: model,
          content: null,
          error: error.message,
          latency: Date.now() - startTime,
          success: false
        };
      }
    },

    updateResultCard(provider, result) {
      const card = document.querySelector(`.result-card[data-provider="${provider}"]`);
      if (!card) return;

      const h3 = card.querySelector('h3');
      const metrics = card.querySelector('.metrics');
      const content = card.querySelector('.result-content');

      h3.innerHTML = `${result.provider} <small style="color: var(--text-secondary); font-size: 0.8rem;">${result.model}</small>`;

      if (result.success) {
        metrics.innerHTML = `
          <span class="metric"><strong>${result.latency}ms</strong> latency</span>
          <span class="metric"><strong>${result.tokens}</strong> tokens</span>
        `;
        content.textContent = result.content;
        card.style.borderLeftColor = '#10b981';
      } else {
        metrics.innerHTML = `
          <span class="metric"><strong>${result.latency}ms</strong> latency</span>
        `;
        content.innerHTML = `<div class="error-message">❌ ${result.error}</div>`;
        card.style.borderLeftColor = '#ef4444';
      }
    },

    exportResults(format) {
      if (!this.lastResults || this.lastResults.length === 0) {
        alert('No results to export');
        return;
      }

      let content, filename, type;

      if (format === 'json') {
        content = JSON.stringify(this.lastResults, null, 2);
        filename = 'llm-comparison.json';
        type = 'application/json';
      } else {
        content = this.generateMarkdownReport(this.lastResults);
        filename = 'llm-comparison.md';
        type = 'text/markdown';
      }

      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },

    generateMarkdownReport(results) {
      const prompt = document.getElementById('router-prompt').value;
      const timestamp = new Date().toISOString();

      let md = `# LLM Comparison Report\n\n`;
      md += `**Prompt:** ${prompt}\n`;
      md += `**Timestamp:** ${timestamp}\n\n`;
      md += `## Results\n\n`;

      results.forEach((result, index) => {
        md += `### ${index + 1}. ${result.provider} (${result.model})\n\n`;
        md += `- **Latency:** ${result.latency}ms\n`;
        md += `- **Tokens:** ${result.tokens || 'N/A'}\n\n`;

        if (result.success) {
          md += `**Response:**\n\n${result.content}\n\n`;
        } else {
          md += `**Error:** ${result.error}\n\n`;
        }

        md += `---\n\n`;
      });

      return md;
    }
  };

  if (window.DevForge) {
    window.DevForge.registerTool(MultiProviderRouter);
  }
})();
