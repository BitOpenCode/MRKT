import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, Grid, List, Zap, Cpu } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import api from '@/services/api'
import ContractCard from '@/components/ContractCard'
import OffersCard from '@/components/OffersCard'
import type { MarketplaceListing, MarketplaceFilters, Offer, SmartContract } from '@/types'

export default function MarketplacePage() {
  const { haptic } = useTelegram()
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<MarketplaceFilters>({
    itemType: 'all',
    sortBy: 'discount',
  })
  const [searchQuery, setSearchQuery] = useState('')
  
  // Mock offers data for first listing - TODO: Load from API
  const getMockOffers = (listingId: string): Offer[] => {
    // Only add offers to first listing
    if (listings.length > 0 && listingId === listings[0]?.id) {
      const contract = listings[0]?.item as any
      if (!contract) return []
      
      const hashrate = contract.hashrate || 100
      const totalPrice = contract.currentPrice || 2125
      const floorPricePerTH = totalPrice / hashrate // e.g., 21.25 USDT per TH
      
      return [
        {
          id: '1',
          listingId: listingId,
          itemId: contract.id || 'item1',
          pricePerTH: 20.0, // -5.9% from floor (below floor)
          totalBudget: 2000,
          minExpirationMonths: 3,
          floorPricePerTH: floorPricePerTH,
          difference: -5.9,
          offerCount: 3,
          userId: 'user1',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          id: '2',
          listingId: listingId,
          itemId: contract.id || 'item1',
          pricePerTH: 19.5, // -8.2% from floor
          totalBudget: 1950,
          minExpirationMonths: 6,
          floorPricePerTH: floorPricePerTH,
          difference: -8.2,
          offerCount: 23,
          userId: 'user2',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          id: '3',
          listingId: listingId,
          itemId: contract.id || 'item1',
          pricePerTH: 18.0, // -15.3% from floor
          totalBudget: 1800,
          minExpirationMonths: 4,
          floorPricePerTH: floorPricePerTH,
          difference: -15.3,
          offerCount: 7,
          userId: 'user3',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          id: '4',
          listingId: listingId,
          itemId: contract.id || 'item1',
          pricePerTH: 17.0, // -20% from floor
          totalBudget: 1700,
          minExpirationMonths: 9,
          floorPricePerTH: floorPricePerTH,
          difference: -20.0,
          offerCount: 1,
          userId: 'user4',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          id: '5',
          listingId: listingId,
          itemId: contract.id || 'item1',
          pricePerTH: 15.5, // -27.1% from floor
          totalBudget: 1550,
          minExpirationMonths: 8,
          floorPricePerTH: floorPricePerTH,
          difference: -27.1,
          offerCount: 12,
          userId: 'user5',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          id: '6',
          listingId: listingId,
          itemId: contract.id || 'item1',
          pricePerTH: 14.5, // -31.8% from floor
          totalBudget: 1450,
          minExpirationMonths: 12,
          floorPricePerTH: floorPricePerTH,
          difference: -31.8,
          offerCount: 5,
          userId: 'user6',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
      ]
    }
    return []
  }

  useEffect(() => {
    loadListings()
  }, [filters])

  const loadListings = async () => {
    try {
      setLoading(true)
      const res = await api.getMarketplaceListings(filters, 1, 50)
      if (res.success && res.data) {
        setListings(res.data.items)
      }
    } catch (error) {
      console.error('Failed to load listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (sortBy: MarketplaceFilters['sortBy']) => {
    haptic.selection()
    setFilters(prev => ({ ...prev, sortBy }))
  }

  const handleFilterChange = (key: keyof MarketplaceFilters, value: any) => {
    haptic.light()
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleViewMode = () => {
    haptic.selection()
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid')
  }

  const filteredListings = listings.filter(listing => {
    if (!searchQuery) return true
    const contract = listing.item as any
    return (
      contract.contractNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.hashrate?.toString().includes(searchQuery)
    )
  })

  const contractCount = filteredListings.filter(l => l.itemType === 'contract').length
  const asicCount = filteredListings.filter(l => l.itemType === 'asic').length

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold gradient-text mb-2">
          ECOS Marketplace
        </h1>
        <p className="text-sm text-dark-text-secondary">
          {filteredListings.length} items available
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-thin pb-2">
        <button
          onClick={() => handleFilterChange('itemType', 'all')}
          className={`btn flex-shrink-0 text-sm ${
            filters.itemType === 'all' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          All ({filteredListings.length})
        </button>
        <button
          onClick={() => handleFilterChange('itemType', 'contract')}
          className={`btn flex-shrink-0 text-sm ${
            filters.itemType === 'contract' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          <Zap className="w-4 h-4 mr-1" />
          Smart Contracts ({contractCount})
        </button>
        <button
          onClick={() => handleFilterChange('itemType', 'asic')}
          className={`btn flex-shrink-0 text-sm ${
            filters.itemType === 'asic' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          <Cpu className="w-4 h-4 mr-1" />
          ASIC Miners ({asicCount})
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-secondary pointer-events-none" />
          <input
            type="text"
            placeholder="Search by contract number or hashrate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12 pr-4"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as any)}
            className="input flex-1"
          >
            <option value="discount">Best Discount</option>
            <option value="roi">Highest ROI</option>
            <option value="price_low">💰 Цена: Дешевые → Дорогие</option>
            <option value="price_high">💰 Цена: Дорогие → Дешевые</option>
            <option value="hashrate_low">⚡ TH/s: Меньше → Больше</option>
            <option value="hashrate_high">⚡ TH/s: Больше → Меньше</option>
            <option value="newest">Just Added</option>
            <option value="ending">Ending Soon</option>
          </select>

          {/* View Mode */}
          <button
            onClick={toggleViewMode}
            className="btn btn-secondary p-3"
          >
            {viewMode === 'grid' ? (
              <List className="w-5 h-5" />
            ) : (
              <Grid className="w-5 h-5" />
            )}
          </button>

          {/* Filters */}
          <button
            onClick={() => {
              haptic.light()
              setShowFilters(!showFilters)
            }}
            className="btn btn-secondary p-3"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="card animate-slide-in space-y-4">
            <h3 className="font-bold mb-3">Filters</h3>
            
            {/* Item Type */}
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Item Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['all', 'contract', 'asic'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange('itemType', type)}
                    className={`
                      btn
                      ${filters.itemType === type ? 'btn-primary' : 'btn-secondary'}
                    `}
                  >
                    {type === 'all' ? 'All' : type === 'contract' ? 'Contracts' : 'ASICs'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Quick Filters
              </label>
              <div className="flex flex-wrap gap-2">
                {['hot', 'premium', 'new', 'trending'].map((badge) => (
                  <button
                    key={badge}
                    onClick={() => {
                      const current = filters.badges || []
                      const newBadges = current.includes(badge as any)
                        ? current.filter(b => b !== badge)
                        : [...current, badge as any]
                      handleFilterChange('badges', newBadges)
                    }}
                    className={`
                      badge cursor-pointer
                      ${filters.badges?.includes(badge as any) 
                        ? `badge-${badge}`
                        : 'bg-dark-bg border border-dark-border'
                      }
                    `}
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                  className="input"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                  className="input"
                />
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                haptic.medium()
                setFilters({ itemType: 'all', sortBy: 'discount' })
              }}
              className="btn btn-danger w-full"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Listings */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-64 bg-dark-bg rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-xl font-semibold mb-2">No contracts found</p>
          <p className="text-dark-text-secondary">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className={`
          grid gap-3
          ${viewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
          }
        `}>
          {filteredListings.map((listing, index) => {
            // Safety check
            if (!listing || !listing.item) {
              console.warn('Invalid listing:', listing)
              return null
            }
            
            const listingOffers = getMockOffers(listing.id)
            const hasOffers = listingOffers.length > 0
            
            // Show OffersCard for first item with offers
            if (index === 0 && hasOffers) {
              const bestOffer = listingOffers.reduce((best, offer) => 
                offer.pricePerTH > best.pricePerTH ? offer : best
              , listingOffers[0])
              
              const contract = listing.item as SmartContract
              
              // Ensure contract has required fields
              if (!contract.id) {
                console.error('Contract missing ID:', contract)
                return null
              }
              
              return (
                <OffersCard
                  key={listing.id}
                  contract={contract}
                  offers={listingOffers}
                  bestOffer={bestOffer}
                />
              )
            }
            
            // Regular contract card
            return (
              <ContractCard
                key={listing.id}
                contract={listing.item as SmartContract}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
