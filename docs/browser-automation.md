# Browser Automation for AI Agents

> Lightweight alternatives to Chrome for self-hosted AI agents and web scraping.

---

## Obscura — The Headless Browser for AI Agents

**[GitHub](https://github.com/h4ckf0r0day/obscura)** | **[Docs](https://docs.obscura.sh)** | 17.5k stars

### Why Obscura?

| Metric      | Obscura      | Headless Chrome |
| ----------- | ------------ | --------------- |
| Memory      | **30 MB**    | 200+ MB         |
| Binary size | **70 MB**    | 300+ MB         |
| Page load   | **85 ms**    | ~500 ms         |
| Anti-detect | **Built-in** | None            |
| MCP server  | **Built-in** | ❌              |

**Apache 2.0 license, Rust + V8, CDP-compatible.**

---

## Quick Setup

### Install (Windows)

1. Download `.zip` from [Releases](https://github.com/h4ckf0r0day/obscura/releases)
2. Extract to `C:\Tools\obscura\`
3. Add to PATH:
   ```powershell
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Tools\obscura", "User")
   ```

### Start CDP Server

```bash
obscura serve --port 9222 --stealth
```

### Test

```bash
obscura fetch https://example.com --dump text
```

---

## MCP Configuration

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "obscura": {
      "command": "obscura",
      "args": ["mcp", "--stealth", "--proxy", "socks5://127.0.0.1:1080"]
    }
  }
}
```

### Cursor / OpenCode

Add to `.cursor/mcp.json` or `opencode.jsonc`:

```json
{
  "mcpServers": {
    "obscura": {
      "command": "obscura",
      "args": ["mcp", "--stealth"]
    }
  }
}
```

---

## Parallel Scraping

```bash
obscura scrape https://news.ycombinator.com https://reddit.com \
  --concurrency 10 \
  --eval "document.querySelector('h1').textContent" \
  --format json
```

---

## Stealth Mode Features

- ✅ Per-session fingerprint randomization (GPU, screen, canvas, audio)
- ✅ `navigator.webdriver = undefined` (matches real Chrome)
- ✅ 3,520 tracker domains blocked
- ✅ `event.isTrusted = true` for dispatched events
- ✅ Native function masking (`Function.prototype.toString()` → `[native code]`)

---

## Use Cases

### 1. AI Agent Eyes

Use Obscura as browser backend for AI agents that need to:

- Fill forms and click buttons
- Read dynamic content (SPAs, infinite scroll)
- Bypass Cloudflare/anti-bot checks

### 2. Content Scraping

Batch-scrape docs, APIs, or competitor sites:

- 25 concurrent workers
- JSON output for easy parsing
- Stealth mode to avoid bans

### 3. Testing

Replace headless Chrome in Playwright/Puppeteer tests:

- 6x faster test runs
- Less memory pressure
- Same CDP API

---

## Integration with DevForge Tools

### Free LLM Radar

Use Obscura to health-check free API endpoints:

```javascript
const browser = await puppeteer.connect({
  browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser'
});

const page = await browser.newPage();
await page.goto('https://api.example.com/health');
const status = await page.evaluate(() => document.body.textContent);
```

### AI Agent Builder

Configure Obscura as the "eyes" for your agent:

```javascript
const obscura = await chromium.connectOverCDP({
  endpointURL: 'ws://127.0.0.1:9222'
});

// Agent can now see, click, fill forms
const page = await obscura.newContext().then(ctx => ctx.newPage());
await page.goto('https://target-site.com');
await page.fill('input[name="search"]', 'query');
```

---

## nodriver — Python Anti-Detect Alternative

**[GitHub](https://github.com/ultrafunkamsterdam/nodriver)** | by the author of `undetected-chromedriver`

### Why nodriver?

| Feature        | nodriver               | Selenium                     |
| -------------- | ---------------------- | ---------------------------- |
| Protocol       | **Direct CDP**         | WebDriver binary             |
| Async          | **Native async**       | Sync by default              |
| Anti-detect    | **Built-in**           | Manual configuration         |
| iframe support | **`tab.get_frames()`** | Complex workaround           |
| Setup          | **1-2 lines**          | Driver installation required |

### When to use which

| Use Case                        | Tool                                    |
| ------------------------------- | --------------------------------------- |
| MCP server integration          | **Obscura** (built-in MCP)              |
| Fast parallel scraping          | **Obscura** (`scrape --concurrency 25`) |
| Python AI agents                | **nodriver** (async Python)             |
| iframe/auth flow automation     | **nodriver** (`get_frames()`)           |
| Anti-detect + Cloudflare bypass | **Either** (both strong)                |

### Quick start

```bash
pip install nodriver
```

```python
import nodriver as uc

async def main():
    browser = await uc.start()
    page = await browser.get('https://example.com')

    # Anti-detect built-in
    title = await page.evaluate('document.title')

    # iframe traversal
    frames = await page.get_frames()
    for frame in frames:
        print(await frame.get_content())

    await browser.stop()

uc.loop().run_until_complete(main())
```

---

## Alternatives

| Tool           | Pros                            | Cons                   | Use when               |
| -------------- | ------------------------------- | ---------------------- | ---------------------- |
| **Obscura**    | Fast, stealth, MCP, standalone  | 70MB binary            | AI agents, scraping    |
| **nodriver**   | Python async, anti-detect, free | Needs Chrome installed | Python agents, iframes |
| **Playwright** | Full browser control            | Heavy (200MB+)         | Complex web apps       |
| **Puppeteer**  | Mature ecosystem                | Chrome-only            | Legacy code            |
| **Selenium**   | Cross-browser                   | Slow, flaky            | E2E testing            |

---

## Resources

- [Obscura Benchmark](https://github.com/h4ckf0r0day/obscura-benchmark)
- [Hermes Agent Plugin](https://github.com/SGavrl/hermes-plugin-obscura) (open-source agent framework)
- [Proxy Recommendations](https://github.com/h4ckf0r0day/obscura#sponsors) (residential proxies for stealth)

---

## TL;DR

**Obscura = Lightweight Chrome for AI agents.**

- 30MB RAM (vs 200MB Chrome)
- Built-in MCP server
- Stealth mode (anti-detection)
- Drop-in Puppeteer/Playwright replacement

**Use when:** You need browser automation for AI agents, scraping, or testing — and want speed + stealth without the bloat.

---

_Last updated: 2026-07-04_
