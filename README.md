<div align="center">

# ⚒️ DevForge

### A beautiful, open-source developer toolkit — built by the community, for the community.

**18+ essential developer tools. Zero dependencies. Runs entirely in your browser.**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/gewitter89/devforge?style=for-the-badge&logo=github)](https://github.com/gewitter89/devforge/stargazers)
[![Contributors](https://img.shields.io/github/contributors/gewitter89/devforge?style=for-the-badge&logo=github)](https://github.com/gewitter89/devforge/graphs/contributors)
[![Deploy](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-222?style=for-the-badge&logo=github)](https://gewitter89.github.io/devforge/)

<br>

> [!IMPORTANT]
> ### 📢 WE ARE BUILDING THIS TOGETHER! / МЫ ПИШЕМ ЭТОТ ПРОЕКТ ВМЕСТЕ!
> **English**: DevForge is a 100% community-driven project. We want this to be the ultimate developer toolkit. Adding a new tool takes less than 15 minutes! Check our [Contributing Guide](CONTRIBUTING.md) and send your PRs. Let's build something awesome together! 🚀
> 
> **Русский**: DevForge — это проект, создаваемый сообществом. Мы хотим сделать идеальный набор инструментов для разработчиков. Добавить новую утилиту можно меньше чем за 15 минут! Читай [Руководство по участию](CONTRIBUTING.md) и отправляй свои Pull Request-ы. Давай сделаем крутой инструмент вместе! 🤝

<br>

<img src="https://via.placeholder.com/800x450?text=DevForge+Screenshot" alt="DevForge Screenshot" width="720">

<br>

[**🌐 Live Demo**](https://gewitter89.github.io/devforge/) · [**🐛 Report a Bug**](https://github.com/gewitter89/devforge/issues/new?template=bug_report.yml) · [**✨ Request a Feature**](https://github.com/gewitter89/devforge/issues/new?template=feature_request.yml) · [**🔧 Propose a Tool**](https://github.com/gewitter89/devforge/issues/new?template=new_tool.yml)

</div>

---

## 🤔 What is DevForge?

DevForge is a **Swiss Army knife for developers** — a sleek, modular web app packed with everyday utilities. No installs, no sign-ups, no telemetry. Just open it and get stuff done.

- ⚡ **Blazing fast** — everything runs client-side, nothing leaves your browser
- 🎨 **Beautiful UI** — dark/light themes, responsive layout, smooth animations
- 🧩 **Modular architecture** — each tool is a single self-registering JS file
- 🔌 **Zero dependencies** — built with vanilla HTML, CSS, and JavaScript
- 🌍 **Works offline** — no server required, open `index.html` and go
- 🔒 **Private by design** — your data never touches a server
- 🤝 **Easy to contribute** — add a tool in under 30 minutes

---

## 🛠️ Available Tools

| # | Tool | Category | Description |
|---|------|----------|-------------|
| 1 | **JSON Formatter** | Formatters | Format, validate, minify, and syntax-highlight JSON |
| 2 | **Base64 Encoder/Decoder** | Encoders | Encode and decode Base64 strings in real-time |
| 3 | **Hash Generator** | Encoders | Generate MD5, SHA-1, SHA-256, SHA-512 hashes |
| 4 | **URL Encoder/Decoder** | Encoders | Encode and decode URL components |
| 5 | **UUID Generator** | Generators | Generate v4 UUIDs — single or in bulk |
| 6 | **Color Converter** | Converters | Convert between HEX, RGB, HSL color formats |
| 7 | **Password Generator** | Generators | Create strong passwords with customizable rules |
| 8 | **Timestamp Converter** | Converters | Convert between Unix timestamps and human-readable dates |
| 9 | **Markdown Preview** | Formatters | Live Markdown editor with instant HTML preview |
| 10 | **Lorem Ipsum Generator** | Generators | Generate placeholder text (words, sentences, paragraphs) |
| 11 | **AI Code Assistant** | Text | Generate regex, SQL, and code explanations with LLMs |
| 12 | **JWT Decoder** | Encoders | Parse and inspect JSON Web Tokens (JWT) payload and dates |
| 13 | **Diff Checker** | Text | Side-by-side and inline comparison of two text inputs |
| 14 | **Cron Parser** | Web | Translate crontab schedules to readable text & execution list |
| 15 | **Image Optimizer** | Web | Compress, resize, and convert images 100% locally in browser |
| 16 | **AI Context Packager** | Text | Combine multiple source files into a single LLM prompt block |
| 17 | **AI Prompt Sanitizer** | Text | Strip hidden Unicode characters and audit prompts for jailbreaks |
| 18 | **Visual Web Terminal** | Web | Interact with DevForge tools using a simulated Unix terminal |

> 💡 **Want to see a new tool?** [Propose one here!](https://github.com/gewitter89/devforge/issues/new?template=new_tool.yml)

---

## ⚡ Quick Start

DevForge requires **no build step**, no Node.js, no bundler. Just a browser.

### Option 1 — Open directly

```bash
git clone https://github.com/gewitter89/devforge.git
cd devforge
# Open index.html in your browser — that's it!
```

### Option 2 — Local dev server (recommended for development)

```bash
git clone https://github.com/gewitter89/devforge.git
cd devforge
npx serve .
# → http://localhost:3000
```

### Option 3 — GitHub Pages

Visit the live version at **[gewitter89.github.io/devforge](https://gewitter89.github.io/devforge/)**

---

## 🤝 Contributing

We love contributions! DevForge is designed to make contributing **ridiculously easy**. Whether you're a first-time contributor or an experienced developer, there's a place for you.

👉 Read the full **[Contributing Guide](CONTRIBUTING.md)** for detailed instructions.

### How to add a new tool — 3 simple steps

**Step 1:** Copy the template

```bash
cp templates/tool-template.js tools/my-awesome-tool.js
```

**Step 2:** Implement your tool using the `DevForge.registerTool()` API

```js
DevForge.registerTool({
  id: 'my-awesome-tool',
  name: 'My Awesome Tool',
  description: 'What it does in one sentence',
  category: 'converters',     // formatters | generators | converters | encoders | text | web
  icon: '<svg>...</svg>',      // 24x24 SVG icon
  tags: ['awesome', 'cool'],
  render() {
    return `<div class="tool-full"><!-- Your UI here --></div>`;
  },
  init() {
    // Attach event listeners here
  }
});
```

**Step 3:** Add a `<script>` tag to `index.html`

```html
<script src="tools/my-awesome-tool.js" defer></script>
```

That's it. Open a PR. 🎉

---

## 🗺️ Roadmap

- [x] 🤖 **AI Code Assistant** — built-in Llama / Gemini / OpenAI support
- [x] 🔊 **Audio UI feedback** — gentle synth clicks and success chords
- [x] 🎨 **Interactive Contributors Wall** — dynamic widget loading GitHub profiles
- [ ] 📱 **PWA support** — install DevForge as a desktop/mobile app
- [ ] 🌐 **i18n / Localization** — support for multiple languages
- [ ] 🔍 **More tools** — JWT decoder, cron expression parser, CSS gradient generator
- [ ] ⌨️ **Keyboard shortcuts** — power-user navigation
- [ ] 📦 **Tool favorites** — bookmark your most-used tools
- [ ] 🎨 **Custom themes** — community-created color schemes
- [ ] 📊 **Usage analytics** — anonymous, opt-in tool popularity stats

> Have an idea? [Open a feature request!](https://github.com/gewitter89/devforge/issues/new?template=feature_request.yml)

---

## 🏗️ Architecture

```
devforge/
├── index.html              # Single-page shell
├── css/
│   └── main.css            # All styles (themes, layout, components)
├── js/
│   └── app.js              # Core: registration, routing, search, themes
├── tools/
│   ├── json-formatter.js   # Each tool = one self-registering file
│   ├── base64-codec.js
│   ├── hash-generator.js
│   └── ...
├── templates/
│   └── tool-template.js    # Starter template for new tools
└── .github/
    ├── workflows/deploy.yml
    ├── ISSUE_TEMPLATE/
    └── PULL_REQUEST_TEMPLATE.md
```

Each tool calls `DevForge.registerTool()` — the core automatically adds it to the catalog, search, and routing. **Zero configuration.**

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You're free to use, modify, and distribute DevForge. Attribution appreciated but not required. ❤️

---

## 💖 Contributors

Thanks to these amazing people for building DevForge:

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Want to see your avatar here? Check out the **[Contributing Guide](CONTRIBUTING.md)** and submit a PR!

---

<div align="center">

**If DevForge helps you, consider giving it a ⭐ — it helps others discover the project!**

Made with ❤️ by the open-source community

</div>
