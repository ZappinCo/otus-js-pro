
## Задачи:

Инициализировать проект и подключить сборщик (Vite/Webpack/Rollup) с dev‑сервером.
Настроить сборку HTML, CSS и JS, вынести исходники в src/, сборку в dist/.
Подключить линтеры (ESLint/Prettier) и настроить их запуск в CI.
Добавить скрипты npm для dev/build/preview, приложить краткую инструкцию в README.

## Проверки

Перед коммитом запускается lint-fix.
При pull-request запускается lint-fix и деплой на github pages.

## Команды

```bash
npm install      # установка зависимостей
npm run dev      # dev-сервер Vite
npm run build    # production-сборка в dist/
npm run preview  # предпросмотр собранного dist/
npm run lint     # проверка ESLint
npm run lint:fix # автоисправление ESLint


