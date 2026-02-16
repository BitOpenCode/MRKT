import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useTelegram } from './hooks/useTelegram'
import { useAppStore } from './store/appStore'

// Pages
import HomePage from './pages/HomePage'
import MarketplacePage from './pages/MarketplacePage'
import ProfilePage from './pages/ProfilePage'
import ContractDetailsPage from './pages/ContractDetailsPage'
import MiningPage from './pages/MiningPage'
import LotteryPage from './pages/LotteryPage'
import OffersPage from './pages/OffersPage'
import PortfolioPage from './pages/PortfolioPage'
import MyActivityPage from './pages/MyActivityPage'
import NotificationsPage from './pages/NotificationsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import SettingsPage from './pages/SettingsPage'

// Layout
import Layout from './components/layout/Layout'

function App() {
  const { webApp, user } = useTelegram()
  const { theme, setUser, setTheme } = useAppStore()

  // Initialize theme from store
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    // Initialize Telegram WebApp
    if (webApp) {
      webApp.ready()
      webApp.expand()
      
      // Don't override user's theme preference with Telegram theme
      // User can manually change theme via settings
    }

    // Set user from Telegram
    if (user) {
      setUser({
        id: user.id.toString(),
        telegramId: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: new Date().toISOString(),
      })
    }
  }, [webApp, user, setUser, setTheme])

  return (
    <div className="min-h-screen bg-inherit">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1a1f3a' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#1a1f3a',
            border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="contract/:id" element={<ContractDetailsPage />} />
          <Route path="mining" element={<MiningPage />} />
          <Route path="lottery" element={<LotteryPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="activity" element={<MyActivityPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
