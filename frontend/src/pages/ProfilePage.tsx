import { useEffect, useState } from 'react'
import { useTonAddress } from '@tonconnect/ui-react'
import { useAppStore } from '@/store/appStore'
import { useTelegram } from '@/hooks/useTelegram'
import { Wallet, Package, Trophy, Settings, Star, Users, TrendingUp, Gift, LogIn, DollarSign, Ticket, RefreshCw } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'
import ContractCard from '@/components/ContractCard'
import PortalLevels from '@/components/PortalLevels'
import ReferralSystem from '@/components/ReferralSystem'
import LoginModal from '@/components/LoginModal'
import SwapModal from '@/components/SwapModal'
import SettingsModal from '@/components/SettingsModal'
import DepositModal from '@/components/DepositModal'
import WithdrawModal from '@/components/WithdrawModal'
import type { SmartContract, ReferralData } from '@/types'

export default function ProfilePage() {
  const userFriendlyAddress = useTonAddress()
  const { user } = useAppStore()
  const { haptic } = useTelegram()
  const [contracts, setContracts] = useState<SmartContract[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'nfts' | 'levels' | 'referrals'>('nfts')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [btcBalance, setBtcBalance] = useState(0)
  const [activeTicketsCount, setActiveTicketsCount] = useState(0)
  const [winningTickets, setWinningTickets] = useState<any[]>([])
  
  // Mock referral data - TODO: Load from API
  const referralData: ReferralData = {
    code: 'ECOS' + (user?.id?.substring(0, 6) || '123456'),
    totalInvited: user?.friendsInvited || 4,
    activeReferrals: 3,
    totalEarnings: user?.referralVolume?.earnedPoints || 162,
    referrals: [
      {
        id: '1',
        username: 'ifukkatsumi',
        joinedAt: '2024-06-14T21:52:00Z',
        totalSpent: 7,
        yourEarnings: 0.07,
        lastActive: '2024-06-14T21:52:00Z',
      },
    ],
  }

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Check if user is logged in
      const userId = localStorage.getItem('user_id')
      if (!userId && !userFriendlyAddress) {
        setLoading(false)
        setContracts([]) // Clear contracts if not logged in
        return
      }
      
      // If logged in, load user contracts and tickets
      if (userId || userFriendlyAddress) {
        const contractsRes = await api.getUserContracts()
        if (contractsRes.success && contractsRes.data) {
          setContracts(contractsRes.data)
        }
        
        // Load lottery tickets
        const ticketsRes = await api.getUserTickets()
        if (ticketsRes.success && ticketsRes.data) {
          // Show all tickets count (not just active/pending)
          setActiveTicketsCount(ticketsRes.data.length)
          
          // Check for winning tickets that haven't been claimed
          const wonTickets = ticketsRes.data.filter((t: any) => t.status === 'won' && !t.claimed)
          setWinningTickets(wonTickets)
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaimPrize = async (ticket: any) => {
    try {
      haptic.heavy()
      const res = await api.claimPrize(ticket.id)
      if (res.success) {
        toast.success(res.data.message || '🎉 Prize claimed!')
        // Reload data
        await loadUserData()
      } else {
        toast.error(res.error || 'Failed to claim prize')
      }
    } catch (error) {
      console.error('Failed to claim prize:', error)
      toast.error('Failed to claim prize')
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Winning Prize Banner */}
      {winningTickets.length > 0 && winningTickets.map(ticket => (
        <div key={ticket.id} className="card relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 animate-pulse"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0icmdiYSgyNTUsMjE1LDAsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="relative p-6">
            {/* Celebration Icons */}
            <div className="absolute top-4 right-4 text-4xl animate-bounce">
              🎉
            </div>
            <div className="absolute top-6 left-4 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>
              ✨
            </div>
            
            {/* Content */}
            <div className="text-center space-y-4">
              <div className="inline-block">
                <Trophy className="w-16 h-16 text-yellow-400 animate-pulse" />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  🎊 ПОЗДРАВЛЯЕМ! 🎊
                </h2>
                <p className="text-xl text-dark-text mb-1">
                  Вы выиграли в лотерее!
                </p>
                <p className="text-lg text-dark-text-secondary">
                  Билет #{ticket.ticketNumber}
                </p>
              </div>
              
              {ticket.prizeContractId && (
                <div className="bg-success/20 border-2 border-success rounded-lg p-4 inline-block">
                  <p className="text-sm text-dark-text-secondary mb-1">Ваш приз:</p>
                  <p className="text-2xl font-bold text-success">
                    💎 Mining Contract NFT
                  </p>
                </div>
              )}
              
              <button
                onClick={() => handleClaimPrize(ticket)}
                className="btn btn-primary btn-lg px-8 py-4 text-xl font-bold animate-pulse hover:scale-110 transition-all"
              >
                <Gift className="w-6 h-6 inline mr-2" />
                ЗАБРАТЬ ПРИЗ! 🎁
              </button>
              
              <p className="text-sm text-dark-text-secondary">
                Нажмите, чтобы получить контракт в свой портфель
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Profile Header */}
      <div className="card p-4 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-xl border-2 border-primary/40">
            <span className="text-primary font-bold">
              {user?.firstName?.[0]?.toUpperCase() || '👤'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-dark-text-secondary text-sm">
              @{user?.username || 'user'} • Level {user?.level || 1}
            </p>
          </div>
          <div className="flex gap-2">
            {user ? (
              <button
                onClick={() => {
                  haptic.light()
                  // Logout
                  localStorage.removeItem('user_id')
                  localStorage.removeItem('username')
                  window.location.reload()
                }}
                className="btn bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 px-3 py-2 text-sm font-semibold transition-all"
              >
                <LogIn className="w-4 h-4 mr-1 rotate-180" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  haptic.light()
                  setShowLoginModal(true)
                }}
                className="btn bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 px-3 py-2 text-sm font-semibold transition-all"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </button>
            )}
            <button
              onClick={() => {
                haptic.light()
                setShowSettingsModal(true)
              }}
              className="btn btn-secondary p-2"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* USDT Balance */}
        <div className="card border border-green-500/30 rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-sm text-dark-text-secondary">Внутренний кошелек</span>
            </div>
            <span className="text-2xl font-bold text-green-400">
              ${(user?.usdtBalance || 0).toFixed(2)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                haptic.light()
                setShowDepositModal(true)
              }}
              className="bg-gradient-to-r from-success to-emerald-500 text-white font-semibold text-xs py-2.5 rounded-lg transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center"
            >
              Пополнить
            </button>
            <button
              onClick={() => {
                haptic.medium()
                setShowSwapModal(true)
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-xs py-2.5 rounded-lg transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              SWAP
            </button>
            <button
              onClick={() => {
                haptic.light()
                setShowWithdrawModal(true)
              }}
              className="bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-xs py-2.5 rounded-lg transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center"
            >
              Вывести
            </button>
          </div>
        </div>

        {/* ECOS Points Balance */}
        <div className="card border border-warning/30 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              <div>
                <p className="text-xs text-warning/80 font-semibold uppercase">ECOS Points</p>
                <p className="text-[10px] text-dark-text-secondary">For discounts up to 30%</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-warning">
              {(user?.ecosPoints || 0).toLocaleString()}⭐
            </span>
          </div>
        </div>

        {/* Lottery Tickets Balance */}
        <div className="card border border-purple-500/30 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs text-purple-400 font-semibold uppercase">Total Tickets</p>
                <p className="text-[10px] text-dark-text-secondary">All lottery tickets owned</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-purple-400">
              {activeTicketsCount}🎫
            </span>
          </div>
        </div>

        {/* Wallet Info */}
        {userFriendlyAddress && (
          <div className="bg-dark-bg/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-primary" />
              <p className="text-xs text-dark-text-secondary uppercase font-semibold">
                Connected Wallet
              </p>
            </div>
            <p className="font-mono text-xs break-all">
              {userFriendlyAddress}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="card p-3 text-center">
          <Package className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-xl font-bold mb-0.5">{contracts.length}</p>
          <p className="text-xs text-dark-text-secondary">NFTs</p>
        </div>
        <div className="card p-3 text-center">
          <Trophy className="w-5 h-5 mx-auto mb-1 text-warning" />
          <p className="text-xl font-bold mb-0.5">0</p>
          <p className="text-xs text-dark-text-secondary">Lottery Wins</p>
        </div>
        <div className="card p-3 text-center">
          <Users className="w-5 h-5 mx-auto mb-1 text-success" />
          <p className="text-xl font-bold mb-0.5">{user?.friendsInvited || 0}</p>
          <p className="text-xs text-dark-text-secondary">Refs</p>
        </div>
        <div className="card p-3 text-center">
          <TrendingUp className="w-5 h-5 mx-auto mb-1 text-info" />
          <p className="text-xl font-bold mb-0.5">${(user?.totalVolume || 0).toFixed(0)}</p>
          <p className="text-xs text-dark-text-secondary">Volume</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => {
            haptic.selection()
            setActiveTab('nfts')
          }}
          className={`
            btn flex-shrink-0 text-sm
            ${activeTab === 'nfts' ? 'btn-primary' : 'btn-secondary'}
          `}
        >
          <Package className="w-4 h-4 mr-1" />
          NFTs ({contracts.length})
        </button>
        <button
          onClick={() => {
            haptic.selection()
            setActiveTab('levels')
          }}
          className={`
            btn flex-shrink-0 text-sm
            ${activeTab === 'levels' ? 'btn-primary' : 'btn-secondary'}
          `}
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          Levels
        </button>
        <button
          onClick={() => {
            haptic.selection()
            setActiveTab('referrals')
          }}
          className={`
            btn flex-shrink-0 text-sm
            ${activeTab === 'referrals' ? 'btn-primary' : 'btn-secondary'}
          `}
        >
          <Gift className="w-4 h-4 mr-1" />
          Referrals ({referralData.totalInvited})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto"></div>
          <p className="text-dark-text-secondary mt-4">Loading...</p>
        </div>
      ) : (
        <>
          {/* NFTs Tab */}
          {activeTab === 'nfts' && (
            <div>
              {contracts.length === 0 ? (
                <div className="card text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-dark-text-secondary opacity-50" />
                  <p className="text-xl font-semibold mb-2">No NFTs yet</p>
                  <p className="text-dark-text-secondary mb-6 text-sm">
                    Win in lottery or buy from marketplace
                  </p>
                  <button 
                    className="btn btn-primary mx-auto"
                    onClick={() => {
                      haptic.medium()
                      // Navigate to marketplace
                    }}
                  >
                    Browse Marketplace
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {contracts.map((contract) => (
                    <ContractCard
                      key={contract.id}
                      contract={contract}
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Levels Tab */}
          {activeTab === 'levels' && (
            <PortalLevels
              currentLevel={user?.level || 1}
              currentVolume={user?.totalVolume || 7}
              ecosPoints={user?.ecosPoints || 0}
            />
          )}

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <ReferralSystem
              referralData={referralData}
              baseUrl="https://t.me/ecosmarketplace_bot"
            />
          )}
        </>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Swap Modal */}
      <SwapModal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        btcBalance={btcBalance}
        onSwap={(btc, usdt) => {
          setBtcBalance(prev => prev - btc)
          // TODO: Update USDT balance via API
        }}
      />

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <DepositModal
          onClose={() => setShowDepositModal(false)}
        />
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <WithdrawModal
          onClose={() => setShowWithdrawModal(false)}
          usdtBalance={user?.usdtBalance || 0}
        />
      )}
    </div>
  )
}
