/* ============================================================
   DevForge — Contributors Hall of Fame
   Dynamically fetches and displays GitHub contributors with animations.
   ============================================================ */

(function () {
  'use strict';

  const Contributors = {
    // Renders the visual list of contributors
    render(targetElementId, repoPath) {
      const container = document.getElementById(targetElementId);
      if (!container) return;

      const t = k => (window.i18n ? window.i18n.t(k) : k);
      container.innerHTML = `
        <div style="text-align:center; padding:var(--space-xl) 0;">
          <h2 style="font-size:1.5rem; font-weight:700; margin-bottom:var(--space-sm); background:var(--gradient-accent); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;">
            ${t('contributorsTitle')}
          </h2>
          <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:var(--space-lg);">
            ${t('contributorsDesc')}
          </p>
          <div id="contributors-list" class="animate-fade-in" style="display:flex; flex-wrap:wrap; justify-content:center; gap:var(--space-md); max-width:800px; margin:0 auto;">
            <div style="color:var(--text-tertiary); font-size:0.85rem;">...</div>
          </div>
        </div>
      `;

      this.fetchContributors(repoPath);
    },

    async fetchContributors(repoPath) {
      const listContainer = document.getElementById('contributors-list');
      if (!listContainer) return;

      try {
        // Fetch from GitHub REST API
        const response = await fetch(`https://api.github.com/repos/${repoPath}/contributors`);
        if (!response.ok) throw new Error('API request failed');

        const contributors = await response.json();

        if (contributors.length === 0) {
          listContainer.innerHTML = this.getPlaceholderHTML();
          return;
        }

        let html = '';
        contributors.forEach(user => {
          html += `
            <a href="${user.html_url}" target="_blank" rel="noopener" class="contributor-card" 
               style="display:flex; flex-direction:column; align-items:center; width:90px; padding:var(--space-sm); background:var(--bg-card); border:1px solid var(--border-primary); border-radius:var(--radius-md); transition:all var(--transition-fast); text-decoration:none;">
              <img src="${user.avatar_url}&s=64" alt="${user.login}" style="width:48px; height:48px; border-radius:var(--radius-full); margin-bottom:6px; border:2px solid var(--border-primary);">
              <span style="font-size:0.75rem; font-weight:500; color:var(--text-primary); text-align:center; overflow:hidden; text-overflow:ellipsis; width:100%; white-space:nowrap;">
                ${user.login}
              </span>
              <span style="font-size:0.6rem; color:var(--text-accent); font-weight:600; margin-top:2px;">
                ${user.contributions} ${user.contributions === 1 ? 'PR' : 'PRs'}
              </span>
            </a>
          `;
        });

        // Always show the invitation button for future contributors
        html += this.getInvitationCardHTML();
        listContainer.innerHTML = html;

        // Apply hover effects using styling
        const cards = listContainer.querySelectorAll('.contributor-card');
        cards.forEach(card => {
          card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.borderColor = 'var(--border-accent)';
            card.style.boxShadow = 'var(--shadow-glow)';
          });
          card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.borderColor = 'var(--border-primary)';
            card.style.boxShadow = 'none';
          });
        });
      } catch (err) {
        console.warn('DevForge: Could not load live contributors, showing placeholder');
        // Render fallback UI with prompt for contributions
        listContainer.innerHTML = this.getPlaceholderHTML() + this.getInvitationCardHTML();
      }
    },

    getPlaceholderHTML() {
      return `
        <div class="contributor-card" style="display:flex; flex-direction:column; align-items:center; width:90px; padding:var(--space-sm); background:var(--bg-card); border:1px solid var(--border-primary); border-radius:var(--radius-md);">
          <div style="width:48px; height:48px; border-radius:var(--radius-full); background:var(--gradient-primary); display:flex; align-items:center; justify-content:center; margin-bottom:6px; font-size:1.2rem; color:white;">👑</div>
          <span style="font-size:0.75rem; font-weight:500; color:var(--text-primary); text-align:center;">You?</span>
        </div>
      `;
    },

    getInvitationCardHTML() {
      const t = k => (window.i18n ? window.i18n.t(k) : k);
      return `
        <a href="https://github.com" target="_blank" rel="noopener" class="contributor-card" 
           style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:90px; padding:var(--space-sm); background:var(--bg-card); border:1px dashed var(--text-accent); border-radius:var(--radius-md); transition:all var(--transition-fast); text-decoration:none;">
          <div style="width:48px; height:48px; border-radius:var(--radius-full); background:var(--bg-input); display:flex; align-items:center; justify-content:center; margin-bottom:6px; font-size:1.5rem; color:var(--text-accent); font-weight:bold;">＋</div>
          <span style="font-size:0.75rem; font-weight:500; color:var(--text-accent); text-align:center;">${t('joinUs')}</span>
        </a>
      `;
    }
  };

  window.Contributors = Contributors;
})();
