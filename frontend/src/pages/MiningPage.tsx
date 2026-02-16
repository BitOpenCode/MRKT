import { useEffect, useState } from 'react'
import { Zap, Play, Pause, DollarSign, TrendingUp } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import api from '@/services/api'
import toast from 'react-hot-toast'
import type { MiningStats, MiningSession } from '@/types'

export default function MiningPage() {
  const { haptic } = useTelegram()
  const [stats, setStats] = useState<MiningStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      const res = await api.getMiningStats()
      if (res.success && res.data) {
        setStats(res.data)
      }
    } catch (error) {
      console.error('Failed to load mining stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartMining = async (contractId: string) => {
    try {
      haptic.medium()
      await api.startMining(contractId)
      toast.success('Mining started!')
      await loadStats()
    } catch (error) {
      haptic.error()
      toast.error('Failed to start mining')
    }
  }

  const handleStopMining = async (contractId: string) => {
    try {
      haptic.medium()
      await api.stopMining(contractId)
      toast.success('Mining stopped')
      await loadStats()
    } catch (error) {
      haptic.error()
      toast.error('Failed to stop mining')
    }
  }

  const handleClaim = async (contractId: string) => {
    try {
      haptic.heavy()
      await api.claimMiningRewards(contractId)
      toast.success('Rewards claimed!')
      await loadStats()
    } catch (error) {
      haptic.error()
      toast.error('Failed to claim rewards')
    }
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

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Mining Dashboard
        </h1>
        <p className="text-dark-text-secondary">
          Manage your mining contracts
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold mb-1">
            {stats?.totalHashrate || 0} TH/s
          </p>
          <p className="text-xs text-dark-text-secondary">Total Hashrate</p>
        </div>
        <div className="card text-center">
          <Play className="w-6 h-6 mx-auto mb-2 text-success" />
          <p className="text-2xl font-bold mb-1">
            {stats?.activeSessions || 0}
          </p>
          <p className="text-xs text-dark-text-secondary">Active</p>
        </div>
        <div className="card text-center">
          <DollarSign className="w-6 h-6 mx-auto mb-2 text-warning" />
          <p className="text-2xl font-bold mb-1">
            {stats?.totalEarned.toFixed(6) || '0.000000'}
          </p>
          <p className="text-xs text-dark-text-secondary">Total Earned (BTC)</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-success" />
          <p className="text-2xl font-bold mb-1">
            {stats?.dailyIncome.toFixed(6) || '0.000000'}
          </p>
          <p className="text-xs text-dark-text-secondary">Daily Income</p>
        </div>
      </div>

      {/* Active Mining Contracts */}
      <div>
        <h2 className="text-xl font-bold mb-4">Active Mining Contracts</h2>
        
        {!stats || stats.contracts.length === 0 ? (
          <div className="card text-center py-12">
            <Zap className="w-16 h-16 mx-auto mb-4 text-dark-text-secondary" />
            <p className="text-xl font-semibold mb-2">No active mining</p>
            <p className="text-dark-text-secondary mb-6">
              Start mining with your NFT contracts
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.contracts.map((session) => (
              <div key={session.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold gradient-text mb-1">
                      {session.contract.hashrate} TH/s
                    </h3>
                    <p className="text-sm text-dark-text-secondary">
                      Contract #{session.contract.contractNumber}
                    </p>
                  </div>
                  <span className={`
                    badge
                    ${session.status === 'active' ? 'badge-new animate-pulse-slow' : ''}
                    ${session.status === 'paused' ? 'badge-premium' : ''}
                  `}>
                    {session.status}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-dark-border">
                  <div>
                    <p className="text-xs text-dark-text-secondary mb-1">
                      Daily Income
                    </p>
                    <p className="font-semibold">
                      {session.dailyIncome.toFixed(6)} BTC
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-text-secondary mb-1">
                      Total Earned
                    </p>
                    <p className="font-semibold text-success">
                      {session.totalEarned.toFixed(6)} BTC
                    </p>
                  </div>
                </div>

                {/* Started */}
                <p className="text-xs text-dark-text-secondary mt-3 mb-4">
                  Started: {new Date(session.startedAt).toLocaleString()}
                </p>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  {session.status === 'active' ? (
                    <button
                      onClick={() => handleStopMining(session.contractId)}
                      className="btn btn-danger"
                    >
                      <Pause className="w-4 h-4 inline mr-2" />
                      Stop Mining
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartMining(session.contractId)}
                      className="btn btn-primary"
                    >
                      <Play className="w-4 h-4 inline mr-2" />
                      Resume
                    </button>
                  )}
                  <button
                    onClick={() => handleClaim(session.contractId)}
                    className="btn btn-secondary"
                    disabled={session.totalEarned === 0}
                  >
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Claim {session.totalEarned.toFixed(6)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
