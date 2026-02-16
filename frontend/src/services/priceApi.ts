import axios from 'axios'

// API для получения курса BTC/USDT
const BINANCE_API = 'https://api.binance.com/api/v3'

export const priceApi = {
  async getBTCUSDTPrice(): Promise<number> {
    try {
      const response = await axios.get(`${BINANCE_API}/ticker/price?symbol=BTCUSDT`)
      return parseFloat(response.data.price)
    } catch (error) {
      console.error('Error fetching BTC price:', error)
      return 50000 // Fallback
    }
  },

  async swap(btcAmount: number): Promise<{ usdtAmount: number; rate: number }> {
    const rate = await this.getBTCUSDTPrice()
    const usdtAmount = btcAmount * rate
    return { usdtAmount, rate }
  }
}
