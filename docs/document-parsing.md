# Document Parsing with MinerU

> Transform PDF, Word, Excel, Powerpoint и отсканированные документы в чистый Markdown.

**MinerU** — state-of-the-art парзер документов от OpenDataLab. 
[GitHub](https://github.com/opendatalab/MinerU) | **73.3k stars** | Open Source (Apache 2.0 based)

---

## Зачем это нужно?

Когда ты строишь **AI агента** или **RAG систему**, самое сложное — не сама модель, а **качество входных данных**.
MinerU превращает PDF/DOCX/PPTX/XLSX в структурированный Markdown который модель понимает правильно:

```
PDF (с формулами, таблицами, картинками)
          ↓
     MinerU
          ↓
Markdown (сохранена структура, таблицы в HTML, формулы в LaTeX)
          ↓
     LLM / RAG
          ↓
    Точные ответы
```

---

## Ключевые возможности

- ✅ **PDF, Image, DOCX, PPTX, XLSX** → Markdown / JSON
- ✅ **Формулы** → LaTeX автоматически
- ✅ **Таблицы** → HTML (сохраняется структура)
- ✅ **OCR 109 языков** (включая рукописный текст)
- ✅ Multi-column layouts, cross-page table merging
- ✅ Работает **локально** (100% приватность)
- ✅ Поддерживает CPU и GPU (MPS для macOS)

---

## Быстрый старт

### 🚀 Онлайн (без установки)

**Официальный сайт:** [mineru.net](https://mineru.net)
- Бесплатная регистрация, полный функционал
- Красивый UI, drag-n-drop
- Для тестирования перед локальным деплоем

**Gradio Demo (без регистрации):**
[https://huggingface.co/spaces/openxyu/MinerU](https://huggingface.co/spaces/openxyu/MinerU)
- Быстрый тест 1 файла
- Показывает layout analysis + span visualization

---

### 💻 Локальная установка

**Требования:**
- Python 3.10-3.13
- Min 16GB RAM (32GB рекомендуется)
- CPU: работает, но медленно
- GPU (Volta+): ускоряет в 10-50x
- 20GB дискового пространства

**Установка:**
```bash
pip install --upgrade pip
pip install uv
uv pip install -U "mineru[all]"
```

**Запуск CLI:**
```bash
# С GPU ускорением
mineru -p document.pdf -o ./output

# Только CPU (медленнее, 100% работает)
mineru -p document.pdf -o ./output -b pipeline
```

---

### 🐳 Docker deployment

```bash
docker run -v $(pwd):/workspace \
  opendatalab/mineru:latest \
  mineru -p /workspace/input.pdf -o /workspace/output
```

Или скачай [docker-compose.yml](https://github.com/opendatalab/MinerU/blob/master/docker/docker-compose.yml) из репо.

---

## 🔌 Интеграции

### MCP Server (Cursor, Claude Desktop)

Добавь в `mcp.json` или `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mineru": {
      "command": "uvx",
      "args": ["--from", "mineru", "mineru-mcp"]
    }
  }
}
```

Теперь Claude/Cursor может парсить документы прямо в чате.

---

### LangChain / LlamaIndex

```python
from langchain_community.document_loaders import MinerULoader

loader = MinerULoader("document.pdf")
docs = loader.load()
# docs[0].page_content = чистый Markdown
```

---

### REST API (для self-hosted)

```bash
mineru-api --host 0.0.0.0 --port 8000
```

Endpoint: `POST /file_parse`
- Accept: multipart/form-data
- Returns: JSON с Markdown + метаданными

---

## 🎯 Use Cases для DevForge

### 1. Preparing RAG data

Загрузи PDFs → MinerU → Markdown → embeddings → vector DB
- **Точность:** 86.47 (pipeline) или 95.39 (hybrid high) на OmniDocBench v1.6
- **Результат:** Модель отвечает точно, не галлюцинирует на формулах/таблицах

### 2. Building knowledge base

Преобразуй документацию компании (Word, PDF, PPT) в единый Markdown архив.
- AI агент видит полную картину
- Поиск по содержимому работает правильно
- Версионирование через Git

### 3. Legal / medical document analysis

OCR scanned documents → structured data → AI analysis
- 109 языков OCR
- Поддержка рукописного текста
- Automatic header/footer removal для чистоты

---

## 🔥 Advanced: 3 backends explained

| Backend | Accuracy | Speed | Use case |
|---------|----------|-------|----------|
| `pipeline` | 86.47 | Fast | CPU-only, basic accuracy OK |
| `vlm-engine` | 95.39 | Medium | High accuracy needed, has GPU |
| `hybrid` (default) | 95.30 | Fast | **Best for most cases** |

**Моя рекомендация:** всегда ставь `hybrid` если есть 4GB+ VRAM.

---

## 🐛 Troubleshooting

**"CUDA not available on Windows"**
→ Install CUDA Toolkit 12.4+, reinstall with `--force-reinstall`

**"Out of memory on large PDF"**
→ Upgrade to 3.0+, sliding window mechanism reduces peak memory

**"OCR quality bad on my language"**
→ Check [supported languages](https://github.com/opendatalab/MinerU/blob/master/docs/README_OCR_languages.md), install language pack

---

## 📊 Comparison with alternatives

| Tool | Stars | Accuracy | Languages | Cost |
|------|-------|----------|-----------|------|
| **MinerU** | 73.3k | 95.39 | 109 | Free |
| Marker | 6.3k | ~85 | 12 | Free |
| Unstructured | 9.1k | ~80 | 12 | Paid API |
| Azure AI Document | N/A | ~90 | 90 | $$/page |

**Вывод:** MinerU доминирует в accuracy + cost.

---

## 💡 Pro tips

1. **Batch processing:** используй `mineru-router` для multi-GPU deployments
2. **Image parsing:** переключись на `effort=high` для картинок/charts
3. **Long documents:** 3.0+ sliding window обрабатывает десятки тысяч страниц без разделения
4. **Cache models:** MinerU проверяет локальный кэш перед download — быстрее на reinstall

---

## 🔗 Resources

- [Official Documentation](https://opendatalab.github.io/MinerU/)
- [DeepWiki (AI assistant)](https://deepwiki.com/opendatalab/MinerU)
- [FAQ](https://github.com/opendatalab/MinerU/blob/master/docs/FAQ.md)
- [Discord Community](https://discord.gg/Tdedn9GTXq)

---

## 🎬 TL;DR

**MinerU = best-in-class document parsing для AI workflow.**
- Бесплатно (Apache 2.0 based)
- 73.3k stars, активно развивается
- Работает локально (приватность)
- Integrates with LangChain/Claude/Cursor через MCP

**Начинай с:** [mineru.net](https://mineru.net) → тест → локальный deploy если работает регулярно.

---

*Last updated: 2026-03-29 based on version 3.1.0 docs*
*Reviewed by: DevForge community*
