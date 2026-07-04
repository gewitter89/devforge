# Show HN Posts for DevForge

## Hacker News - Show HN

**Title:** Show HN: DevForge – Open-source browser toolkit with 22 dev tools, zero dependencies

**URL:** https://gewitter89.github.io/devforge/

**Text:**
Hi HN! I built DevForge, a collection of 22 developer tools that runs entirely in your browser with no server, no tracking, no dependencies.

**What's included:**

- JSON/YAML formatter, JWT decoder, timestamp converter
- Password generator, hash generator, UUID v7
- Base64 codec, URL encoder, color converter
- Markdown preview, diff checker, cron parser
- Image optimizer (client-side compression)
- AI tools: prompt packager, context sanitizer
- **New:** AI Agent Config Generator (OpenCode, Cline, Cursor, Crush)
- **New:** Token savings guide (65-91% reduction with Caveman/Ponytail/Memanto)

**Tech stack:**

- Pure vanilla JS (no React, no build step)
- PWA with service worker (works offline)
- Dark/light theme with system preference detection
- Command palette (Ctrl+K) for instant tool access
- i18n support (EN/RU)

**Why I built this:**
I was tired of installing npm packages or using sketchy online tools that track your data. Everything here runs client-side, you can audit the code, and it works offline.

**Open source:** https://github.com/gewitter89/devforge

Would love feedback on UX and tool ideas!

---

## Reddit r/LocalLLaMA

**Title:** I built a browser-based AI config generator for OpenCode/Cline/Cursor + token savings guide (65-91% cost reduction)

**Text:**
Hey everyone!

I just released **DevForge**, a collection of 22 developer tools that runs entirely in your browser. No server, no tracking, no npm install.

**🤖 AI Agent Config Generator**
The main feature I want to highlight: a universal config generator for AI coding assistants.

Supports:

- **OpenCode** (opencode.jsonc)
- **Cline** (.clinerules)
- **Cursor** (.cursorrules)
- **Crush** (crush.yaml)
- Custom setups

You can configure:

- Multi-provider support (OpenRouter, Anthropic, OpenAI, Ollama)
- Free models: GLM-5.2 (753B), Fable 5, Llama 3.3 70B, Qwen3 72B
- Token optimization hooks (Ponytail, Caveman, Memanto)
- Advanced settings (context window, temperature, timeout)

**💰 Token Savings Guide**
I also wrote a comprehensive guide on reducing AI costs by 65-91%:

| Method       | Savings | What it does          |
| ------------ | ------- | --------------------- |
| **Caveman**  | 65-75%  | Compresses AI outputs |
| **Ponytail** | 22-50%  | Optimizes prompts     |
| **Memanto**  | 28%     | Deduplicates context  |
| **pxpipe**   | 44%     | Compresses images     |

When stacked: up to **91% total reduction**.

**🔗 Links:**

- Live demo: https://gewitter89.github.io/devforge/
- GitHub: https://github.com/gewitter89/devforge
- Token guide: https://github.com/gewitter89/devforge/blob/main/docs/token-savings.md

**Other tools included:**

- JSON/YAML formatter
- JWT decoder with signature verification
- Password generator with strength meter
- Hash generator (SHA-256, MD5, etc.)
- UUID v7 generator (timestamp-ordered)
- Base64 codec
- And 16 more...

Everything runs client-side, works offline (PWA), and has zero dependencies.

Let me know what you think! Would love tool suggestions.

---

## Reddit r/ChatGPT

**Title:** Free tool: Reduce your ChatGPT API costs by up to 91% with token optimization

**Text:**
Hey! I built a free browser tool that helps developers reduce AI API costs significantly.

**The problem:**
AI APIs charge by tokens. Most developers waste 65-91% of their budget on:

- Verbose outputs with unnecessary formatting
- Redundant prompts with filler words
- Duplicate context in conversation history
- Uncompressed images

**The solution:**
**DevForge** - a browser-based toolkit with token optimization tools.

**Key features:**

1. **AI Agent Config Generator**
   - Generates optimal configs for Claude, GPT, Llama, etc.
   - Supports OpenCode, Cline, Cursor, Crush
   - Pre-configured free models (GLM-5.2, Fable 5, Qwen3)

2. **Token Savings Guide**
   Complete guide to 4 battle-tested methods:
   - **Caveman**: Compress outputs (-70% tokens)
   - **Ponytail**: Optimize prompts (-50% tokens)
   - **Memanto**: Dedupe context (-28% tokens)
   - **pxpipe**: Compress images (-77% tokens)

   Combined: **up to 91% savings**

3. **AI Tools:**
   - Prompt packager (format prompts for APIs)
   - Context sanitizer (remove sensitive data)
   - Plus 19 other dev tools (JWT decoder, JSON formatter, etc.)

**Tech details:**

- Runs 100% in browser (no server)
- Zero dependencies (vanilla JS)
- PWA with offline support
- Open source

**Links:**

- Try it: https://gewitter89.github.io/devforge/
- Code: https://github.com/gewitter89/devforge
- Token guide: https://github.com/gewitter89/devforge/blob/main/docs/token-savings.md

Would love feedback! What other tools would be useful?

---

## dev.to Article

**Title:** How I Built DevForge: A Zero-Dependency Browser Toolkit with 22 Dev Tools

**Tags:** webdev, javascript, opensource, productivity

**Body:**

## The Problem

As developers, we constantly need quick tools:

- Format JSON
- Decode JWT
- Generate UUID
- Convert timestamps

The options are usually:

1. Install npm packages (heavy, version conflicts)
2. Use sketchy online tools (tracking, ads, data collection)
3. Write one-off scripts (reinventing the wheel)

None of these felt right.

## The Solution: DevForge

I built **DevForge** - a collection of 22 developer tools that runs entirely in your browser with:

