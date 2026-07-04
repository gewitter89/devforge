(function () {
  'use strict';

  // Quick translation helper
  const t = k => (window.i18n ? window.i18n.t(k) : k);

  // Add custom localization dictionary labels dynamically if not already defined
  if (window.i18n && window.i18n.translations) {
    // English overrides
    window.i18n.translations.en.knowledgeBase = 'Knowledge Base';
    window.i18n.translations.en.kbTitle = '🧠 Interactive Knowledge Base & AI Guides';
    window.i18n.translations.en.kbDesc =
      'Learn how to use AI coding agents, setup private repos, compress prompts to save 65% on tokens, and get free API keys. Simplified for everyone, not just geeks!';
    window.i18n.translations.en.viewDetails = 'Read Guide';
    window.i18n.translations.en.kbSearchPlaceholder = 'Search guides, hacks, and tools...';

    // Russian overrides
    window.i18n.translations.ru.knowledgeBase = 'База Знаний';
    window.i18n.translations.ru.kbTitle = '🧠 Интерактивная База Знаний и ИИ-гиды';
    window.i18n.translations.ru.kbDesc =
      'Научитесь использовать ИИ-агентов, подключать приватные репозитории, экономить до 65% на токенах и получать бесплатные API-ключи. Написано простым человеческим языком для людей, а не гиков!';
    window.i18n.translations.ru.viewDetails = 'Читать гайд';
    window.i18n.translations.ru.kbSearchPlaceholder = 'Поиск по гайдам, хакам и фичам...';
  }

  // Define structured guides data
  const guides = [
    {
      id: 'gig-ai-boost',
      titleEn: '🚀 GIG AI Boost & Private Repositories',
      titleRu: '🚀 GIG AI Boost и Приватные Репозитории',
      descEn:
        'Connect 2 private updating repos with pre-configured prompts, customized MCP servers, and personal developer stack. 10$ one-time.',
      descRu:
        'Подключите 2 приватных обновляемых репозитория с готовыми инструкциями, настроенными MCP-серверами и личным стеком автора за 10$.',
      url: 'gig-ai-boost.md',
      tag: 'GIG AI'
    },
    {
      id: 'caveman',
      titleEn: '🪨 Caveman SKILLS — Save 65% on Output Tokens',
      titleRu: '🪨 Фича: Caveman SKILLS — Сэкономь 65% токенов',
      descEn:
        'Make your AI agent communicate like a caveman. Cuts down ~65% of verbose greeting/explanation tokens while keeping code 100% accurate.',
      descRu:
        'Заставьте ИИ-агента общаться кратко, как пещерный человек. Срезает ~65% "воды" при генерации, экономя ваши деньги и ускоряя ответ.',
      url: 'caveman.md',
      tag: 'Hacks'
    },
    {
      id: 'cursorrules',
      titleEn: '🤖 .cursorrules / .clinerules System Templates',
      titleRu: '🤖 Шаблоны перепрошивки ИИ (.cursorrules)',
      descEn:
        'Copy-paste instruction templates to configure your Cursor, Windsurf, or Cline code assistants for maximum efficiency.',
      descRu:
        'Готовые шаблоны инструкций для ИИ-агентов. Обучите ваш ИИ писать код быстро, без лишних слов и рассуждений.',
      url: 'cursorrules.md',
      tag: 'System Prompts'
    },
    {
      id: 'free-llm-apis',
      titleEn: '🔑 Awesome Free LLM APIs (API Keys)',
      titleRu: '🔑 Список постоянных бесплатных API для LLM',
      descEn:
        'Get free, stable keys and endpoints for Gemini, Llama, and Mistral. Perfect for pet-projects and testing.',
      descRu:
        'Постоянные бесплатные ключи и роутеры для Gemini, Llama и Mistral. Идеально для пет-проектов и тестирования.',
      url: 'free-llm-apis.md',
      tag: 'APIs'
    },
    {
      id: 'cli-in-docker',
      titleEn: '🐳 Sandbox AI CLI inside Docker',
      titleRu: '🐳 Песочница: ИИ-агент внутри Docker',
      descEn:
        'Isolate your coding agent in a container with environment secrets mounted. Stop personal data theft from bad models.',
      descRu:
        'Безопасный запуск ИИ-агентов в изолированном Docker-контейнере с пробросом папки проекта. Защита от кражи личных данных.',
      url: 'cli-in-docker.md',
      tag: 'Security'
    },
    {
      id: 'cline-pass',
      titleEn: '🔌 ClinePass & OpenAI Compatible Setup',
      titleRu: '🔌 Настройка ClinePass и OpenAI CLI',
      descEn:
        'Unlock DeepSeek V4, GLM-5.2, and Kimi inside Crush CLI and OpenCode using ClinePass gateways.',
      descRu:
        'Настройка ClinePass, Crush CLI и OpenCode для работы с DeepSeek V4, GLM-5.2 и Kimi через прокси-интерфейсы.',
      url: 'cline-pass.md',
      tag: 'CLI Config'
    },
    {
      id: 'telepi',
      titleEn: '🤖 TelePI — Control Agent via Telegram Bot',
      titleRu: '🤖 TelePI — Управление ИИ-агентом из Telegram',
      descEn:
        'Integrate your local PI CLI with a Telegram bot. Supports offline voice messages transcribing on your machine.',
      descRu:
        'Свяжите локальный ИИ-агент PI с ботом в Telegram. Поддерживает офлайн-распознавание ваших голосовых сообщений.',
      url: 'telepi.md',
      tag: 'Integrations'
    },
    {
      id: 'herdr',
      titleEn: '🎛️ Herdr Multiplexer — Tmux for AI Agents',
      titleRu: '🎛️ Herdr — Tmux-панель для AI-агентов',
      descEn:
        'Control panel allowing you to run, view status, and coordinate multiple active coding bots without losing sessions.',
      descRu:
        'Панель управления и мультиплексор для AI-агентов. Следите за статусами ботов и делите экраны в терминале.',
      url: 'herdr.md',
      tag: 'Tools'
    }
  ];

  // Register Knowledge Base Tool
  window.DevForge.registerTool({
    id: 'knowledge-base',
    name: 'Knowledge Base / База знаний',
    description:
      'Interactive guides, cost savings, security, and private repo setups / База знаний ИИ',
    category: 'ai',
    icon: '📚',
    tags: ['guides', 'mcp', 'cheatsheet', 'hacks', 'ru', 'en'],
    render() {
      const isRu = window.i18n && window.i18n.lang === 'ru';
      return `
        <div class="tool-full" style="max-width: 1000px; margin: 0 auto; padding: var(--space-md);">
          <!-- KB Banner -->
          <div style="background: linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.15) 100%); border: 1px solid var(--border-accent); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-xl); text-align: center; position: relative; overflow: hidden;">
            <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
              ${t('kbTitle')}
            </h1>
            <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 700px; margin: 0 auto; line-height: 1.5;">
              ${t('kbDesc')}
            </p>
          </div>

          <!-- Guides Search Filter -->
          <div style="margin-bottom: var(--space-lg); display: flex; gap: var(--space-sm); align-items:center;">
            <input type="text" id="kb-search" placeholder="${t('kbSearchPlaceholder')}" style="flex:1; padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-primary); background: var(--bg-input); color: var(--text-primary); outline: none;">
          </div>

          <!-- Guides Cards Grid -->
          <div id="guides-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-md);">
            <!-- Rendered by JS -->
          </div>
        </div>
      `;
    },
    init() {
      const isRu = window.i18n && window.i18n.lang === 'ru';
      const grid = document.getElementById('guides-grid');
      const search = document.getElementById('kb-search');

      function renderGuides(filter = '') {
        const query = filter.toLowerCase().trim();
        const filtered = guides.filter(g => {
          const title = (isRu ? g.titleRu : g.titleEn).toLowerCase();
          const desc = (isRu ? g.descRu : g.descEn).toLowerCase();
          const tag = g.tag.toLowerCase();
          return title.includes(query) || desc.includes(query) || tag.includes(query);
        });

        grid.innerHTML = filtered
          .map(
            g => `
          <div class="tool-card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--border-primary); border-radius: var(--radius-md); background: var(--bg-secondary); padding: var(--space-md); position: relative; transition: border-color 0.25s ease;">
            <div>
              <span class="tool-tag" style="background: var(--bg-tertiary); color: var(--text-accent); font-weight:600; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 8px;">
                ${g.tag}
              </span>
              <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; line-height: 1.3;">
                ${isRu ? g.titleRu : g.titleEn}
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.45;">
                ${isRu ? g.descRu : g.descEn}
              </p>
            </div>
            <a href="${g.url}" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 8px 12px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; border-radius: var(--radius-sm); background: var(--bg-tertiary); border: 1px solid var(--border-accent); color: var(--text-accent); text-decoration: none; cursor: pointer;">
              ${t('viewDetails')} ↗
            </a>
          </div>
        `
          )
          .join('');
      }

      // Initial Render
      renderGuides();

      // Filter on Input
      if (search) {
        search.addEventListener('input', () => renderGuides(search.value));
      }
    }
  });
})();
