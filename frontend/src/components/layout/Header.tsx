import { useNavigate } from 'react-router-dom'
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import { useAppStore } from '@/store/appStore'
import { useTelegram } from '@/hooks/useTelegram'
import { Wallet, Moon, Sun, Bell, ShoppingCart } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  const [tonConnectUI] = useTonConnectUI()
  const userFriendlyAddress = useTonAddress()
  const { theme, toggleTheme, user, notifications, getCartItemCount } = useAppStore()
  const { haptic } = useTelegram()
  
  const cartItemCount = getCartItemCount()

  const handleConnect = async () => {
    haptic.light()
    if (userFriendlyAddress) {
      await tonConnectUI.disconnect()
    } else {
      await tonConnectUI.openModal()
    }
  }

  const handleThemeToggle = () => {
    haptic.selection()
    toggleTheme()
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-50 bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border backdrop-blur-md bg-opacity-95">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold">₿</span>
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">
                ECOS
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {user?.firstName || 'Guest'} • {user?.ecosPoints || 0}⭐
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <button
              onClick={() => {
                haptic.light()
                navigate('/cart')
              }}
              className="relative p-2 hover:bg-light-bg dark:hover:bg-dark-bg rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-success rounded-full text-[10px] flex items-center justify-center font-bold px-1">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={() => {
                haptic.light()
                navigate('/notifications')
              }}
              className="relative p-2 hover:bg-light-bg dark:hover:bg-dark-bg rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full text-[10px] flex items-center justify-center font-bold">
                  {notifications}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 hover:bg-light-bg dark:hover:bg-dark-bg rounded-lg transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Wallet Connect */}
            <button
              onClick={handleConnect}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all
                ${userFriendlyAddress
                  ? 'bg-dark-bg border border-primary text-primary'
                  : 'bg-gradient-to-r from-primary to-primary-dark text-white'
                }
              `}
            >
              <Wallet className="w-4 h-4" />
              <span className="text-sm">
                {userFriendlyAddress 
                  ? formatAddress(userFriendlyAddress)
                  : 'Connect'
                }
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
