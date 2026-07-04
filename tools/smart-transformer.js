(function () {
  'use strict';

  // Translation helper
  const t = (k) => window.i18n ? window.i18n.t(k) : k;

  // Extend localization dynamically if needed
  if (window.i18n && window.i18n.translations) {
    // English
    window.i18n.translations.en.smartHubName = 'Smart Hub: OCR & Transformer';
    window.i18n.translations.en.smartHubDesc = 'Extract text from images (OCR), convert CSV/Excel to JSON/HTML, and clean/minify texts 100% locally.';
    window.i18n.translations.en.tabOcr = '🖼️ Image to Text (OCR)';
    window.i18n.translations.en.tabTable = '📊 Table Converter';
    window.i18n.translations.en.tabText = '📝 Text Optimizer';
    window.i18n.translations.en.ocrPlaceholder = 'Drag & drop an image here or click to select';
    window.i18n.translations.en.ocrProgress = 'Recognizing text...';
    window.i18n.translations.en.ocrLang = 'Language:';
    window.i18n.translations.en.convert = 'Convert';
    window.i18n.translations.en.tablePlaceholder = 'Paste CSV, Excel cells, or Tab-separated values here...';
    window.i18n.translations.en.textPlaceholder = 'Paste dirty text, logs, or unformatted strings here...';

    // Russian
    window.i18n.translations.ru.smartHubName = 'Умный Трансформер: OCR и Данные';
    window.i18n.translations.ru.smartHubDesc = 'Извлечение текста из скриншотов (OCR), конвертер Excel/CSV в HTML/JSON и очистка текстов полностью локально.';
    window.i18n.translations.ru.tabOcr = '🖼️ Текст из картинки (OCR)';
    window.i18n.translations.ru.tabTable = '📊 Конвертер таблиц';
    window.i18n.translations.ru.tabText = '📝 Оптимизатор текста';
    window.i18n.translations.ru.ocrPlaceholder = 'Перетащите сюда картинку/скриншот или кликните для выбора';
    window.i18n.translations.ru.ocrProgress = 'Распознавание текста...';
    window.i18n.translations.ru.ocrLang = 'Язык распознавания:';
    window.i18n.translations.ru.convert = 'Преобразовать';
    window.i18n.translations.ru.tablePlaceholder = 'Вставьте CSV или скопированные ячейки Excel/Google Таблиц сюда...';
    window.i18n.translations.ru.textPlaceholder = 'Вставьте сюда текст, логи или неформатированные строки для очистки...';
  }

  // Register the tool
  window.DevForge.registerTool({
    id: 'smart-transformer',
    name: 'Smart Hub: OCR & Transformer',
    description: 'Extract text from screenshots, convert Excel/CSV to HTML/JSON, and optimize dirty text locally / Умный OCR трансформер',
    category: 'converters',
    icon: '🔮',
    tags: ['ocr', 'excel', 'csv', 'json', 'cleaner', 'parser', 'ru', 'en'],

    render() {
      return `
        <div class="tool-full" style="max-width: 1000px; margin: 0 auto; padding: var(--space-md);">
          <!-- Navigation Tabs -->
          <div class="tool-tabs" style="display: flex; gap: var(--space-sm); border-bottom: 2px solid var(--border-primary); padding-bottom: var(--space-xs); margin-bottom: var(--space-md);">
            <button class="tab-btn active" data-target="ocr-panel" style="padding: 10px 16px; font-weight: 600; font-size: 0.9rem; border-radius: var(--radius-sm); border: none; background: none; color: var(--text-secondary); cursor: pointer;">
              ${t('tabOcr')}
            </button>
            <button class="tab-btn" data-target="table-panel" style="padding: 10px 16px; font-weight: 600; font-size: 0.9rem; border-radius: var(--radius-sm); border: none; background: none; color: var(--text-secondary); cursor: pointer;">
              ${t('tabTable')}
            </button>
            <button class="tab-btn" data-target="text-panel" style="padding: 10px 16px; font-weight: 600; font-size: 0.9rem; border-radius: var(--radius-sm); border: none; background: none; color: var(--text-secondary); cursor: pointer;">
              ${t('tabText')}
            </button>
          </div>

          <!-- PANEL 1: OCR -->
          <div id="ocr-panel" class="tab-panel" style="display: block;">
            <div style="margin-bottom: var(--space-md); display: flex; gap: var(--space-md); align-items: center; justify-content: space-between;">
              <div>
                <label style="font-weight: 600; font-size: 0.85rem; color: var(--text-secondary); margin-right: 8px;">
                  ${t('ocrLang')}
                </label>
                <select id="ocr-lang-select" style="padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-primary); background: var(--bg-input); color: var(--text-primary); font-size: 0.85rem; outline: none;">
                  <option value="rus+eng">Russian + English</option>
                  <option value="eng">English Only</option>
                  <option value="rus">Russian Only</option>
                </select>
              </div>
            </div>

            <div id="ocr-dropzone" style="border: 2px dashed var(--border-accent); border-radius: var(--radius-md); padding: var(--space-xl); text-align: center; cursor: pointer; transition: background 0.2s ease, border-color 0.2s ease; position: relative;">
              <input type="file" id="ocr-file-input" accept="image/*" style="display: none;">
              <span style="font-size: 2rem; display: block; margin-bottom: 8px;">📷</span>
              <p style="font-size: 0.95rem; font-weight: 550; color: var(--text-primary); margin-bottom: 4px;">
                ${t('ocrPlaceholder')}
              </p>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">Supports PNG, JPG, WebP</p>
            </div>

            <!-- OCR Progress Bar -->
            <div id="ocr-progress-wrap" style="display: none; margin-top: var(--space-md);">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 6px;">
                <span>${t('ocrProgress')}</span>
                <span id="ocr-progress-percent">0%</span>
              </div>
              <div style="height: 6px; background: var(--border-primary); border-radius: 99px; overflow: hidden;">
                <div id="ocr-progress-bar" style="width: 0%; height: 100%; background: var(--text-accent); transition: width 0.1s linear;"></div>
              </div>
            </div>

            <!-- Preview and Results -->
            <div id="ocr-result-container" style="display: none; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-top: var(--space-md);">
              <div>
                <p style="font-weight:600; font-size:0.85rem; color:var(--text-secondary); margin-bottom:6px;">Image Preview</p>
                <div style="border: 1px solid var(--border-primary); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-secondary); display: grid; place-items: center; min-height: 250px;">
                  <img id="ocr-img-preview" style="max-height: 350px; object-fit: contain;">
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <p style="font-weight:600; font-size:0.85rem; color:var(--text-secondary);">Extracted Text</p>
                  <button id="ocr-copy-btn" class="btn" style="padding:4px 8px; font-size:0.75rem; border-radius:4px; border:1px solid var(--border-primary); background:var(--bg-secondary); color:var(--text-accent); cursor:pointer;">
                    ${t('copy')}
                  </button>
                </div>
                <textarea id="ocr-result-text" style="width: 100%; height: 350px; padding: var(--space-sm); border-radius: var(--radius-sm); border: 1px solid var(--border-primary); background: var(--bg-secondary); color: var(--text-primary); font-family: monospace; font-size: 0.85rem; resize: vertical; outline: none;"></textarea>
              </div>
            </div>
          </div>

          <!-- PANEL 2: TABLE CONVERTER -->
          <div id="table-panel" class="tab-panel" style="display: none;">
            <div class="tool-split" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
              <div>
                <p style="font-weight:600; font-size:0.85rem; color:var(--text-secondary); margin-bottom:6px;">Input (CSV, TSV, Excel Rows)</p>
                <textarea id="table-input" placeholder="${t('tablePlaceholder')}" style="width: 100%; height: 350px; padding: var(--space-sm); border-radius: var(--radius-sm); border: 1px solid var(--border-primary); background: var(--bg-secondary); color: var(--text-primary); font-family: monospace; font-size: 0.85rem; outline: none; resize: vertical;"></textarea>
                <div style="margin-top:var(--space-sm); display:flex; gap:var(--space-sm);">
                  <button id="table-to-json-btn" class="btn" style="padding:10px 16px; border-radius:var(--radius-sm); background:var(--bg-tertiary); border:1px solid var(--border-accent); color:var(--text-accent); font-weight:600; cursor:pointer;">
                    To JSON
                  </button>
                  <button id="table-to-html-btn" class="btn" style="padding:10px 16px; border-radius:var(--radius-sm); background:var(--bg-tertiary); border:1px solid var(--border-accent); color:var(--text-accent); font-weight:600; cursor:pointer;">
                    To HTML Table
                  </button>
                  <button id="table-to-md-btn" class="btn" style="padding:10px 16px; border-radius:var(--radius-sm); background:var(--bg-tertiary); border:1px solid var(--border-accent); color:var(--text-accent); font-weight:600; cursor:pointer;">
                    To Markdown
                  </button>
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <p style="font-weight:600; font-size:0.85rem; color:var(--text-secondary);">Output Result</p>
                  <button id="table-copy-btn" class="btn" style="padding:4px 8px; font-size:0.75rem; border-radius:4px; border:1px solid var(--border-primary); background:var(--bg-secondary); color:var(--text-accent); cursor:pointer;">
                    ${t('copy')}
                  </button>
                </div>
                <textarea id="table-output" style="width: 100%; height: 350px; padding: var(--space-sm); border-radius: var(--radius-sm); border: 1px solid var(--border-primary); background: var(--bg-secondary); color: var(--text-primary); font-family: monospace; font-size: 0.85rem; resize: vertical; outline: none;" readonly></textarea>
                <div id="table-html-preview" style="margin-top:var(--space-sm); border:1px solid var(--border-primary); border-radius:var(--radius-sm); padding:var(--space-sm); max-height:120px; overflow-y:auto; background:var(--bg-secondary); display:none;"></div>
              </div>
            </div>
          </div>

          <!-- PANEL 3: TEXT OPTIMIZER -->
          <div id="text-panel" class="tab-panel" style="display: none;">
            <div class="tool-split" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
              <div>
                <p style="font-weight:600; font-size:0.85rem; color:var(--text-secondary); margin-bottom:6px;">Dirty Input Text</p>
                <textarea id="text-input" placeholder="${t('textPlaceholder')}" style="width: 100%; height: 350px; padding: var(--space-sm); border-radius: var(--radius-sm); border: 1px solid var(--border-primary); background: var(--bg-secondary); color: var(--text-primary); font-family: monospace; font-size: 0.85rem; outline: none; resize: vertical;"></textarea>
                <div style="margin-top:var(--space-sm); display:flex; flex-wrap:wrap; gap:var(--space-sm);">
                  <button id="text-strip-spaces" class="btn" style="padding:8px 12px; border-radius:4px; font-size:0.8rem; background:var(--bg-secondary); border:1px solid var(--border-primary); cursor:pointer;">
                    Remove Double Spaces
                  </button>
                  <button id="text-strip-newlines" class="btn" style="padding:8px 12px; border-radius:4px; font-size:0.8rem; background:var(--bg-secondary); border:1px solid var(--border-primary); cursor:pointer;">
                    Remove Newlines
                  </button>
                  <button id="text-slugify" class="btn" style="padding:8px 12px; border-radius:4px; font-size:0.8rem; background:var(--bg-secondary); border:1px solid var(--border-primary); cursor:pointer;">
                    To Slug-URL
                  </button>
                  <button id="text-clean-html" class="btn" style="padding:8px 12px; border-radius:4px; font-size:0.8rem; background:var(--bg-secondary); border:1px solid var(--border-primary); cursor:pointer;">
                    Strip HTML Tags
                  </button>
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <p style="font-weight:600; font-size:0.85rem; color:var(--text-secondary);">Clean Output</p>
                  <button id="text-copy-btn" class="btn" style="padding:4px 8px; font-size:0.75rem; border-radius:4px; border:1px solid var(--border-primary); background:var(--bg-secondary); color:var(--text-accent); cursor:pointer;">
                    ${t('copy')}
                  </button>
                </div>
                <textarea id="text-output" style="width: 100%; height: 350px; padding: var(--space-sm); border-radius: var(--radius-sm); border: 1px solid var(--border-primary); background: var(--bg-secondary); color: var(--text-primary); font-family: monospace; font-size: 0.85rem; resize: vertical; outline: none;" readonly></textarea>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    init() {
      // TAB CONTROLLER
      const tabBtns = document.querySelectorAll('.tab-btn');
      const panels = document.querySelectorAll('.tab-panel');

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.style.display = 'none');

          btn.classList.add('active');
          document.getElementById(btn.dataset.target).style.display = 'block';
          if (window.SoundFX) window.SoundFX.playClick();
        });
      });

      // OCR CONTROLLER (Tesseract Dynamic Load)
      const dropzone = document.getElementById('ocr-dropzone');
      const fileInput = document.getElementById('ocr-file-input');
      const imgPreview = document.getElementById('ocr-img-preview');
      const resultText = document.getElementById('ocr-result-text');
      const progressWrap = document.getElementById('ocr-progress-wrap');
      const progressBar = document.getElementById('ocr-progress-bar');
      const progressPercent = document.getElementById('ocr-progress-percent');
      const resultContainer = document.getElementById('ocr-result-container');
      const ocrCopy = document.getElementById('ocr-copy-btn');
      const ocrLangSelect = document.getElementById('ocr-lang-select');

      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--text-accent)';
        dropzone.style.background = 'rgba(139,92,246,0.05)';
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'var(--border-accent)';
        dropzone.style.background = 'none';
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--border-accent)';
        dropzone.style.background = 'none';
        if (e.dataTransfer.files.length) {
          processOcrImage(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
          processOcrImage(e.target.files[0]);
        }
      });

      function processOcrImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imgPreview.src = e.target.result;
          resultContainer.style.display = 'grid';
          progressWrap.style.display = 'block';
          progressBar.style.width = '0%';
          progressPercent.textContent = '0%';
          resultText.value = '';

          // Load Tesseract.js dynamically from CDN to keep offline caching robust via SW
          if (typeof Tesseract === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.5/dist/tesseract.min.js';
            script.onload = () => runTesseract(file);
            document.head.appendChild(script);
          } else {
            runTesseract(file);
          }
        };
        reader.readAsDataURL(file);
      }

      function runTesseract(file) {
        const lang = ocrLangSelect.value;
        Tesseract.recognize(file, lang, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const p = Math.round(m.progress * 100);
              progressBar.style.width = `${p}%`;
              progressPercent.textContent = `${p}%`;
            }
          }
        }).then(({ data: { text } }) => {
          resultText.value = text;
          progressWrap.style.display = 'none';
          if (window.SoundFX) window.SoundFX.playSuccess();
        }).catch(err => {
          resultText.value = `OCR Error: ${err.message || err}`;
          progressWrap.style.display = 'none';
        });
      }

      ocrCopy.addEventListener('click', () => {
        DevForge.copyToClipboard(resultText.value);
      });

      // TABLE TRANSFORMS CONTROLLER
      const tableInput = document.getElementById('table-input');
      const tableOutput = document.getElementById('table-output');
      const tableCopy = document.getElementById('table-copy-btn');
      const htmlPreview = document.getElementById('table-html-preview');

      function parseTable() {
        const raw = tableInput.value.trim();
        if (!raw) return [];
        // Split by newlines, then tab or comma
        const rows = raw.split(/\r?\n/).map(line => {
          if (line.includes('\t')) return line.split('\t');
          // Basic comma split (ignoring quotes for speed, custom rules apply)
          return line.split(',');
        });
        return rows;
      }

      document.getElementById('table-to-json-btn').addEventListener('click', () => {
        const rows = parseTable();
        if (!rows.length) return;
        const headers = rows[0];
        const items = rows.slice(1).map(row => {
          const obj = {};
          headers.forEach((h, i) => {
            obj[h.trim()] = row[i] ? row[i].trim() : '';
          });
          return obj;
        });
        tableOutput.value = JSON.stringify(items, null, 2);
        htmlPreview.style.display = 'none';
        if (window.SoundFX) window.SoundFX.playSuccess();
      });

      document.getElementById('table-to-html-btn').addEventListener('click', () => {
        const rows = parseTable();
        if (!rows.length) return;
        let html = '<table class="kb-table" style="width:100%; border-collapse:collapse; font-size:0.85rem;">\n';
        rows.forEach((row, rIdx) => {
          html += '  <tr>\n';
          row.forEach(cell => {
            const tag = rIdx === 0 ? 'th' : 'td';
            const style = rIdx === 0 
              ? 'background:var(--bg-tertiary); border:1px solid var(--border-primary); padding:8px; font-weight:bold; text-align:left;' 
              : 'border:1px solid var(--border-primary); padding:8px;';
            html += `    <${tag} style="${style}">${cell.trim()}</${tag}>\n`;
          });
          html += '  </tr>\n';
        });
        html += '</table>';
        tableOutput.value = html;
        htmlPreview.style.display = 'block';
        htmlPreview.innerHTML = html;
        if (window.SoundFX) window.SoundFX.playSuccess();
      });

      document.getElementById('table-to-md-btn').addEventListener('click', () => {
        const rows = parseTable();
        if (!rows.length) return;
        let md = '';
        rows.forEach((row, rIdx) => {
          md += '| ' + row.map(c => c.trim()).join(' | ') + ' |\n';
          if (rIdx === 0) {
            md += '| ' + row.map(() => '---').join(' | ') + ' |\n';
          }
        });
        tableOutput.value = md;
        htmlPreview.style.display = 'none';
        if (window.SoundFX) window.SoundFX.playSuccess();
      });

      tableCopy.addEventListener('click', () => {
        DevForge.copyToClipboard(tableOutput.value);
      });

      // TEXT OPTIMIZER CONTROLLER
      const textInput = document.getElementById('text-input');
      const textOutput = document.getElementById('text-output');
      const textCopy = document.getElementById('text-copy-btn');

      document.getElementById('text-strip-spaces').addEventListener('click', () => {
        textOutput.value = textInput.value.replace(/[ \t]+/g, ' ');
        if (window.SoundFX) window.SoundFX.playSuccess();
      });

      document.getElementById('text-strip-newlines').addEventListener('click', () => {
        textOutput.value = textInput.value.replace(/\r?\n|\r/g, ' ');
        if (window.SoundFX) window.SoundFX.playSuccess();
      });

      document.getElementById('text-slugify').addEventListener('click', () => {
        textOutput.value = textInput.value
          .toLowerCase()
          .replace(/[^a-z0-9а-яёієїґ\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/-+/g, '-');
        if (window.SoundFX) window.SoundFX.playSuccess();
      });

      document.getElementById('text-clean-html').addEventListener('click', () => {
        textOutput.value = textInput.value.replace(/<\/?[^>]+(>|$)/g, '');
        if (window.SoundFX) window.SoundFX.playSuccess();
      });

      textCopy.addEventListener('click', () => {
        DevForge.copyToClipboard(textOutput.value);
      });
    }
  });

})();
