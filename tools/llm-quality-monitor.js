/**
 * LLM Quality Monitor Tool
 * Real-time LLM degradation tracking via aistupidlevel.info embed
 */

(function () {
  'use strict';

  const LLMQualityMonitor = {
    id: 'llm-quality-monitor',
    name: 'LLM Quality Monitor',
    icon: '📊',
    description: 'Real-time tracking of LLM model degradation and quality metrics',
    category: 'AI',

    init: function () {
      this.render();
    },

    render: function () {
      const t = key => (window.i18n && window.i18n.t ? window.i18n.t(key) : key);

      return `
        <div class="tool llm-quality-monitor">
          <style>
            .llm-quality-monitor {
              padding: 1rem;
              height: calc(100vh - 200px);
              display: flex;
              flex-direction: column;
            }
            .llm-quality-monitor h2 {
              color: var(--text-primary);
              margin-bottom: 0.5rem;
            }
            .description {
              color: var(--text-secondary);
              margin-bottom: 1rem;
            }
            .iframe-container {
              flex: 1;
              border-radius: 12px;
              overflow: hidden;
              border: 2px solid var(--border-primary);
              background: var(--bg-secondary);
              position: relative;
            }
            .iframe-container iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
            .fallback-message {
              padding: 2rem;
              text-align: center;
              color: var(--text-secondary);
            }
            .fallback-message h3 {
              color: var(--text-primary);
              margin-bottom: 1rem;
            }
            .fallback-message a {
              color: var(--primary-color);
              text-decoration: underline;
            }
            .info-bar {
              display: flex;
              gap: 1rem;
              margin-bottom: 1rem;
              flex-wrap: wrap;
            }
            .info-card {
              flex: 1;
              min-width: 200px;
              background: var(--bg-secondary);
              border-radius: 8px;
              padding: 1rem;
              border-left: 4px solid var(--primary-color);
            }
            .info-card h4 {
              color: var(--primary-color);
              margin-bottom: 0.5rem;
              font-size: 0.9rem;
            }
            .info-card .value {
              font-size: 1.5rem;
              font-weight: 700;
              color: var(--text-primary);
            }
            .info-card .trend {
              font-size: 0.85rem;
              color: var(--text-secondary);
              margin-top: 0.25rem;
            }
            .trend.negative {
              color: #ef4444;
            }
            .trend.positive {
              color: #10b981;
            }
          </style>

          <h2>📊 ${t('llmMonitorTitle') || 'LLM Quality Monitor'}</h2>
          <p class="description">${t('llmMonitorDesc') || 'Real-time tracking of model degradation and quality metrics'}</p>

          <div class="info-bar">
            <div class="info-card">
              <h4>${t('llmMonitorModels') || 'Models Tracked'}</h4>
              <div class="value">50+</div>
              <div class="trend">${t('llmMonitorModelsTrend') || 'GPT, Claude, Gemini, Llama, etc.'}</div>
            </div>
            <div class="info-card">
              <h4>${t('llmMonitorCategories') || 'Categories'}</h4>
              <div class="value">8</div>
              <div class="trend">${t('llmMonitorCategoriesTrend') || 'Reasoning, Coding, Agent Skills'}</div>
            </div>
            <div class="info-card">
              <h4>${t('llmMonitorAlerts') || 'Active Alerts'}</h4>
              <div class="value" style="color: #ef4444;">3</div>
              <div class="trend negative">${t('llmMonitorAlertsTrend') || 'Gemini 3.1 Flash Lite -32%'}</div>
            </div>
          </div>

          <div class="iframe-container" id="llm-iframe-container">
            <iframe 
              src="https://aistupidlevel.info" 
              title="LLM Quality Monitor"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              referrerpolicy="no-referrer"
            ></iframe>
          </div>

          <div class="fallback-message" style="display: none;" id="llm-fallback">
            <h3>${t('llmMonitorFallbackTitle') || 'External content blocked'}</h3>
            <p>${t('llmMonitorFallbackDesc') || 'Your browser blocked the embedded content. Open directly:'}</p>
            <a href="https://aistupidlevel.info" target="_blank" rel="noopener noreferrer">
              ${t('llmMonitorFallbackLink') || 'Open aistupidlevel.info in new tab'}
            </a>
          </div>
        </div>
      `;
    }
  };

  // Register tool
  if (window.DevForge) {
    window.DevForge.registerTool(LLMQualityMonitor);
  }
})();
