# ⚡ ECOS Marketplace - Quick Start Guide

> Запустите проект за 5 минут!

---

## 🚀 Быстрый старт

### 1. Клонирование

```bash
git clone https://github.com/BitOpenCode/MRKT.git
cd MRKT
```

### 2. Backend Setup

```bash
cd backend

# Создать venv и активировать
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Создать .env
echo 'FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=dev-secret-key
DATABASE_URL=sqlite:///marketplace.db
BITCOIN_API_URL=https://blockstream.info/api
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173' > .env

# Создать БД и данные
python seed_data.py

# Запустить сервер
python app.py
```

✅ Backend running on http://localhost:5001

### 3. Frontend Setup (Новый терминал)

```bash
cd frontend

# Установить зависимости
npm install

# Создать .env
echo 'VITE_API_URL=http://localhost:5001
VITE_TON_MANIFEST_URL=http://localhost:3001/tonconnect-manifest.json
VITE_ENV=development' > .env

# Запустить dev server
npm run dev
```

✅ Frontend running on http://localhost:5173

### 4. Открыть браузер

Перейти на http://localhost:5173

### 5. Войти в систему

- Username: `alice`
- Password: `password123`

---

## 🎮 Тестовые пользователи

| Username | Password    | ECOS Points | USDT | Contracts |
|----------|------------|-------------|------|-----------|
| alice    | password123| 1000⭐      | $25  | 6         |
| charlie  | password123| 2000⭐      | $100 | 4         |

---

## 📁 Структура

```
MRKT/
├── backend/          # Flask API
│   ├── api/         # Endpoints
│   ├── models/      # Database models
│   └── app.py       # Main app
├── frontend/         # React app
│   ├── src/
│   │   ├── pages/   # Pages
│   │   ├── components/  # Components
│   │   └── services/    # API calls
│   └── package.json
└── README.md
```

---

## 🐛 Troubleshooting

### Backend не запускается?

```bash
# Проверьте Python версию
python3 --version  # Должно быть 3.9+

# Переустановите зависимости
pip install -r requirements.txt
```

### Frontend не запускается?

```bash
# Проверьте Node версию
node --version  # Должно быть 18+

# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

### Порт занят?

```bash
# Убить процесс на порту 5001 (Backend)
lsof -ti:5001 | xargs kill -9

# Убить процесс на порту 5173 (Frontend)
lsof -ti:5173 | xargs kill -9
```

### Login не работает?

1. Пересоздайте БД: `python seed_data.py`
2. Обновите страницу (Ctrl+R)
3. Используйте `password123` (lowercase!)

### Контракты не отображаются?

1. Очистите localStorage:
   ```javascript
   // В консоли браузера (F12)
   localStorage.clear()
   location.reload()
   ```
2. Заново войдите

---

## 📚 Полная документация

- 📖 [README.md](./README.md) - Полное описание
- 📦 [INSTALLATION.md](./INSTALLATION.md) - Подробная установка
- 📊 [FEATURES_STATUS.md](./FEATURES_STATUS.md) - Статус функций

