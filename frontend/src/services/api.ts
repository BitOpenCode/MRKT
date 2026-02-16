import axios, { AxiosInstance } from 'axios'
import type { 
  ApiResponse, 
  PaginatedResponse,
  MarketplaceListing,
  SmartContract,
  ASIC,
  MiningStats,
  LotteryDraw,
  LotteryResult,
  Transaction,
  Activity,
  User,
  WalletInfo,
  MarketplaceFilters
} from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
      withCredentials: true, // Important for session cookies
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add Telegram init data for auth
        const initData = window.Telegram?.WebApp?.initData
        if (initData) {
          config.headers['X-Telegram-Init-Data'] = initData
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('API Error:', error)
        
        // Handle 401 - clear session and reload
        if (error.response?.status === 401) {
          console.log('[API] 401 Unauthorized - clearing session')
          localStorage.removeItem('user_id')
          localStorage.removeItem('username')
          // Reload page to reset state
          setTimeout(() => window.location.reload(), 500)
        }
        
        return Promise.reject(error)
      }
    )
  }

  // ============= Auth API =============
  async login(username: string, password: string): Promise<ApiResponse<{ user: User; userId: string; username: string }>> {
    return this.client.post('/auth/login', { username, password })
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.client.post('/auth/logout')
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.client.get('/auth/me')
  }

  // ============= User API =============
  async getUser(): Promise<ApiResponse<User>> {
    return this.client.get('/user/profile')
  }

  async updateUser(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.client.put('/user/profile', data)
  }

  // ============= Marketplace API =============
  async getMarketplaceListings(
    filters?: MarketplaceFilters,
    page = 1,
    perPage = 20
  ): Promise<ApiResponse<PaginatedResponse<MarketplaceListing>>> {
    return this.client.get('/marketplace/listings', {
      params: { ...filters, page, perPage },
    })
  }

  async getListingById(id: string): Promise<ApiResponse<MarketplaceListing>> {
    return this.client.get(`/marketplace/listings/${id}`)
  }

  async listItem(data: {
    itemType: 'contract' | 'asic'
    itemId: string
    price: number
    description?: string
  }): Promise<ApiResponse<MarketplaceListing>> {
    return this.client.post('/marketplace/list', data)
  }

  async buyItem(listingId: string): Promise<ApiResponse<Transaction>> {
    return this.client.post(`/marketplace/buy/${listingId}`)
  }

  async removeListng(listingId: string): Promise<ApiResponse<void>> {
    return this.client.delete(`/marketplace/listings/${listingId}`)
  }

  // ============= Smart Contracts API =============
  async getUserContracts(userId?: string): Promise<ApiResponse<SmartContract[]>> {
    // Backend gets user from session, userId param is optional for backwards compatibility
    return this.client.get('/contracts/user')
  }

  async getContractById(id: string): Promise<ApiResponse<SmartContract>> {
    return this.client.get(`/contracts/${id}`)
  }

  async getUserContracts(): Promise<ApiResponse<SmartContract[]>> {
    return this.client.get('/contracts/user')
  }

  async startMining(contractId: string): Promise<ApiResponse<SmartContract>> {
    return this.client.post(`/contracts/${contractId}/start-mining`, {})
  }

  async stopMining(contractId: string): Promise<ApiResponse<SmartContract>> {
    return this.client.post(`/contracts/${contractId}/stop-mining`)
  }

  async listContract(contractId: string, price: number): Promise<ApiResponse<SmartContract>> {
    return this.client.post(`/contracts/${contractId}/list`, { price })
  }

  async withdrawContract(contractId: string): Promise<ApiResponse<SmartContract>> {
    return this.client.post(`/contracts/${contractId}/withdraw`)
  }

  async importContract(tokenId: string): Promise<ApiResponse<SmartContract>> {
    return this.client.post('/contracts/import', { tokenId })
  }

  async transferContract(contractId: string, toAddress: string): Promise<ApiResponse<Transaction>> {
    return this.client.post(`/contracts/${contractId}/transfer`, { toAddress })
  }

  // ============= ASIC API =============
  async getUserAsics(): Promise<ApiResponse<ASIC[]>> {
    return this.client.get('/asics/user')
  }

  async getAsicById(id: string): Promise<ApiResponse<ASIC>> {
    return this.client.get(`/asics/${id}`)
  }

  // ============= Mining API =============
  async getMiningStats(): Promise<ApiResponse<MiningStats>> {
    return this.client.get('/mining/stats')
  }

  async startMining(contractId: string): Promise<ApiResponse<void>> {
    return this.client.post(`/mining/start/${contractId}`)
  }

  async stopMining(contractId: string): Promise<ApiResponse<void>> {
    return this.client.post(`/mining/stop/${contractId}`)
  }

  async claimMiningRewards(contractId: string): Promise<ApiResponse<Transaction>> {
    return this.client.post(`/mining/claim/${contractId}`)
  }

  // ============= Lottery API =============
  async getLotteryHistory(page = 1, perPage = 10): Promise<ApiResponse<PaginatedResponse<LotteryDraw>>> {
    return this.client.get('/lottery/history', {
      params: { page, perPage },
    })
  }

  async getCurrentDraw(): Promise<ApiResponse<LotteryDraw>> {
    return this.client.get('/lottery/current')
  }

  async conductDraw(blockCount = 3): Promise<ApiResponse<LotteryResult>> {
    return this.client.post('/lottery/draw', { blockCount })
  }

  async verifyDraw(data: {
    seedHex: string
    tickets: number[]
    claimedWinner: number
  }): Promise<ApiResponse<{ valid: boolean }>> {
    return this.client.post('/lottery/verify', data)
  }

  async getUserTickets(): Promise<ApiResponse<any[]>> {
    return this.client.get('/lottery/tickets/user')
  }

  async claimPrize(ticketId: string): Promise<ApiResponse<any>> {
    return this.client.post(`/lottery/claim-prize/${ticketId}`)
  }

  async claimLotteryPrize(ticketId: string): Promise<ApiResponse<any>> {
    return this.client.post(`/lottery/claim-prize/${ticketId}`)
  }

  // ============= Wallet API =============
  async connectWallet(address: string, network: 'mainnet' | 'testnet'): Promise<ApiResponse<WalletInfo>> {
    return this.client.post('/wallet/connect', { address, network })
  }

  async disconnectWallet(): Promise<ApiResponse<void>> {
    return this.client.post('/wallet/disconnect')
  }

  async getWalletNFTs(address: string): Promise<ApiResponse<SmartContract[]>> {
    return this.client.get(`/wallet/nfts/${address}`)
  }

  async importNFT(tokenId: string): Promise<ApiResponse<SmartContract>> {
    return this.client.post('/wallet/import-nft', { tokenId })
  }

  // ============= Activity API =============
  async getActivityFeed(limit = 20): Promise<ApiResponse<Activity[]>> {
    return this.client.get('/activity/feed', {
      params: { limit },
    })
  }

  async getOnlineUsers(): Promise<ApiResponse<{ count: number }>> {
    return this.client.get('/activity/online')
  }

  // ============= Transactions API =============
  async getUserTransactions(
    page = 1,
    perPage = 20
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    return this.client.get('/transactions/user', {
      params: { page, perPage },
    })
  }

  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    return this.client.get(`/transactions/${id}`)
  }
}

export const api = new ApiService()
export default api
