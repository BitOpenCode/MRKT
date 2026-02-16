import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingDown, Clock, DollarSign, Calendar, Zap } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import api from '@/services/api'
import type { Offer } from '@/types'

export default function OffersPage() {
  const navigate = useNavigate()
  const { haptic } = useTelegram()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'best' | 'volume' | 'expiry'>('best')

  // Mock data - TODO: Load from API
  useEffect(() => {
    loadOffers()
  }, [sortBy])

  const loadOffers = async () => {
    try {
      setLoading(true)
      
      // Mock offers data
      const mockOffers: Offer[] = [
        {
          id: '1',
          listingId: 'listing1',
          itemId: 'MC-1000',
          pricePerTH: 21.25,
          totalBudget: 2125,
          minExpirationMonths: 3,
          floorPricePerTH: 21.25,
          difference: 0,
          offerCount: 3,
          userId: 'user1',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 2).toISOString(),
        },
        {
          id: '2',
          listingId: 'listing1',
          itemId: 'MC-1001',
          pricePerTH: 19.5,
          totalBudget: 1950,
          minExpirationMonths: 6,
          floorPricePerTH: 21.25,
          difference: -8.2,
          offerCount: 23,
          userId: 'user2',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 5).toISOString(),
        },
        {
          id: '3',
          listingId: 'listing1',
          itemId: 'MC-1002',
          pricePerTH: 17.0,
          totalBudget: 1700,
          minExpirationMonths: 9,
          floorPricePerTH: 21.25,
          difference: -20.0,
          offerCount: 1,
          userId: 'user3',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 1).toISOString(),
        },
        {
          id: '4',
          listingId: 'listing2',
          itemId: 'MC-1003',
          pricePerTH: 14.5,
          totalBudget: 1450,
          minExpirationMonths: 12,
          floorPricePerTH: 21.25,
          difference: -31.8,
          offerCount: 5,
          userId: 'user4',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
        },
        {
          id: '5',
          listingId: 'listing3',
          itemId: 'MC-1004',
          pricePerTH: 22.0,
          totalBudget: 2200,
          minExpirationMonths: 3,
          floorPricePerTH: 21.25,
          difference: 3.5,
          offerCount: 12,
          userId: 'user5',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(),
        },
        {
          id: '6',
          listingId: 'listing4',
          itemId: 'MC-1005',
          pricePerTH: 16.0,
          totalBudget: 1600,
          minExpirationMonths: 6,
          floorPricePerTH: 21.25,
          difference: -24.7,
          offerCount: 8,
          userId: 'user6',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 4).toISOString(),
        },
      ]

      // Sort offers
      let sortedOffers = [...mockOffers]
      if (sortBy === 'best') {
        sortedOffers.sort((a, b) => b.pricePerTH - a.pricePerTH)
      } else if (sortBy === 'volume') {
        sortedOffers.sort((a, b) => b.totalBudget - a.totalBudget)
      } else if (sortBy === 'expiry') {
        sortedOffers.sort((a, b) => 
          new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
        )
      }

      setOffers(sortedOffers)
    } catch (error) {
      console.error('Failed to load offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptOffer = (offer: Offer) => {
    haptic.medium()
    // TODO: Implement accept offer logic
    console.log('Accepting offer:', offer)
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime()
    const expiry = new Date(expiresAt).getTime()
    const diff = expiry - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            haptic.light()
            navigate(-1)
          }}
          className="btn btn-secondary p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Все офферы</h1>
          <p className="text-sm text-dark-text-secondary">
            Биддинг предложения на BTC Mining контракты
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="card p-4 mb-6 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold mb-1">Как работают офферы?</h3>
            <p className="text-sm text-dark-text-secondary">
              Пользователи размещают биды с указанием <strong>цены за TH</strong> (USDT), 
              <strong> бюджета</strong> и <strong>минимального срока годности</strong> контракта. 
              Если вы продаете контракт, вы можете быстро принять любой оффер.
            </p>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => {
            haptic.selection()
            setSortBy('best')
          }}
          className={`btn text-sm ${sortBy === 'best' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <TrendingDown className="w-4 h-4 mr-1" />
          Лучшая цена
        </button>
        <button
          onClick={() => {
            haptic.selection()
            setSortBy('volume')
          }}
          className={`btn text-sm ${sortBy === 'volume' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <DollarSign className="w-4 h-4 mr-1" />
          Бюджет
        </button>
        <button
          onClick={() => {
            haptic.selection()
            setSortBy('expiry')
          }}
          className={`btn text-sm ${sortBy === 'expiry' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Clock className="w-4 h-4 mr-1" />
          Истекает
        </button>
      </div>

      {/* Offers List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((offer, index) => (
            <div
              key={offer.id}
              className="card p-4 hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => handleAcceptOffer(offer)}
            >
              <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white' : 
                    index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                    index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white' :
                    'bg-dark-bg text-dark-text-secondary'}
                `}>
                  #{index + 1}
                </div>

                {/* Offer Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">
                        ${offer.pricePerTH.toFixed(2)} <span className="text-sm font-normal text-dark-text-secondary">за TH</span>
                      </h3>
                      {offer.difference !== 0 && (
                        <p className={`text-sm ${offer.difference > 0 ? 'text-success' : 'text-danger'}`}>
                          {offer.difference > 0 ? '+' : ''}{offer.difference.toFixed(1)}% от floor
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ${offer.totalBudget.toLocaleString()}
                      </p>
                      <p className="text-xs text-dark-text-secondary">бюджет</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-dark-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>Мин. {offer.minExpirationMonths} мес</span>
                    </div>
                    <div className="flex items-center gap-1 text-dark-text-secondary">
                      <Clock className="w-4 h-4" />
                      <span>Истекает через {getTimeRemaining(offer.expiresAt)}</span>
                    </div>
                    {offer.offerCount > 1 && (
                      <div className="flex items-center gap-1 text-warning">
                        <Zap className="w-4 h-4" />
                        <span className="font-semibold">{offer.offerCount} офферов</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAcceptOffer(offer)
                  }}
                  className="btn btn-primary whitespace-nowrap"
                >
                  Продать {offer.offerCount > 1 ? `(x${offer.offerCount})` : ''}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && offers.length === 0 && (
        <div className="card p-8 text-center">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-dark-text-secondary/50" />
          <h3 className="text-xl font-bold mb-2">Нет активных офферов</h3>
          <p className="text-dark-text-secondary">
            Пока никто не разместил биддинг предложения
          </p>
        </div>
      )}
    </div>
  )
}
