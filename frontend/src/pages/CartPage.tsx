import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useTelegram } from '@/hooks/useTelegram'
import toast from 'react-hot-toast'

export default function CartPage() {
  const navigate = useNavigate()
  const { haptic } = useTelegram()
  const { cart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, user } = useAppStore()
  const [loading, setLoading] = useState(false)

  const cartTotal = getCartTotal()
  const hasItems = cart.length > 0

  const handleQuantityChange = (contractId: string, newQuantity: number) => {
    haptic.selection()
    updateCartQuantity(contractId, newQuantity)
  }

  const handleRemove = (contractId: string) => {
    haptic.warning()
    removeFromCart(contractId)
    toast.success('Removed from cart')
  }

  const handleClearCart = () => {
    haptic.heavy()
    clearCart()
    toast.success('Cart cleared')
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout')
      navigate('/profile')
      return
    }
    
    haptic.heavy()
    navigate('/checkout')
  }

  if (!hasItems) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-dark-surface rounded-full flex items-center justify-center mb-4 animate-pulse-slow">
          <ShoppingCart className="w-12 h-12 text-dark-text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-dark-text mb-2">Your cart is empty</h2>
        <p className="text-dark-text-secondary mb-6 text-center">
          Start shopping for cloud mining contracts!
        </p>
        <button
          onClick={() => {
            haptic.light()
            navigate('/marketplace')
          }}
          className="btn btn-primary"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Browse Marketplace
        </button>
      </div>
    )
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1">Shopping Cart</h1>
          <p className="text-sm text-dark-text-secondary">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        {hasItems && (
          <button
            onClick={handleClearCart}
            className="btn btn-secondary text-danger text-sm"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-4">
        {cart.map((item) => (
          <div
            key={item.contract.id}
            className="card p-4 border-dark-border hover:border-primary/30 transition-all"
          >
            <div className="flex gap-4">
              {/* Contract Image/Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">⚡</span>
              </div>

              {/* Contract Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-dark-text mb-1 truncate">
                      BTC Mining Contract
                    </h3>
                    <p className="text-sm text-dark-text-secondary">
                      #{item.contract.contractNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.contract.id)}
                    className="p-1 hover:bg-danger/20 rounded transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5 text-danger" />
                  </button>
                </div>

                {/* Contract Details */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-dark-text-secondary">Hashrate</p>
                    <p className="text-sm font-semibold">{item.contract.hashrate} TH/s</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-text-secondary">Duration</p>
                    <p className="text-sm font-semibold">
                      {Math.ceil((new Date(item.contract.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>

                {/* Quantity and Price */}
                <div className="flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.contract.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="btn btn-secondary w-8 h-8 p-0 disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4 mx-auto" />
                    </button>
                    <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.contract.id, item.quantity + 1)}
                      className="btn btn-secondary w-8 h-8 p-0"
                    >
                      <Plus className="w-4 h-4 mx-auto" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-xs text-dark-text-secondary">Subtotal</p>
                    <p className="text-xl font-bold text-success">
                      ${((item.contract.currentPrice || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="card p-4 border-primary/30 mb-4">
        <h3 className="text-lg font-bold mb-3">Order Summary</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-dark-text-secondary">Subtotal</span>
            <span className="font-semibold">${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dark-text-secondary">Service Fee</span>
            <span className="font-semibold">$0.00</span>
          </div>
          <div className="border-t border-dark-border pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-success">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {user && (
          <div className="bg-dark-bg/50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-dark-text-secondary">Your Balance</span>
              <span className="text-lg font-bold text-warning">${(user.usdtBalance || 0).toFixed(2)}</span>
            </div>
            {user.usdtBalance < cartTotal && (
              <p className="text-xs text-danger mt-2">
                ⚠️ Insufficient balance. Please top up your account.
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading || (user && user.usdtBalance < cartTotal)}
          className="btn btn-primary w-full btn-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="spinner w-5 h-5 border-2"></div>
          ) : (
            <>
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Continue Shopping */}
      <button
        onClick={() => {
          haptic.light()
          navigate('/marketplace')
        }}
        className="btn btn-secondary w-full"
      >
        <ShoppingBag className="w-5 h-5 mr-2" />
        Continue Shopping
      </button>
    </div>
  )
}
