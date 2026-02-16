import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, CreditCard, Wallet, ShoppingBag, Star, DollarSign, ArrowLeft } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useTelegram } from '@/hooks/useTelegram'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { haptic } = useTelegram()
  const { cart, user, clearCart, getCartTotal } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [useEcosPoints, setUseEcosPoints] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'usdt' | 'ton'>('usdt')

  const cartTotal = getCartTotal()
  const userLevel = user?.level || 1
  const maxPointsDiscount = userLevel === 5 ? 0.30 : userLevel === 4 ? 0.25 : userLevel === 3 ? 0.20 : 0
  const pointsNeeded = Math.floor(cartTotal * maxPointsDiscount * 100) // Assuming 1 USDT = 100 ECOS Points
  const canUsePoints = (user?.ecosPoints || 0) >= pointsNeeded && maxPointsDiscount > 0

  const finalPrice = useEcosPoints && canUsePoints
    ? cartTotal * (1 - maxPointsDiscount)
    : cartTotal

  const hasEnoughBalance = (user?.usdtBalance || 0) >= finalPrice

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login first')
      navigate('/profile')
      return
    }

    if (!hasEnoughBalance) {
      toast.error('Insufficient balance')
      return
    }

    if (cart.length === 0) {
      toast.error('Cart is empty')
      navigate('/cart')
      return
    }

    setLoading(true)
    haptic.heavy()

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // TODO: Implement actual purchase logic via API
      // const response = await api.purchaseContracts({
      //   items: cart,
      //   useEcosPoints,
      //   paymentMethod
      // })

      clearCart()
      toast.success('Purchase successful! 🎉', {
        duration: 5000,
      })
      
      // Navigate to success page or portfolio
      navigate('/portfolio')
    } catch (error) {
      toast.error('Purchase failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-dark-surface rounded-full flex items-center justify-center mb-4 animate-pulse-slow">
          <ShoppingBag className="w-12 h-12 text-dark-text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-dark-text mb-2">Your cart is empty</h2>
        <p className="text-dark-text-secondary mb-6 text-center">
          Add some contracts before checking out
        </p>
        <button
          onClick={() => {
            haptic.light()
            navigate('/marketplace')
          }}
          className="btn btn-primary"
        >
          Browse Marketplace
        </button>
      </div>
    )
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            haptic.light()
            navigate('/cart')
          }}
          className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold gradient-text">Checkout</h1>
          <p className="text-sm text-dark-text-secondary">
            Complete your purchase
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card p-4 mb-4">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          Order Summary
        </h3>
        
        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.contract.id} className="flex justify-between items-center py-2 border-b border-dark-border last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  BTC Mining Contract #{item.contract.contractNumber}
                </p>
                <p className="text-xs text-dark-text-secondary">
                  {item.contract.hashrate} TH/s × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold ml-2">
                ${((item.contract.currentPrice || 0) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-dark-border pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dark-text-secondary">Subtotal</span>
            <span className="font-semibold">${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dark-text-secondary">Service Fee</span>
            <span className="font-semibold">$0.00</span>
          </div>
          {useEcosPoints && canUsePoints && (
            <div className="flex justify-between text-sm">
              <span className="text-warning">ECOS Points Discount ({Math.round(maxPointsDiscount * 100)}%)</span>
              <span className="font-semibold text-warning">-${(cartTotal * maxPointsDiscount).toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-dark-border pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-success">${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="card p-4 mb-4">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Payment Method
        </h3>
        
        <div className="space-y-2">
          <button
            onClick={() => {
              haptic.selection()
              setPaymentMethod('usdt')
            }}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              paymentMethod === 'usdt'
                ? 'border-primary bg-primary/10'
                : 'border-dark-border bg-dark-bg/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-success" />
                <div className="text-left">
                  <p className="font-semibold">USDT Balance</p>
                  <p className="text-sm text-dark-text-secondary">
                    Available: ${(user?.usdtBalance || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                paymentMethod === 'usdt'
                  ? 'border-primary bg-primary'
                  : 'border-dark-border'
              }`}>
                {paymentMethod === 'usdt' && (
                  <CheckCircle className="w-full h-full text-white" />
                )}
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              haptic.selection()
              setPaymentMethod('ton')
            }}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              paymentMethod === 'ton'
                ? 'border-primary bg-primary/10'
                : 'border-dark-border bg-dark-bg/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">TON Wallet</p>
                  <p className="text-sm text-dark-text-secondary">
                    Pay with cryptocurrency
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                paymentMethod === 'ton'
                  ? 'border-primary bg-primary'
                  : 'border-dark-border'
              }`}>
                {paymentMethod === 'ton' && (
                  <CheckCircle className="w-full h-full text-white" />
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ECOS Points Discount */}
      {canUsePoints && (
        <div className="card p-4 mb-4 border-warning/30">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useEcosPoints}
              onChange={(e) => {
                haptic.selection()
                setUseEcosPoints(e.target.checked)
              }}
              className="w-5 h-5 rounded border-2 border-warning/50 bg-dark-bg checked:bg-warning"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-warning" />
                <p className="font-semibold text-dark-text">Use ECOS Points</p>
              </div>
              <p className="text-xs text-dark-text-secondary">
                Save {Math.round(maxPointsDiscount * 100)}% ({pointsNeeded}⭐) - Level {userLevel} benefit
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-warning">-{Math.round(maxPointsDiscount * 100)}%</p>
            </div>
          </label>
        </div>
      )}

      {/* Balance Warning */}
      {!hasEnoughBalance && (
        <div className="card p-4 mb-4 border-danger/30">
          <p className="text-danger text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>Insufficient balance. Please top up your account.</span>
          </p>
        </div>
      )}

      {/* Complete Purchase Button */}
      <button
        onClick={handleCheckout}
        disabled={loading || !hasEnoughBalance}
        className="btn btn-primary w-full btn-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="spinner w-5 h-5 border-2"></div>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Complete Purchase - ${finalPrice.toFixed(2)}</span>
          </>
        )}
      </button>

      {/* User Info */}
      {user && (
        <div className="mt-4 p-3 bg-dark-surface/50 rounded-lg text-xs text-dark-text-secondary">
          <p className="mb-1">
            <span className="font-semibold">USDT Balance:</span> ${(user.usdtBalance || 0).toFixed(2)}
          </p>
          <p>
            <span className="font-semibold">ECOS Points:</span> {(user.ecosPoints || 0).toLocaleString()}⭐
          </p>
        </div>
      )}
    </div>
  )
}
