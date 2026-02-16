# 🚀 Запуск проекта MRKT - Шпаргалка

## Быстрый старт (2 команды)

### Terminal 1 - Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install Flask Flask-CORS Flask-SQLAlchemy Flask-Migrate python-dotenv requests
cat > .env << 'EOF'
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=dev-secret-key
DATABASE_URL=sqlite:///marketplace.db
BITCOIN_API_URL=https://blockstream.info/api
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173
EOF
python seed_data.py
python app.py
```
✅ Backend: http://localhost:5001

### Terminal 2 - Frontend:
```bash
cd frontend
npm install  # если нет node_modules
cat > .env << 'EOF'
VITE_API_URL=http://localhost:5001
VITE_TON_MANIFEST_URL=http://localhost:3000/tonconnect-manifest.json
VITE_ENV=development
EOF
npm run dev
```
✅ Frontend: http://localhost:3000

## Логин
- Username: `alice`
- Password: `password123`

## Подробная инструкция
Смотри: [START_CORRECT.md](./START_CORRECT.md)
