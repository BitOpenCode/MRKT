#  Архитектура проекта

## Технологический стэк

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev-сервер
- **Tailwind CSS** - стили
- **@tonconnect/ui-react** - интеграция с TON Wallet
- **@twa-dev/sdk** - Telegram WebApp API
- **Zustand** - state management
- **React Router** - маршрутизация
- **Axios** - HTTP клиент

### Backend
- **Python 3.11+** - язык программирования
- **Flask** - веб-фреймворк
- **SQLAlchemy** - ORM
- **PostgreSQL** - база данных
- **Redis** - кэширование и очереди
- **Celery** - асинхронные задачи

### Blockchain
- **TON** - основной blockchain
- **Bitcoin** - источник энтропии для лотереи

## Структура проекта

```
Marketplace/
├── frontend/                    # React приложение
│   ├── src/
│   │   ├── components/         # UI компоненты
│   │   │   ├── layout/        # Layout компоненты
│   │   │   └── ContractCard.tsx
│   │   ├── pages/             # Страницы приложения
│   │   │   ├── HomePage.tsx
│   │   │   ├── MarketplacePage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── MiningPage.tsx
│   │   │   ├── LotteryPage.tsx
│   │   │   └── ContractDetailsPage.tsx
│   │   ├── hooks/             # Custom hooks
│   │   │   └── useTelegram.ts
│   │   ├── services/          # API сервисы
│   │   │   └── api.ts
│   │   ├── store/             # State management
│   │   │   └── appStore.ts
│   │   ├── types/             # TypeScript типы
│   │   │   └── index.ts
│   │   ├── styles/            # Глобальные стили
│   │   │   └── index.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                     # Flask API
│   ├── api/                    # API endpoints
│   │   ├── user.py            # /api/user/*
│   │   ├── marketplace.py     # /api/marketplace/*
│   │   ├── mining.py          # /api/mining/*
│   │   ├── lottery.py         # /api/lottery/*
│   │   ├── wallet.py          # /api/wallet/*
│   │   └── activity.py        # /api/activity/*
│   ├── models/                # Database models
│   │   ├── user.py
│   │   ├── contract.py
│   │   ├── marketplace.py
│   │   ├── mining.py
│   │   ├── lottery.py
│   │   └── transaction.py
│   ├── lottery/               # Лотерея (из lottery-BTC-v1)
│   │   ├── lottery_core.py    # Алгоритм лотереи
│   │   └── bitcoin_api.py     # Bitcoin API интеграция
│   ├── app.py                 # Flask приложение
│   └── requirements.txt
│
├── contracts/                   # TON Smart Contracts
│   ├── nft/
│   └── mining/
│
├── docs/                        # Документация
│
├── README.md
├── DEPLOYMENT.md
├── ARCHITECTURE.md
├── package.json
└── .gitignore
```

## Компоненты системы

### 1. Frontend (React SPA)

#### Страницы
- **HomePage** - главная страница с статистикой и hot deals
- **MarketplacePage** - каталог всех предложений с фильтрами
- **ProfilePage** - личный кабинет пользователя
- **MiningPage** - управление майнингом контрактов
- **LotteryPage** - участие в лотерее
- **ContractDetailsPage** - детальная информация о контракте

#### Компоненты
- **Layout** - общий layout с Header и BottomNav
- **Header** - шапка с подключением кошелька
- **BottomNav** - нижняя навигация (mobile-first)
- **ContractCard** - карточка mining контракта

#### Store (Zustand)
```typescript
{
  user: User | null
  wallet: WalletInfo | null
  theme: 'dark' | 'light'
  isLoading: boolean
  notifications: number
}
```

### 2. Backend (Flask API)

#### API Endpoints

**User API** (`/api/user`)
- `GET /profile` - получить профиль
- `PUT /profile` - обновить профиль

**Marketplace API** (`/api/marketplace`)
- `GET /listings` - список объявлений
- `GET /listings/:id` - детали объявления
- `POST /list` - выставить на продажу
- `POST /buy/:id` - купить
- `DELETE /listings/:id` - снять с продажи

**Mining API** (`/api/mining`)
- `GET /stats` - статистика майнинга
- `POST /start/:contractId` - начать майнинг
- `POST /stop/:contractId` - остановить майнинг
- `POST /claim/:contractId` - забрать награды

**Lottery API** (`/api/lottery`)
- `GET /current` - текущий розыгрыш
- `GET /history` - история розыгрышей
- `POST /draw` - провести розыгрыш
- `POST /verify` - проверить результат
- `GET /tickets/user` - билеты пользователя

**Wallet API** (`/api/wallet`)
- `POST /connect` - подключить кошелек
- `POST /disconnect` - отключить кошелек
- `GET /nfts/:address` - NFT кошелька
- `POST /import-nft` - импортировать NFT

**Activity API** (`/api/activity`)
- `GET /feed` - лента активности
- `GET /online` - количество онлайн

#### Database Models

