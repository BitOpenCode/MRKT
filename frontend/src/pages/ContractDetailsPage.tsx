import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Zap, Clock, TrendingUp, Share2, Gift, Plus } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import api from '@/services/api'
import toast from 'react-hot-toast'
import OffersTable from '@/components/OffersTable'
import type { SmartContract, Offer } from '@/types'

export default function ContractDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { haptic, webApp } = useTelegram()
  const [contract, setContract] = useState<SmartContract | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [showMakeOffer, setShowMakeOffer] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')

  useEffect(() => {
    if (id) {
      loadContract()
    }
  }, [id])

  const loadContract = async () => {
    try {
      setLoading(true)
      const res = await api.getContractById(id!)
      if (res.success && res.data) {
        setContract(res.data)
        // Load offers after contract is set
        setTimeout(() => loadOffers(), 100)
      }
    } catch (error) {
      console.error('Failed to load contract:', error)
      
      // Fallback: Create mock contract if API fails
      const mockContract: SmartContract = {
        id: id!,
        tokenId: `TON-NFT-${id}`,
        contractNumber: `MC-${Math.floor(Math.random() * 10000)}`,
        hashrate: 100,
        expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
        fairPrice: 2500,
        currentPrice: 2125,
        owner: 'user1',
        status: 'on_sale',
        listedOnMarketplace: true,
        dailyIncome: 0.00004200, // 100 TH * 0.00000042
        totalEarned: 0,
        roi: 35,
        metadata: {
          name: 'BTC Mining Contract',
          description: 'High-performance Bitcoin mining contract',
          image: '',
          attributes: [
            { trait_type: 'Hashrate', value: '100 TH/s' },
            { trait_type: 'Manufacturer', value: 'Bitmain' },
            { trait_type: 'Efficiency', value: 'High' },
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      setContract(mockContract)
      setTimeout(() => loadOffers(), 100)
      toast.error('Using demo data - backend not available')
    } finally {
      setLoading(false)
    }
  }

  const loadOffers = async () => {
    try {
      // TODO: Implement API call to get offers
      // For now, generate mock offers if we have contract data
      if (!contract) return
      
      const hashrate = contract.hashrate || 100
      const totalPrice = contract.currentPrice || 2125
      const floorPricePerTH = totalPrice / hashrate // e.g., 21.25 USDT per TH
      
      const mockOffers: Offer[] = [
        {
          id: '1',
          listingId: id!,
          itemId: id!,
          pricePerTH: 21.25,
          totalBudget: 2125,
          minExpirationMonths: 3,
          floorPricePerTH: floorPricePerTH,
          difference: 0,
          offerCount: 3,
          userId: 'user1',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          id: '2',
          listingId: id!,
          itemId: id!,
          pricePerTH: 19.5,
          totalBudget: 5000,
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
          listingId: id!,
          itemId: id!,
          pricePerTH: 17.0,
          totalBudget: 3400,
          minExpirationMonths: 9,
          floorPricePerTH: floorPricePerTH,
          difference: -20.0,
          offerCount: 1,
          userId: 'user3',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          id: '4',
          listingId: id!,
          itemId: id!,
          pricePerTH: 14.5,
          totalBudget: 2900,
          minExpirationMonths: 12,
          floorPricePerTH: floorPricePerTH,
          difference: -31.8,
          offerCount: 5,
          userId: 'user4',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          id: '5',
          listingId: id!,
          itemId: id!,
          pricePerTH: 13.0,
          totalBudget: 1300,
          minExpirationMonths: 6,
          floorPricePerTH: floorPricePerTH,
          difference: -38.8,
          offerCount: 1,
          userId: 'user5',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
      ]
      setOffers(mockOffers)
    } catch (error) {
      console.error('Failed to load offers:', error)
    }
  }

  const handleMakeOffer = async () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast.error('Please enter a valid offer amount')
      return
    }

    haptic.medium()
    try {
      // TODO: Implement API call to create offer
      toast.success('Offer created successfully!')
      setShowMakeOffer(false)
      setOfferAmount('')
      await loadOffers()
    } catch (error) {
      toast.error('Failed to create offer')
    }
  }

  const handleAcceptOffer = async (offerId: string) => {
    haptic.heavy()
    try {
      // TODO: Implement API call to accept offer
      toast.success('Offer accepted! Processing sale...')
      await loadOffers()
    } catch (error) {
      toast.error('Failed to accept offer')
    }
  }

  const handleShare = () => {
    haptic.light()
    if (webApp) {
      webApp.openTelegramLink(`https://t.me/share/url?url=${window.location.href}&text=Check out this mining contract!`)
    }
  }

  const handleBuy = () => {
    haptic.heavy()
    // TODO: Implement buy logic
    toast.success('Purchase initiated!')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <div className="spinner mx-auto"></div>
          <p className="text-dark-text-secondary mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="card text-center py-12">
          <p className="text-xl font-semibold mb-2">Contract not found</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="btn btn-primary mx-auto mt-4"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    )
  }

  const daysLeft = Math.ceil(
    (new Date(contract.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  const discount = contract.fairPrice && contract.currentPrice
    ? Math.round(((contract.fairPrice - contract.currentPrice) / contract.fairPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            haptic.light()
            navigate(-1)
          }}
          className="btn btn-secondary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleShare}
          className="btn btn-secondary"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* TOP 10 OFFERS - FIRST CARD as per screenshot */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-warning" />
            <div>
              <h2 className="text-xl font-bold text-dark-text">Top 10 offers</h2>
              <p className="text-xs text-dark-text-secondary">
                {contract?.contractNumber || 'Mining Contract'} • 0 gifts in inventory
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              haptic.light()
              setShowMakeOffer(!showMakeOffer)
            }}
            className="btn btn-primary text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Make Offer
          </button>
        </div>

        {/* Make Offer Form */}
        {showMakeOffer && (
          <div className="bg-dark-bg/50 rounded-lg p-4 mb-4 border border-primary/30">
            <h3 className="font-semibold mb-3 text-sm">Make an Offer</h3>
            <div className="flex gap-2">
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="Enter amount (USDT)"
                className="input flex-1 text-sm py-2"
                step="0.01"
                min="0.01"
              />
              <button
                onClick={handleMakeOffer}
                className="btn btn-success px-6 text-sm"
              >
                Submit
              </button>
            </div>
            <p className="text-xs text-dark-text-secondary mt-2">
              Floor price: {contract?.currentPrice || 0} USDT
            </p>
          </div>
        )}

        {/* Offers Table */}
        <OffersTable 
          offers={offers} 
          onAcceptOffer={handleAcceptOffer}
          isOwner={false} // TODO: Check if user is owner
        />
      </div>

      {/* NFT Image */}
      <div className="card p-4">
        {contract.metadata?.image ? (
          <img
            src={contract.metadata.image}
            alt={contract.metadata.name}
            className="w-full aspect-square object-cover rounded-lg mb-3"
          />
        ) : (
          <div className="w-full aspect-square bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center mb-3">
            <div className="text-center">
              <Zap className="w-20 h-20 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">₿</p>
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold gradient-text mb-2">
          {contract.metadata?.name || `${contract.hashrate} TH/s BTC Mining Contract`}
        </h1>
        <p className="text-dark-text-secondary text-sm mb-3">
          {contract.metadata?.description || 'Bitcoin Mining Contract NFT'}
        </p>
        <p className="text-xs text-dark-text-secondary">
          Contract #{contract.contractNumber}
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3 text-center">
          <Zap className="w-5 h-5 mx-auto mb-1 text-orange-500" />
          <p className="text-xl font-bold gradient-text">
            {contract.hashrate}
          </p>
          <p className="text-xs text-dark-text-secondary">TH/s</p>
        </div>
        <div className="card p-3 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1 text-warning" />
          <p className="text-xl font-bold">
            {daysLeft}
          </p>
          <p className="text-xs text-dark-text-secondary">Days Left</p>
        </div>
        <div className="card p-3 text-center">
          <TrendingUp className="w-5 h-5 mx-auto mb-1 text-success" />
          <p className="text-xl font-bold text-success">
            {contract.roi}%
          </p>
          <p className="text-xs text-dark-text-secondary">ROI</p>
        </div>
      </div>

      {/* Price */}
      <div className="card p-4 border-success/30">
        {contract.fairPrice && (
          <p className="text-xs text-dark-text-secondary line-through mb-1">
            Fair Price: ${contract.fairPrice.toLocaleString()}
          </p>
        )}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-dark-text-secondary">Current Price:</span>
          <span className="text-3xl font-bold text-success">
            ${contract.currentPrice.toLocaleString()}
          </span>
        </div>
        {discount > 0 && (
          <p className="text-danger text-lg font-bold text-center mt-2">
            🔥 YOU SAVE -{discount}% 💰
          </p>
        )}
      </div>

      {/* Details */}
      <div className="card">
        <h3 className="font-bold text-lg mb-4">Contract Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Daily Income</span>
            <span className="font-semibold">{contract.dailyIncome.toFixed(8)} BTC</span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Expiration Date</span>
            <span className="font-semibold">
              {new Date(contract.expirationDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Status</span>
            <span className={`
              badge
              ${contract.status === 'available' ? 'badge-new' : ''}
              ${contract.status === 'mining' ? 'badge-hot' : ''}
              ${contract.status === 'on_sale' ? 'badge-premium' : ''}
            `}>
              {contract.status}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Token ID</span>
            <span className="font-mono text-sm">{contract.tokenId}</span>
          </div>
        </div>
      </div>

      {/* Attributes */}
      {contract.metadata?.attributes && contract.metadata.attributes.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Attributes</h3>
          <div className="grid grid-cols-2 gap-3">
            {contract.metadata.attributes.map((attr, i) => (
              <div key={i} className="bg-dark-bg rounded-lg p-3">
                <p className="text-xs text-dark-text-secondary mb-1">
                  {attr.trait_type}
                </p>
                <p className="font-semibold">{attr.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {contract.status === 'available' && (
        <div className="sticky bottom-20 left-0 right-0 p-4 bg-dark-surface/95 backdrop-blur-md border-t border-dark-border">
          <button
            onClick={handleBuy}
            className="btn btn-primary w-full btn-lg animate-pulse-slow"
          >
            BUY NOW - ${contract.currentPrice.toLocaleString()}
          </button>
        </div>
      )}
    </div>
  )
}
