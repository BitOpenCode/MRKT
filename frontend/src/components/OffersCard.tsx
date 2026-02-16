import { Gift, TrendingUp, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '@/hooks/useTelegram'
import type { SmartContract, Offer } from '@/types'

interface Props {
  contract: SmartContract
  offers: Offer[]
  bestOffer: Offer
}

export default function OffersCard({ contract, offers, bestOffer }: Props) {
  const navigate = useNavigate()
  const { haptic } = useTelegram()

  const handleClick = () => {
    haptic.medium()
    navigate('/offers')
  }

  const floorPricePerTH = contract.currentPrice / contract.hashrate
  const totalContractPrice = contract.currentPrice
  const daysLeft = Math.ceil(
    (new Date(contract.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  const monthsLeft = Math.floor(daysLeft / 30)

  return (
    <div
      onClick={handleClick}
      className="card card-hover cursor-pointer relative overflow-hidden transition-all duration-500 border-2 border-blue-400/40 flex flex-col h-full p-3 md:p-5 hover:shadow-xl hover:shadow-blue-500/20"
    >
      {/* Animated Badge - Top Right */}
      <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg px-2 py-1 md:px-3 md:py-1.5 animate-pulse">
        <p className="text-[9px] md:text-xs font-bold text-white flex items-center gap-1">
          <Zap className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden md:inline">{offers.length} ОФФЕРОВ</span>
          <span className="md:hidden">{offers.length}</span>
        </p>
      </div>

      {/* Header with Icon */}
      <div className="flex items-center gap-2 mb-2 md:mb-3">
        <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
          <Gift className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-[10px] md:text-xs text-blue-400 font-bold mb-0.5 truncate uppercase">🎁 Биддинг</p>
          <p className="text-base md:text-xl font-bold gradient-text truncate">
            {contract.hashrate} TH/s
          </p>
        </div>
      </div>

      {/* Best Offer - Main Focus with Glow */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50 rounded-xl p-2 md:p-3 mb-2 md:mb-3 shadow-lg shadow-blue-500/10">
        <div className="flex items-center gap-1 md:gap-2 mb-1">
          <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
          <p className="text-[10px] md:text-xs text-blue-400 font-bold uppercase">Best Offer</p>
        </div>
        <p className="text-xl md:text-3xl font-black text-blue-400 mb-1 leading-none">
          {bestOffer.pricePerTH.toFixed(2)}
        </p>
        <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-1.5">
          USDT per TH/s
        </p>
        <div className="flex items-center justify-between text-[9px] md:text-xs">
          <span className="text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
            <span className="hidden md:inline">Budget:</span>
            <span className="font-bold text-gray-900 dark:text-white">{bestOffer.totalBudget.toFixed(0)}</span>
          </span>
          <span className="bg-success/20 text-success px-1.5 py-0.5 rounded font-bold flex-shrink-0">
            {bestOffer.minExpirationMonths}mo+
          </span>
        </div>
      </div>

      {/* Compact Stats - Только биддинг информация */}
      <div className="grid grid-cols-1 gap-1.5 md:gap-2 mb-2 md:mb-3">
        <div className="bg-gray-100 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1.5 md:p-2 border border-gray-200 dark:border-gray-700">
          <p className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 truncate uppercase">Floor/TH</p>
          <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate">${floorPricePerTH.toFixed(2)}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1.5 md:p-2 border border-gray-200 dark:border-gray-700">
          <p className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 truncate uppercase">Разница</p>
          <p className={`text-xs md:text-sm font-bold truncate ${bestOffer.difference < 0 ? 'text-danger' : 'text-success'}`}>
            {bestOffer.difference > 0 && '+'}{bestOffer.difference.toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1.5 md:p-2 border border-gray-200 dark:border-gray-700">
          <p className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 truncate uppercase">Офферов</p>
          <p className="text-xs md:text-sm font-bold text-blue-400 truncate">{offers.length}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation()
            haptic.medium()
          }}
          className="bg-gradient-to-r from-success to-emerald-500 text-white font-semibold text-xs py-2.5 rounded-lg transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-1"
        >
          💰 Продать
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-xs py-2.5 rounded-lg transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-1"
        >
          👁 Все {offers.length}
        </button>
      </div>
    </div>
  )
}
