// ============= User Types =============
export interface User {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  walletAddress?: string;
  usdtBalance?: number; // Internal USDT wallet balance
  btcBalance?: number; // Internal BTC wallet balance (from mining)
  ecosPoints: number; // ECOS Points balance
  level: number; // Portal level (1-5)
  referralCode: string;
  referredBy?: string;
  referralEarnings: number;
  totalVolume: number; // For level progression
  inventoryCost: number;
  boughtSold: number;
  friendsInvited: number;
  giftsBought: number;
  friendsBuyVolume: number;
  cashbackBonus: number; // 0-15%
  earnedFromReferrals: number;
  createdAt: string;
}

// ============= NFT Smart Contract Types =============
export interface SmartContract {
  id: string;
  tokenId: string;
  contractNumber: string;
  hashrate: number; // TH/s
  expirationDate: string;
  fairPrice: number;
  currentPrice: number;
  initialPrice?: number; // Цена при первом выставлении
  discount?: number;
  owner: string;
  status: 'available' | 'mining' | 'on_sale' | 'sold';
  listedOnMarketplace: boolean;
  dailyIncome: number;
  totalEarned?: number;
  roi?: number;
  cartAddCount?: number;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

// ============= ASIC Types =============
export interface ASIC {
  id: string;
  model: string;
  manufacturer: string;
  hashrate: number;
  powerConsumption: number;
  price: number;
  condition: 'new' | 'used' | 'refurbished';
  seller: string;
  location?: string;
  warranty?: number; // months
  images: string[];
  description: string;
  createdAt: string;
}

// ============= Marketplace Types =============
export interface MarketplaceListing {
  id: string;
  itemType: 'contract' | 'asic';
  itemId: string;
  item: SmartContract | ASIC;
  price: number;
  seller: string;
  sellerRating?: number;
  views: number;
  watchlist: number;
  badges: Array<'hot' | 'premium' | 'new' | 'trending'>;
  listedAt: string;
}

export interface MarketplaceFilters {
  itemType?: 'contract' | 'asic' | 'all';
  minPrice?: number;
  maxPrice?: number;
  minHashrate?: number;
  maxHashrate?: number;
  minDiscount?: number;
  timeRemaining?: string;
  sortBy?: 'discount' | 'roi' | 'price_low' | 'price_high' | 'newest' | 'ending';
  badges?: Array<'hot' | 'premium' | 'new' | 'trending'>;
}

// ============= Mining Types =============
export interface MiningSession {
  id: string;
  contractId: string;
  contract: SmartContract;
  startedAt: string;
  dailyIncome: number;
  totalEarned: number;
  status: 'active' | 'paused' | 'stopped';
  hashrate: number;
}

export interface MiningStats {
  totalHashrate: number;
  activeSessions: number;
  totalEarned: number;
  dailyIncome: number;
  contracts: MiningSession[];
}

// ============= Lottery Types =============
export interface LotteryTicket {
  id: string;
  ticketNumber: number;
  userId: string;
  drawId?: string;
  status: 'pending' | 'won' | 'lost';
  createdAt: string;
}

export interface LotteryDraw {
  id: string;
  drawNumber: number;
  seedHex: string;
  blockHashes: string[];
  blockHeights: number[];
  tickets: number[];
  winner: number;
  prize: SmartContract;
  drawDate: string;
  verified: boolean;
}

export interface LotteryResult {
  winner: number;
  seedHex: string;
  allScores: Record<number, string>;
  proof: {
    seed: string;
    blockHashes: string[];
    blockHeights: number[];
    winnerScore: string;
  };
}

export interface ReferralData {
  code: string;
  totalInvited: number;
  activeReferrals: number;
  totalEarnings: number;
  referrals: Array<{
    id: string;
    username: string;
    joinedAt: string;
    totalSpent: number;
    yourEarnings: number;
    lastActive: string;
  }>;
}

// ============= Wallet Types =============
export interface WalletInfo {
  address: string;
  balance: number;
  nfts: SmartContract[];
  connected: boolean;
  network: 'mainnet' | 'testnet';
}

// ============= Transaction Types =============
export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer' | 'mining_payout';
  amount: number;
  from: string;
  to: string;
  itemId?: string;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  createdAt: string;
}

// ============= Activity Types =============
export interface Activity {
  id: string;
  type: 'sale' | 'listing' | 'price_drop' | 'mining_start' | 'lottery_win';
  userId?: string;
  username?: string;
  message: string;
  highlight?: string;
  itemId?: string;
  timestamp: string;
}

// ============= API Response Types =============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ============= Store Types =============
export interface AppState {
  user: User | null;
  wallet: WalletInfo | null;
  theme: 'dark' | 'light';
  isLoading: boolean;
}

// ============= Form Types =============
export interface ListContractForm {
  contractId: string;
  price: number;
  description?: string;
}

export interface BuyForm {
  listingId: string;
  paymentMethod: 'wallet' | 'card';
}

export interface MiningControlForm {
  contractId: string;
  action: 'start' | 'stop' | 'claim';
}

// ============= Offer/Bid System Types =============
export interface Offer {
  id: string;
  listingId: string;
  itemId: string;
  offeredPrice: number;
  floorPrice: number;
  difference: number; // percentage
  offerCount: number; // number of similar offers
  userId: string;
  username?: string;
  status: 'active' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export interface TradeHistory {
  id: string;
  itemId: string;
  itemType: 'contract' | 'asic';
  price: number;
  seller: string;
  buyer: string;
  sellerUsername?: string;
  buyerUsername?: string;
  timestamp: string;
  txHash?: string;
}

// ============= User Level System Types =============
export interface UserLevel {
  level: number;
  name: string;
  commissionRate: number; // % of referral purchase
  ecosPointsDiscount: number; // max % of purchase payable in ECOS Points
  volumeRequired: number; // TON volume to reach this level
  color: string; // for UI gradient
  isSpecial: boolean;
}

export const USER_LEVELS: UserLevel[] = [
  { level: 1, name: 'Level 1', commissionRate: 20, ecosPointsDiscount: 10, volumeRequired: 0, color: 'blue', isSpecial: false },
  { level: 2, name: 'Level 2', commissionRate: 25, ecosPointsDiscount: 15, volumeRequired: 100000, color: 'purple', isSpecial: false },
  { level: 3, name: 'Level 3', commissionRate: 30, ecosPointsDiscount: 20, volumeRequired: 250000, color: 'yellow', isSpecial: false },
  { level: 4, name: 'Level 4', commissionRate: 35, ecosPointsDiscount: 25, volumeRequired: 500000, color: 'cyan', isSpecial: true },
  { level: 5, name: 'Level 5', commissionRate: 40, ecosPointsDiscount: 30, volumeRequired: 1000000, color: 'green', isSpecial: true },
];

// ============= Referral System Types =============
export interface ReferralData {
  code: string;
  totalInvited: number;
  activeReferrals: number;
  totalEarnings: number;
  referrals: ReferralUser[];
}

export interface ReferralUser {
  id: string;
  username?: string;
  firstName?: string;
  joinedAt: string;
  totalSpent: number;
  yourEarnings: number;
  lastActive: string;
}
