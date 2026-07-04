/**
 * Language Selector UI Component
 * Renders dropdown with flags for all supported languages
 */

(function () {
  'use strict';

  const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  function initLangSelector() {
    const btn = document.getElementById('lang-selector-btn');
    const dropdown = document.getElementById('lang-dropdown');
    const currentFlag = document.getElementById('current-lang-flag');
    const currentCode = document.getElementById('current-lang-code');

    if (!btn || !dropdown) return;

    // Get current language from i18n
    const currentLang = window.i18n ? window.i18n.lang : 'en';
    const currentInfo =
      SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

    // Update button display
    currentFlag.textContent = currentInfo.flag;
    currentCode.textContent = currentInfo.code.toUpperCase();

    // Render dropdown items
    dropdown.innerHTML = SUPPORTED_LANGUAGES.map(
      lang => `
      <button class="lang-option" data-lang="${lang.code}" style="
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 8px 16px;
        background: ${lang.code === currentLang ? 'var(--bg-tertiary)' : 'transparent'};
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        transition: background 0.15s;
        text-align: left;
        font-size: 0.9rem;
      ">
        <span style="font-size: 1.2rem;">${lang.flag}</span>
        <span>${lang.name}</span>
        ${lang.code === currentLang ? '<span style="margin-left:auto; color:var(--primary-color);">✓</span>' : ''}
      </button>
    `
    ).join('');

    // Toggle dropdown
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = dropdown.style.display === 'block';
      dropdown.style.display = isOpen ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdown.style.display = 'none';
    });

    // Handle language selection
    dropdown.addEventListener('click', e => {
      const option = e.target.closest('.lang-option');
      if (!option) return;

      const langCode = option.dataset.lang;

      if (window.i18n) {
        window.i18n.setLang(langCode);

        // Update UI immediately
        const newInfo = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
        currentFlag.textContent = newInfo.flag;
        currentCode.textContent = newInfo.code.toUpperCase();

        // Update active state
        dropdown.querySelectorAll('.lang-option').forEach(opt => {
          const isActive = opt.dataset.lang === langCode;
          opt.style.background = isActive ? 'var(--bg-tertiary)' : 'transparent';
          const checkmark = opt.querySelector('span:last-child');
          if (isActive) {
            const existingCheck = checkmark.textContent.trim();
            if (existingCheck !== '✓') {
              const span = document.createElement('span');
              span.style.marginLeft = 'auto';
              span.style.color = 'var(--primary-color)';
              span.textContent = '✓';
              opt.appendChild(span);
            }
          } else if (checkmark && checkmark.textContent.trim() === '✓') {
            checkmark.remove();
          }
        });

        // Close dropdown
        dropdown.style.display = 'none';

        // Reload page to apply language
        setTimeout(() => location.reload(), 100);
      }
    });

    // Hover effect for dropdown items
    dropdown.addEventListener('mouseover', e => {
      const option = e.target.closest('.lang-option');
      if (option) option.style.background = 'var(--bg-tertiary)';
    });

    dropdown.addEventListener('mouseout', e => {
      const option = e.target.closest('.lang-option');
      if (option) {
        const isActive = option.dataset.lang === (window.i18n ? window.i18n.lang : 'en');
        option.style.background = isActive ? 'var(--bg-tertiary)' : 'transparent';
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLangSelector);
  } else {
    initLangSelector();
  }

  // Re-initialize when tools change (in case i18n was reloaded)
  document.addEventListener('tools-changed', initLangSelector);
})();
