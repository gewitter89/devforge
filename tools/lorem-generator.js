/* ============================================================
   DevForge Tool — Lorem Ipsum Generator
   Generate placeholder text with multiple options
   ============================================================ */

DevForge.registerTool({
  id: 'lorem-generator',
  name: 'Lorem Ipsum Generator',
  description: 'Generate Lorem Ipsum and random placeholder text with formatting options',
  category: 'text',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>',
  tags: ['lorem', 'ipsum', 'placeholder', 'text', 'generator', 'dummy'],

  render() {
    return `
      <div class="tool-full">
        <!-- Options -->
        <div class="tool-options" style="flex-wrap:wrap;gap:var(--space-md);">
          <div class="tool-option">
            <label for="lorem-generator-mode" style="font-weight:600;font-size:0.8rem;text-transform:uppercase;">Type</label>
            <select id="lorem-generator-mode">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div class="tool-option">
            <label for="lorem-generator-count" style="font-weight:600;font-size:0.8rem;text-transform:uppercase;">Quantity</label>
            <input type="number" id="lorem-generator-count" min="1" max="100" value="3">
          </div>
        </div>

        <div class="tool-options" style="flex-wrap:wrap;gap:var(--space-md);">
          <label class="tool-checkbox">
            <input type="checkbox" id="lorem-generator-classic" checked> Start with "Lorem ipsum dolor sit amet..."
          </label>
          <label class="tool-checkbox">
            <input type="checkbox" id="lorem-generator-random"> Use random (non-Lorem) text
          </label>
          <label class="tool-checkbox">
            <input type="checkbox" id="lorem-generator-html"> Wrap in &lt;p&gt; tags
          </label>
        </div>

        <!-- Actions -->
        <div class="tool-actions" style="margin-top:0;">
          <button class="tool-btn tool-btn-primary" id="lorem-generator-generate">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Generate
          </button>
          <button class="tool-btn" id="lorem-generator-copy">
            ${DevForge.COPY_ICON} Copy
          </button>
        </div>

        <!-- Output -->
        <div class="tool-group">
          <label>Generated Text</label>
          <div id="lorem-generator-output" class="tool-result" style="min-height:200px;white-space:pre-wrap;"></div>
        </div>

        <!-- Stats -->
        <div id="lorem-generator-stats" style="display:flex;gap:var(--space-xl);flex-wrap:wrap;"></div>
      </div>
    `;
  },

  init() {
    const modeSelect = document.getElementById('lorem-generator-mode');
    const countInput = document.getElementById('lorem-generator-count');
    const classicCb = document.getElementById('lorem-generator-classic');
    const randomCb = document.getElementById('lorem-generator-random');
    const htmlCb = document.getElementById('lorem-generator-html');
    const genBtn = document.getElementById('lorem-generator-generate');
    const copyBtn = document.getElementById('lorem-generator-copy');
    const output = document.getElementById('lorem-generator-output');
    const statsEl = document.getElementById('lorem-generator-stats');

    // Classic Lorem Ipsum words pool
    const LOREM_WORDS = [
      'lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet',
      'consectetur',
      'adipiscing',
      'elit',
      'sed',
      'do',
      'eiusmod',
      'tempor',
      'incididunt',
      'ut',
      'labore',
      'et',
      'dolore',
      'magna',
      'aliqua',
      'enim',
      'ad',
      'minim',
      'veniam',
      'quis',
      'nostrud',
      'exercitation',
      'ullamco',
      'laboris',
      'nisi',
      'aliquip',
      'ex',
      'ea',
      'commodo',
      'consequat',
      'duis',
      'aute',
      'irure',
      'in',
      'reprehenderit',
      'voluptate',
      'velit',
      'esse',
      'cillum',
      'fugiat',
      'nulla',
      'pariatur',
      'excepteur',
      'sint',
      'occaecat',
      'cupidatat',
      'non',
      'proident',
      'sunt',
      'culpa',
      'qui',
      'officia',
      'deserunt',
      'mollit',
      'anim',
      'id',
      'est',
      'laborum',
      'praesent',
      'mauris',
      'viverra',
      'lacinia',
      'augue',
      'nibh',
      'cras',
      'pulvinar',
      'mattis',
      'nunc',
      'pellentesque',
      'habitant',
      'morbi',
      'tristique',
      'senectus',
      'netus',
      'malesuada',
      'fames',
      'ac',
      'turpis',
      'egestas',
      'maecenas',
      'pharetra',
      'convallis',
      'posuere',
      'orci',
      'leo',
      'urna',
      'dui',
      'at',
      'semper',
      'risus',
      'venenatis',
      'auctor',
      'purus',
      'ultricies',
      'integer',
      'feugiat',
      'scelerisque',
      'varius',
      'morbi',
      'blandit',
      'cursus',
      'accumsan',
      'dictum',
      'porta',
      'justo',
      'vel',
      'sollicitudin',
      'tempus',
      'facilisis',
      'felis',
      'donec',
      'pretium',
      'vulputate',
      'sapien',
      'nec',
      'sagittis',
      'aliquam',
      'metus',
      'quam',
      'elementum',
      'etiam',
      'proin',
      'libero',
      'faucibus',
      'interdum',
      'massa',
      'tortor',
      'condimentum',
      'lacus',
      'suspendisse',
      'faucibus',
      'velit',
      'dignissim',
      'sodales',
      'neque',
      'ornare',
      'aenean',
      'euismod',
      'lectus',
      'arcu',
      'bibendum',
      'ante',
      'dapibus',
      'placerat',
      'tincidunt',
      'lobortis',
      'natoque',
      'penatibus',
      'magnis',
      'dis',
      'parturient',
      'montes',
      'nascetur',
      'ridiculus',
      'mus',
      'vitae',
      'congue',
      'imperdiet',
      'gravida',
      'luctus',
      'vestibulum',
      'rhoncus',
      'fermentum',
      'iaculis',
      'hac',
      'habitasse',
      'platea',
      'dictumst',
      'quisque',
      'eget',
      'mi',
      'ligula',
      'primis',
      'hendrerit',
      'tellus'
    ];

    // Random non-Lorem words
    const RANDOM_WORDS = [
      'the',
      'be',
      'to',
      'of',
      'and',
      'a',
      'in',
      'that',
      'have',
      'I',
      'it',
      'for',
      'not',
      'on',
      'with',
      'he',
      'as',
      'you',
      'do',
      'at',
      'this',
      'but',
      'his',
      'by',
      'from',
      'they',
      'we',
      'her',
      'she',
      'or',
      'an',
      'will',
      'my',
      'one',
      'all',
      'would',
      'there',
      'their',
      'what',
      'so',
      'up',
      'out',
      'if',
      'about',
      'who',
      'get',
      'which',
      'go',
      'me',
      'when',
      'make',
      'can',
      'like',
      'time',
      'no',
      'just',
      'him',
      'know',
      'take',
      'people',
      'into',
      'year',
      'your',
      'good',
      'some',
      'could',
      'them',
      'see',
      'other',
      'than',
      'then',
      'now',
      'look',
      'only',
      'come',
      'its',
      'over',
      'think',
      'also',
      'back',
      'after',
      'use',
      'two',
      'how',
      'our',
      'work',
      'first',
      'well',
      'way',
      'even',
      'new',
      'want',
      'because',
      'any',
      'these',
      'give',
      'day',
      'most',
      'us',
      'great',
      'between',
      'need',
      'large',
      'often',
      'around',
      'each',
      'next',
      'under',
      'open',
      'seem',
      'together',
      'keep',
      'still',
      'found',
      'hand',
      'high',
      'place',
      'small',
      'home',
      'never',
      'running',
      'quickly',
      'strong',
      'building',
      'creative',
      'solution',
      'design',
      'modern',
      'system',
      'process',
      'important',
      'develop',
      'software',
      'digital',
      'platform',
      'experience',
      'technology',
      'project',
      'create',
      'build',
      'code',
      'data',
      'network',
      'cloud'
    ];

    const CLASSIC_START =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

    function pickRandom(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function generateSentence(wordPool, minWords, maxWords) {
      const len = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
      const words = [];
      for (let i = 0; i < len; i++) {
        words.push(pickRandom(wordPool));
      }
      // Add commas randomly
      for (let i = 3; i < words.length - 1; i += 2 + Math.floor(Math.random() * 4)) {
        if (Math.random() > 0.5) words[i] = words[i] + ',';
      }
      return capitalize(words.join(' ')) + '.';
    }

    function generateParagraph(wordPool, sentenceCount) {
      const count = sentenceCount || 3 + Math.floor(Math.random() * 5);
      const sentences = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(wordPool, 6, 18));
      }
      return sentences.join(' ');
    }

    function generate() {
      const mode = modeSelect.value;
      const count = Math.max(1, Math.min(100, parseInt(countInput.value) || 3));
      const useClassic = classicCb.checked;
      const useRandom = randomCb.checked;
      const useHtml = htmlCb.checked;
      const wordPool = useRandom ? RANDOM_WORDS : LOREM_WORDS;

      let result = '';

      if (mode === 'paragraphs') {
        const paragraphs = [];
        for (let i = 0; i < count; i++) {
          let para = generateParagraph(wordPool);
          if (i === 0 && useClassic && !useRandom) {
            para = CLASSIC_START + ' ' + para;
          }
          if (useHtml) {
            paragraphs.push('<p>' + para + '</p>');
          } else {
            paragraphs.push(para);
          }
        }
        result = paragraphs.join(useHtml ? '\n\n' : '\n\n');
      } else if (mode === 'sentences') {
        const sentences = [];
        for (let i = 0; i < count; i++) {
          if (i === 0 && useClassic && !useRandom) {
            sentences.push(CLASSIC_START);
          } else {
            sentences.push(generateSentence(wordPool, 6, 18));
          }
        }
        result = sentences.join(' ');
        if (useHtml) result = '<p>' + result + '</p>';
      } else {
        // Words
        const words = [];
        if (useClassic && !useRandom) {
          const classicWords = CLASSIC_START.replace(/[.,]/g, '').split(/\s+/);
          for (let i = 0; i < Math.min(count, classicWords.length); i++) {
            words.push(classicWords[i]);
          }
          for (let i = words.length; i < count; i++) {
            words.push(pickRandom(wordPool));
          }
        } else {
          for (let i = 0; i < count; i++) {
            words.push(pickRandom(wordPool));
          }
        }
        result = words.join(' ');
        if (useHtml) result = '<p>' + result + '</p>';
      }

      output.textContent = result;
      updateStats(result);
    }

    function updateStats(text) {
      const words = text
        .trim()
        .split(/\s+/)
        .filter(w => w).length;
      const chars = text.length;
      const charsNoSpaces = text.replace(/\s/g, '').length;
      const sentences = (text.match(/[.!?]+/g) || []).length;
      const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;

      statsEl.innerHTML = [
        { label: 'Words', value: words },
        { label: 'Characters', value: chars.toLocaleString() },
        { label: 'Characters (no spaces)', value: charsNoSpaces.toLocaleString() },
        { label: 'Sentences', value: sentences },
        { label: 'Paragraphs', value: paragraphs }
      ]
        .map(
          s => `
        <div style="text-align:center;">
          <div style="font-size:1.25rem;font-weight:700;color:var(--text-accent);font-family:'JetBrains Mono',monospace;">${s.value}</div>
          <div style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:600;">${s.label}</div>
        </div>
      `
        )
        .join('');
    }

    // Events
    genBtn.addEventListener('click', generate);
    copyBtn.addEventListener('click', () => {
      if (output.textContent) DevForge.copyToClipboard(output.textContent);
    });

    // Auto-regenerate on option change
    [modeSelect, countInput, classicCb, randomCb, htmlCb].forEach(el => {
      el.addEventListener('change', generate);
    });
    countInput.addEventListener('input', generate);

    // Initial generation
    generate();
  }
});
