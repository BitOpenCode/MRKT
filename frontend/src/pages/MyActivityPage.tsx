import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X, Package, DollarSign, ShoppingCart, Gift, AlertCircle } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/store/appStore'
import { format } from 'date-fns'

interface Activity {
  id: string
  type: 'buy' | 'listing' | 'offer' | 'offer_reject' | 'delist' | 'offer_accept'
  itemName: string
  itemImage: string
  itemId: string
  price?: number
  date: string
  status: 'success' | 'failed' | 'pending'
}

export default function MyActivityPage() {
  const { haptic } = useTelegram()
  const { user } = useAppStore()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    type: 'all',
    priceMin: '',
    priceMax: '',
    dateFrom: '',
    dateTo: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)
      
      // Mock data - TODO: Load from API
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'delist',
          itemName: 'Lol Pop',
          itemImage: '/lol-pop.png',
          itemId: '#66965',
          date: '2026-02-12T00:00:00Z',
          status: 'success',
        },
        {
          id: '2',
          type: 'offer_reject',
          itemName: 'Lol Pop',
          itemImage: '/lol-pop.png',
          itemId: '#66965',
          date: '2026-02-10T00:00:00Z',
          status: 'failed',
        },
        {
          id: '3',
          type: 'offer',
          itemName: 'Lol Pop',
          itemImage: '/lol-pop.png',
          itemId: '#66965',
          date: '2026-02-10T00:00:00Z',
          status: 'pending',
        },
        {
          id: '4',
          type: 'listing',
          itemName: 'Lol Pop',
          itemImage: '/lol-pop.png',
          itemId: '#66965',
          price: 8,
          date: '2026-02-10T00:00:00Z',
          status: 'success',
        },
        {
          id: '5',
          type: 'buy',
          itemName: 'Lol Pop',
          itemImage: '/lol-pop.png',
          itemId: '#66965',
          price: -4.44,
          date: '2026-02-01T00:00:00Z',
          status: 'success',
        },
        {
          id: '6',
          type: 'buy',
          itemName: 'Homemade Cake',
          itemImage: '/cake.png',
          itemId: '#12345',
          price: -20,
          date: '2026-01-28T00:00:00Z',
          status: 'success',
        },
        {
          id: '7',
          type: 'buy',
          itemName: 'Spy Agaric',
          itemImage: '/mushroom.png',
          itemId: '#67890',
          price: -15,
          date: '2026-01-28T00:00:00Z',
          status: 'success',
        },
      ]

      setActivities(mockActivities)
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'buy':
        return <ShoppingCart className="w-4 h-4 text-success" />
      case 'listing':
        return <Package className="w-4 h-4 text-info" />
      case 'offer':
        return <Gift className="w-4 h-4 text-warning" />
      case 'offer_reject':
        return <X className="w-4 h-4 text-danger" />
      case 'offer_accept':
        return <Gift className="w-4 h-4 text-success" />
      case 'delist':
        return <AlertCircle className="w-4 h-4 text-danger" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getActivityLabel = (type: Activity['type']) => {
    switch (type) {
      case 'buy':
        return 'Buy'
      case 'listing':
        return 'Listing'
      case 'offer':
        return 'Offer'
      case 'offer_reject':
        return 'Offer reject'
      case 'offer_accept':
        return 'Offer accept'
      case 'delist':
        return 'Delist'
      default:
        return type
    }
  }

  const getStatusBadge = (activity: Activity) => {
    if (activity.type === 'offer_reject') {
      return (
        <div className="w-8 h-8 bg-danger/20 rounded-full flex items-center justify-center flex-shrink-0">
          <X className="w-5 h-5 text-danger" />
        </div>
      )
    }
    if (activity.type === 'offer') {
      return (
        <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Gift className="w-5 h-5 text-warning" />
        </div>
      )
    }
    if (activity.type === 'listing') {
      return (
        <div className="w-8 h-8 bg-info/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Package className="w-5 h-5 text-info" />
        </div>
      )
    }
    if (activity.type === 'buy') {
      return (
        <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
          <ShoppingCart className="w-5 h-5 text-success" />
        </div>
      )
    }
    return null
  }

  const groupActivitiesByDate = (activities: Activity[]) => {
    const grouped: Record<string, Activity[]> = {}
    
    activities.forEach((activity) => {
      const date = format(new Date(activity.date), 'd MMMM yyyy')
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(activity)
    })
    
    return grouped
  }

  const groupedActivities = groupActivitiesByDate(activities)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My activity</h1>
        <p className="text-dark-text-secondary">
          История ваших действий на маркетплейсе
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-secondary pointer-events-none" />
        <input
          type="text"
          placeholder="Search by ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-12 pr-4"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => {
            haptic.selection()
            setFilters({ ...filters, type: 'all' })
          }}
          className={`btn flex-shrink-0 text-sm ${filters.type === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All
        </button>
        <button
          onClick={() => {
            haptic.selection()
            setFilters({ ...filters, type: 'buy' })
          }}
          className={`btn flex-shrink-0 text-sm ${filters.type === 'buy' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Buy
        </button>
        <button
          onClick={() => {
            haptic.selection()
            setFilters({ ...filters, type: 'listing' })
          }}
          className={`btn flex-shrink-0 text-sm ${filters.type === 'listing' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Listing
        </button>
        <button
          onClick={() => {
            haptic.selection()
            setFilters({ ...filters, type: 'offer' })
          }}
          className={`btn flex-shrink-0 text-sm ${filters.type === 'offer' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Offer
        </button>
        <button
          onClick={() => {
            haptic.selection()
            setShowFilters(!showFilters)
          }}
          className="btn btn-secondary flex-shrink-0 text-sm ml-auto"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="card p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Price Min</label>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Price Max</label>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                className="input"
                placeholder="∞"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="input"
            />
          </div>
          <button
            onClick={() => {
              haptic.medium()
              setFilters({
                type: 'all',
                priceMin: '',
                priceMax: '',
                dateFrom: '',
                dateTo: '',
              })
            }}
            className="btn btn-secondary w-full"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Activities List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, dayActivities]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-dark-text-secondary uppercase mb-3">
                {date}
              </h3>
              <div className="space-y-2">
                {dayActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="card p-4 hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {/* Item Image */}
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                        <Package className="w-6 h-6 text-primary" />
                        {/* Status Badge */}
                        <div className="absolute -bottom-1 -right-1">
                          {getStatusBadge(activity)}
                        </div>
                      </div>

                      {/* Activity Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold mb-0.5">{activity.itemName}</h4>
                        <p className="text-xs text-dark-text-secondary">
                          {getActivityLabel(activity.type)}
                        </p>
                      </div>

                      {/* Price */}
                      {activity.price && (
                        <div className="text-right">
                          <p className={`text-lg font-bold ${activity.price < 0 ? 'text-danger' : 'text-success'}`}>
                            {activity.price < 0 ? '' : '+'}{activity.price.toFixed(2)} USDT
                          </p>
                          <p className="text-xs text-dark-text-secondary">
                            {activity.price < 0 ? 'Your price' : 'Earned'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && activities.length === 0 && (
        <div className="card p-8 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-dark-text-secondary/50" />
          <h3 className="text-xl font-bold mb-2">Нет активности</h3>
          <p className="text-dark-text-secondary">
            Начните торговать на маркетплейсе
          </p>
        </div>
      )}
    </div>
  )
}
