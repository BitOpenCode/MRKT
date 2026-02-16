### 1. 🗄️ Backend API для контрактов

**Новый файл:** `backend/api/contract.py`

#### Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contracts/user` | Получить все контракты пользователя |
| GET | `/api/contracts/<id>` | Получить контракт по ID |
| POST | `/api/contracts/<id>/start-mining` | Начать майнинг |
| POST | `/api/contracts/<id>/stop-mining` | Остановить майнинг |
| POST | `/api/contracts/<id>/list` | Выставить на маркетплейс |
| POST | `/api/contracts/<id>/withdraw` | Вывести в TON кошелек |
| POST | `/api/contracts/import` | Импортировать из кошелька |

#### Примеры использования:

**Получить контракты пользователя:**
```bash
curl http://localhost:5001/api/contracts/user \
  -b cookies.txt
```

**Начать майнинг:**
```bash
curl -X POST http://localhost:5001/api/contracts/<contract_id>/start-mining \
  -b cookies.txt
```

**Выставить на продажу:**
```bash
curl -X POST http://localhost:5001/api/contracts/<contract_id>/list \
  -H "Content-Type: application/json" \
  -d '{"price": 2500}' \
  -b cookies.txt
```

**Импортировать из кошелька:**
```bash
curl -X POST http://localhost:5001/api/contracts/import \
  -H "Content-Type: application/json" \
  -d '{"tokenId": "TON-NFT-PC2000"}' \
  -b cookies.txt
```

---

### 2. 📦 Персональные NFT контракты

**Обновлен:** `backend/seed_data.py`

#### Для пользователя `charlie` создано 4 персональных контракта:

```python
# MC-PC2000, MC-PC2001, MC-PC2002, MC-PC2003
# Hashrate: 50, 75, 100, 150 TH/s
# Status: 'owned' (принадлежит пользователю, не на продаже)
# Owner: charlie.id
```

**Всего в базе:**
- 20 контрактов на маркетплейсе (доступны для покупки)
- 4 персональных контракта charlie (в портфолио)
- **= 24 контракта**

---

### 3. 🎨 Frontend Portfolio Page

**Обновлен:** `frontend/src/pages/PortfolioPage.tsx`

#### Новый функционал:

✅ **Загрузка реальных контрактов из API**
```typescript
const response = await api.getUserContracts()
setContracts(response.data)
```

✅ **Start/Stop Mining**
```typescript
handleStartMining(contractId) → api.startMining()
handleStopMining(contractId) → api.stopMining()
```

✅ **Выставление на продажу**
```typescript
handleListOnMarket(contractId) → api.listContract(contractId, price)
```

✅ **Вывод в кошелек**
```typescript
handleWithdraw(contractId) → api.withdrawContract(contractId)
```

✅ **Импорт из кошелька**
```typescript
handleImportFromWallet() → api.importContract(tokenId)
```

#### UI изменения:

**Новые кнопки:**
- **"Импорт из кошелька"** - всегда видна в unlisted tab
- **"Mine/Stop"** - меняется в зависимости от статуса
- **"Sell"** - выставить на продажу
- **"Withdraw"** - вывести в кошелек

**Disabled состояния:**
- Нельзя продать контракт который майнится
- Нельзя вывести контракт который майнится

**Визуальные индикаторы:**
- 🟢 "Mining active" - если майнится
- 💰 "На продаже" - если выставлен

---

### 4. 🔧 Frontend API Service

**Обновлен:** `frontend/src/services/api.ts`

#### Новые методы:

```typescript
// Контракты пользователя
async getUserContracts(): Promise<ApiResponse<SmartContract[]>>

// Управление майнингом
async startMining(contractId: string): Promise<ApiResponse<SmartContract>>
async stopMining(contractId: string): Promise<ApiResponse<SmartContract>>

// Управление листингом
async listContract(contractId: string, price: number): Promise<ApiResponse<SmartContract>>

// Управление кошельком
async withdrawContract(contractId: string): Promise<ApiResponse<SmartContract>>
async importContract(tokenId: string): Promise<ApiResponse<SmartContract>>
```

---

## 🚀 Как протестировать

### 1. **Залогиниться как charlie**

```
1. http://localhost:3000/profile
2. Login → charlie / password123
3. Страница перезагрузится
```

### 2. **Открыть Portfolio**

```
1. Click "Portfolio" в bottom navigation (иконка подарка 🎁)
2. Должны увидеть 4 контракта charlie
```

### 3. **Тестировать функционал**

#### ✅ Start Mining:
```
1. Нажать кнопку "Mine" на любом контракте
2. Статус изменится на "Mining active"
3. Кнопка станет "Stop" (оранжевая)
4. Кнопки "Sell" и "Withdraw" станут disabled
```

