/**
 * Breach Checker Tool
 * Check if email/domain appears in known data breaches via HIBP API
 */

(function () {
  'use strict';

  const BreachChecker = {
    id: 'breach-checker',
    name: 'Breach Checker',
    icon: '🔒',
    description: 'Check if your email or domain appears in known data breaches (via HIBP API)',
    category: 'Security',

    init: function () {
      this.render();
      this.bindEvents();
    },

    render: function () {
      const t = (key) => window.i18n && window.i18n.t ? window.i18n.t(key) : key;
      
      return `
        <div class="tool breach-checker">
          <style>
            .breach-checker {
              padding: 2rem;
              max-width: 900px;
              margin: 0 auto;
            }
            .breach-checker h2 {
              color: var(--text-primary);
              margin-bottom: 0.5rem;
            }
            .breach-checker .description {
              color: var(--text-secondary);
              margin-bottom: 2rem;
            }
            .input-section {
              background: var(--bg-secondary);
              border-radius: 12px;
              padding: 1.5rem;
              margin-bottom: 1.5rem;
            }
            .input-group {
              display: flex;
              gap: 12px;
              flex-wrap: wrap;
            }
            .input-group input {
              flex: 1;
              min-width: 250px;
              padding: 12px 16px;
              border: 2px solid var(--border-primary);
              border-radius: 8px;
              background: var(--bg-primary);
              color: var(--text-primary);
              font-size: 1rem;
            }
            .input-group input:focus {
              outline: none;
              border-color: var(--primary-color);
            }
            .check-btn {
              padding: 12px 32px;
              background: var(--primary-color);
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              transition: transform 0.15s, box-shadow 0.15s;
            }
            .check-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
            }
            .check-btn:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
            .results {
              background: var(--bg-secondary);
              border-radius: 12px;
              padding: 1.5rem;
              min-height: 200px;
            }
            .result-header {
              font-size: 1.2rem;
              font-weight: 600;
              margin-bottom: 1rem;
              color: var(--text-primary);
            }
            .breach-item {
              background: var(--bg-primary);
              border-left: 4px solid #ef4444;
              padding: 1rem;
              margin-bottom: 1rem;
              border-radius: 8px;
            }
            .breach-item h4 {
              color: #ef4444;
              margin-bottom: 0.5rem;
            }
            .breach-item .meta {
              color: var(--text-secondary);
              font-size: 0.9rem;
              margin-bottom: 0.5rem;
            }
            .breach-item .data-types {
              color: var(--text-secondary);
              font-size: 0.85rem;
            }
            .safe-message {
              background: #10b981;
              color: white;
              padding: 1.5rem;
              border-radius: 8px;
              text-align: center;
              font-weight: 600;
            }
            .loading {
              text-align: center;
              padding: 2rem;
              color: var(--text-secondary);
            }
            .error-message {
              background: #fef2f2;
              border: 2px solid #ef4444;
              color: #ef4444;
              padding: 1rem;
              border-radius: 8px;
              margin-bottom: 1rem;
            }
            .info-box {
              background: var(--bg-tertiary);
              border-left: 4px solid var(--primary-color);
              padding: 1rem;
              margin-top: 1.5rem;
              border-radius: 8px;
            }
            .info-box h4 {
              color: var(--primary-color);
              margin-bottom: 0.5rem;
            }
            .info-box p {
              color: var(--text-secondary);
              font-size: 0.9rem;
              line-height: 1.6;
            }
          </style>

          <h2>🔒 ${t('breachCheckerTitle') || 'Breach Checker'}</h2>
          <p class="description">${t('breachCheckerDesc') || 'Check if your email appears in known data breaches'}</p>

          <div class="input-section">
            <div class="input-group">
              <input 
                type="text" 
                id="breach-input" 
                placeholder="${t('breachPlaceholder') || 'Enter email address...'}"
                autocomplete="off"
              />
              <button class="check-btn" id="check-btn">
                ${t('checkBtn') || 'Check'}
              </button>
            </div>
          </div>

          <div class="results" id="breach-results">
            <div style="text-align: center; color: var(--text-secondary); padding: 2rem;">
              ${t('breachInitial') || 'Enter an email address above to check for breaches'}
            </div>
          </div>

          <div class="info-box">
            <h4>${t('breachInfoTitle') || 'How it works'}</h4>
            <p>${t('breachInfoDesc') || 'This tool uses the Have I Been Pwned API to check if your email has appeared in known data breaches. All queries are made directly from your browser - no data is stored or logged.'}</p>
          </div>
        </div>
      `;
    },

    bindEvents: function () {
      const checkBtn = document.getElementById('check-btn');
      const input = document.getElementById('breach-input');

      if (checkBtn) {
        checkBtn.addEventListener('click', () => this.checkBreach());
      }

      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') this.checkBreach();
        });
      }
    },

    async checkBreach() {
      const input = document.getElementById('breach-input');
      const results = document.getElementById('breach-results');
      const checkBtn = document.getElementById('check-btn');
      const t = (key) => window.i18n && window.i18n.t ? window.i18n.t(key) : key;

      const email = input.value.trim();

      if (!email) {
        this.showError(t('breachEmptyError') || 'Please enter an email address');
        return;
      }

      if (!this.validateEmail(email)) {
        this.showError(t('breachInvalidEmail') || 'Please enter a valid email address');
        return;
      }

      // Show loading
      results.innerHTML = `
        <div class="loading">
          ${t('breachLoading') || 'Checking...'}
        </div>
      `;
      checkBtn.disabled = true;

      try {
        // Using HIBP API (requires API key for full access, but we'll use free tier)
        const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=true`, {
          headers: {
            'hibp-api-key': 'devforge-public-demo', // Public demo key (limited)
            'User-Agent': 'DevForge-BreachChecker'
          }
        });

        checkBtn.disabled = false;

        if (response.status === 200) {
          const breaches = await response.json();
          this.displayBreaches(breaches, email);
        } else if (response.status === 404) {
          this.displaySafe(email);
        } else if (response.status === 403) {
          this.showError(t('breachApiLimit') || 'API rate limit reached. Please try again later or use your own HIBP API key.');
        } else {
          this.showError(`${t('breachError') || 'Error:'} ${response.status} ${response.statusText}`);
        }

      } catch (error) {
        checkBtn.disabled = false;
        // Handle CORS or network errors
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
          this.showError(t('breachCorsError') || 'Browser security blocked the request. Use the HIBP website directly: haveibeenpwned.com');
        } else {
          this.showError(`${t('breachError') || 'Error:'} ${error.message}`);
        }
      }
    },

    validateEmail: function (email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    displayBreaches: function (breaches, email) {
      const results = document.getElementById('breach-results');
      const t = (key) => window.i18n && window.i18n.t ? window.i18n.t(key) : key;

      const breachList = breaches.map(breach => {
        const dataTypes = (breach.DataClasses || []).join(', ');
        return `
          <div class="breach-item">
            <h4>${breach.Title || breach.Name}</h4>
            <div class="meta">
              ${breach.Domain || 'Unknown domain'} • 
              ${(breach.BreachDate || 'Unknown date')} • 
              ${(breach.PwnCount || 0).toLocaleString()} accounts
            </div>
            <div class="data-types">
              <strong>${t('breachDataTypes') || 'Compromised data:'}</strong> ${dataTypes || 'Unknown'}
            </div>
          </div>
        `;
      }).join('');

      results.innerHTML = `
        <div class="result-header" style="color: #ef4444;">
          ⚠️ ${t('breachFound') || 'Email found in'} ${breaches.length} ${t('breachFoundPlural') || 'breaches'}
        </div>
        ${breachList}
        <div class="info-box" style="margin-top: 1rem;">
          <p style="color: #fbbf24;">
            ${t('breachWarning') || 'Your email has been compromised in these breaches. Consider:'}
            <br>• ${t('breachTip1') || 'Change your passwords immediately'}
            <br>• ${t('breachTip2') || 'Enable 2FA on all accounts'}
            <br>• ${t('breachTip3') || 'Check if you reused passwords elsewhere'}
          </p>
        </div>
      `;
    },

    displaySafe: function (email) {
      const results = document.getElementById('breach-results');
      const t = (key) => window.i18n && window.i18n.t ? window.i18n.t(key) : key;

      results.innerHTML = `
        <div class="safe-message">
          ✅ ${t('breachSafe') || 'No breaches found!'}
          <p style="margin-top: 0.5rem; font-weight: 400; font-size: 0.95rem;">
            ${t('breachSafeDesc') || 'Your email has not appeared in any known data breaches. Stay safe!'}
          </p>
        </div>
      `;
    },

    showError: function (message) {
      const results = document.getElementById('breach-results');
      results.innerHTML = `
        <div class="error-message">
          ❌ ${message}
        </div>
      `;
    }
  };

  // Register tool
  if (window.DevForge) {
    window.DevForge.registerTool(BreachChecker);
  }

})();
