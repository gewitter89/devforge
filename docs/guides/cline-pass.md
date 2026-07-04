# 🛠️ Настройка Cline CLI с поддержкой ClinePass и сторонних LLM моделей

При использовании официального инструмента командной строки **Cline CLI** разработчики часто сталкиваются с тем, что по умолчанию биллинг привязан к стандартной кредитной системе аккаунта. Это блокирует использование безлимитных подписок (например, **ClinePass**) и доступ к альтернативным моделям (DeepSeek V4 Pro, GLM-5.2, Kimi и др.) напрямую через CLI.

Данное руководство объясняет разницу в механизмах авторизации и содержит пошаговую инструкцию по обходу ограничений.

---

## 📊 Кредиты vs ClinePass: В чем разница?

| Параметр             | Кредитная система (стандартная)     | Подписка ClinePass                           |
| :------------------- | :---------------------------------- | :------------------------------------------- |
| **Тип оплаты**       | Pay-as-you-go (списание по токенам) | Фиксированная подписка (безлимит)            |
| **Доступные модели** | Базовые (Claude 3.5 Sonnet, GPT-4o) | Расширенные (DeepSeek V4, GLM-5.2, Kimi, Yi) |
| **CLI "из коробки"** | ✅ Работает (через дефолтный логин) | ❌ Требуется подмена API-эндпоинта           |

> [!WARNING]
> Без выполнения подмены прокси-сервера или переопределения переменных окружения официальный CLI будет списывать ваши платные кредиты, даже если у вас активна подписка ClinePass.

---

## ⚡ Инструкция по настройке

### Шаг 1: Получение API-ключа Cline

