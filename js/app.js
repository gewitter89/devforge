/* ============================================================
   DevForge — Core Application Logic
   Handles tool registration, routing, search, themes, and UI
   ============================================================ */

(function () {
  'use strict';

  // ======================== NAMESPACE ========================
  const DevForge = {
    tools: [],
    currentCategory: 'all',
    currentTool: null,
    searchQuery: '',
  };

  // Expose globally for tool registration
  window.DevForge = DevForge;

  // ===================== CATEGORIES =========================
  const getCategories = () => [
    { id: 'all', name: window.i18n ? window.i18n.t('allTools') : 'All Tools', icon: '⚡' },
    { id: 'formatters', name: window.i18n ? window.i18n.t('formatters') : 'Formatters', icon: '📝' },
    { id: 'generators', name: window.i18n ? window.i18n.t('generators') : 'Generators', icon: '🎲' },
    { id: 'converters', name: window.i18n ? window.i18n.t('converters') : 'Converters', icon: '🔄' },
    { id: 'encoders', name: window.i18n ? window.i18n.t('encoders') : 'Encoders', icon: '🔐' },
    { id: 'text', name: window.i18n ? window.i18n.t('text') : 'Text', icon: '✏️' },
    { id: 'web', name: window.i18n ? window.i18n.t('web') : 'Web', icon: '🌐' },
  ];

  // ================== TOOL REGISTRATION =====================
  DevForge.registerTool = function (tool) {
    if (!tool.id || !tool.name || !tool.render) {
      console.warn('DevForge: Invalid tool registration — missing id, name, or render.', tool);
      return;
    }
    // Defaults
    tool.category = tool.category || 'other';
    tool.description = tool.description || '';
    tool.icon = tool.icon || '🔧';
    tool.tags = tool.tags || [];
    DevForge.tools.push(tool);
  };

  // ====================== ROUTER ============================
  function getRoute() {
    const hash = window.location.hash.slice(1) || '/';
    if (hash.startsWith('/tool/')) {
      return { view: 'tool', toolId: hash.replace('/tool/', '') };
    }
    return { view: 'catalog' };
  }

  function navigateTo(hash) {
    window.location.hash = hash;
  }

  function handleRoute() {
    const route = getRoute();
    if (route.view === 'tool') {
      const tool = DevForge.tools.find(t => t.id === route.toolId);
      if (tool) {
        renderToolView(tool);
        DevForge.currentTool = tool;
        return;
      }
    }
    DevForge.currentTool = null;
    renderCatalog();
  }

  // ================== RENDER CATALOG ========================
  function renderCatalog() {
    const main = document.getElementById('main-content');
    const filtered = getFilteredTools();
    const t = (k) => window.i18n ? window.i18n.t(k) : k;

    let html = `
      <div class="catalog-header animate-fade-in">
        <h1>${t('logoText')} — ${t('allTools')}</h1>
        <p><span class="highlight">${DevForge.tools.length}</span> ${t('toolsAvailable')} — all running in your browser</p>
      </div>
    `;

    if (filtered.length === 0) {
      html += `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>${t('searchEmpty')}</p>
          <span>${t('searchEmptySub')}</span>
        </div>
      `;
    } else {
      html += '<div class="tools-grid">';
      filtered.forEach(tool => {
        const tagsHtml = tool.tags.slice(0, 3).map(tag => `<span class="tool-tag">${tag}</span>`).join('');
        html += `
          <div class="tool-card" data-tool-id="${tool.id}" role="button" tabindex="0" aria-label="Open ${tool.name}">
            <div class="tool-card-icon">${tool.icon}</div>
            <h3>${highlightMatch(tool.name)}</h3>
            <p>${tool.description}</p>
            <div class="tool-card-tags">${tagsHtml}</div>
          </div>
        `;
      });
      html += '</div>';
    }

    // Add star prompt and dynamic contributors section
    html += `
      <!-- GitHub Star CTA -->
      <div class="star-prompt">
        <div>
          <h3 style="font-size:1.1rem; font-weight:600; margin-bottom:4px;">${t('starCTATitle')}</h3>
          <p style="font-size:0.8rem; opacity:0.9;">${t('starCTADesc')}</p>
        </div>
        <a href="https://github.com/gewitter89/devforge" target="_blank" rel="noopener" class="star-prompt-btn">
          ${t('starBtn')}
        </a>
      </div>

      <!-- Dynamic Contributors Section -->
      <div id="contributors-container" style="margin-top: var(--space-3xl);"></div>
    `;

    main.innerHTML = html;

    // Initialize contributors listing
    if (window.Contributors) {
      window.Contributors.render('contributors-container', 'gewitter89/devforge');
    }

    // Attach card click handlers
    main.querySelectorAll('.tool-card').forEach(card => {
      const handler = () => navigateTo('#/tool/' + card.dataset.toolId);
      card.addEventListener('click', handler);
      card.addEventListener('keydown', e => { if (e.key === 'Enter') handler(); });
    });
  }

  // ================= RENDER TOOL VIEW =======================
  function renderToolView(tool) {
    const main = document.getElementById('main-content');
    const t = (k) => window.i18n ? window.i18n.t(k) : k;

    const html = `
      <div class="tool-view">
        <div class="tool-view-header">
          <button class="back-btn" id="back-btn" title="${t('backToTools')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <div class="tool-view-title">
            <h2>${tool.icon} ${tool.name}</h2>
            <p>${tool.description}</p>
          </div>
        </div>
        <div class="tool-body" id="tool-body">
          ${tool.render()}
        </div>
      </div>
    `;

    main.innerHTML = html;

    // Back button
    document.getElementById('back-btn').addEventListener('click', () => navigateTo('#/'));

    // Init tool logic
    if (typeof tool.init === 'function') {
      try {
        tool.init();
      } catch (err) {
        console.error(`DevForge: Error initializing tool "${tool.id}":`, err);
      }
    }
  }

  // ================== FILTERING =============================
  function getFilteredTools() {
    let tools = DevForge.tools;

    // Filter by category
    if (DevForge.currentCategory !== 'all') {
      tools = tools.filter(t => t.category === DevForge.currentCategory);
    }

    // Filter by search
    if (DevForge.searchQuery) {
      const q = DevForge.searchQuery.toLowerCase();
      tools = tools.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return tools;
  }

  function highlightMatch(text) {
    if (!DevForge.searchQuery) return text;
    const q = DevForge.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${q})`, 'gi');
    return text.replace(regex, '<mark style="background:rgba(139,92,246,0.25);color:inherit;border-radius:2px;padding:0 1px">$1</mark>');
  }

  // =================== SIDEBAR ==============================
  function renderSidebar() {
    const nav = document.getElementById('categories');
    const t = (k) => window.i18n ? window.i18n.t(k) : k;
    const cats = getCategories();

    nav.innerHTML = cats.map(cat => {
      const count = cat.id === 'all'
        ? DevForge.tools.length
        : DevForge.tools.filter(t => t.category === cat.id).length;

      if (cat.id !== 'all' && count === 0) return '';

      return `
        <button class="category-btn ${DevForge.currentCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
          <span class="cat-icon">${cat.icon}</span>
          ${cat.name}
          <span class="cat-count">${count}</span>
        </button>
      `;
    }).join('');

    // Update tool count & footer translation
    document.getElementById('tool-count').textContent = `${DevForge.tools.length} ${t('toolsAvailable')}`;
    const addBtnLink = document.querySelector('.sidebar-footer a');
    if (addBtnLink) addBtnLink.textContent = t('addYourTool');

    // Attach handlers
    nav.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        DevForge.currentCategory = btn.dataset.category;
        renderSidebar();
        if (DevForge.currentTool) navigateTo('#/');
        else renderCatalog();
      });
    });
  }

  // ==================== SEARCH & COMMAND PALETTE ====================
  function initSearch() {
    const headerInput = document.getElementById('search-input');
    const backdrop = document.getElementById('cmd-backdrop');
    const cmdInput = document.getElementById('cmd-input');
    const cmdResults = document.getElementById('cmd-results');

    let selectedIndex = 0;
    let currentItems = [];

    const showPalette = () => {
      backdrop.style.display = 'flex';
      cmdInput.value = '';
      cmdInput.focus();
      updatePaletteResults('');
      if (window.SoundFX) window.SoundFX.playClick();
    };

    const hidePalette = () => {
      backdrop.style.display = 'none';
      cmdInput.blur();
    };

    // Close palette on backdrop click
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) hidePalette();
    });

    // Map K shortcut to Command Palette instead of basic search
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showPalette();
      }
      if (e.key === 'Escape' && backdrop.style.display === 'flex') {
        e.preventDefault();
        hidePalette();
      }
    });

    // Intercept click on search input to open palette
    headerInput.addEventListener('focus', (e) => {
      e.preventDefault();
      headerInput.blur();
      showPalette();
    });

    cmdInput.addEventListener('input', () => {
      updatePaletteResults(cmdInput.value.trim());
    });

    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % currentItems.length;
        renderSelected();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + currentItems.length) % currentItems.length;
        renderSelected();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentItems[selectedIndex]) {
          triggerPaletteAction(currentItems[selectedIndex]);
        }
      }
    });

    function updatePaletteResults(query) {
      selectedIndex = 0;
      currentItems = [];

      // Case 1: Command starting with '>'
      if (query.startsWith('>')) {
        const cmd = query.slice(1).toLowerCase().split(' ');
        const action = cmd[0];
        const param = cmd.slice(1).join(' ');

        if (action === 'uuid') {
          currentItems = [{ type: 'action', title: 'Generate & Copy UUID', desc: 'Creates a v4 UUID and saves it to clipboard', handler: executeUUIDAction }];
        } else if (action === 'theme') {
          currentItems = [
            { type: 'action', title: 'Set Theme: Dark', desc: 'Switch interface to dark mode', handler: () => setTheme('dark') },
            { type: 'action', title: 'Set Theme: Light', desc: 'Switch interface to light mode', handler: () => setTheme('light') }
          ];
        } else if (action === 'sound') {
          currentItems = [
            { type: 'action', title: 'Turn Sound On', desc: 'Enable audio interactions', handler: () => setSound(true) },
            { type: 'action', title: 'Turn Sound Off', desc: 'Disable audio interactions', handler: () => setSound(false) }
          ];
        } else if (action === 'base64' && param) {
          const enc = btoa(param);
          currentItems = [{ type: 'action', title: `Base64 Encode: "${param}"`, desc: `Result: ${enc} (Click to copy)`, handler: () => { DevForge.copyToClipboard(enc); hidePalette(); } }];
        } else if (action === 'hash' && param) {
          // Dummy sync md5 or simple hash fallback
          currentItems = [{ type: 'action', title: `Hash: "${param}"`, desc: 'Open Hash tool to calculate hashes', handler: () => { navigateTo('#/tool/hash-generator'); hidePalette(); } }];
        } else {
          currentItems = [{ type: 'action', title: 'Unknown Command', desc: 'Available: >uuid, >theme [light/dark], >sound [on/off], >base64 [text]', handler: () => {} }];
        }
      } else {
        // Case 2: Regular search tool matching
        const matchingTools = DevForge.tools.filter(t => 
          !query || 
          t.name.toLowerCase().includes(query.toLowerCase()) || 
          t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        currentItems = matchingTools.map(t => ({
          type: 'tool',
          title: t.name,
          desc: t.description,
          icon: t.icon,
          id: t.id
        }));
      }

      renderPaletteItems();
    }

    function renderPaletteItems() {
      if (currentItems.length === 0) {
        cmdResults.innerHTML = '<div style="color:var(--text-tertiary); padding:var(--space-md); text-align:center; font-size:0.85rem;">No matches found</div>';
        return;
      }

      cmdResults.innerHTML = currentItems.map((item, idx) => {
        const icon = item.type === 'action' ? '⚙️' : item.icon;
        return `
          <div class="cmd-item ${idx === selectedIndex ? 'selected' : ''}" data-index="${idx}">
            <span style="font-size:1.1rem; flex-shrink:0;">${icon}</span>
            <div style="flex:1; min-width:0;">
              <div style="font-weight:550; font-size:0.875rem;">${item.title}</div>
              <div style="font-size:0.75rem; color:var(--text-secondary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${item.desc}</div>
            </div>
            <span style="font-size:0.7rem; color:var(--text-tertiary); margin-left:auto; text-transform:uppercase;">${item.type}</span>
          </div>
        `;
      }).join('');

      // Mouse triggers
      cmdResults.querySelectorAll('.cmd-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
          selectedIndex = parseInt(el.dataset.index);
          renderSelected();
        });
        el.addEventListener('click', () => {
          triggerPaletteAction(currentItems[selectedIndex]);
        });
      });
    }

    function renderSelected() {
      const els = cmdResults.querySelectorAll('.cmd-item');
      els.forEach((el, idx) => {
        if (idx === selectedIndex) el.classList.add('selected');
        else el.classList.remove('selected');
      });
    }

    function triggerPaletteAction(item) {
      if (item.type === 'tool') {
        navigateTo(`#/tool/${item.id}`);
        hidePalette();
      } else if (item.type === 'action' && item.handler) {
        item.handler();
      }
    }

    // Direct Command Helpers
    function executeUUIDAction() {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // v4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
      const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
      const uuid = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
      
      DevForge.copyToClipboard(uuid);
      hidePalette();
    }

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('devforge-theme', theme);
      const sun = document.querySelector('.icon-sun');
      const moon = document.querySelector('.icon-moon');
      if (sun) sun.style.display = theme === 'dark' ? 'block' : 'none';
      if (moon) moon.style.display = theme === 'dark' ? 'none' : 'block';
      
      if (window.SoundFX) window.SoundFX.playSuccess();
      hidePalette();
    }

    function setSound(enabled) {
      if (window.SoundFX) {
        window.SoundFX.enabled = enabled;
        localStorage.setItem('devforge-sound', enabled);
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
          const onIcon = soundToggle.querySelector('.icon-sound-on');
          const offIcon = soundToggle.querySelector('.icon-sound-off');
          if (onIcon && offIcon) {
            onIcon.style.display = enabled ? 'block' : 'none';
            offIcon.style.display = enabled ? 'none' : 'block';
          }
        }
        if (enabled) window.SoundFX.playSuccess();
      }
      hidePalette();
    }
  }

  // =================== THEME & SOUNDS =====================
  function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('devforge-theme');

    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }

    updateThemeIcons();

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('devforge-theme', next);
      updateThemeIcons();
      if (window.SoundFX) window.SoundFX.playClick();
    });

    // Sound toggle init
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
      const updateSoundUI = (enabled) => {
        const onIcon = soundToggle.querySelector('.icon-sound-on');
        const offIcon = soundToggle.querySelector('.icon-sound-off');
        if (onIcon && offIcon) {
          onIcon.style.display = enabled ? 'block' : 'none';
          offIcon.style.display = enabled ? 'none' : 'block';
        }
      };

      if (window.SoundFX) {
        updateSoundUI(window.SoundFX.enabled);
      }

      soundToggle.addEventListener('click', () => {
        if (window.SoundFX) {
          const enabled = window.SoundFX.toggle();
          updateSoundUI(enabled);
          if (enabled) window.SoundFX.playSuccess();
        }
      });
    }
  }

  function updateThemeIcons() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const sun = document.querySelector('.icon-sun');
    const moon = document.querySelector('.icon-moon');
    if (sun) sun.style.display = isDark ? 'block' : 'none';
    if (moon) moon.style.display = isDark ? 'none' : 'block';
  }

  // =================== TOAST ================================
  DevForge.toast = function (message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('toast-visible'));
    });

    setTimeout(() => {
      toast.classList.remove('toast-visible');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  };

  // ================ COPY TO CLIPBOARD =======================
  DevForge.copyToClipboard = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
      DevForge.toast('✓ Copied to clipboard');
      if (window.SoundFX) window.SoundFX.playSuccess();
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 45, origin: { y: 0.85 } });
      }
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      DevForge.toast('✓ Copied to clipboard');
      if (window.SoundFX) window.SoundFX.playSuccess();
    }
  };

  // ================== COPY ICON SVG =========================
  DevForge.COPY_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  // ===================== INIT ===============================
  function init() {
    initTheme();
    initSearch();
    renderSidebar();
    handleRoute();

    // Bind Language selector
    const langSelect = document.getElementById('lang-selector');
    if (langSelect && window.i18n) {
      langSelect.value = window.i18n.lang;
      langSelect.addEventListener('change', () => {
        window.i18n.setLang(langSelect.value);
        if (window.SoundFX) window.SoundFX.playSuccess();
      });
    }

    // Subscribe to lang changes to update the UI
    window.addEventListener('df-lang-changed', (e) => {
      // Re-translate search placeholder
      const searchInput = document.getElementById('search-input');
      if (searchInput && window.i18n) {
        searchInput.placeholder = window.i18n.t('searchPlaceholder');
      }

      // Rerender layout blocks
      renderSidebar();
      handleRoute();
    });

    // Translate placeholder on load
    const searchInput = document.getElementById('search-input');
    if (searchInput && window.i18n) {
      searchInput.placeholder = window.i18n.t('searchPlaceholder');
    }

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('DevForge: Service Worker registered successfully', reg.scope))
          .catch(err => console.warn('DevForge: Service Worker registration failed', err));
      });
    }

    // PWA Install Prompt Handler
    let deferredPrompt;
    const installBtn = document.getElementById('pwa-install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent standard browser bar from showing
      e.preventDefault();
      deferredPrompt = e;
      // Show custom install button in header actions
      if (installBtn) installBtn.style.display = 'block';
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        if (window.SoundFX) window.SoundFX.playClick();
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`DevForge: PWA install user choice: ${outcome}`);
        deferredPrompt = null;
        installBtn.style.display = 'none';
        if (outcome === 'accepted' && window.confetti) {
          window.confetti({ particleCount: 70, spread: 50 });
        }
      });
    }

    // Hash change listener
    window.addEventListener('hashchange', () => {
      handleRoute();
      if (window.SoundFX) window.SoundFX.playClick();
    });

    // Log registered tools
    console.log(`%c⚒ DevForge loaded — ${DevForge.tools.length} tools registered`, 'color: #a78bfa; font-weight: bold; font-size: 14px;');
  }

  // Wait for DOM + all deferred scripts
  document.addEventListener('DOMContentLoaded', init);

})();
