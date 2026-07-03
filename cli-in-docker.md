---
name: cli-in-docker
description: Use when the user needs to containerize any CLI tool (AI agent or not) in Docker with external secrets/config/workspace management, sandbox CLI agents against host filesystem, or isolate AI from the host machine. Covers Dockerfile, entrypoint.sh, docker-compose.yml, .env, and runtime constraints for AI agents inside containers.
user-invocable: true
---

# CLI в Docker: спецификация контейнеризации для AI-агента

Изолировать любой CLI-based AI-агент (opencode, claude-code, crush, cursor-agent
и т.д.) внутри Docker-песочницы. Три внешних точки управления: секреты, конфиг,
рабочая директория. За их пределы агент выходить НЕ ДОЛЖЕН.

Референсная реализация: `/home/admin/opencode-docker/`.

## Архитектура

```
Хост                                Контейнер
────                                ─────────
.env ──env_file──→                  entrypoint → auth.json
./workspace ──volume──→             /home/coder/workspace
./config.json ──(volume, опционально)──→ /home/coder/.config/.../config.json
```

## Dockerfile — ДОЛЖЕН

```
FROM <базовый-образ>                # ДОЛЖЕН соответствовать рантайму CLI
                                    #   node:lts-slim, python:3.12-slim, ubuntu:24.04
RUN <установка CLI>                 # npm install -g, pip install, curl ... | sh
COPY <шаблон-конфига> <путь>        # ДОЛЖЕН быть шаблоном — без реальных ключей
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
RUN useradd -m -s /bin/bash coder   # НЕ-root обязателен
USER coder
WORKDIR /home/coder/workspace        # ДОЛЖЕН совпадать с точкой монтирования
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["<cli-бинарник>"]
```

### Dockerfile — ЗАПРЕЩЕНО

- Запускать CMD/ENTRYPOINT от root
- Вшивать реальные API-ключи, токены, пароли в образ
- Ставить ssh, sudo, или сетевые утилиты кроме тех, что требует сам CLI
- Использовать `ADD` для внешних URL без явной необходимости (лучше `COPY`)

## entrypoint.sh — ДОЛЖЕН

```bash
#!/bin/bash
set -euo pipefail

# Правило 1: инжект секретов из env в ожидаемый файл
if [ -n "${API_KEY:-}" ]; then
    mkdir -p "$(dirname "$AUTH_FILE")"
    cat > "$AUTH_FILE" << JSONEOF
{"provider": {"key": "$API_KEY"}}
JSONEOF
    chmod 600 "$AUTH_FILE"
fi

# Правило 2: скопировать шаблон конфига ОДИН раз, не перезаписывать
if [ ! -f "$CONFIG_DST" ]; then
    cp "$CONFIG_SRC" "$CONFIG_DST"
fi

# Правило 3: передать управление CLI
exec "$@"
```

- `set -euo pipefail` — первой строкой
- `chmod 600` — на любом файле с секретами
- `exec "$@"` — последней строкой, без фоновых процессов
- Копировать конфиг только при первом запуске (защита `[ ! -f ]`)

### entrypoint.sh — ЗАПРЕЩЕНО

- Хардкодить секреты
- Логировать секреты в stdout/stderr
- Писать файлы за пределами `$HOME` и примонтированной рабочей директории
- Оставлять фоновые процессы после `exec`

## docker-compose.yml — ДОЛЖЕН

```yaml
services:
  agent:
    build: .
    stdin_open: true        # обязательно для интерактивных CLI
    tty: true               # обязательно для интерактивных CLI
    env_file: .env           # все секреты в одном файле
    volumes:
      - ${WORKSPACE:-./workspace}:/home/coder/workspace
    environment:
      - API_KEY=${API_KEY}
    restart: "no"            # умирает с сессией
```

### docker-compose.yml — ЗАПРЕЩЕНО

- Монтировать `docker.sock`
- `network_mode: host`
- `privileged: true`
- Монтировать `/`, `/home`, `/etc`, `/var/run` или системные директории хоста
- `pid: host`

## .env — ДОЛЖЕН

```bash
# .env — НИКОГДА НЕ КОММИТИТЬ
API_KEY=sk-...
WORKSPACE=./my-project
```

Быть в `.gitignore`. Иметь `.env.example` как закоммиченный шаблон с пустыми значениями.

## .gitignore — ДОЛЖЕН

```
.env
workspace/
```

## Правила рантайма для AI-агента внутри контейнера

Работая внутри этого контейнера, AI-агент:

### ДОЛЖЕН

- Считать `/home/coder/workspace` единственной изменяемой директорией
- Читать секреты из ожидаемого инструментом пути (auth/config)
- Считать, что сеть доступна только до API-эндпоинта, с которым работает CLI
- Завершаться — не оставлять фоновых процессов

### ЗАПРЕЩЕНО

- Читать/писать файлы вне `/home/coder/workspace` и `$HOME/.config`
- Выполнять `curl`, `wget` или сетевые утилиты против внутренних сервисов хоста
- Считать файловую систему хоста доступной
- Ставить системные пакеты в рантайме (`apt`, `pip`, `npm install -g`)

## Адаптация под другой CLI

Заменить ровно эти переменные — и проверить каждый путь по официальной документации:

| Переменная       | opencode (пример)                                | Ваш CLI     |
|------------------|--------------------------------------------------|-------------|
| `BASE_IMAGE`     | `node:lts-slim`                                  |             |
| `INSTALL_CMD`    | `npm install -g opencode-ai`                     |             |
| `AUTH_FILE`      | `$HOME/.local/share/opencode/auth.json`          |             |
| `CONFIG_SRC`     | `$HOME/opencode.json`                            |             |
| `CONFIG_DST`     | `$HOME/.config/opencode/opencode.json`           |             |
| `API_KEY_ENV`    | `OPENCODE_API_KEY`                               |             |
| `CLI_BINARY`     | `opencode`                                       |             |

**ДОЛЖЕН** сверить каждый путь с документацией тула. НЕ гадать.

## Запуск

```bash
cp .env.example .env
docker compose build
docker compose run --rm agent
```

## Три причины, почему это нужно

1. **Файловая изоляция.** Контейнер видит только `volumes:`. Нет доступа к
   `~/.ssh`, `~/.aws`, `/etc/passwd`, исходникам других проектов. AI-агент
   не может прочитать личные файлы хоста.

2. **Песочница для процессов.** CLI работает под `coder` (не root), без `sudo`,
   без `ssh`, без `docker.sock`. `rm -rf /` убьёт контейнер — не хост.

3. **Секреты не живут в образе.** Ключ прилетает из `.env` на старте через
   entrypoint. В образе — только шаблон конфига. Скомпрометирован образ ≠
   скомпрометированы ключи.

Коротко: AI-агент получает ровно тот периметр, который ему нарисовали.
