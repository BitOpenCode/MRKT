import { useState } from 'react'
import { Ticket, Plus, Minus, ShoppingCart } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import { USER_LEVELS } from '@/types'
import toast from 'react-hot-toast'

interface Props {
  ticketPrice: number
  userEcosPoints: number
  userBalance: number // USDT balance
  userLevel: number // User's current level
  onPurchase: (count: number, usePoints: boolean) => Promise<void>
}

export default function LotteryTicketPurchase({ ticketPrice, userEcosPoints, userBalance, userLevel, onPurchase }: Props) {
  const { haptic } = useTelegram()
  const [ticketCount, setTicketCount] = useState(1)
  const [usePoints, setUsePoints] = useState(false)
  const [purchasing, setPurchasing] = useState(false)

  // Get discount % based on user level
  const levelData = USER_LEVELS.find(l => l.level === userLevel) || USER_LEVELS[0]
  const maxPointsDiscount = levelData.ecosPointsDiscount / 100 // Convert to decimal (e.g., 20 -> 0.20)
  const pointsNeeded = Math.floor(ticketPrice * ticketCount * maxPointsDiscount)
  const canUsePoints = userEcosPoints >= pointsNeeded

  const totalPrice = usePoints && canUsePoints
    ? ticketPrice * ticketCount * (1 - maxPointsDiscount)
    : ticketPrice * ticketCount
  
  const hasEnoughBalance = userBalance >= totalPrice

  const handlePurchase = async () => {
    if (ticketCount < 1) {
      toast.error('Select at least 1 ticket')
      return
    }

    if (!hasEnoughBalance) {
      toast.error(`Insufficient balance! Need $${totalPrice.toFixed(2)} USDT`)
      return
    }

    haptic.heavy()
    setPurchasing(true)
    try {
      await onPurchase(ticketCount, usePoints && canUsePoints)
      toast.success(`Successfully purchased ${ticketCount} ticket${ticketCount > 1 ? 's' : ''}!`)
      setTicketCount(1)
    } catch (error) {
      toast.error('Failed to purchase tickets')
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <div className="card p-6 border-warning/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center shadow-lg">
          <Ticket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-dark-text">Buy Lottery Tickets</h3>
          <p className="text-sm text-dark-text-secondary">
            ${ticketPrice} USDT per ticket
          </p>
        </div>
      </div>

      {/* Ticket Counter */}
      <div className="bg-dark-bg/50 rounded-lg p-4 mb-4">
        <p className="text-sm text-dark-text-secondary mb-3">Number of tickets:</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              haptic.light()
              setTicketCount(Math.max(1, ticketCount - 1))
            }}
            disabled={ticketCount <= 1}
            className="btn btn-secondary w-12 h-12 p-0 disabled:opacity-30"
          >
            <Minus className="w-5 h-5 mx-auto" />
          </button>
          
          <div className="flex-1 text-center">
            <p className="text-4xl font-bold text-dark-text">{ticketCount}</p>
            <p className="text-xs text-dark-text-secondary mt-1">
              ticket{ticketCount > 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={() => {
              haptic.light()
              setTicketCount(Math.min(100, ticketCount + 1))
            }}
            disabled={ticketCount >= 100}
            className="btn btn-secondary w-12 h-12 p-0 disabled:opacity-30"
          >
            <Plus className="w-5 h-5 mx-auto" />
          </button>
        </div>

        {/* Quick select */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[1, 5, 10, 25].map((count) => (
            <button
              key={count}
              onClick={() => {
                haptic.light()
                setTicketCount(count)
              }}
              className={`btn text-sm py-2 ${
                ticketCount === count ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* ECOS Points Option */}
      {canUsePoints && (
        <div className="bg-dark-bg/50 rounded-lg p-4 mb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={usePoints}
              onChange={(e) => {
                haptic.selection()
                setUsePoints(e.target.checked)
              }}
              className="w-5 h-5 rounded border-2 border-warning/50 bg-dark-bg checked:bg-warning"
            />
            <div className="flex-1">
              <p className="font-semibold text-dark-text">Use ECOS Points</p>
              <p className="text-xs text-dark-text-secondary">
                Pay up to {levelData.ecosPointsDiscount}% with points ({pointsNeeded}⭐ / {userEcosPoints}⭐)
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-warning">-{maxPointsDiscount * 100}%</p>
            </div>
          </label>
        </div>
      )}

      {/* Price Summary */}
      <div className="bg-dark-surface/50 rounded-lg p-4 mb-4 border border-dark-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-dark-text-secondary">Subtotal:</span>
          <span className="font-semibold">${(ticketPrice * ticketCount).toFixed(2)} USDT</span>
        </div>
        {usePoints && canUsePoints && (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-dark-text-secondary">ECOS Points discount:</span>
              <span className="font-semibold text-warning">-{pointsNeeded}⭐ (-{levelData.ecosPointsDiscount}%)</span>
            </div>
            <div className="border-t border-dark-border my-2"></div>
          </>
        )}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-dark-text">Total:</span>
          <span className={`text-2xl font-bold ${hasEnoughBalance ? 'text-success' : 'text-danger'}`}>
            ${totalPrice.toFixed(2)} USDT
          </span>
        </div>
        <div className="mt-2 text-xs text-dark-text-secondary">
          Your balance: ${userBalance.toFixed(2)} USDT
        </div>
      </div>

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={purchasing || !hasEnoughBalance}
        className="btn btn-primary w-full btn-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {purchasing ? (
          <div className="spinner w-5 h-5 border-2"></div>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>Purchase Lottery Tickets</span>
          </>
        )}
      </button>

      {/* Balance Info */}
      {!hasEnoughBalance && (
        <div className="mt-3 text-center text-sm text-danger bg-danger/10 rounded-lg py-2 px-3">
          ⚠️ Insufficient USDT balance. Please top up your account.
        </div>
      )}
    </div>
  )
}
