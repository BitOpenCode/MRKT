import { useState } from 'react'
import { TrendingDown } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import type { Offer } from '@/types'

interface Props {
  offers: Offer[]
  onAcceptOffer?: (offerId: string) => void
  isOwner?: boolean
}

export default function OffersTable({ offers, onAcceptOffer, isOwner = false }: Props) {
  const { haptic } = useTelegram()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleAccept = async (offerId: string) => {
    haptic.medium()
    setProcessingId(offerId)
    try {
      await onAcceptOffer?.(offerId)
    } finally {
      setProcessingId(null)
    }
  }

  // Group offers by price per TH
  const groupedOffers = offers.reduce((acc, offer) => {
    const existing = acc.find(g => g.pricePerTH === offer.pricePerTH)
    if (existing) {
      existing.count++
    } else {
      acc.push({
        pricePerTH: offer.pricePerTH,
        totalBudget: offer.totalBudget,
        minExpirationMonths: offer.minExpirationMonths,
        floorPricePerTH: offer.floorPricePerTH,
        difference: offer.difference,
        count: 1,
        offers: [offer]
      })
    }
    return acc
  }, [] as Array<{
    pricePerTH: number
    totalBudget: number
    minExpirationMonths: number
    floorPricePerTH: number
    difference: number
    count: number
    offers: Offer[]
  }>)

  // Sort by price per TH (best offers first - highest price)
  const sortedOffers = groupedOffers.sort((a, b) => b.pricePerTH - a.pricePerTH)

  if (offers.length === 0) {
    return (
      <div className="text-center py-8 text-dark-text-secondary">
        <p>No offers yet</p>
        <p className="text-sm mt-2">Be the first to make an offer!</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      {/* Header */}
      <div className="grid grid-cols-6 gap-2 px-4 py-3 bg-dark-surface/50 border-b border-dark-border text-xs font-semibold text-dark-text-secondary">
        <div>Price/TH</div>
        <div>Budget</div>
        <div>Min Term</div>
        <div>Floor/TH</div>
        <div>Diff</div>
        <div className="text-right">Action</div>
      </div>

      {/* Offers List */}
      <div className="divide-y divide-dark-border">
        {sortedOffers.map((group, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-2 px-4 py-3 items-center hover:bg-dark-surface/30 transition-colors"
          >
            {/* Price per TH */}
            <div className="font-bold text-dark-text">
              {group.pricePerTH.toFixed(2)} <span className="text-xs text-dark-text-secondary">USDT</span>
            </div>

            {/* Total Budget */}
            <div className="text-dark-text-secondary text-sm">
              {group.totalBudget.toFixed(0)} <span className="text-xs">USDT</span>
            </div>

            {/* Min Expiration */}
            <div className="text-success text-sm">
              {group.minExpirationMonths}mo
            </div>

            {/* Floor Price per TH */}
            <div className="text-dark-text-secondary text-sm">
              {group.floorPricePerTH.toFixed(2)} <span className="text-xs">USDT</span>
            </div>

            {/* Difference */}
            <div className={`font-semibold text-sm ${
              group.difference < 0 ? 'text-danger' : 'text-success'
            }`}>
              {group.difference > 0 && '+'}
              {group.difference.toFixed(1)}%
            </div>

            {/* Action */}
            <div className="text-right">
              {isOwner ? (
                <button
                  onClick={() => handleAccept(group.offers[0].id)}
                  disabled={processingId === group.offers[0].id}
                  className="btn btn-primary px-3 py-1 text-xs disabled:opacity-50"
                >
                  {processingId === group.offers[0].id ? (
                    <span className="spinner w-3 h-3 border-2"></span>
                  ) : (
                    `Sell (×${group.count})`
                  )}
                </button>
              ) : (
                <span className="text-xs text-dark-text-secondary">
                  {group.count} offer{group.count > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {sortedOffers.length > 0 && (
        <div className="px-4 py-3 bg-dark-surface/30 border-t border-dark-border flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-dark-text-secondary">
            <TrendingDown className="w-4 h-4" />
            <span>Best: {sortedOffers[0].pricePerTH.toFixed(2)} USDT/TH (min {sortedOffers[0].minExpirationMonths}mo)</span>
          </div>
          <div className="text-dark-text">
            <span className="font-bold text-primary">{offers.length}</span> total offers
          </div>
        </div>
      )}
    </div>
  )
}
