# 📦 ECOS Marketplace - Полная инструкция по установке и запуску

> Подробное руководство для локального запуска проекта

---

## 📋 Содержание

1. [Системные требования](#системные-требования)
2. [Клонирование репозитория](#клонирование-репозитория)
3. [Установка Backend](#установка-backend)
4. [Установка Frontend](#установка-frontend)
5. [Запуск проекта](#запуск-проекта)
6. [Проверка работы](#проверка-работы)
7. [Troubleshooting](#troubleshooting)
8. [Production deployment](#production-deployment)

---

## 1️⃣ Системные требования

### Обязательно:
- **Python 3.9 или выше**
- **Node.js 18 или выше**
- **npm 9 или yarn 1.22+**
- **Git**

### Опционально (для production):
- PostgreSQL 14+
- Redis 7+
- Nginx

### Проверка версий:

```bash
# Python
python3 --version
# Должно быть: Python 3.9.x или выше

# Node.js
node --version
# Должно быть: v18.x.x или выше

# npm
npm --version
# Должно быть: 9.x.x или выше

# Git
git --version
# Любая современная версия
```

---

## 2️⃣ Клонирование репозитория

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/BitOpenCode/MRKT.git

# 2. Перейдите в директорию проекта
cd MRKT

# 3. Проверьте структуру
ls -la
# Вы должны увидеть папки: backend/, frontend/, README.md и т.д.
```

---

## 3️⃣ Установка Backend

### Шаг 1: Перейдите в директорию backend

```bash
cd backend
```

### Шаг 2: Создайте виртуальное окружение Python

**На macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**На Windows:**
```cmd
python -m venv venv
venv\Scripts\activate
```

После активации вы должны увидеть `(venv)` в начале строки терминала.

### Шаг 3: Обновите pip

```bash
pip install --upgrade pip
```

### Шаг 4: Установите зависимости

```bash
pip install -r requirements.txt
```

**Установка займет 2-5 минут.** Вы увидите установку пакетов:
- Flask
- SQLAlchemy
- Flask-CORS
- И другие...

### Шаг 5: Создайте .env файл

**Вариант А: Автоматически (рекомендуется)**

```bash
cat > .env << 'EOF'
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production
DATABASE_URL=sqlite:///marketplace.db
BITCOIN_API_URL=https://blockstream.info/api
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173
EOF
```

**Вариант Б: Вручную**

Создайте файл `.env` в папке `backend/` и вставьте:

```env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production
DATABASE_URL=sqlite:///marketplace.db
BITCOIN_API_URL=https://blockstream.info/api
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173
```

### Шаг 6: Создайте базу данных и заполните тестовыми данными

```bash
python seed_data.py
```

**Вы увидите:**
```
Clearing database...
Creating users...

📝 Test Users (password for all: password123):
------------------------------------------------------------
  Username: alice      | Level: 3 | ECOS:  1000⭐ | USDT: $25.5
  Username: bob        | Level: 4 | ECOS:  1500⭐ | USDT: $45.0
  Username: charlie    | Level: 5 | ECOS:  2000⭐ | USDT: $100.0
  ...

✅ Database seeded successfully!
Created 10 users
Created 27 contracts
Created 15 marketplace listings
Created 10 lottery tickets
Created 1 lottery draw
```

### Шаг 7: Запустите Backend сервер

```bash
python app.py
```

**Вы увидите:**
```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://127.0.0.1:5001
```

✅ **Backend запущен на http://localhost:5001**

**Оставьте этот терминал открытым!**

---

## 4️⃣ Установка Frontend

### Шаг 1: Откройте НОВЫЙ терминал

**НЕ ЗАКРЫВАЙТЕ терминал с backend!**

### Шаг 2: Перейдите в директорию frontend

```bash
cd /путь/к/MRKT/frontend
```

### Шаг 3: Установите зависимости

**С npm:**
```bash
npm install
```

**Или с yarn:**
```bash
yarn install
```

**Установка займет 3-7 минут.** Вы увидите установку:
- React
- Vite
- Tailwind CSS
- И другие...

### Шаг 4: Создайте .env файл

**Вариант А: Автоматически (рекомендуется)**

```bash
cat > .env << 'EOF'
VITE_API_URL=http://localhost:5001
VITE_TON_MANIFEST_URL=http://localhost:3001/tonconnect-manifest.json
VITE_ENV=development
EOF
```

**Вариант Б: Вручную**

Создайте файл `.env` в папке `frontend/` и вставьте:

```env
VITE_API_URL=http://localhost:5001
VITE_TON_MANIFEST_URL=http://localhost:3001/tonconnect-manifest.json
VITE_ENV=development
```

### Шаг 5: Запустите Frontend dev server

```bash
npm run dev
```

**Вы увидите:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

✅ **Frontend запущен на http://localhost:5173**

---

## 5️⃣ Запуск проекта

У вас должны быть **2 открытых терминала**:

### Терминал 1: Backend (Python/Flask)
```
(venv) user@mac backend % python app.py
 * Running on http://127.0.0.1:5001
```

### Терминал 2: Frontend (Node/Vite)
```
user@mac frontend % npm run dev
  ➜  Local:   http://localhost:5173/
```

---

## 6️⃣ Проверка работы

### Шаг 1: Откройте браузер

Перейдите по адресу: **http://localhost:5173**

### Шаг 2: Проверьте главную страницу

Вы должны увидеть:
- Логотип "ECOS" в левом верхнем углу
- Иконки корзины, уведомлений, темы
- Кнопку "Connect" (TON кошелек)
- Нижнюю навигацию: Home, Market, Portfolio, Lottery, Profile

### Шаг 3: Войдите в систему

1. Перейдите на страницу **Profile** (иконка человека внизу)
2. Нажмите кнопку **"Login"**
3. Введите тестовые данные:
   - **Username:** `alice`
   - **Password:** `password123`
4. Нажмите **"Login"**

✅ Вы должны увидеть профиль Alice с:
- ECOS Points: 1000⭐
- USDT Balance: $25.5
- Level: 3

### Шаг 4: Проверьте Portfolio

1. Перейдите на страницу **Portfolio**
2. Вы должны увидеть контракты Alice:
   - Unlisted: 2 контракта (MC-PA3000, MC-PA3001)
   - Listed: несколько контрактов на продаже

### Шаг 5: Проверьте Marketplace

1. Перейдите на страницу **Market**
2. Вы должны увидеть список контрактов на продажу
3. Попробуйте:
   - Фильтрацию (Smart Contracts / ASICs)
   - Сортировку (по цене, хэшрейту)
   - Поиск
   - Добавление в корзину

### Шаг 6: Проверьте Lottery

1. Перейдите на страницу **Lottery**
2. Проверьте вкладки:
   - **Buy** - покупка билетов
   - **Draw** - текущий розыгрыш
   - **My Tickets** - ваши билеты
   - **History** - история розыгрышей

### Шаг 7: Проверьте темы

1. Нажмите на иконку **солнца/луны** в Header
2. Тема должна переключиться (темная ↔ светлая)
3. Все элементы должны корректно адаптироваться

---

## 7️⃣ Troubleshooting (Решение проблем)

### Проблема 1: Backend не запускается

**Ошибка:** `ModuleNotFoundError: No module named 'flask'`

**Решение:**
```bash
# Убедитесь что виртуальное окружение активировано
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Переустановите зависимости
pip install -r requirements.txt
```

---

### Проблема 2: Frontend не запускается

**Ошибка:** `Error: Cannot find module 'vite'`

**Решение:**
```bash
# Удалите node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Переустановите зависимости
npm install
```

---

### Проблема 3: CORS ошибки в браузере

**Ошибка в консоли:** `Access to XMLHttpRequest ... blocked by CORS policy`

**Решение:**

1. Проверьте `.env` файл в backend:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173
```

2. Убедитесь что frontend запущен на порту 5173:
```bash
# Проверьте вывод в терминале frontend
  ➜  Local:   http://localhost:5173/
```

3. Перезапустите backend:
```bash
# Ctrl+C в терминале backend, затем:
python app.py
```

---

### Проблема 4: База данных пустая / нет контрактов

**Проблема:** После входа Portfolio пустой или на Marketplace нет контрактов

**Решение:**

1. Пересоздайте базу данных:
```bash
cd backend
source venv/bin/activate

# Удалите старую БД
rm -f instance/marketplace.db

# Создайте новую с данными
python seed_data.py
```

2. Обновите страницу в браузере (Ctrl+R / Cmd+R)

3. Заново войдите в систему

---

### Проблема 5: Login не работает

**Ошибка:** "User not found" или "Invalid password"

**Решение:**

1. Проверьте что используете **правильные данные:**
   - Username: `alice` (lowercase!)
   - Password: `password123` (lowercase!)

2. Проверьте что БД создана:
```bash
ls backend/instance/
# Должен быть файл: marketplace.db
```

3. Если БД нет - выполните:
```bash
cd backend
python seed_data.py
```

---

### Проблема 6: Порт занят

**Ошибка:** `Address already in use` или `EADDRINUSE`

**Решение:**

**Backend (порт 5001):**
```bash
# macOS/Linux
lsof -ti:5001 | xargs kill -9

# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

**Frontend (порт 5173):**
```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

Затем перезапустите серверы.

---

### Проблема 7: Изменения не отображаются

**Решение:**

1. **Backend:** Перезапустите Flask (Ctrl+C, затем `python app.py`)
2. **Frontend:** Vite auto-reload должен работать, но если нет:
   ```bash
   # Ctrl+C, затем
   npm run dev
   ```
3. **Браузер:** Жесткий reload (Ctrl+Shift+R / Cmd+Shift+R)
4. **Очистка кэша:** Developer Tools → Application → Clear Storage

---

### Проблема 8: Контракты Alice не отображаются

**Причина:** Старая сессия после пересоздания БД

**Решение:**

1. **Вариант A:** Обновите страницу - автоматический logout
2. **Вариант B:** Очистите localStorage:
   ```javascript
   // В консоли браузера (F12)
   localStorage.clear()
   location.reload()
   ```
3. Заново войдите как `alice` / `password123`

---

### Проблема 9: Python версия старая

**Ошибка:** `ERROR: This package requires Python >=3.9`

**Решение:**

1. Установите Python 3.9+:
   - **macOS:** `brew install python@3.9`
   - **Ubuntu:** `sudo apt install python3.9`
   - **Windows:** Скачайте с [python.org](https://python.org)

2. Пересоздайте виртуальное окружение:
```bash
python3.9 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

### Проблема 10: Node версия старая

**Ошибка:** `error ... requires Node.js >=18`

**Решение:**

1. Обновите Node.js:
   - **macOS:** `brew install node@18`
   - **Ubuntu:** Используйте [nvm](https://github.com/nvm-sh/nvm)
   - **Windows:** Скачайте LTS с [nodejs.org](https://nodejs.org)

2. Проверьте версию:
```bash
node --version
# Должно быть v18.x.x или выше
```

3. Переустановите зависимости:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 8️⃣ Production Deployment

### Для Backend (Flask)

1. **Используйте PostgreSQL вместо SQLite:**

```env
# .env для production
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=GENERATE_RANDOM_SECRET_KEY_HERE
DATABASE_URL=postgresql://username:password@localhost:5432/ecos_marketplace
BITCOIN_API_URL=https://blockstream.info/api
CORS_ORIGINS=https://yourdomain.com
```

2. **Установите Gunicorn:**
```bash
pip install gunicorn
```

3. **Запустите через Gunicorn:**
```bash
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

4. **Настройте Nginx как reverse proxy:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Для Frontend (React/Vite)

1. **Build production версии:**
```bash
npm run build
```

2. **Deploy на Vercel:**
```bash
npm i -g vercel
vercel deploy --prod
```

3. **Или на Netlify:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

4. **Обновите .env.production:**
```env
VITE_API_URL=https://api.yourdomain.com
VITE_TON_MANIFEST_URL=https://yourdomain.com/tonconnect-manifest.json
VITE_ENV=production
```

---

## 9️⃣ Полезные команды

### Backend

```bash
# Активировать venv
source venv/bin/activate

# Запустить сервер
python app.py

# Пересоздать БД
python seed_data.py

# Миграции (если используете)
flask db migrate -m "message"
flask db upgrade

# Проверить зависимости
pip list

# Обновить зависимости
pip install --upgrade -r requirements.txt
```

### Frontend

```bash
# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Build для production
npm run build

# Preview production build
npm run preview

# Lint код
npm run lint

# Обновить зависимости
npm update
```

---

## 🎉 Готово!

Теперь у вас **полностью рабочий ECOS Marketplace**!

### Что делать дальше:

1. ✅ **Explore** - изучите все страницы и функции
2. ✅ **Test** - протестируйте с разными пользователями
3. ✅ **Customize** - адаптируйте под свои нужды
4. ✅ **Deploy** - разверните в production
5. ✅ **Share** - поделитесь с сообществом


