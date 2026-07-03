/* ============================================================
   DevForge — Internationalization (i18n) Engine
   Contains translations and helpers for English and Russian
   ============================================================ */

(function() {
  'use strict';

  const i18n = {
    lang: 'en',

    // Translations Dictionary
    translations: {
      en: {
        logoText: 'DevForge',
        searchPlaceholder: 'Search tools... (Ctrl+K)',
        allTools: 'All Tools',
        formatters: 'Formatters',
        generators: 'Generators',
        converters: 'Converters',
        encoders: 'Encoders',
        text: 'Text',
        web: 'Web',
        toolsAvailable: 'tools available',
        addYourTool: '＋ Add your tool',
        starCTATitle: '✨ Love DevForge?',
        starCTADesc: 'Support us by giving a star on GitHub! It helps more developers find this project.',
        starBtn: '⭐ Star Repo',
        contributorsTitle: '🏆 Project Contributors',
        contributorsDesc: 'The amazing people who help make DevForge better. You could be here too!',
        joinUs: 'Join Us',
        backToTools: 'Back to all tools',
        searchEmpty: 'No tools found',
        searchEmptySub: 'Try a different search term or category',
        loadDemo: '💡 Load Demo',
        clear: 'Clear',
        copy: 'Copy',
        copied: '✓ Copied!',
        success: 'Success',
        error: 'Error',
        
        // Command Palette
        cmdPlaceholder: 'Type a command (e.g. >uuid, >theme light) or search...',
        cmdEsc: 'ESC to close',
        cmdNoMatches: 'No matches found',
        cmdActionType: 'action',
        cmdToolType: 'tool',
        cmdUuidTitle: 'Generate & Copy UUID',
        cmdUuidDesc: 'Creates a v4 UUID and saves it to clipboard',
        cmdThemeDarkTitle: 'Set Theme: Dark',
        cmdThemeDarkDesc: 'Switch interface to dark mode',
        cmdThemeLightTitle: 'Set Theme: Light',
        cmdThemeLightDesc: 'Switch interface to light mode',
        cmdSoundOnTitle: 'Turn Sound On',
        cmdSoundOnDesc: 'Enable audio interactions',
        cmdSoundOffTitle: 'Turn Sound Off',
        cmdSoundOffDesc: 'Disable audio interactions',
        cmdUnknown: 'Unknown Command. Try: >uuid, >theme, >sound',
        cmdBase64Title: 'Base64 Encode: "{param}"',
        cmdBase64Desc: 'Result: {result} (Click to copy)'
      },
      ru: {
        logoText: 'DevForge',
        searchPlaceholder: 'Поиск инструментов... (Ctrl+K)',
        allTools: 'Все инструменты',
        formatters: 'Форматтеры',
        generators: 'Генераторы',
        converters: 'Конвертеры',
        encoders: 'Кодеры',
        text: 'Текст',
        web: 'Веб',
        toolsAvailable: 'инструментов доступно',
        addYourTool: '＋ Добавить инструмент',
        starCTATitle: '✨ Нравится DevForge?',
        starCTADesc: 'Поддержи проект звездой на GitHub! Это поможет другим разработчикам найти нас.',
        starBtn: '⭐ Поставить звезду',
        contributorsTitle: '🏆 Контрибьюторы проекта',
        contributorsDesc: 'Потрясающие люди, помогающие делать DevForge лучше. Ты тоже можешь быть здесь!',
        joinUs: 'Участвовать',
        backToTools: 'Назад к инструментам',
        searchEmpty: 'Инструменты не найдены',
        searchEmptySub: 'Попробуйте другой запрос или категорию',
        loadDemo: '💡 Демо-данные',
        clear: 'Очистить',
        copy: 'Копировать',
        copied: '✓ Скопировано!',
        success: 'Успешно',
        error: 'Ошибка',

        // Command Palette
        cmdPlaceholder: 'Введите команду (напр. >uuid, >theme light) или поиск...',
        cmdEsc: 'ESC для выхода',
        cmdNoMatches: 'Совпадений не найдено',
        cmdActionType: 'действие',
        cmdToolType: 'утилита',
        cmdUuidTitle: 'Создать и скопировать UUID',
        cmdUuidDesc: 'Генерирует UUID v4 и сохраняет в буфер обмена',
        cmdThemeDarkTitle: 'Установить тему: Тёмная',
        cmdThemeDarkDesc: 'Переключить интерфейс в тёмный режим',
        cmdThemeLightTitle: 'Установить тему: Светлая',
        cmdThemeLightDesc: 'Переключить интерфейс в светлый режим',
        cmdSoundOnTitle: 'Включить звуки',
        cmdSoundOnDesc: 'Активировать звуковое сопровождение',
        cmdSoundOffTitle: 'Выключить звуки',
        cmdSoundOffDesc: 'Деактивировать звуковое сопровождение',
        cmdUnknown: 'Неизвестная команда. Попробуйте: >uuid, >theme, >sound',
        cmdBase64Title: 'Base64 кодирование: "{param}"',
        cmdBase64Desc: 'Результат: {result} (Кликните для копирования)'
      }
    },

    init() {
      // 1. Detect language (localStorage -> browser language -> default 'en')
      const saved = localStorage.getItem('devforge-lang');
      if (saved && (saved === 'en' || saved === 'ru')) {
        this.lang = saved;
      } else {
        const navLang = navigator.language || navigator.userLanguage;
        if (navLang && navLang.startsWith('ru')) {
          this.lang = 'ru';
        } else {
          this.lang = 'en';
        }
      }
    },

    setLang(lang) {
      if (lang === 'en' || lang === 'ru') {
        this.lang = lang;
        localStorage.setItem('devforge-lang', lang);
        // Dispatch custom event to let app trigger rerender
        window.dispatchEvent(new CustomEvent('df-lang-changed', { detail: lang }));
      }
    },

    // Translate a key
    t(key) {
      return this.translations[this.lang][key] || this.translations['en'][key] || key;
    }
  };

  window.i18n = i18n;
  i18n.init();
})();
