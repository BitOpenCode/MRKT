import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Gift, Package, DollarSign, Clock, Check, X } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/store/appStore'

interface OfferNotification {
  id: string
  type: 'received' | 'placed'
  itemName: string
  itemId: string
  itemImage: string
  pricePerTH: number
  totalBudget: number
  minExpirationMonths: number
  fromUser?: string
  toUser?: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  createdAt: string
  expiresAt: string
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { haptic } = useTelegram()
  const { user, setNotifications } = useAppStore()
  const [activeTab, setActiveTab] = useState<'received' | 'placed'>('received')
  const [offers, setOffers] = useState<OfferNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOffers()
    // Clear notifications badge
    setNotifications(0)
  }, [])

  const loadOffers = async () => {
    try {
      setLoading(true)
      
      // Mock data - TODO: Load from API
      const mockOffers: OfferNotification[] = [
        {
          id: '1',
          type: 'received',
          itemName: 'BTC Mining Contract #1000',
          itemId: 'MC-1000',
          itemImage: '/contract.png',
          pricePerTH: 21.25,
          totalBudget: 2125,
          minExpirationMonths: 3,
          fromUser: 'alice',
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          type: 'received',
          itemName: 'BTC Mining Contract #1002',
          itemId: 'MC-1002',
          itemImage: '/contract.png',
          pricePerTH: 19.5,
          totalBudget: 1950,
          minExpirationMonths: 6,
          fromUser: 'bob',
          status: 'pending',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'placed',
          itemName: 'BTC Mining Contract #5000',
          itemId: 'MC-5000',
          itemImage: '/contract.png',
          pricePerTH: 22.0,
          totalBudget: 2200,
          minExpirationMonths: 3,
          toUser: 'charlie',
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          type: 'placed',
          itemName: 'BTC Mining Contract #5001',
          itemId: 'MC-5001',
          itemImage: '/contract.png',
          pricePerTH: 17.0,
          totalBudget: 1700,
          minExpirationMonths: 9,
          toUser: 'david',
          status: 'rejected',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
      ]

      setOffers(mockOffers)
    } catch (error) {
      console.error('Failed to load offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptOffer = async (offerId: string) => {
    haptic.medium()
    // TODO: Accept offer API call
    console.log('Accept offer:', offerId)
    setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'accepted' as const } : o))
  }

  const handleRejectOffer = async (offerId: string) => {
    haptic.medium()
    // TODO: Reject offer API call
    console.log('Reject offer:', offerId)
    setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'rejected' as const } : o))
  }

  const handleCancelOffer = async (offerId: string) => {
    haptic.medium()
    // TODO: Cancel offer API call
    console.log('Cancel offer:', offerId)
    setOffers(offers.filter(o => o.id !== offerId))
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime()
    const expiry = new Date(expiresAt).getTime()
    const diff = expiry - now
    
    if (diff < 0) return 'Expired'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }

  const receivedOffers = offers.filter(o => o.type === 'received')
  const placedOffers = offers.filter(o => o.type === 'placed')
  const displayOffers = activeTab === 'received' ? receivedOffers : placedOffers

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
          <h1 className="text-2xl font-bold">Offers</h1>
          <p className="text-sm text-dark-text-secondary">
            Управление офферами
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            haptic.selection()
            setActiveTab('received')
          }}
          className={`
            flex-1 px-4 py-3 rounded-lg font-semibold transition-all
            ${activeTab === 'received' 
              ? 'bg-white text-dark-bg' 
              : 'bg-dark-bg text-dark-text-secondary'
            }
          `}
        >
          Received {receivedOffers.length}
        </button>
        <button
          onClick={() => {
            haptic.selection()
            setActiveTab('placed')
          }}
          className={`
            flex-1 px-4 py-3 rounded-lg font-semibold transition-all
            ${activeTab === 'placed' 
              ? 'bg-white text-dark-bg' 
              : 'bg-dark-bg text-dark-text-secondary'
            }
          `}
        >
          Placed {placedOffers.length}
        </button>
      </div>

      {/* Offers List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : displayOffers.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-dark-bg rounded-full flex items-center justify-center">
            <Gift className="w-12 h-12 text-dark-text-secondary" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            {activeTab === 'received' ? 'No received offers' : 'No placed offers'}
          </h3>
          <p className="text-dark-text-secondary mb-4">
            {activeTab === 'received' 
              ? 'Когда кто-то сделает оффер на ваш контракт, он появится здесь'
              : 'Делайте офферы на контракты других пользователей'
            }
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="btn btn-primary"
          >
            Go to marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayOffers.map((offer) => (
            <div
              key={offer.id}
              className="card p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Item Image */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-7 h-7 text-primary" />
                </div>

                {/* Offer Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold mb-1">{offer.itemName}</h4>
                  <p className="text-xs text-dark-text-secondary mb-2">
                    {activeTab === 'received' ? `From @${offer.fromUser}` : `To @${offer.toUser}`}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-dark-text-secondary">
                      ${offer.pricePerTH.toFixed(2)}/TH
                    </span>
                    <span className="text-dark-text-secondary">•</span>
                    <span className="text-primary font-semibold">
                      ${offer.totalBudget} budget
                    </span>
                    <span className="text-dark-text-secondary">•</span>
                    <span className="text-dark-text-secondary">
                      Min {offer.minExpirationMonths}mo
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                {offer.status !== 'pending' && (
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0
                    ${offer.status === 'accepted' ? 'bg-success/20 text-success' :
                      offer.status === 'rejected' ? 'bg-danger/20 text-danger' :
                      'bg-dark-bg text-dark-text-secondary'
                    }
                  `}>
                    {offer.status === 'accepted' ? 'Accepted' : 
                     offer.status === 'rejected' ? 'Rejected' : 
                     'Expired'}
                  </div>
                )}
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 text-xs text-dark-text-secondary mb-3">
                <Clock className="w-4 h-4" />
                <span>{getTimeRemaining(offer.expiresAt)}</span>
              </div>

              {/* Actions */}
              {offer.status === 'pending' && (
                <div className="grid grid-cols-2 gap-2">
                  {activeTab === 'received' ? (
                    <>
                      <button
                        onClick={() => handleAcceptOffer(offer.id)}
                        className="btn btn-success"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectOffer(offer.id)}
                        className="btn btn-danger"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleCancelOffer(offer.id)}
                      className="btn btn-secondary col-span-2"
                    >
                      Cancel offer
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