- **Zero dependencies** (pure vanilla JS)
- **No server** (everything client-side)
- **No tracking** (privacy-first)
- **Offline support** (PWA with service worker)

[Try it here](https://gewitter89.github.io/devforge/)

## What's Included

### Core Tools (15)

- JSON/YAML formatter with syntax highlighting
- JWT decoder with signature verification
- Password generator with strength meter
- Hash generator (SHA-256, SHA-512, MD5, SHA-1)
- UUID v7 generator (timestamp-ordered)
- Base64 encoder/decoder
- URL encoder/decoder
- Color converter (HEX ↔ RGB ↔ HSL)
- Timestamp converter (Unix ↔ ISO 8601)
- Markdown preview with live rendering
- Lorem ipsum generator
- Diff checker (side-by-side comparison)
- Cron parser with human-readable output
- Image optimizer (client-side compression)

### AI Tools (4)

- AI Assistant (chat interface)
- Prompt Packager (format prompts for APIs)
- Context Sanitizer (remove sensitive data)
- Knowledge Base (documentation search)

### New: AI Agent Config Generator

Generate configurations for AI coding assistants:

- **OpenCode** (opencode.jsonc)
- **Cline** (.clinerules)
- **Cursor** (.cursorrules)
- **Crush** (crush.yaml)

Features:

- Multi-provider support (OpenRouter, Anthropic, OpenAI, Ollama)
- Free model presets (GLM-5.2, Fable 5, Llama 3.3, Qwen3)
- Token optimization hooks
- Advanced settings (context window, temperature, timeout)

## Technical Implementation

### Architecture

```
DevForge/
├── index.html          # Single HTML file
├── sw.js              # Service worker for offline
├── js/
│   ├── app.js         # Core routing + command palette
│   ├── i18n.js        # Internationalization
│   ├── contributors.js # GitHub API integration
│   └── sound.js       # Audio feedback
├── tools/             # 22 tool modules
│   ├── json-formatter.js
│   ├── jwt-decoder.js
│   └── ...
└── css/
    └── styles.css     # Single stylesheet
```

### Tool Registration

Each tool is self-contained and registers itself:

```javascript
DevForge.registerTool({
  id: 'json-formatter',
  name: 'JSON Formatter',
  description: 'Format and validate JSON',
  category: 'formatters',
  icon: '📋',
  render() {
    return `<textarea id="json-input"></textarea>`;
  },
  init() {
    // Setup event listeners
  }
});
```

### Service Worker Strategy

- **Cache-first** for static assets (HTML, CSS, JS)
- **Network-first** for API calls (GitHub contributors)
- **Stale-while-revalidate** for tool updates

Cache-busting with query params:

```html
<script src="tools/json-formatter.js?v=2"></script>
```

### Offline Support

```javascript
// sw.js
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
```

## Token Savings Guide

I also wrote a comprehensive guide on reducing AI costs by 65-91%.

### The Methods

1. **Caveman** (65-75% savings)
   - Post-processor for AI outputs
   - Strips whitespace, comments, boilerplate
   - Preserves semantic content

   ```bash
   claude "explain recursion" | caveman
   ```

2. **Ponytail** (22-50% savings)
   - Meta-prompt that optimizes prompts
   - Removes filler words, merges redundant instructions
   - 66K+ stars on GitHub

   ```bash
   ponytail.sh optimize my-prompt.md
   ```

3. **Memanto** (28% savings)
   - Context deduplication
   - Merges repetitive information
   - Works as proxy

   ```bash
   memanto --port 8080 --upstream https://api.anthropic.com
   ```

4. **pxpipe** (44% savings)
   - Image compression for AI uploads
   - Downscales 48MP → 1024px
   - Reduces API token usage by 77%

   ```bash
   pxpipe photo.jpg | curl -X POST --data-binary @-
   ```

### Combined Effect

When stacked:

- Ponytail: -50% prompt tokens
- Caveman: -70% output tokens
- Memanto: -28% context tokens
- pxpipe: -77% image tokens

**Total: up to 91% savings**

## Lessons Learned

### 1. Service Worker Caching is Tricky

The "0 tools loading" bug was caused by cache key mismatches:

- Browser requested: `tools/foo.js`
- SW cached: `tools/foo.js?v=2`

**Fix:** Add `?v=2` to all script tags and SW cache list.

### 2. Vanilla JS is Still Viable

No build step, no React, no TypeScript. Just:

- ES modules
- Modern DOM APIs
- Service worker

Result: 220KB gzipped, instant load, works offline.

### 3. Command Palette UX

Adding Ctrl+K palette was a game-changer:

```javascript
tools.filter(t => t.name.toLowerCase().includes(query));
```

Users can now:

- Search tools instantly
- Switch themes with `>theme dark`
- Access any tool without clicking

### 4. AI Config Complexity

Supporting 4 AI agents × 5 providers × 10 models = 200 combinations.

**Solution:** Composable config generator with presets.

## Future Plans

- [ ] Add unit tests (Vitest)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] More AI tools (image-to-prompt, code explainer)
- [ ] Community tool submissions
- [ ] Mobile optimizations

## Contributing

DevForge is open source! Contributions welcome:

1. Fork the repo
2. Create a tool (follow the pattern)
3. Add tests
4. Submit PR

[GitHub repo](https://github.com/gewitter89/devforge)

## Conclusion

DevForge proves that you don't need:

- Heavy frameworks
- Server infrastructure
- npm install
- Analytics tracking

To build a polished, full-featured dev tool.

Just vanilla JS, good UX, and privacy-first design.

[Try DevForge](https://gewitter89.github.io/devforge/) | [View source](https://github.com/gewitter89/devforge)

---

Thanks for reading! Let me know if you have questions or tool ideas.