```python
User
├── id: str (UUID)
├── telegram_id: int (unique)
├── username: str
├── first_name: str
├── last_name: str
├── wallet_address: str (unique)
└── created_at: datetime

SmartContract (NFT)
├── id: str (UUID)
├── token_id: str (unique)
├── contract_number: str (unique)
├── hashrate: float (TH/s)
├── expiration_date: datetime
├── fair_price: float
├── current_price: float
├── owner: str (FK User)
├── status: str (available, mining, on_sale, sold)
├── daily_income: float
├── roi: float
└── metadata_json: text (JSON)

MarketplaceListing
├── id: str (UUID)
├── item_type: str (contract, asic)
├── item_id: str (FK SmartContract)
├── price: float
├── seller: str (FK User)
├── views: int
├── watchlist_count: int
├── badges: str (comma-separated)
├── status: str (active, sold, cancelled)
└── listed_at: datetime

MiningSession
├── id: str (UUID)
├── contract_id: str (FK SmartContract)
├── user_id: str (FK User)
├── started_at: datetime
├── daily_income: float
├── total_earned: float
├── status: str (active, paused, stopped)
└── hashrate: float

LotteryDraw
├── id: str (UUID)
├── draw_number: int (unique)
├── seed_hex: str
├── block_hashes: text (JSON array)
├── block_heights: text (JSON array)
├── tickets: text (JSON array)
├── winner: int
├── prize_contract_id: str (FK SmartContract)
├── draw_date: datetime
└── verified: bool

Transaction
├── id: str (UUID)
├── type: str (buy, sell, transfer, mining_payout)
├── amount: float
├── from_address: str
├── to_address: str
├── item_id: str
├── status: str (pending, confirmed, failed)
└── tx_hash: str
```

### 3. Lottery System (Bitcoin-based)

#### Алгоритм

1. **Генерация Seed**
   ```
   seed = SHA256(H_draw || H_draw-1 || H_draw-2)
   ```
   Где `H_draw` - хеш Bitcoin блока

2. **Вычисление Score**
   ```
   score = int(SHA256(seed || ":" || ticket_number))
   ```

3. **Выбор победителя**
   - Победитель - билет с минимальным score
   - При коллизии - tie-breaker раунды

#### Проверяемость
Любой может проверить результат:
1. Получить seed и список билетов
2. Вычислить scores
3. Проверить победителя

### 4. TON Integration

#### TON Connect
- Подключение кошелька через TON Connect UI
- Проверка NFT в кошельке
- Перевод NFT

#### Smart Contracts
- NFT Collection контракт
- NFT Item контракты
- Mining логика (опционально on-chain)

### 5. Telegram Mini App

#### Особенности
- Нативная интеграция с Telegram
- Haptic feedback
- Theme detection
- MainButton/BackButton API
- Share functionality

## Data Flow

### Покупка контракта

```
User → Frontend (buy button)
  → API POST /marketplace/buy/:id
    → Check listing exists & active
    → Create Transaction
    → Update listing status
    → Update contract owner
    → Commit to DB
  → Response with transaction
→ Update UI
```

### Майнинг

```
User → Frontend (start mining)
  → API POST /mining/start/:contractId
    → Check contract ownership
    → Create MiningSession
    → Update contract status
  → Response success
→ Celery task (background)
  → Calculate daily rewards
  → Update session.total_earned
  → Every 24h
→ Frontend polls /mining/stats
```

### Лотерея

```
Admin → Conduct Draw
  → API POST /lottery/draw
    → Get Bitcoin block hashes
    → Calculate seed
    → Pick winner
    → Create LotteryDraw record
    → Update tickets status
    → Transfer prize contract to winner
  → Response with result
→ All users see results
```

## Security

### Authentication
- Telegram WebApp initData verification
- No passwords needed
- User identified by telegram_id

### Authorization
- Check ownership before operations
- Verify wallet signatures for transfers
- Rate limiting on API

### Data Validation
- Input sanitization
- Type checking (TypeScript + Pydantic)
- SQL injection protection (SQLAlchemy ORM)

## Performance

### Caching
- Redis for online users count
- Redis for activity feed
- Browser cache for static assets

### Optimization
- Code splitting (React.lazy)
- Image optimization
- Database indexes
- API pagination

## Scalability

### Horizontal Scaling
- Stateless API servers (можно добавить n instances)
- Celery workers (можно добавить n workers)
- PostgreSQL read replicas

### Load Balancing
- Nginx load balancer
- Round-robin для API servers

## Monitoring & Logging

### Logs
- Application logs (journalctl)
- Access logs (Nginx)
- Error tracking (Sentry)

### Metrics
- Response times
- Error rates
- Active users
- Transaction volume

## Future Improvements

1. **Blockchain**
   - Полная интеграция с TON blockchain
   - On-chain verification
   - Decentralized storage (IPFS)

2. **Features**
   - Аукционы
   - Escrow сервис
   - Referral program
   - Staking

3. **Performance**
   - GraphQL API
   - WebSocket для real-time updates
   - CDN для статики

4. **Security**
   - 2FA
   - Rate limiting per user
   - DDoS protection

---

Для вопросов по архитектуре создайте Issue в репозитории.
