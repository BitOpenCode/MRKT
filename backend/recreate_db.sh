#!/bin/bash

echo "🗑️  Удаляем старую базу данных..."
rm -f marketplace.db

echo "🔨 Создаем новую базу данных..."
python3 -c "from app import app, db; app.app_context().push(); db.create_all(); print('✅ База данных создана')"

echo "🌱 Заполняем базу данных тестовыми данными..."
python3 seed_data.py

echo "✅ Готово! База данных пересоздана с 10 тестовыми пользователями"
echo ""
echo "📝 Тестовые пользователи:"
echo "   Username: alice    | Password: password123 | Level: 3 | Points: 5,000"
echo "   Username: bob      | Password: password123 | Level: 4 | Points: 12,000"
echo "   Username: charlie  | Password: password123 | Level: 5 | Points: 25,000"
echo "   Username: david    | Password: password123 | Level: 1 | Points: 800"
echo "   Username: emma     | Password: password123 | Level: 2 | Points: 3,500"
echo "   Username: frank    | Password: password123 | Level: 4 | Points: 15,000"
echo "   Username: grace    | Password: password123 | Level: 2 | Points: 2,000"
echo "   Username: henry    | Password: password123 | Level: 3 | Points: 8,000"
echo "   Username: iris     | Password: password123 | Level: 5 | Points: 30,000"
echo "   Username: jack     | Password: password123 | Level: 1 | Points: 1,200"
