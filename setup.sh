#!/bin/bash

echo "🚀 Setting up TON Mining Marketplace..."

# Fix npm cache permissions
echo "📦 Fixing npm cache permissions..."
sudo chown -R $(whoami) "$HOME/.npm"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed!"
else
    echo "❌ Frontend installation failed. Try: npm install --legacy-peer-deps"
    exit 1
fi

# Create .env if not exists
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cat > .env << EOF
VITE_API_URL=http://localhost:5000
VITE_TON_MANIFEST_URL=http://localhost:3000/tonconnect-manifest.json
VITE_ENV=development
EOF
fi

# Setup backend
echo "📦 Setting up backend..."
cd ../backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate venv and install dependencies
echo "📦 Installing backend dependencies..."
source venv/bin/activate
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed!"
else
    echo "❌ Backend installation failed"
    exit 1
fi

# Create .env if not exists
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cat > .env << EOF
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=dev-secret-key-$(date +%s)
DATABASE_URL=sqlite:///marketplace.db
REDIS_URL=redis://localhost:6379/0
BITCOIN_API_URL=https://blockstream.info/api
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
EOF
fi

# Create test data
echo "🎲 Creating test data..."
python seed_data.py

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
