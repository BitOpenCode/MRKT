import { Share2, Users, TrendingUp, Copy, Gift } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import toast from 'react-hot-toast'
import type { ReferralData } from '@/types'

interface Props {
  referralData: ReferralData
  baseUrl: string
}

export default function ReferralSystem({ referralData, baseUrl }: Props) {
  const { haptic } = useTelegram()
  
  const referralLink = `${baseUrl}?start=ref_${referralData.code}`

  const handleCopyLink = () => {
    haptic.light()
    navigator.clipboard.writeText(referralLink)
    toast.success('Referral link copied!')
  }

  const handleShare = () => {
    haptic.medium()
    if (navigator.share) {
      navigator.share({
        title: 'Join ECOS Marketplace',
        text: `Join me on ECOS Marketplace and start earning! Use my referral code: ${referralData.code}`,
        url: referralLink,
      })
    } else {
      handleCopyLink()
    }
  }

  return (
    <div className="space-y-4">
      {/* Referral Code Card */}
      <div className="card p-6 border-accent/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg">
            <Share2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm text-dark-text-secondary mb-1">Your Referral Code</p>
            <h2 className="text-3xl font-bold text-accent">{referralData.code}</h2>
          </div>
        </div>

        {/* Share Link */}
        <div className="bg-dark-bg/50 rounded-lg p-3 mb-3">
          <p className="text-xs text-dark-text-secondary mb-2">Share this link:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text font-mono"
            />
            <button
              onClick={handleCopyLink}
              className="btn btn-secondary p-2"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          <span>Share Referral Link</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center border-primary/30">
          <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-dark-text">{referralData.totalInvited}</p>
          <p className="text-xs text-dark-text-secondary">Total Invited</p>
        </div>
        <div className="card p-4 text-center border-success/30">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-success" />
          <p className="text-2xl font-bold text-dark-text">{referralData.activeReferrals}</p>
          <p className="text-xs text-dark-text-secondary">Active</p>
        </div>
        <div className="card p-4 text-center border-warning/30">
          <Gift className="w-6 h-6 mx-auto mb-2 text-warning" />
          <p className="text-2xl font-bold text-warning">{referralData.totalEarnings}⭐</p>
          <p className="text-xs text-dark-text-secondary">Earned</p>
        </div>
      </div>

      {/* Referrals List */}
      <div className="card p-4">
        <h3 className="font-bold text-dark-text mb-4">Your Referrals</h3>
        
        {referralData.referrals.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-3 text-dark-text-secondary opacity-50" />
            <p className="text-dark-text-secondary">No referrals yet</p>
            <p className="text-xs text-dark-text-secondary mt-2">
              Share your link to start earning!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {referralData.referrals.map((referral) => (
              <div
                key={referral.id}
                className="bg-dark-bg/50 rounded-lg p-3 border border-dark-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-sm font-bold">
                      {referral.username?.[0]?.toUpperCase() || referral.firstName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-dark-text">
                        {referral.username || referral.firstName || 'Anonymous'}
                      </p>
                      <p className="text-xs text-dark-text-secondary">
                        Joined {new Date(referral.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-warning">
                      +{referral.yourEarnings.toFixed(2)}⭐
                    </p>
                    <p className="text-xs text-dark-text-secondary">
                      earned
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-dark-border">
                  <div>
                    <p className="text-xs text-dark-text-secondary">Total Spent</p>
                    <p className="text-sm font-semibold text-dark-text">
                      {referral.totalSpent.toFixed(2)} TON
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-dark-text-secondary">Last Active</p>
                    <p className="text-sm font-semibold text-dark-text">
                      {new Date(referral.lastActive).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How it Works */}
      <div className="card p-4 border-info/30">
        <h3 className="font-bold text-dark-text mb-3 flex items-center gap-2">
          <Gift className="w-5 h-5 text-info" />
          How Referrals Work
        </h3>
        <ul className="space-y-2 text-sm text-dark-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-success font-bold">1.</span>
            <span>Share your unique referral link with friends</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success font-bold">2.</span>
            <span>They sign up and make purchases on ECOS Marketplace</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success font-bold">3.</span>
            <span>You earn ECOS Points based on their spending</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success font-bold">4.</span>
            <span>At Level 5, earn up to 5% of their purchase value!</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
