### 1. Fork репозитория

Нажмите кнопку "Fork" на GitHub.

### 2. Клонируйте свой fork

```bash
git clone https://github.com/YOUR_USERNAME/MRKT.git
cd MRKT
```

### 3. Создайте feature branch

```bash
git checkout -b feature/amazing-feature
```

### 4. Внесите изменения

Следуйте code style проекта:

#### Python (Backend)
- PEP 8 стандарт
- Docstrings для функций
- Type hints где возможно
- 4 пробела для отступов

#### TypeScript (Frontend)
- ESLint правила проекта
- Functional components
- TypeScript strict mode
- 2 пробела для отступов

### 5. Commit изменений

```bash
git add .
git commit -m "feat: Add amazing feature"
```

Используйте conventional commits:
- `feat:` - новая функция
- `fix:` - исправление бага
- `docs:` - документация
- `style:` - форматирование
- `refactor:` - рефакторинг
- `test:` - тесты
- `chore:` - прочее

### 6. Push в ваш fork

```bash
git push origin feature/amazing-feature
```

### 7. Создайте Pull Request

## 🐛 Reporting Bugs

Используйте GitHub Issues с шаблоном:

**Описание:**
Краткое описание проблемы.

**Шаги для воспроизведения:**
1. Перейти на '...'
2. Нажать на '...'
3. Увидеть ошибку

**Ожидаемое поведение:**
Что должно было произойти.

**Скриншоты:**
Если применимо.

**Окружение:**
- OS: [e.g. macOS 13]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

## 💡 Feature Requests

Предложения приветствуются! Создайте Issue с тегом `enhancement`.

## 📝 Code Style

### Python

```python
def calculate_earnings(hashrate: float, days: int) -> float:
    """
    Calculate mining earnings.
    
    Args:
        hashrate: TH/s
        days: Number of days
        
    Returns:
        Total BTC earned
    """
    daily_rate = 0.00000042
    return hashrate * daily_rate * days
```

### TypeScript

```typescript
interface SmartContract {
  id: string
  hashrate: number
  currentPrice: number
}

function calculateROI(contract: SmartContract): number {
  const dailyIncome = contract.hashrate * 0.00000042
  const btcPrice = 42000
  const dailyUSD = dailyIncome * btcPrice
  const daysToBreakeven = contract.currentPrice / dailyUSD
  return (365 / daysToBreakeven) * 100
}
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

