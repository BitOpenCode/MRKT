import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Zap, Trophy, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useTelegram } from '@/hooks/useTelegram'
import api from '@/services/api'
import ContractCard from '@/components/ContractCard'
import type { MarketplaceListing, Activity } from '@/types'

export default function HomePage() {
  const { user } = useAppStore()
  const { haptic } = useTelegram()
  const [hotDeals, setHotDeals] = useState<MarketplaceListing[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [stats, setStats] = useState({
    marketVolume: 0,
    deals24h: 0,
    avgDiscount: 0,
    onlineUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load hot deals
      const listingsRes = await api.getMarketplaceListings({
        sortBy: 'discount',
        badges: ['hot'],
      }, 1, 6)
      
      if (listingsRes.success && listingsRes.data) {
        setHotDeals(listingsRes.data.items)
      }

      // Load activity
      const activityRes = await api.getActivityFeed(10)
      if (activityRes.success && activityRes.data) {
        setActivity(activityRes.data)
      }

      // Load online users
      const onlineRes = await api.getOnlineUsers()
      if (onlineRes.success && onlineRes.data) {
        setStats(prev => ({ ...prev, onlineUsers: onlineRes.data!.count }))
      }

      // Mock stats (replace with real API calls)
      setStats({
        marketVolume: 847392,
        deals24h: 127,
        avgDiscount: 18.3,
        onlineUsers: 89,
      })
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Welcome Section */}
      <section className="card border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Привет, {user?.firstName || 'Guest'}! 👋
            </h2>
            <p className="text-dark-text-secondary">
              Добро пожаловать в TON Mining Marketplace
            </p>
          </div>
          <div className="text-4xl">⚡</div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-xs text-dark-text-secondary uppercase mb-2">
            Market Volume
          </p>
          <p className="text-2xl font-bold">
            ${stats.marketVolume.toLocaleString()}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-dark-text-secondary uppercase mb-2">
            24h Deals
          </p>
          <p className="text-2xl font-bold text-success">
            {stats.deals24h} ↑
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-dark-text-secondary uppercase mb-2">
            Avg Discount
          </p>
          <p className="text-2xl font-bold text-danger">
            -{stats.avgDiscount}%
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-dark-text-secondary uppercase mb-2">
            Online Now
          </p>
          <p className="text-2xl font-bold">
            {stats.onlineUsers}
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-3 gap-4">
        <Link
          to="/marketplace"
          onClick={() => haptic.selection()}
          className="card card-hover text-center"
        >
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-semibold">Marketplace</p>
        </Link>
        <Link
          to="/mining"
          onClick={() => haptic.selection()}
          className="card card-hover text-center"
        >
          <Zap className="w-8 h-8 mx-auto mb-2 text-success" />
          <p className="font-semibold">Mining</p>
        </Link>
        <Link
          to="/lottery"
          onClick={() => haptic.selection()}
          className="card card-hover text-center"
        >
          <Trophy className="w-8 h-8 mx-auto mb-2 text-warning" />
          <p className="font-semibold">Lottery</p>
        </Link>
      </section>

      {/* Hot Deals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            🔥 Hot Deals
          </h3>
          <Link
            to="/marketplace?filter=hot"
            onClick={() => haptic.light()}
            className="text-primary text-sm font-semibold flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-dark-bg rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotDeals.map((listing) => (
              <ContractCard
                key={listing.id}
                contract={listing.item as any}
              />
            ))}
          </div>
        )}
      </section>

      {/* Live Activity */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-danger rounded-full animate-pulse"></div>
          <h3 className="text-xl font-bold">Live Activity</h3>
        </div>
        
        <div className="card space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
          {activity.length === 0 ? (
            <p className="text-center text-dark-text-secondary py-8">
              No recent activity
            </p>
          ) : (
            activity.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-dark-bg rounded-lg border border-dark-border animate-slide-in"
              >
                <p className="text-xs text-dark-text-secondary mb-1">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </p>
                <p className="text-sm">
                  <span className={`
                    badge text-[10px] mr-2
                    ${item.type === 'sale' ? 'badge-new' : ''}
                    ${item.type === 'listing' ? 'bg-blue-500' : ''}
                    ${item.type === 'price_drop' ? 'badge-hot' : ''}
                  `}>
                    {item.type.toUpperCase()}
                  </span>
                  {item.message}
                </p>
                {item.highlight && (
                  <p className="text-sm font-semibold text-success mt-1">
                    {item.highlight}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
