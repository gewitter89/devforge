/* ============================================================
   DevForge — Internationalization (i18n) Engine
   Supports 14 languages with auto-detection and dynamic loading
   ============================================================ */

(function () {
  'use strict';

  // Supported locales with native names
  const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  const i18n = {
    lang: 'en',
    translations: {},
    supportedLanguages: SUPPORTED_LANGUAGES,

    // Core translations (always loaded)
    translations: {
      en: {
        logoText: 'DevForge',
        searchPlaceholder: 'Search tools... (Ctrl+K)',
        allTools: 'All Tools',
        ai: 'AI Tools',
        formatters: 'Formatters',
        generators: 'Generators',
        converters: 'Converters',
        encoders: 'Encoders',
        text: 'Text',
        web: 'Web',
        toolsAvailable: 'tools available',
        addYourTool: '＋ Add your tool',
        starCTATitle: '✨ Love DevForge?',
        starCTADesc: 'Support us by giving a star on GitHub!',
        starBtn: '⭐ Star Repo',
        contributorsTitle: '🏆 Project Contributors',
        contributorsDesc: 'The amazing people who make DevForge better.',
        joinUs: 'Join Us',
        backToTools: 'Back to all tools',
        searchEmpty: 'No tools found',
        searchEmptySub: 'Try a different search term',
        loadDemo: '💡 Load Demo',
        clear: 'Clear',
        copy: 'Copy',
        copied: '✓ Copied!',
        success: 'Success',
        error: 'Error',
        aiProvider: 'Provider:',
        aiPromptLabel: 'What do you want to generate?',
        aiOutputLabel: 'AI Output',
        aiGenerateBtn: 'Generate',
        aiPlaceholder: 'Example: Create a regex for email validation...',
        aiWaiting: '🤖 Thinking...',
        aiFallbackErr: 'All free LLM gateways failed. Provide your own API key.'
      },
      ru: {
        logoText: 'DevForge',
        searchPlaceholder: 'Поиск инструментов... (Ctrl+K)',
        allTools: 'Все инструменты',
        ai: 'ИИ-инструменты',
        formatters: 'Форматтеры',
        generators: 'Генераторы',
        converters: 'Конвертеры',
        encoders: 'Кодеры',
        text: 'Текст',
        web: 'Веб',
        toolsAvailable: 'инструментов доступно',
        addYourTool: '＋ Добавить инструмент',
        starCTATitle: '✨ Нравится DevForge?',
        starCTADesc: 'Поддержи проект звездой на GitHub!',
        starBtn: '⭐ Поставить звезду',
        contributorsTitle: '🏆 Контрибьюторы проекта',
        contributorsDesc: 'Люди, которые делают DevForge лучше.',
        joinUs: 'Участвовать',
        backToTools: 'Назад к инструментам',
        searchEmpty: 'Инструменты не найдены',
        searchEmptySub: 'Попробуйте другой запрос',
        loadDemo: '💡 Пример данных',
        clear: 'Очистить',
        copy: 'Копировать',
        copied: '✓ Скопировано!',
        success: 'Успешно',
        error: 'Ошибка',
        aiProvider: 'Провайдер ИИ:',
        aiPromptLabel: 'Что вы хотите сгенерировать?',
        aiOutputLabel: 'Результат генерации',
        aiGenerateBtn: 'Сгенерировать',
        aiPlaceholder: 'Например: Создай regex для валидации email...',
        aiWaiting: '🤖 ИИ думает...',
        aiFallbackErr: 'Бесплатные серверы ИИ перегружены. Вставьте свой API-ключ.'
      }
    },

    // Auto-detect language from browser
    detectLanguage() {
      const navLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
      
      // Priority: match exact code, then prefix, then default to 'en'
      const exactMatch = SUPPORTED_LANGUAGES.find(l => navLang === l.code || navLang.startsWith(l.code.toLowerCase()));
      if (exactMatch) return exactMatch.code;
      
      // Special cases for regional variants
      if (navLang.startsWith('zh')) return 'zh';
      if (navLang.startsWith('ja')) return 'ja';
      if (navLang.startsWith('ko')) return 'ko';
      if (navLang.startsWith('ar')) return 'ar';
      if (navLang.startsWith('hi')) return 'hi';
      if (navLang.startsWith('uk')) return 'uk';
      if (navLang.startsWith('pl')) return 'pl';
      if (navLang.startsWith('es') || navLang.includes('lat')) return 'es';
      if (navLang.startsWith('pt') && navLang.includes('br')) return 'pt';
      if (navLang.startsWith('de')) return 'de';
      if (navLang.startsWith('fr')) return 'fr';
      if (navLang.startsWith('it')) return 'it';
      
      return 'en'; // Safe fallback
    },

    init() {
      // Priority: localStorage > browser detection > 'en'
      const saved = localStorage.getItem('devforge-lang');
      const isSupported = (code) => SUPPORTED_LANGUAGES.some(l => l.code === code);
      
      if (saved && isSupported(saved)) {
        this.lang = saved;
      } else {
        this.lang = this.detectLanguage();
      }
      
      // Load translations for detected language if not already loaded
      this.loadTranslations(this.lang);
    },

    async loadTranslations(lang) {
      // English and Russian are always loaded (core)
      if (lang === 'en' || lang === 'ru') {
        return Promise.resolve();
      }
      
      // Check if already loaded
      if (this.translations[lang]) {
        return Promise.resolve();
      }
      
      try {
        const response = await fetch(`./i18n/${lang}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        this.translations[lang] = data;
      } catch (error) {
        console.warn(`[i18n] Failed to load ${lang}.json, falling back to English`);
        this.translations[lang] = this.translations['en'];
      }
    },

    setLang(lang) {
      const isSupported = SUPPORTED_LANGUAGES.some(l => l.code === lang);
      if (!isSupported) {
        console.warn(`[i18n] Unsupported language: ${lang}`);
        return;
      }
      
      this.loadTranslations(lang).then(() => {
        this.lang = lang;
        localStorage.setItem('devforge-lang', lang);
        window.dispatchEvent(new CustomEvent('df-lang-changed', { detail: lang }));
      });
    },

    t(key) {
      const currentLang = this.translations[this.lang];
      const fallbackLang = this.translations['en'];
      
      return (currentLang && currentLang[key]) || 
             (fallbackLang && fallbackLang[key]) || 
             key;
    },

    // Get all supported languages for UI
    getSupportedLanguages() {
      return [...SUPPORTED_LANGUAGES];
    }
  };

  window.i18n = i18n;
  i18n.init();
})();
