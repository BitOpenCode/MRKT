import { useNavigate } from 'react-router-dom'
import { Clock, TrendingUp, Eye, Heart, ShoppingCart } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/store/appStore'
import type { SmartContract } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface Props {
  contract: SmartContract
  onBuy?: (id: string) => void
  showActions?: boolean
}

export default function ContractCard({ contract, onBuy, showActions = true, bestOffer, offersCount = 0 }: Props) {
  const navigate = useNavigate()
  const { haptic } = useTelegram()
  const { addToCart } = useAppStore()

  const handleClick = () => {
    haptic.light()
    navigate(`/contract/${contract.id}`)
  }

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation()
    haptic.medium()
    onBuy?.(contract.id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    haptic.selection()
    addToCart(contract)
    toast.success('Added to cart!', {
      icon: '🛒',
      duration: 2000,
    })
  }

  const discount = contract.fairPrice && contract.currentPrice
    ? Math.round(((contract.fairPrice - contract.currentPrice) / contract.fairPrice) * 100)
    : 0

  const daysLeft = Math.ceil(
    (new Date(contract.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  // HOT = если контракт добавили в корзину >= 10 раз
  const isHot = (contract.cartAddCount || 0) >= 10
  // PREMIUM = NFT уже минтнут в блокчейн или высокий хэшрейт
  const isPremium = contract.status === 'in_wallet' || contract.hashrate >= 200
  const isNew = contract.metadata?.attributes?.some(
    attr => attr.trait_type === 'created' && 
    new Date(attr.value as string).getTime() > Date.now() - 3600000
  )

  return (
    <div
      onClick={handleClick}
      className={`
        card card-hover cursor-pointer relative overflow-hidden
        transition-all duration-500
        p-3 md:p-5
        flex flex-col
        h-full
        ${isHot ? 'ring-2 ring-danger/50 shadow-lg shadow-danger/20' : ''}
      `}
    >
      {/* Best Offer Badge - Top Right */}
      {bestOffer && (
        <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm rounded-lg px-2 py-0.5 md:px-3 md:py-1 z-10">
          <p className="text-[10px] md:text-xs text-white/80 mb-0.5">Best offer</p>
          <p className="text-xs md:text-sm font-bold text-white">{bestOffer.toFixed(2)} ∇</p>
        </div>
      )}

      {/* Badges */}
      {/* Reserved space for badges - consistent card height */}
      <div className="flex gap-1 md:gap-2 mb-2 md:mb-3 flex-wrap min-h-[20px] md:min-h-[28px]">
        {isHot && <span className="badge badge-hot text-[9px] md:text-xs px-1.5 md:px-3 py-0.5 md:py-1">🔥 HOT</span>}
        {isPremium && <span className="badge badge-premium text-[9px] md:text-xs px-1.5 md:px-3 py-0.5 md:py-1">💎 PREMIUM</span>}
        {isNew && <span className="badge badge-new text-[9px] md:text-xs px-1.5 md:px-3 py-0.5 md:py-1">🆕 NEW</span>}
      </div>

      {/* Header */}
      <div className="mb-2 md:mb-3">
        <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
          Contract #{contract.contractNumber}
        </p>
        <h3 className="text-lg md:text-2xl font-bold gradient-text truncate">
          {contract.hashrate} TH/s
        </h3>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 py-2 md:py-3 border-y border-gray-200 dark:border-gray-700 my-2 md:my-3">
        <div className="min-w-0">
          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-0.5 md:mb-1 flex items-center gap-0.5 md:gap-1">
            <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" />
            <span className="truncate">Days Left</span>
          </p>
          <p className="font-semibold text-xs md:text-sm text-gray-900 dark:text-white truncate">{daysLeft}d</p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-0.5 md:mb-1 flex items-center gap-0.5 md:gap-1">
            <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" />
            <span className="truncate">Daily</span>
          </p>
          <p className="font-semibold text-xs md:text-sm text-warning truncate" title={`${contract.dailyIncome.toFixed(8)} BTC`}>
            {contract.dailyIncome.toFixed(8)} BTC
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="mb-2 md:mb-3">
        <p className="text-[9px] md:text-[10px] text-gray-400 dark:text-gray-500 mb-0.5 truncate">
          Fair Price: ${contract.fairPrice.toLocaleString()}
        </p>
        {/* Reserved space for "Was" price - consistent height */}
        <div className="min-h-[14px] md:min-h-[18px]">
          {contract.initialPrice && contract.initialPrice !== contract.currentPrice && (
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 line-through mb-0.5 md:mb-1 truncate">
              Was: ${contract.initialPrice.toLocaleString()}
            </p>
          )}
        </div>
        <p className="text-lg md:text-2xl font-bold text-success mb-0.5 md:mb-1 truncate">
          ${contract.currentPrice.toLocaleString()}
        </p>
        {/* Reserved space for discount - consistent height */}
        <div className="min-h-[16px] md:min-h-[20px]">
          {discount > 0 && (
            <p className="text-danger font-semibold text-xs md:text-sm truncate">
              -{discount}% 💰
            </p>
          )}
        </div>
      </div>

      {/* ROI - Reserved space for consistent height */}
      <div className="mb-2 md:mb-3 min-h-[50px] md:min-h-[64px]">
        {contract.roi && (
          <div className="bg-success/10 border border-success/30 rounded-lg p-1.5 md:p-2 text-center">
            <p className="text-[9px] md:text-xs text-gray-600 dark:text-gray-400 uppercase mb-0.5 md:mb-1">
              ROI
            </p>
            <p className="text-base md:text-xl font-bold text-success">
              {contract.roi}%
            </p>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="flex justify-between text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-2 md:mb-3">
        <span className="flex items-center gap-0.5 md:gap-1 truncate">
          <Eye className="w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" />
          <span className="hidden md:inline">234 views</span>
          <span className="md:hidden">234</span>
        </span>
        <span className="flex items-center gap-0.5 md:gap-1 truncate">
          <Heart className="w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" />
          <span className="hidden md:inline">12 watching</span>
          <span className="md:hidden">12</span>
        </span>
      </div>

      {/* Actions - Pushed to bottom */}
      {showActions && (
        <div className="space-y-1.5 md:space-y-2 mt-auto">
          <button
            onClick={handleBuy}
            className="btn btn-primary w-full text-[11px] md:text-sm py-1.5 md:py-2 transition-all duration-300 hover:scale-105"
          >
            <span className="hidden md:inline">BUY NOW - </span>
            <span className="md:hidden">BUY </span>
            ${contract.currentPrice.toLocaleString()}
          </button>
          <button
            onClick={handleAddToCart}
            className="btn btn-secondary w-full text-[11px] md:text-sm py-1.5 md:py-2 transition-all duration-300"
          >
            <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 inline mr-1 md:mr-2" />
            <span className="hidden md:inline">Add to Cart</span>
            <span className="md:hidden">Cart</span>
          </button>
        </div>
      )}
    </div>
  )
}
