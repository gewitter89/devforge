# Hosting Providers for Self-Hosted AI Tools

> Real-world reviews from DevForge community members (3+ months usage).

Use this guide if you need a VPS to self-host:

- Obscura browser automation
- MCP servers (SocraticoCode, Claude, Cursor)
- Free LLM proxies (CLIProxyAPI)
- Your own DevForge instance

---

## Tier 1: Premium (Reliable)

### Hetzner 🏆

**[hetzner.com](https://www.hetzner.com)**

| Plan | Specs                       | Price     |
| ---- | --------------------------- | --------- |
| CX23 | 2 CPU / 4GB RAM / 40GB NVMe | ~5€/month |
| CX33 | 4 CPU / 8GB RAM / 80GB NVMe | ~9€/month |

**Pros:**

- Best price/performance ratio in Europe
- 99.99% uptime over 4 months
- NVMe storage standard
- No KYC issues for CIS countries (with foreign card)

**Cons:**

- Requires credit card (non-Russian)
- Russian IPs may be blocked (use residential proxy to signup)

**Best for:** Production MCP servers, Obscura workers

---

### Intezio

**[intezio.net](https://intezio.net)**

- Community-vetted, "no-bullshit" provider
- Good pricing for Eastern European region
- Reliable support

**Best for:** Budget-conscious deployments

---

## Tier 2: Budget (Dirt Cheap)

### NodeHost

**[nodehost_bot](https://t.me/nodehost_bot)**

- Cheapest VPS options available
- **Warning:** Some IPs in TPSU (Ukrainian block list)
- Test on daily billing before committing

**Best for:** Temporary testing, throwaway experiments

### VibeHost

**[vibehost_bot](https://t.me/vibehost_bot)**

- Community-recommended ("few servers running 3+ months, no issues")
- Hourly/daily billing options
- Telegram-based support

**Pros:**

- No KYC
- Crypto payments
- Hourly billing

**Cons:**

- May have TPSU-blocked IPs
- Limited stock on good plans (CX23/CX33 sell out fast)

**Best for:** Cheap experiments, short-term hosting

---

## Tier 3: Resellers (More Expensive)

### Spacecore

**[billing.spacecore.pro](https://billing.spacecore.pro)**

- Reseller of Contabo and other providers
- **Warning:** Markup prices (e.g., 8€ for Contabo's 5.5€ plan)
- Use only if direct Contabo signup fails

---

## Comparison Matrix

| Provider      | Reliability | Price   | TPSU Risk | KYC    | Best For   |
| ------------- | ----------- | ------- | --------- | ------ | ---------- |
| **Hetzner**   | ⭐⭐⭐⭐⭐  | €5-9/mo | Low       | Medium | Production |
| **Intezio**   | ⭐⭐⭐⭐    | €4-7/mo | Low       | Low    | Budget     |
| **VibeHost**  | ⭐⭐⭐      | $2-5/mo | High      | Low    | Testing    |
| **NodeHost**  | ⭐⭐        | $1-3/mo | High      | Low    | Temporary  |
| **Spacecore** | ⭐⭐⭐      | €8+/mo  | Low       | Medium | Fallback   |

---

## Recommendations by Use Case

### Self-hosting Obscura workers

**Hetzner CX33** (4 CPU / 8GB) — enough for 20+ parallel workers with stealth mode.

### MCP server deployment

**Hetzner CX23** (2 CPU / 4GB) — MCP servers are lightweight.

### CLIProxyAPI (free LLM routing)

**VibeHost** or **NodeHost** hourly — test then shut down.

### DevForge static hosting

**GitHub Pages** (free) — DevForge is static, no VPS needed. See `.github/workflows/deploy.yml`.

---

## Signup Tips (for CIS users)

1. **Payment:** Need non-Russian credit card or crypto
2. **IP:** Use residential proxy during signup (see Obscura sponsors)
3. **KYC:** Some providers (Hetzner) may request ID verification
4. **TPSU:** Test IP reputation before deploying production workloads

---

## Community Resources

- [Obscura sponsors](https://github.com/h4ckf0r0day/obscura#sponsors) — residential proxies for privacy
- [CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) — self-hosted free LLM routing
- DevForge Discord — share your VPS experiences

---

_Last updated: 2026-07-04_
_Source: Community reviews from GIG AI Tools chat_
