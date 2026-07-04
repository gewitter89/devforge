# Changelog

All notable changes to DevForge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- SECURITY.md with privacy model and responsible disclosure policy
- CHANGELOG.md for version tracking
- Good first issues for new contributors

### Changed
- Updated README with clearer privacy model explanation
- Improved CONTRIBUTING.md with step-by-step guide

### Fixed
- Service worker cache invalidation for tool updates

---

## [0.1.0] - 2026-07-04

### Added
- **Core Application**
  - Plugin-based architecture with self-registering tools
  - Dark/Light theme support
  - Multi-language support (EN/RU)
  - Command palette (Ctrl+K)
  - Search functionality
  - Offline PWA support
  - Service Worker for caching

- **20 Developer Tools**
  - JSON Formatter — format, validate, minify JSON
  - Base64 Codec — encode/decode Base64 strings
  - Hash Generator — MD5, SHA-1, SHA-256, SHA-512
  - URL Codec — encode/decode URL components
  - UUID Generator — generate v4 UUIDs
  - Color Converter — HEX, RGB, HSL conversion
  - Password Generator — strong password creation
  - Timestamp Converter — Unix timestamp conversion
  - Markdown Preview — live Markdown editor
  - Lorem Ipsum Generator — placeholder text
  - AI Code Assistant — LLM-powered code generation
  - JWT Decoder — parse and inspect JWT tokens
  - Diff Checker — side-by-side text comparison
  - Cron Parser — crontab schedule explanation
  - Image Optimizer — compress and resize images
  - AI Context Packager — combine files for LLM prompts
  - AI Sanitizer — clean prompts for LLMs
  - Web Terminal — browser-based terminal emulator
  - Smart Transformer — intelligent text transformation
  - Knowledge Base — community-maintained wiki

- **Documentation**
  - README.md with tool list and usage
  - CONTRIBUTING.md for contributors
  - CODE_OF_CONDUCT.md
  - LICENSE (MIT)

- **Infrastructure**
  - GitHub Pages deployment
  - GitHub Actions workflow for deployment
  - Issue templates (bug report, feature request, new tool)
  - Pull request template

[Unreleased]: https://github.com/gewitter89/devforge/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/gewitter89/devforge/releases/tag/v0.1.0
