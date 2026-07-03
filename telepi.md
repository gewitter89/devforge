# 🤖 TelePI — Телеграм-бот для PI CLI (Автономный ИИ-разработчик в мессенджере)

[TelePI](https://github.com/futurelab-studio/telepi) позволяет связать ваш локальный или удаленный автономный CLI-агент разработки **PI (Earendil Works)** с ботом в Telegram. 

С его помощью можно отправлять голосовые или текстовые команды ИИ-агенту прямо из мессенджера, получать от него готовые куски кода, отчеты и управлять файловой системой удаленно.

---

## 🛠️ Способ 1: Установка через CLI-инструмент `telepi`

### 1. Системные требования и зависимости
Для работы потребуется установленный Node.js (v18+) и глобальный пакет `telepi`:

```bash
npm install -g @futurelab-studio/telepi
```

### 2. Создание бота в Telegram
1. Откройте диалог с [@BotFather](https://t.me/BotFather) в Telegram.
2. Выполните команду `/newbot`, задайте имя и логин для бота и скопируйте полученный **Bot Token** (вид `123:ABC`).
3. Откройте [@userinfobot](https://t.me/userinfobot) и скопируйте ваш числовой идентификатор пользователя (**User ID**). Бот будет принимать команды только от этого ID из соображений безопасности.

### 3. Первоначальная настройка и привязка проектов
Запустите интерактивный скрипт настройки, передав токен, ваш ID и директорию, в которой лежат ваши проекты:

```bash
telepi setup "<токен_бота>" "<ваш_user_id>" "/путь/к/папке/проектов"

# Пример запуска на Linux:
# telepi setup "123456:ABC-DEF" "857055696" "/home/user/projects"
```

---

## 🎤 Транскрибация голосовых сообщений (Офлайн-распознавание речи)

Чтобы надиктовывать ИИ-агенту команды голосом без отправки данных на серверы Telegram или сторонние API, настройте локальное распознавание на базе **Sherpa-ONNX** и модели **Parakeet** от Nvidia.

### 1. Установка необходимых библиотек
Установите утилиту конвертации медиафайлов `ffmpeg` и глобальный модуль Node.js:

```bash
# Для Ubuntu / Debian
sudo apt update && sudo apt install ffmpeg -y

# Глобальная библиотека для Node.js
npm install -g sherpa-onnx-node
```

### 2. Загрузка легковесной модели распознавания Parakeet (~650MB)
Модель загружается и распаковывается в локальную папку данных `telepi`:

```bash
cd /tmp
# Скачиваем модель Parakeet TDT 0.6b
curl -LO https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2
tar xf sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2

# Создаем папку и перемещаем файлы
mkdir -p ~/.local/share/telepi/models
mv sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8 ~/.local/share/telepi/models/
```

### 3. Привязка модели к конфигурационному файлу
Добавьте пути к модели в файл окружения `~/.config/telepi/config.env`:

```env
SHERPA_ONNX_MODEL_DIR=/home/YOUR_USER/.local/share/telepi/models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8
SHERPA_ONNX_NUM_THREADS=4
```
*(Не забудьте заменить `YOUR_USER` на ваше реальное имя пользователя в Linux).*

После настройки перезапустите бота. Теперь при отправке голосового сообщения бот автоматически переведет его в текст и отправит команду в PI CLI.

---

## 🔌 Способ 2: Готовое расширение `pi-telegram`

Если вы хотите использовать встроенные плагины экосистемы PI, вы можете установить официальный экстеншн напрямую:
👉 **[pi-telegram GitHub Repository](https://github.com/llblab/pi-telegram)**

Установка плагина выполняется встроенными средствами PI CLI:
```bash
pi extension install https://github.com/llblab/pi-telegram
```
Конфигурация токена бота и разрешенных ID пользователей задается внутри интерфейса расширений вашего агента.