1. Перейдите в личный кабинет: [app.cline.bot → API Keys](https://app.cline.bot/dashboard/account?tab=api-keys).
2. Сгенерируйте новый токен доступа и скопируйте его.

### Шаг 2: Настройка переменных окружения CLI

Для работы Cline CLI через шлюз подписки необходимо принудительно изменить базовый URL-адрес запросов к API.

#### Вариант A: Для macOS / Linux (`.bashrc` / `.zshrc`)

Добавьте в ваш конфигурационный файл оболочки следующие строки:

```bash
export CLINE_API_KEY="ваш_api_ключ_из_шага_1"
export CLINE_API_BASE="https://api.cline.bot/v1" # Либо специализированный эндпоинт вашего провайдера подписки
```

Примените настройки:

```bash
source ~/.zshrc
```

#### Вариант B: Для Windows (PowerShell)

Выполните в терминале или добавьте в профиль:

```powershell
[System.Environment]::SetEnvironmentVariable('CLINE_API_KEY', 'ваш_api_ключ_из_шага_1', 'User')
[System.Environment]::SetEnvironmentVariable('CLINE_API_BASE', 'https://api.cline.bot/v1', 'User')
```

### Шаг 3: Проверка и запуск

После установки переменных окружения перезапустите ваш CLI агент. Теперь запросы будут идти в обход стандартной тарификации напрямую через пул моделей **ClinePass**, открывая доступ к дешевым и быстрым альтернативным LLM-моделям (включая китайские бенчмарки GLM-5.2 и Kimi).

---

## 🛠️ Подключение к Crush CLI (и другим OpenAI-совместимым утилитам)

Вы также можете использовать подписку **ClinePass** в любых сторонних консольных клиентах, поддерживающих кастомные эндпоинты (OpenAI-compat).

### 1. Настройка для Crush CLI

Откройте файл конфигурации `~/.config/crush/crush.json` и добавьте в блок `"providers"` конфигурацию провайдера `cline`:

```json
{
  "providers": {
    "cline": {
      "type": "openai-compat",
      "name": "ClinePass",
      "base_url": "https://api.cline.bot/api/v1",
      "api_key": "ваш_api_ключ_от_cline_sk-...",
      "models": [
        { "id": "cline-pass/glm-5.2", "name": "GLM-5.2" },
        { "id": "cline-pass/kimi-k2.7-code", "name": "Kimi K2.7 Code" },
        { "id": "cline-pass/kimi-k2.6", "name": "Kimi K2.6" },
        { "id": "cline-pass/deepseek-v4-pro", "name": "DeepSeek V4 Pro" },
        { "id": "cline-pass/deepseek-v4-flash", "name": "DeepSeek V4 Flash" },
        { "id": "cline-pass/mimo-v2.5", "name": "MiMo-V2.5" },
        { "id": "cline-pass/mimo-v2.5-pro", "name": "MiMo-V2.5-Pro" },
        { "id": "cline-pass/minimax-m3", "name": "MiniMax M3" },
        { "id": "cline-pass/qwen3.7-max", "name": "Qwen3.7 Max" },
        { "id": "cline-pass/qwen3.7-plus", "name": "Qwen3.7 Plus" }
      ]
    }
  }
}
```

_Примечание: Поля `type` ("openai-compat") и массив `models` с парами `id/name` являются обязательными._  
После редактирования перезапустите Crush CLI и переключите провайдер командой `/providers` → **ClinePass**.

---

### 2. Параметры для любого другого OpenAI-совместимого CLI

Если ваш клиент настраивается через форму или плоский конфигурационный файл, укажите следующие параметры:

- **Provider type**: `openai-compat` / `openai`
- **Base URL**: `https://api.cline.bot/api/v1`
- **API key**: `sk-...` (ваш API-ключ)
- **Список моделей для ручного ввода**:
  - `cline-pass/glm-5.2` (GLM-5.2)
  - `cline-pass/kimi-k2.7-code` (Kimi K2.7 Code)
  - `cline-pass/kimi-k2.6` (Kimi K2.6)
  - `cline-pass/deepseek-v4-pro` (DeepSeek V4 Pro)
  - `cline-pass/deepseek-v4-flash` (DeepSeek V4 Flash)
  - `cline-pass/mimo-v2.5` (MiMo-V2.5)
  - `cline-pass/mimo-v2.5-pro` (MiMo-V2.5-Pro)
  - `cline-pass/minimax-m3` (MiniMax M3)
  - `cline-pass/qwen3.7-max` (Qwen3.7 Max)
  - `cline-pass/qwen3.7-plus` (Qwen3.7 Plus)

---

### 3. Интеграция с OpenCode CLI

Чтобы использовать **ClinePass** в OpenCode, откройте ваш конфигурационный файл `~/.config/opencode/opencode.json` (или `opencode.jsonc`) и добавьте провайдера `clinepass` в секцию `"provider"`:

```json
{
  "provider": {
    "clinepass": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "ClinePass",
      "options": {
        "apiKey": "ваш_api_ключ_sk-...",
        "baseURL": "https://api.cline.bot/api/v1"
      },
      "models": {
        "cline-pass/glm-5.2": { "name": "GLM-5.2" },
        "cline-pass/kimi-k2.7-code": { "name": "Kimi K2.7 Code" },
        "cline-pass/kimi-k2.6": { "name": "Kimi K2.6" },
        "cline-pass/deepseek-v4-pro": { "name": "DeepSeek V4 Pro" },
        "cline-pass/deepseek-v4-flash": { "name": "DeepSeek V4 Flash" },
        "cline-pass/mimo-v2.5": { "name": "MiMo-V2.5" },
        "cline-pass/mimo-v2.5-pro": { "name": "MiMo-V2.5-Pro" },
        "cline-pass/minimax-m3": { "name": "MiniMax M3" },
        "cline-pass/qwen3.7-max": { "name": "Qwen3.7 Max" },
        "cline-pass/qwen3.7-plus": { "name": "Qwen3.7 Plus" }
      }
    }
  }
}
```

> [!IMPORTANT]
> Для правильного распознавания обязательно укажите пакет `"npm": "@ai-sdk/openai-compatible"` и перечислите ключи моделей в блоке `"models"`, иначе команда `/models` не выведет нового провайдера.

После сохранения файла выполните в терминале команду `/models` и переключитесь на провайдер **ClinePass**.