#### ✅ Stop Mining:
```
1. Нажать "Stop" на майнящемся контракте
2. Статус изменится на "owned"
3. Кнопка вернется к "Mine" (зеленая)
4. Кнопки "Sell" и "Withdraw" станут активными
```

#### ✅ List on Market:
```
1. Нажать "Sell" на любом контракте (не mining!)
2. Ввести цену (например: 2500)
3. Контракт переместится в "Listed" tab
4. Статус: "На продаже"
```

#### ✅ Withdraw to Wallet:
```
1. Нажать "Withdraw" на контракте
2. Confirm
3. Статус изменится на "withdrawn"
4. Контракт можно импортировать обратно
```

#### ✅ Import from Wallet:
```
1. Нажать "Импорт из кошелька" (синяя кнопка сверху)
2. Ввести Token ID: TON-NFT-PC2000 (или другой withdrawn контракт)
3. Контракт появится в портфолио
4. Статус: "owned"
```

---

## 📊 Статусы контрактов

| Status | Description | Можно майнить | Можно продать | Можно вывести |
|--------|-------------|---------------|---------------|---------------|
| `owned` | Принадлежит пользователю | ✅ | ✅ | ✅ |
| `mining` | Майнится | ❌ (Stop) | ❌ | ❌ |
| `on_sale` | Выставлен на продажу | ❌ | ❌ | ❌ |
| `withdrawn` | Выведен в кошелек | ❌ | ❌ | ❌ (Import) |

---

## 🎯 Сценарии использования

### Сценарий 1: Майнинг контракта
```
1. Login: charlie / password123
2. Portfolio → Unlisted
3. Выбрать контракт MC-PC2000 (100 TH/s)
4. Нажать "Mine"
5. ✅ Mining started!
6. Статус: "Mining active"
7. Дождаться... (в реальности накапливается income)
8. Нажать "Stop"
9. ✅ Mining stopped
```

### Сценарий 2: Продажа контракта
```
1. Portfolio → Unlisted
2. Выбрать контракт MC-PC2001 (75 TH/s)
3. Нажать "Sell"
4. Ввести цену: $1800
5. ✅ Contract listed on marketplace!
6. Перейти в "Listed" tab
7. Контракт появился там
8. Другие пользователи могут купить
```

### Сценарий 3: Вывод в кошелек и импорт обратно
```
1. Portfolio → Unlisted
2. Выбрать контракт MC-PC2002 (50 TH/s)
3. Нажать "Withdraw"
4. Confirm
5. ✅ Contract withdrawn to wallet!
6. Контракт исчез из портфолио

7. Нажать "Импорт из кошелька"
8. Ввести: TON-NFT-PC2002
9. ✅ Contract imported from wallet!
10. Контракт появился обратно
```

### Сценарий 4: Bundle (TODO)
```
Функционал "Собрать в Bundle" пока в разработке.
Планируется:
- Выбрать несколько контрактов
- Объединить в один NFT bundle
- Продать как пакет со скидкой
```

---

## 🛠️ Технические детали

### Backend Flow:

```
1. User login → session created
2. GET /api/contracts/user → fetch contracts WHERE owner = user_id
3. POST /api/contracts/<id>/start-mining → UPDATE status = 'mining'
4. POST /api/contracts/<id>/list → UPDATE status = 'on_sale', listed = True
5. POST /api/contracts/<id>/withdraw → UPDATE status = 'withdrawn'
6. POST /api/contracts/import → UPDATE owner = user_id, status = 'owned'
```

### Frontend Flow:

```
PortfolioPage.tsx
  ↓
useEffect(() => loadUserContracts())
  ↓
api.getUserContracts() → GET /api/contracts/user
  ↓
setContracts(response.data)
  ↓
Render cards with actions
  ↓
handleStartMining() → POST /api/contracts/<id>/start-mining
  ↓
loadUserContracts() → Reload data
```

---

## 📂 Измененные файлы

```
backend/
  api/
    __init__.py          ← Добавлен contract_bp
    contract.py          ← НОВЫЙ: API для контрактов
  seed_data.py           ← Добавлены персональные контракты
  app.py                 ← Зарегистрирован contract_bp

frontend/
  src/
    pages/
      PortfolioPage.tsx  ← Полностью переработан
    services/
      api.ts             ← Добавлены методы для контрактов
```

---

## ✅ Checklist

- [x] Backend API для контрактов
- [x] Endpoints: user, start-mining, stop-mining, list, withdraw, import
- [x] Персональные NFT для charlie (4 контракта)
- [x] Frontend: загрузка реальных контрактов
- [x] Frontend: Start/Stop Mining
- [x] Frontend: List on Market
- [x] Frontend: Withdraw to Wallet
- [x] Frontend: Import from Wallet
- [x] UI: кнопки с правильными состояниями
- [x] UI: disabled для mining контрактов
- [x] UI: индикаторы статусов
- [x] Toast notifications
- [x] Перезагрузка данных после действий

