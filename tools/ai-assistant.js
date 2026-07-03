/* ============================================================
   DevForge — AI Code Assistant Tool
   Allows users to generate regex, SQL queries, or ask questions
   using custom API keys or free local execution endpoints.
   ============================================================ */

DevForge.registerTool({
  id: 'ai-assistant',
  name: 'AI Code Assistant',
  description: 'Generate regular expressions, SQL schemas, or explain code using AI models.',
  category: 'ai',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 7.54 16.59l-1.42-1.42A8 8 0 1 0 6 12h2a6 6 0 1 1 6 6v2a8 8 0 1 0-8-8H4a10 10 0 0 1 8-10z"/><circle cx="12" cy="12" r="3"/></svg>',
  tags: ['ai', 'regex', 'sql', 'generator', 'code-helper'],
  
  render() {
    const t = (k) => window.i18n ? window.i18n.t(k) : k;
    return `
      <div class="tool-full">
        <!-- API Setup Panel -->
        <div style="background:var(--bg-input); padding:var(--space-md); border-radius:var(--radius-md); border:1px solid var(--border-primary); margin-bottom:var(--space-sm);">
          <div class="tool-options" style="margin-bottom: 0;">
            <div class="tool-option">
              <label for="ai-provider" id="ai-provider-label"></label>
              <select id="ai-provider">
                <option value="free-llama" selected>Free Serverless LLM</option>
                <option value="gemini">Gemini API</option>
                <option value="openai">OpenAI API</option>
                <option value="deepseek">DeepSeek API</option>
              </select>
            </div>
            <div class="tool-option" id="api-key-group" style="flex: 1; max-width: 400px; display: none;">
              <input type="password" id="ai-api-key" class="tool-input" style="height: 34px;">
            </div>
          </div>
          <span id="ai-security-tip" style="font-size:0.75rem; color:var(--text-tertiary); margin-top:6px; display:block;"></span>
        </div>

        <!-- Task & Prompt split -->
        <div class="tool-split">
          <div class="tool-group">
            <label for="ai-prompt" id="ai-prompt-title"></label>
            <textarea id="ai-prompt" class="tool-textarea" style="min-height: 180px;"></textarea>
            
            <div class="tool-actions">
              <button class="tool-btn tool-btn-primary" id="ai-generate-btn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span id="ai-btn-text"></span>
              </button>
              <button class="tool-btn" id="ai-demo-btn"></button>
              <button class="tool-btn" id="ai-clear-btn"></button>
            </div>
          </div>

          <div class="tool-group">
            <label id="ai-output-title"></label>
            <div class="tool-result" id="ai-output" style="min-height: 180px; font-size: 0.85rem; user-select: text;"></div>
            <div class="tool-actions" style="margin-top: var(--space-sm);">
              <button class="tool-btn tool-btn-sm" id="ai-copy-btn" style="display:none;">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span id="ai-copy-text"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const providerSelect = document.getElementById('ai-provider');
    const apiKeyInput = document.getElementById('ai-api-key');
    const apiKeyGroup = document.getElementById('api-key-group');
    const promptArea = document.getElementById('ai-prompt');
    const generateBtn = document.getElementById('ai-generate-btn');
    const clearBtn = document.getElementById('ai-clear-btn');
    const demoBtn = document.getElementById('ai-demo-btn');
    const outputDiv = document.getElementById('ai-output');
    const copyBtn = document.getElementById('ai-copy-btn');

    const providerLbl = document.getElementById('ai-provider-label');
    const securityTip = document.getElementById('ai-security-tip');
    const promptTitle = document.getElementById('ai-prompt-title');
    const btnText = document.getElementById('ai-btn-text');
    const outputTitle = document.getElementById('ai-output-title');
    const copyText = document.getElementById('ai-copy-text');

    const t = (k) => window.i18n ? window.i18n.t(k) : k;

    // Apply translations
    const applyTranslations = () => {
      providerLbl.textContent = t('aiProvider');
      securityTip.textContent = window.i18n.lang === 'ru' 
        ? 'Ваши API-ключи хранятся конфиденциально только в памяти вашего браузера и не передаются третьим лицам.'
        : 'Your API keys are stored securely ONLY in your local browser storage and never touch our servers.';
      promptTitle.textContent = t('aiPromptLabel');
      btnText.textContent = t('aiGenerateBtn');
      outputTitle.textContent = t('aiOutputLabel');
      copyText.textContent = t('copy');
      
      promptArea.placeholder = t('aiPlaceholder');
      outputDiv.innerHTML = window.i18n.lang === 'ru' ? 'Результат генерации отобразится здесь...' : 'Response will appear here...';
      
      clearBtn.textContent = t('clear');
      demoBtn.textContent = t('loadDemo');
    };
    applyTranslations();

    // Listen for global translation changes
    window.addEventListener('df-lang-changed', applyTranslations);

    // Load saved settings
    const savedProvider = localStorage.getItem('df-ai-provider') || 'free-llama';
    providerSelect.value = savedProvider;
    apiKeyInput.value = localStorage.getItem(`df-key-${savedProvider}`) || '';

    const updateUI = () => {
      if (providerSelect.value === 'free-llama') {
        apiKeyGroup.style.display = 'none';
      } else {
        apiKeyGroup.style.display = 'block';
        apiKeyInput.placeholder = providerSelect.value === 'gemini' ? 'AIzaSy...' : 'sk-...';
      }
    };
    updateUI();

    providerSelect.addEventListener('change', () => {
      localStorage.setItem('df-ai-provider', providerSelect.value);
      apiKeyInput.value = localStorage.getItem(`df-key-${providerSelect.value}`) || '';
      updateUI();
    });

    apiKeyInput.addEventListener('input', () => {
      localStorage.setItem(`df-key-${providerSelect.value}`, apiKeyInput.value.trim());
    });

    demoBtn.addEventListener('click', () => {
      promptArea.value = window.i18n.lang === 'ru'
        ? "Создай регулярное выражение для проверки сложного пароля: минимум 8 символов, одна заглавная буква, одна цифра и один спецсимвол. Объясни, как работает регулярка."
        : "Create a regular expression to validate a complex password with at least 8 chars, 1 uppercase, 1 symbol, and 1 number. Explain how it works.";
      if (window.SoundFX) window.SoundFX.playSuccess();
      if (window.confetti) {
        window.confetti({ particleCount: 30, spread: 35, origin: { y: 0.8 } });
      }
    });

    clearBtn.addEventListener('click', () => {
      promptArea.value = '';
      outputDiv.innerHTML = window.i18n.lang === 'ru' ? 'Результат генерации отобразится здесь...' : 'Response will appear here...';
      outputDiv.className = 'tool-result';
      copyBtn.style.display = 'none';
      if (window.SoundFX) window.SoundFX.playClick();
    });

    copyBtn.addEventListener('click', () => {
      const codeBlock = outputDiv.querySelector('code');
      const textToCopy = codeBlock ? codeBlock.textContent : outputDiv.textContent;
      DevForge.copyToClipboard(textToCopy);
    });

    generateBtn.addEventListener('click', async () => {
      const prompt = promptArea.value.trim();
      const provider = providerSelect.value;
      const key = apiKeyInput.value.trim();

      if (!prompt) {
        DevForge.toast(window.i18n.lang === 'ru' ? 'Пожалуйста, введите запрос' : 'Please enter a query', 'error');
        return;
      }

      if (provider !== 'free-llama' && !key) {
        DevForge.toast(window.i18n.lang === 'ru' ? `Укажите API-ключ для ${provider}` : `Please provide an API key for ${provider}`, 'error');
        return;
      }

      if (window.SoundFX) window.SoundFX.playClick();

      outputDiv.innerHTML = `<span style="color:var(--text-accent);">${t('aiWaiting')}</span>`;
      outputDiv.className = 'tool-result';
      copyBtn.style.display = 'none';
      generateBtn.disabled = true;

      try {
        let resultText = '';

        if (provider === 'free-llama') {
          // Call fully open & free stable HuggingFace serverless inference gateway
          const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              inputs: `<|system|>\nYou are a helpful coding assistant. Solve the user request. Output ONLY valid markdown. Do not include introductory conversational fluff.\n<|user|>\n${prompt}\n<|assistant|>\n`
            })
          });

          if (!response.ok) {
             throw new Error(t('aiFallbackErr'));
          }

          const data = await response.json();
          // Extract text from HuggingFace response format
          const rawResult = data[0]?.generated_text || '';
          // Remove prompt context from response if present
          const splitMarker = '<|assistant|>\n';
          resultText = rawResult.includes(splitMarker) 
            ? rawResult.split(splitMarker)[1] 
            : rawResult;

        } else if (provider === 'gemini') {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `You are a helpful coding assistant. Solve this task. Format the output with clear code blocks:\n\n${prompt}` }] }]
            })
          });
          if (!response.ok) throw new Error(`Gemini API Error: ${response.statusText}`);
          const data = await response.json();
          resultText = data.candidates[0].content.parts[0].text;
        } else if (provider === 'openai') {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'user', content: prompt }]
            })
          });
          if (!response.ok) throw new Error(`OpenAI API Error: ${response.statusText}`);
          const data = await response.json();
          resultText = data.choices[0].message.content;
        } else if (provider === 'deepseek') {
          const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages: [{ role: 'user', content: prompt }]
            })
          });
          if (!response.ok) throw new Error(`DeepSeek API Error: ${response.statusText}`);
          const data = await response.json();
          resultText = data.choices[0].message.content;
        }

        // Clean & Format Output
        outputDiv.innerHTML = formatMarkdown(resultText);
        outputDiv.className = 'tool-result success';
        copyBtn.style.display = 'inline-flex';
        
        if (window.SoundFX) window.SoundFX.playSuccess();
        if (window.confetti) {
          window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
        }
      } catch (err) {
        outputDiv.innerHTML = `<span style="color:var(--color-error)">${window.i18n.lang === 'ru' ? '❌ Ошибка генерации:' : '❌ Generation Failed:'}</span>\n\n${err.message}`;
        outputDiv.className = 'tool-result error';
        DevForge.toast(err.message, 'error');
      } finally {
        generateBtn.disabled = false;
      }
    });

    // Helper Markdown-to-HTML parser for code blocks & text
    function formatMarkdown(text) {
      let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Format code blocks
      html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre style="background:rgba(0,0,0,0.2); padding:var(--space-md); border-radius:var(--radius-sm); overflow-x:auto; border:1px solid var(--border-primary); margin: var(--space-sm) 0;"><code style="color:var(--text-primary); font-size:0.8rem;">${code.trim()}</code></pre>`;
      });

      // Format inline code
      html = html.replace(/`([^`\n]+)`/g, '<code style="background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px; font-size:0.8rem; color:var(--text-accent);">$1</code>');

      return html.replace(/\n/g, '<br>');
    }
  }
});
