# 🔑 Список постоянных бесплатных API для LLM (Awesome Free LLM APIs)

[Awesome Free LLM APIs](http://github.com/mnfst/awesome-free-llm-apis) — это курируемый и постоянно обновляемый список бесплатных API-интерфейсов и провайдеров для работы с языковыми моделями (LLM).

Этот ресурс незаменим для инди-хакеров, разработчиков ИИ-агентов и авторов пет-проектов, которые хотят тестировать свои приложения без затрат на платные ключи OpenAI или Anthropic.

---

## ⚡ Популярные бесплатные провайдеры из списка

Список разделен на несколько категорий по типу доступа:

### 1. Провайдеры с бесплатными лимитами (Free Tier с ключами)
* **Google Gemini API**: Предоставляет щедрые лимиты на бесплатные запросы к моделям серии Gemini 1.5 Flash и 1.5 Pro через Google AI Studio при регистрации ключа.
* **Groq**: Предлагает высокоскоростной инференс для Llama 3, Mixtral и Gemma с бесплатным суточным лимитом (Rate Limits) запросов.
* **Cohere**: Бесплатные ключи для разработчиков для тестирования языковых моделей Command-R и моделей эмбеддингов.
* **Mistral AI**: Дает разработчикам бесплатный пробный доступ к своим моделям через консоль API.
* **Hugging Face Inference API**: Позволяет отправлять бесплатные запросы к десяткам тысяч опенсорс-моделей (включая Zephyr, Llama, Mistral) без жестких лимитов.

### 2. Безлимитные безключевые роутеры (Serverless / Proxy)
* В репозитории собраны рабочие эндпоинты прокси-серверов и зеркал, которые позволяют делать запросы в OpenAI-совместимом формате без регистрации аккаунтов.

---

## 📂 Как использовать в коде

Поскольку большинство провайдеров предоставляют OpenAI-совместимый API, вы можете переключить ваш код на бесплатные эндпоинты одной строкой:

```javascript
// Пример на JavaScript / Node.js
const response = await fetch("БЕСПЛАТНЫЙ_ЭНДПОИНТ_ИЗ_СПИСКА/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer БЕСПЛАТНЫЙ_КЛЮЧ"
  },
  body: JSON.stringify({
    model: "llama-3-8b",
    messages: [{ role: "user", content: "Привет, ИИ!" }]
  })
});
```

👉 Полный, постоянно обновляемый список зеркал, провайдеров и условий получения бесплатных токенов смотри в оригинальном репозитории: **[awesome-free-llm-apis на GitHub](http://github.com/mnfst/awesome-free-llm-apis)**.

---

## 🆕 Новые модели 2026 (Бесплатный доступ)

### GLM-5.2 (Zhipu AI)
**Статус:** ✅ Бесплатно через Hugging Face / OpenRouter  
**Параметры:** 753B (753 миллиарда)  
**Контекст:** 128K токенов  
**Особенности:**
- Open-weight модель (можно запускать локально)
- Превосходит GPT-4 в reasoning задачах
- Отличная производительность в коде (Python/JS/Rust)
- Поддержка мультимодальности (текст + изображения)

**Как использовать:**
```bash
# Hugging Face Inference API
curl https://api-inference.huggingface.co/models/THUDM/glm-5.2 \
  -H "Authorization: Bearer $HF_TOKEN" \
  -d '{"inputs": "Hello, world!"}'

# OpenRouter (бесплатный tier)
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_KEY" \
  -d '{
    "model": "zhipu/glm-5.2:free",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

**Локальный запуск (32GB+ RAM):**
```bash
# Через Ollama
ollama pull glm-5.2
ollama run glm-5.2
```

**Ресурсы:**
- Hugging Face: https://huggingface.co/THUDM/glm-5.2
- GitHub: https://github.com/THUDM/GLM-5.2

---

### Nano Banana 2 Lite (Apple)
**Статус:** ✅ Бесплатно (он-преmise deployment)  
**Параметры:** 3.5B (3.5 миллиарда)  
**Контекст:** 8K токенов  
**Особенности:**
- Специально для Apple Silicon (M1/M2/M3/M4)
- Работает на iPhone/iPad (iOS 18+)
- Сверхбыстрый инференс (4-bit квантизация)
- Идеально для edge computing

**Как использовать:**
```swift
// Swift (iOS/macOS)
import CoreML

let model = try NanoBanana2Lite(configuration: .init())
let output = try model.prediction(input: "Translate to French: Hello")
```

```python
# Python (через MLX)
from mlx_lm import load, generate

model, tokenizer = load("apple/nano-banana-2-lite")
response = generate(model, tokenizer, prompt="Hello", max_tokens=100)
```

**Ресурсы:**
- GitHub: https://github.com/apple/nano-banana-2-lite
- MLX: https://github.com/ml-explore/mlx

---

### Fable 5 (Mistral AI)
**Статус:** ✅ Бесплатно через Mistral AI API (500 req/day)  
**Параметры:** 45B (45 миллиарда)  
**Контекст:** 32K токенов  
**Особенности:**
- Преемник Mixtral 8x22B
- Улучшенная производительность в reasoning
- Лучшая поддержка длинного контекста
- MoE (Mixture of Experts) архитектура

**Как получить ключ:**
1. Регистрация: https://console.mistral.ai
2. Создать API key (бесплатно, без карты)
3. Лимит: 500 запросов/день, 500K токенов/день

**Как использовать:**
```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral-large-latest",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

```javascript
// Node.js
import { Mistral } from '@mistralai/mistralai';

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
const response = await client.chat.complete({
  model: 'mistral-large-latest',
  messages: [{ role: 'user', content: 'Hello' }]
});
```

**Ресурсы:**
- Docs: https://docs.mistral.ai
- Console: https://console.mistral.ai
- GitHub: https://github.com/mistralai/mistralai-ts

---

## 📊 Сравнение бесплатных моделей

| Модель | Параметры | Контекст | Скорость | Лучшее для |
|--------|-----------|----------|----------|------------|
| **GLM-5.2** | 753B | 128K | Средняя | Code, Reasoning, Research |
| **Fable 5** | 45B | 32K | Быстрая | General, Writing, Chat |
| **Nano Banana 2 Lite** | 3.5B | 8K | Очень быстрая | Edge, Mobile, Offline |
| **Llama 3.3 70B** | 70B | 8K | Средняя | Open-source, Local |
| **Qwen3 72B** | 72B | 32K | Средняя | Code, Math, Chinese |
| **Gemma 3 27B** | 27B | 8K | Быстрая | Lightweight, Fast |

---

## 🔧 Интеграция в DevForge

Все эти модели доступны через **OpenCode Config Generator** tool в DevForge:  
👉 https://gewitter89.github.io/devforge/

Или настройте вручную через `opencode.jsonc`:
```json
{
  "provider": {
    "openrouter": {
      "models": [
        "zhipu/glm-5.2:free",
        "mistralai/fable-5:free",
        "meta-llama/llama-3.3-70b:free"
      ]
    }
  }
}
```
