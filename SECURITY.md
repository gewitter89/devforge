# Security Policy

## Supported Versions

The latest version on the `main` branch and the latest tagged release are actively maintained and supported with security updates.

| Version  | Supported          |
| -------- | ------------------ |
| Latest   | :white_check_mark: |
| < Latest | :x:                |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability, please report it responsibly:

### Email

Contact: [Create a private vulnerability report](https://github.com/gewitter89/devforge/security/advisories/new)

### What to Include

- Affected tool or page (e.g., JWT Decoder, AI Assistant)
- Steps to reproduce the vulnerability
- Potential impact
- Browser and version information
- Suggested fix (if available)

### Response Time

- **Acknowledgment**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Depends on severity, typically within 30 days

## Privacy Model

DevForge operates on a **privacy-first** architecture:

### Local-Only Tools

Most tools run **entirely client-side** in your browser:

- All data processing happens locally
- No data is sent to external servers
- No telemetry or analytics
- Works offline via PWA

Tools marked as `network: false` in their metadata are guaranteed to make **zero network requests**.

### AI-Powered Tools

Some tools (AI Assistant, AI Packager, AI Sanitizer) may interact with external AI providers:

- **Explicit user action required**: Data is only sent when you explicitly trigger the tool
- **Provider transparency**: The tool clearly shows which AI provider is being used
- **API key handling**:
  - Keys are stored in session memory only (not persisted by default)
  - Optional "Remember key locally" toggle for convenience
  - Clear button to remove stored keys
- **User control**: You choose which provider and when to send data

### Data You Control

- **No account required**: Use all tools without registration
- **No tracking**: No cookies, no analytics, no fingerprinting
- **Local storage**: Only used for preferences (theme, language, sound) and optional API keys
- **Export/Import**: You can export and delete all stored data

## Security Best Practices (For Users)

When using DevForge tools:

1. **Treat pasted data as potentially sensitive**
   - Avoid pasting production credentials, API keys, or PII
   - Use the AI Sanitizer tool to clean prompts before sending to LLMs

2. **Review AI tool outputs**
   - AI-generated code/regex/SQL should be reviewed before use
   - Never blindly execute AI suggestions in production

3. **Keep API keys secure**
   - Use environment variables or secure vaults
   - Rotate keys regularly
   - Never commit keys to version control

4. **Validate outputs**
   - Hash generators: Verify hash algorithms match your security requirements
   - JWT Decoder: Always validate signatures server-side, not just client-side
   - Password Generator: Use sufficient entropy for your use case

## Security Best Practices (For Contributors)

When contributing to DevForge:

1. **Never commit secrets**
   - No API keys, tokens, or credentials in code
   - Use `.env.example` for templates
   - Tools like `git-secrets` or pre-commit hooks recommended

2. **Validate all inputs**
   - Sanitize user input in all tools
   - Use safe defaults (e.g., escape HTML output)
   - Limit resource usage (prevent DoS via huge inputs)

3. **Minimize dependencies**
   - Prefer vanilla JS over libraries when possible
   - Audit any new dependencies for vulnerabilities
   - Keep dependencies up to date

4. **Code review**
   - All PRs require review before merge
   - Security-sensitive changes require additional scrutiny
   - Use GitHub's security advisories for known issues

## Responsible Disclosure

We appreciate security researchers who responsibly disclose vulnerabilities. We will:

- Acknowledge your report promptly
- Work with you to understand and resolve the issue
- Credit you in our security advisories (unless you prefer to remain anonymous)
- Never take legal action for good-faith security research

## Security Updates

Security updates will be:

- Published via GitHub Security Advisories
- Included in release notes
- Tagged with security-related labels

## Contact

For questions about this security policy:

- Open a discussion on GitHub Discussions
- Create a private security advisory

---

**Last Updated**: 2026-07-04
