# DevForge Launch Posts

> Rule #1 for every post below: **never claim anything the code can't back up.**
> HN and Reddit commenters will open the repo and check. Honesty converts better than hype.

---

## Launch Checklist (do in this order)

1. [ ] Repo is clean: license shows MIT, README has screenshot, issues labeled `good first issue`
2. [ ] Post **Show HN** on a weekday, 8-10am US Eastern (best visibility window)
3. [ ] Same day: r/webdev + r/SideProject (different angles, don't copy-paste)
4. [ ] Day 2: r/LocalLLaMA (AI angle) + dev.to article
5. [ ] Day 3: Habr (Russian audience) + Telegram channels
6. [ ] Week 2: submit to alternativeto.net (as alternative to it-tools), awesome-lists PRs
7. [ ] **Reply to every single comment within the first 3 hours** — this is what keeps posts alive
8. [ ] When someone suggests a tool → immediately create a labeled issue and link them to it

---

## 1. Hacker News — Show HN

**Title:** Show HN: DevForge – 25 dev tools in one page, no server, no build step, no deps

**URL:** https://gewitter89.github.io/devforge/

**First comment (post it yourself immediately after submitting):**

Hi HN! I built DevForge because I was tired of two things: googling "json formatter online" and landing on ad-filled pages that send my data who-knows-where, and installing npm packages for one-off tasks.

Everything runs client-side. There is no server, no analytics, no build step — the repo is plain HTML/CSS/JS you can read in an afternoon. It works offline as a PWA and ships in 14 languages.

The everyday tools are what you'd expect: JSON formatter, JWT decoder (decode + expiry inspection — no signature verification yet, PRs welcome), hash generator, UUID v4/v7, diff checker, cron parser, client-side image optimizer.

The part I'm most interested in feedback on is the AI-agent tooling: a config generator for AI coding assistants (OpenCode, Cline, Cursor), a prompt sanitizer that strips hidden Unicode and flags injection patterns, a context packager that bundles source files into one LLM prompt, and a multi-provider router to compare LLM responses side by side.

Architecture: each tool is one self-registering JS file. `DevForge.registerTool({...})` and the core picks it up — catalog, search, routing, i18n all automatic. Adding a tool genuinely takes ~15 minutes, which is the point: I want this to be community-maintained, not a one-man project.

Things I know are missing: regex tester, YAML converter, QR generator — all open as `good first issue` if anyone wants a fast first PR.

Code: https://github.com/gewitter89/devforge

**Notes for HN:**

- Do NOT use marketing words ("blazing", "beautiful", "game-changer") — HN downvotes them
- Do NOT mention star counts or growth goals
- DO admit limitations upfront (the JWT caveat above builds more trust than any feature list)
- Answer technical questions with code links

---

## 2. Reddit r/webdev

**Title:** I built 25 browser dev tools with zero dependencies — no framework, no build step, works offline. Roast my architecture.

**Text:**

Live: https://gewitter89.github.io/devforge/ · Code: https://github.com/gewitter89/devforge

The constraint I set myself: no npm packages at runtime, no bundler, no framework. Just files a browser can run.

What came out of it:

- 25 tools (JSON formatter, JWT decoder, hash gen, diff checker, cron parser, image optimizer, plus a set of AI-agent utilities)
- Plugin architecture: every tool is one self-registering file. `DevForge.registerTool({...})` and the core handles catalog, hash routing, search, and i18n
- PWA with a service worker — fully usable offline
- 14 languages, lazy-loaded, auto-detected from `navigator.language`
- Command palette on Ctrl+K

Honest lessons:

1. Service worker cache invalidation caused my worst bug — the SW cached `tools/foo.js?v=2` while the page requested `tools/foo.js`. Result: "0 tools available" for users with a stale cache. Fix: versioned cache names + a guarded auto-recovery (max 2 reload attempts so slow connections don't loop forever).
2. Vanilla JS at this scale is fine — until you want shared state between tools. I'd still choose it for this project, but I understand frameworks better now, not worse.
3. i18n without a library is mostly discipline, not code.

Genuinely asking for architecture criticism — especially the SW strategy and the plugin registration pattern. And if you want an easy open-source PR, regex tester / YAML converter / QR generator are open as good-first-issues.

---

## 3. Reddit r/SideProject

**Title:** My side project: a community-driven toolkit where adding your own tool takes 15 minutes (and puts your face on the site)

**Text:**

https://gewitter89.github.io/devforge/

DevForge is 25 developer tools in one page — JSON formatter, JWT decoder, password generator, AI prompt tools — all running 100% in the browser. No server, no tracking, open source (MIT).

The twist: it's built to be trivially easy to contribute to. Each tool is one JS file with a `registerTool()` call. Copy the template, fill in your logic, open a PR. Every merged contributor automatically appears on the Contributors Wall on the live site.

I'm trying to build the project so the community owns it, not me. If you've never contributed to open source, the `good first issue` list is designed for exactly that: https://github.com/gewitter89/devforge/issues

Feedback and tool ideas very welcome.

---

## 4. Reddit r/LocalLLaMA

**Title:** Free browser toolkit for agent builders: config generator (OpenCode/Cline/Cursor), prompt sanitizer, multi-provider comparison — no server, open source

**Text:**

I built DevForge — 25 client-side dev tools — and the AI-agent section is the part this sub might actually care about:

**AI Agent Config Hub** — generates configs for OpenCode (`opencode.jsonc`), Cline (`.clinerules`), Cursor (`.cursorrules`) and similar. Pick providers (OpenRouter, Anthropic, OpenAI, Ollama), models, context/temperature settings — get a ready file.

**Multi-Provider Router** — run the same prompt against several providers side by side (incl. local Ollama) and compare output, latency, and token counts. Export as JSON/Markdown.

**Prompt Sanitizer** — strips hidden Unicode (zero-width chars, bidi overrides) and flags common injection patterns before you paste text into your agent.

**Context Packager** — bundles multiple source files into one clean prompt block with file markers.

There's also a knowledge base of guides we maintain in the repo: free LLM API options, prompt token compression techniques, sandboxing agents in Docker, running a CLI agent through Telegram. All community-editable markdown: https://github.com/gewitter89/devforge/tree/main/docs/guides

Everything runs in the browser, works offline, zero dependencies. Your API keys never leave your machine (calls go directly from your browser to the provider).

Live: https://gewitter89.github.io/devforge/ · Code: https://github.com/gewitter89/devforge

What agent tooling is missing from your workflow? I'll turn good suggestions into issues.

---

## 5. dev.to Article

**Title:** 25 tools, 0 dependencies: what I learned building a toolkit in pure vanilla JS in 2026

**Tags:** webdev, javascript, opensource, showdev

**Body outline (write in your own voice, keep the honesty):**

1. **The itch** — sketchy online tools + npm fatigue for one-off tasks
2. **The constraint** — no framework, no build step, no runtime deps. Why constraints made the architecture better
3. **The plugin pattern** — full `registerTool()` code walkthrough; how one file = one tool keeps contributor friction near zero
4. **The war story** — the service-worker "0 tools available" bug: cache key mismatch (`?v=2`), the reload-loop danger, and the guarded recovery fix. This section is the reason people will share the article
5. **i18n for 14 languages without a library** — embedded EN/RU, lazy-loaded the rest, `navigator.language` detection
6. **What vanilla JS cost me** — shared state between tools is manual; no type safety; discipline replaces tooling. Be honest here
7. **Numbers** — FCP under 200ms, zero CLS, works fully offline. Real Lighthouse screenshots
8. **What's next** — community-driven roadmap, link to good first issues
9. **CTA** — "add your own tool in 15 minutes" + Contributors Wall

**Do not include:** the old draft's roadmap items "add tests / add CI" — both already exist and it makes the project look stale.

---

## 6. Habr (Russian)

**Заголовок:** 25 инструментов, ноль зависимостей: как я собрал тулкит для разработчиков на чистом JS — и зачем отдаю его сообществу

**Хабы:** JavaScript, Open source, Разработка веб-сайтов

**Структура статьи:**

1. Боль: онлайн-инструменты с рекламой и трекингом, npm-пакеты ради одной задачи
2. Ограничение как фича: без фреймворка, без сборки, без зависимостей — и почему это сделало архитектуру лучше
3. Плагинная система: один файл = один инструмент, разбор `registerTool()` с кодом
4. История бага «0 tools available»: кэш service worker, несовпадение ключей `?v=2`, опасность бесконечной перезагрузки и как это чинится
5. i18n на 14 языков без библиотек (включая русский и украинский)
6. AI-секция: генератор конфигов для агентов, санитайзер промптов, сравнение LLM-провайдеров — с примерами
7. База знаний по AI-агентам: бесплатные LLM API, сжатие токенов, песочницы в Docker
8. Честный раздел «что мне стоил vanilla JS»
9. Призыв: проект community-driven, добавить инструмент — 15 минут, good first issues ждут

Демо: https://gewitter89.github.io/devforge/ · Код: https://github.com/gewitter89/devforge

---

## 7. Telegram (short post for dev channels)

DevForge — 25 инструментов разработчика в одной странице. JSON formatter, JWT decoder, генератор конфигов для AI-агентов (OpenCode/Cline/Cursor), сравнение LLM-провайдеров, санитайзер промптов.

Всё работает в браузере: без сервера, без трекинга, офлайн (PWA), 14 языков. Open source, MIT.

Фишка: добавить свой инструмент — один JS-файл и 15 минут. Каждый контрибьютор попадает на стену на сайте.

Демо: https://gewitter89.github.io/devforge/
Код: https://github.com/gewitter89/devforge

---

## Directories & Lists (week 2)

| Where                            | How                                                                 |
| -------------------------------- | ------------------------------------------------------------------- |
| alternativeto.net                | Add DevForge as alternative to it-tools, transform.tools, CyberChef |
| awesome-developer-tools (GitHub) | PR with one-line description                                        |
| goodfirstissue.dev               | Automatic — issues are already labeled                              |
| Product Hunt                     | Optional; needs a dedicated launch day and gallery images           |
| uneed.best, microlaunch          | Low-effort submissions, steady trickle of traffic                   |

## Rules of Engagement (all platforms)

1. Never inflate numbers. "25 tools" not "25+" unless it's actually 26
2. Admit missing features before commenters find them
3. Every "you should add X" reply → create issue, label it, link it back. Suggester becomes contributor
4. Post natively per platform — HN wants engineering honesty, r/SideProject wants the journey, Habr wants technical depth in Russian
5. First 3 hours after posting = reply to everything. A dead comment section kills a post faster than downvotes
