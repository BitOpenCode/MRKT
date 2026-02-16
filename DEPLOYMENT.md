# 🚀 Руководство по развертыванию

## Содержание
- [Локальная разработка](#локальная-разработка)
- [Production развертывание](#production-развертывание)
- [Telegram Mini App](#telegram-mini-app)
- [TON Smart Contracts](#ton-smart-contracts)

## Локальная разработка

### Требования
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+ (или SQLite для разработки)
- Redis 6+

### 1. Клонирование репозитория

```bash
git clone <your-repo-url>
cd Marketplace
```

### 2. Установка зависимостей

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Настройка переменных окружения

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Отредактируйте `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_TON_MANIFEST_URL=https://your-domain.com/tonconnect-manifest.json
VITE_ENV=development
```

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Отредактируйте `.env`:
```env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-generate-new-one

# Для разработки используйте SQLite
DATABASE_URL=sqlite:///marketplace.db

REDIS_URL=redis://localhost:6379/0
TON_NETWORK=testnet
BITCOIN_API_URL=https://blockstream.info/api
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Инициализация базы данных

```bash
cd backend
source venv/bin/activate

# Создать таблицы
python app.py
# или используйте Flask-Migrate
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 5. Запуск приложения

#### Запуск Backend
```bash
cd backend
source venv/bin/activate
python app.py
```
Backend будет доступен на `http://localhost:5000`

#### Запуск Frontend
```bash
cd frontend
npm run dev
```
Frontend будет доступен на `http://localhost:3000`

### 6. Проверка работы

Откройте `http://localhost:3000` в браузере.

---

## Production развертывание

### 1. Подготовка сервера

Рекомендуемые требования:
- Ubuntu 22.04 LTS
- 2 CPU cores
- 4 GB RAM
- 20 GB SSD

### 2. Установка зависимостей

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Python
sudo apt install -y python3.11 python3.11-venv python3-pip

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Redis
sudo apt install -y redis-server

# Nginx
sudo apt install -y nginx

# Certbot для SSL
sudo apt install -y certbot python3-certbot-nginx
```

### 3. Настройка PostgreSQL

```bash
sudo -u postgres psql

CREATE DATABASE ton_marketplace;
CREATE USER marketplace_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ton_marketplace TO marketplace_user;
\q
```

### 4. Настройка Backend

```bash
cd /var/www/Marketplace/backend

# Создать виртуальное окружение
python3.11 -m venv venv
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt
pip install gunicorn

# Настроить .env для production
nano .env
```

Production `.env`:
```env
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=generate-strong-random-key-here

DATABASE_URL=postgresql://marketplace_user:your_secure_password@localhost/ton_marketplace
REDIS_URL=redis://localhost:6379/0

TON_NETWORK=mainnet
BITCOIN_API_URL=https://blockstream.info/api
CORS_ORIGINS=https://your-domain.com
```

### 5. Настройка Gunicorn

Создайте systemd service:

```bash
sudo nano /etc/systemd/system/marketplace-backend.service
```

```ini
[Unit]
Description=Marketplace Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/Marketplace/backend
Environment="PATH=/var/www/Marketplace/backend/venv/bin"
ExecStart=/var/www/Marketplace/backend/venv/bin/gunicorn \
    --workers 4 \
    --bind 127.0.0.1:5000 \
    --timeout 120 \
    app:app

[Install]
WantedBy=multi-user.target
```

Запустите сервис:
```bash
sudo systemctl daemon-reload
sudo systemctl start marketplace-backend
sudo systemctl enable marketplace-backend
sudo systemctl status marketplace-backend
```

### 6. Сборка Frontend

```bash
cd /var/www/Marketplace/frontend

# Установить зависимости
npm install

# Собрать для production
npm run build
```

### 7. Настройка Nginx

```bash
sudo nano /etc/nginx/sites-available/marketplace
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /var/www/Marketplace/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        proxy_pass http://127.0.0.1:5000;
    }
}
```

Активировать конфигурацию:
```bash
sudo ln -s /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Настройка SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 9. Настройка Celery (для асинхронных задач)

```bash
sudo nano /etc/systemd/system/marketplace-celery.service
```

```ini
[Unit]
Description=Marketplace Celery Worker
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/Marketplace/backend
Environment="PATH=/var/www/Marketplace/backend/venv/bin"
ExecStart=/var/www/Marketplace/backend/venv/bin/celery \
    -A app.celery worker \
    --loglevel=info

[Install]
WantedBy=multi-user.target
```

---

## Telegram Mini App

### 1. Создание бота

1. Напишите [@BotFather](https://t.me/BotFather)
2. Создайте нового бота: `/newbot`
3. Получите токен

### 2. Настройка Mini App

```
/newapp
<выберите вашего бота>
Название: TON Mining Marketplace
Описание: Trade ASIC and Smart Contract NFTs
Фото: <загрузите иконку>
GIF: <опционально>
Web App URL: https://your-domain.com
Short name: ton_marketplace
```

### 3. TON Connect Manifest

Создайте файл `tonconnect-manifest.json` в `frontend/public/`:

```json
{
  "url": "https://your-domain.com",
  "name": "TON Mining Marketplace",
  "iconUrl": "https://your-domain.com/icon.png",
  "termsOfUseUrl": "https://your-domain.com/terms",
  "privacyPolicyUrl": "https://your-domain.com/privacy"
}
```

---

## TON Smart Contracts

### Деплой NFT контрактов

1. Установите TON CLI:
```bash
npm install -g ton
```

2. Скомпилируйте контракты:
```bash
cd contracts
ton-compiler compile nft-collection.fc
ton-compiler compile nft-item.fc
```

3. Задеплойте на testnet/mainnet

---

## Мониторинг

### Логи

```bash
# Backend logs
sudo journalctl -u marketplace-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Celery logs
sudo journalctl -u marketplace-celery -f
```

### Системный мониторинг

Рекомендуется использовать:
- **PM2** для Node.js процессов (если нужно)
- **Prometheus + Grafana** для метрик
- **Sentry** для отслеживания ошибок

---

## Обновление приложения

### Backend
```bash
cd /var/www/Marketplace/backend
git pull
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade  # если есть миграции
sudo systemctl restart marketplace-backend
```

### Frontend
```bash
cd /var/www/Marketplace/frontend
git pull
npm install
npm run build
sudo systemctl reload nginx
```

---

## Troubleshooting

### Backend не запускается

```bash
sudo systemctl status marketplace-backend
sudo journalctl -u marketplace-backend -n 50
```

### Frontend не отображается

```bash
sudo nginx -t
sudo systemctl status nginx
ls -la /var/www/Marketplace/frontend/dist
```

### База данных

```bash
sudo -u postgres psql -d ton_marketplace -c "SELECT * FROM users LIMIT 1;"
```

---

## Безопасность

1. **Firewall**:
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. **Regular updates**:
```bash
sudo apt update && sudo apt upgrade -y
```

3. **Backup**:
```bash
# База данных
pg_dump ton_marketplace > backup.sql

# Файлы
tar -czf marketplace-backup.tar.gz /var/www/Marketplace
```

---

## Поддержка

Для вопросов и проблем создайте Issue в репозитории.
