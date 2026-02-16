import { useState, useEffect } from 'react'
import { X, RefreshCw, ArrowDown } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import { priceApi } from '@/services/priceApi'
import toast from 'react-hot-toast'

interface Props {
  isOpen: boolean
  onClose: () => void
  btcBalance: number
  onSwap: (btcAmount: number, usdtAmount: number) => void
}

export default function SwapModal({ isOpen, onClose, btcBalance, onSwap }: Props) {
  const { haptic } = useTelegram()
  const [btcAmount, setBtcAmount] = useState('')
  const [usdtAmount, setUsdtAmount] = useState('')
  const [rate, setRate] = useState(0)
  const [loading, setLoading] = useState(false)

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      loadRate()
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const loadRate = async () => {
    const price = await priceApi.getBTCUSDTPrice()
    setRate(price)
  }

  const handleBtcChange = (value: string) => {
    setBtcAmount(value)
    if (value && rate) {
      const usdt = parseFloat(value) * rate
      setUsdtAmount(usdt.toFixed(2))
    } else {
      setUsdtAmount('')
    }
  }

  const handleMaxClick = () => {
    haptic.light()
    setBtcAmount(btcBalance.toString())
    setUsdtAmount((btcBalance * rate).toFixed(2))
  }

  const handleSwap = async () => {
    if (!btcAmount || parseFloat(btcAmount) <= 0) {
      toast.error('Введите сумму BTC')
      return
    }
    if (parseFloat(btcAmount) > btcBalance) {
      toast.error('Недостаточно BTC')
      return
    }

    setLoading(true)
    haptic.medium()
    
    try {
      const { usdtAmount: finalUsdt } = await priceApi.swap(parseFloat(btcAmount))
      onSwap(parseFloat(btcAmount), finalUsdt)
      toast.success(`✅ Обменяно ${btcAmount} BTC на ${finalUsdt.toFixed(2)} USDT`)
      onClose()
    } catch (error) {
      toast.error('Ошибка обмена')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">SWAP BTC → USDT</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Можем использовать виджет и менять запрашиваемую сумму из BTC на USDT (DeFi)
        </p>

        {/* Rate */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Курс:</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">1 BTC = ${rate.toLocaleString()}</span>
            <button onClick={loadRate} className="p-1 hover:bg-blue-500/20 rounded">
              <RefreshCw className="w-4 h-4 text-blue-500" />
            </button>
          </div>
        </div>

        {/* From BTC */}
        <div className="mb-2">
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">От (BTC)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={btcAmount}
              onChange={(e) => handleBtcChange(e.target.value)}
              placeholder="0.00"
              step="0.00000001"
              className="input flex-1"
            />
            <button onClick={handleMaxClick} className="btn btn-secondary px-4">
              MAX
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Доступно: {btcBalance.toFixed(8)} BTC</p>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <ArrowDown className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* To USDT */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Получите (USDT)</label>
          <input
            type="text"
            value={usdtAmount}
            readOnly
            placeholder="0.00"
            className="input bg-gray-50 dark:bg-gray-800"
          />
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={loading || !btcAmount}
          className="btn btn-primary w-full py-3 text-lg font-bold disabled:opacity-50"
        >
          {loading ? 'Обмен...' : '🔄 SWAP'}
        </button>
      </div>
    </div>
  )
}
