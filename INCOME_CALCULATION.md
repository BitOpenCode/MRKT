#  Расчет дохода от майнинга

## Формула

**1 TH/day = 0.00000042 BTC**

## Примеры расчетов

| Hashrate (TH/s) | Daily Income (BTC) | Daily Income (USD @ $100k) |
|-----------------|-------------------|---------------------------|
| 50 TH/s         | 0.00002100 BTC    | $2.10                     |
| 75 TH/s         | 0.00003150 BTC    | $3.15                     |
| 100 TH/s        | 0.00004200 BTC    | $4.20                     |
| 125 TH/s        | 0.00005250 BTC    | $5.25                     |
| 150 TH/s        | 0.00006300 BTC    | $6.30                     |
| 200 TH/s        | 0.00008400 BTC    | $8.40                     |
| 250 TH/s        | 0.00010500 BTC    | $10.50                    |
| 300 TH/s        | 0.00012600 BTC    | $12.60                    |

## Где применяется

### Backend

1. **`backend/seed_data.py`** (строка 75):
   ```python
   daily_income=hashrate * 0.00000042  # 1 TH/day = 0.00000042 BTC
   ```

2. **`backend/models/mining.py`** (метод `calculate_daily_income`):
   ```python
   btc_per_th = 0.00000042
   return self.contract.hashrate * btc_per_th
   ```

3. **`backend/models/contract.py`**:
   - Поле `daily_income` хранит рассчитанное значение
   - Используется в API responses

### Frontend

1. **`frontend/src/components/ContractCard.tsx`**:
   - Отображает `contract.dailyIncome.toFixed(8) BTC`
   - Показывает в карточках контрактов

2. **`frontend/src/pages/ContractDetailsPage.tsx`**:
   - Отображает детальную информацию о доходе
   - Форматирование: `{contract.dailyIncome.toFixed(8)} BTC`

## Проверка

Чтобы проверить правильность расчетов:

1. Запустите backend:
   ```bash
   cd backend
   source venv/bin/activate  # или venv\Scripts\activate на Windows
   python seed_data.py
   python app.py
   ```

2. Откройте frontend и проверьте карточки контрактов
3. Daily Income должен отображаться в формате: `0.00004200 BTC` для 100 TH/s

## Конвертация в USD (опционально)

Для отображения в USD можно добавить:
- Получать текущий курс BTC/USD из API (например, CoinGecko)
- Умножать `dailyIncome * btcPrice`
- Отображать оба значения: BTC и USD

Пример:
```typescript
const btcPrice = 100000 // USD
const dailyIncomeUSD = contract.dailyIncome * btcPrice
// 0.00004200 * 100000 = $4.20
```
