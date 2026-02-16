import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Upload, TrendingUp, Play, DollarSign, Filter, Grid, List as ListIcon, Download, StopCircle } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/store/appStore'
import api from '@/services/api'
import toast from 'react-hot-toast'
import type { SmartContract } from '@/types'

export default function PortfolioPage() {
  const navigate = useNavigate()
  const { haptic } = useTelegram()
  const { user } = useAppStore()
  const [contracts, setContracts] = useState<SmartContract[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'unlisted' | 'listed'>('unlisted')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedContracts, setSelectedContracts] = useState<string[]>([])

  useEffect(() => {
    loadUserContracts()
  }, [user?.id]) // Reload when user changes

  const loadUserContracts = async () => {
    if (!user?.id) {
      setContracts([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      if (!user?.id) {
        setContracts([])
        setLoading(false)
        return
      }
      
      const response = await api.getUserContracts()
      
      if (response.success && response.data) {
        setContracts(response.data)
      } else {
        setContracts([])
      }
    } catch (error) {
      console.error('Failed to load contracts:', error)
      toast.error('Войдите чтобы увидеть контракты')
      setContracts([])
    } finally {
      setLoading(false)
    }
  }

  const unlistedContracts = contracts.filter(c => !c.listedOnMarketplace)
  const listedContracts = contracts.filter(c => c.listedOnMarketplace)
  const displayContracts = activeTab === 'unlisted' ? unlistedContracts : listedContracts

  const totalValue = contracts.reduce((sum, c) => sum + c.currentPrice, 0)

  const handleStartMining = async (contractId: string) => {
    haptic.medium()
    
    // Show confirmation modal
    const confirmed = await new Promise((resolve) => {
      if (window.confirm('Вы точно хотите начать майнинг?\n\nВы не сможете выполнять действий с контрактом минимум 7 дней.')) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
    
    if (!confirmed) return
    
    try {
      const response = await api.startMining(contractId)
      if (response.success) {
        toast.success('Mining started! Contract locked for 7 days.')
        await loadUserContracts() // Reload contracts
      } else {
        toast.error(response.error || 'Failed to start mining')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to start mining')
    }
  }

  const handleStopMining = async (contractId: string) => {
    haptic.medium()
    try {
      const response = await api.stopMining(contractId)
      if (response.success) {
        toast.success('Mining stopped')
        await loadUserContracts() // Reload contracts
      } else {
        toast.error(response.error || 'Failed to stop mining')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to stop mining')
    }
  }

  const handleListOnMarket = async (contractId: string) => {
    haptic.medium()
    const priceInput = prompt('Enter listing price in USD:')
    if (!priceInput) return
    
    const price = parseFloat(priceInput)
    if (isNaN(price) || price <= 0) {
      toast.error('Invalid price')
      return
    }

    try {
      const response = await api.listContract(contractId, price)
      if (response.success) {
        toast.success('Contract listed on marketplace!')
        await loadUserContracts()
      } else {
        toast.error(response.error || 'Failed to list contract')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to list contract')
    }
  }

  const handleWithdraw = async (contractId: string) => {
    haptic.medium()
    if (!confirm('Withdraw this contract to your TON wallet?')) return

    try {
      const response = await api.withdrawContract(contractId)
      if (response.success) {
        toast.success('Contract withdrawn to wallet!')
        await loadUserContracts()
      } else {
        toast.error(response.error || 'Failed to withdraw contract')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to withdraw contract')
    }
  }

  const handleImportFromWallet = async () => {
    haptic.medium()
    const tokenId = prompt('Enter NFT Token ID to import:')
    if (!tokenId) return

    try {
      const response = await api.importContract(tokenId)
      if (response.success) {
        toast.success('Contract imported from wallet!')
        await loadUserContracts()
      } else {
        toast.error(response.error || 'Failed to import contract')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to import contract')
    }
  }

  const getDaysLeft = (expirationDate: string) => {
    const days = Math.ceil(
      (new Date(expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    return days
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Portfolio</h1>
        <p className="text-dark-text-secondary">
          Управляйте своими BTC Mining контрактами
        </p>
      </div>

      {/* Stats Card */}
      <div className="card p-4 mb-6 border-primary/30">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-dark-text-secondary mb-1">Всего контрактов</p>
            <p className="text-2xl font-bold">{contracts.length}</p>
          </div>
          <div>
            <p className="text-xs text-dark-text-secondary mb-1">Общая стоимость</p>
            <p className="text-2xl font-bold text-primary">${totalValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-dark-text-secondary mb-1">Дневной доход</p>
            <p className="text-2xl font-bold text-warning">
              {contracts.reduce((sum, c) => sum + c.dailyIncome, 0).toFixed(8)} BTC
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              haptic.selection()
              setActiveTab('unlisted')
            }}
            className={`
              px-4 py-2 rounded-lg font-semibold text-sm transition-all
              ${activeTab === 'unlisted' 
                ? 'bg-white text-dark-bg' 
                : 'bg-dark-bg text-dark-text-secondary'
              }
            `}
          >
            Unlisted {unlistedContracts.length}
          </button>
          <button
            onClick={() => {
              haptic.selection()
              setActiveTab('listed')
            }}
            className={`
              px-4 py-2 rounded-lg font-semibold text-sm transition-all
              ${activeTab === 'listed' 
                ? 'bg-white text-dark-bg' 
                : 'bg-dark-bg text-dark-text-secondary'
              }
            `}
          >
            Listed {listedContracts.length}
          </button>
        </div>

        <button
          onClick={() => {
            haptic.light()
            setViewMode(viewMode === 'grid' ? 'list' : 'grid')
          }}
          className="btn btn-secondary p-2"
        >
          {viewMode === 'grid' ? <ListIcon className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
        </button>
      </div>

      {/* Quick Actions */}
      {activeTab === 'unlisted' && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button 
            onClick={handleImportFromWallet}
            className="btn btn-primary flex-shrink-0 text-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            Импорт из кошелька
          </button>
          {unlistedContracts.length > 0 && (
            <>
              <button 
                onClick={() => {
                  haptic.medium()
                  if (unlistedContracts.length > 0) {
                    handleListOnMarket(unlistedContracts[0].id)
                  }
                }}
                className="btn btn-secondary flex-shrink-0 text-sm"
              >
                <Upload className="w-4 h-4 mr-1" />
                Выставить на продажу
              </button>
              <button 
                onClick={() => {
                  haptic.medium()
                  if (unlistedContracts.length > 0) {
                    handleWithdraw(unlistedContracts[0].id)
                  }
                }}
                className="btn btn-secondary flex-shrink-0 text-sm"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Вывести
              </button>
              <button 
                onClick={() => {
                  haptic.medium()
                  if (unlistedContracts.length > 0) {
                    handleStartMining(unlistedContracts[0].id)
                  }
                }}
                className="btn btn-secondary flex-shrink-0 text-sm"
              >
                <Play className="w-4 h-4 mr-1" />
                Начать майнинг
              </button>
              <button className="btn btn-secondary flex-shrink-0 text-sm">
                <Package className="w-4 h-4 mr-1" />
                Собрать в Bundle
              </button>
            </>
          )}
        </div>
      )}

      {/* Contracts Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : displayContracts.length === 0 ? (
        <div className="card p-8 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-dark-text-secondary/50" />
          <h3 className="text-xl font-bold mb-2">
            {activeTab === 'unlisted' ? 'Нет контрактов' : 'Нет выставленных контрактов'}
          </h3>
          <p className="text-dark-text-secondary mb-4">
            {activeTab === 'unlisted' 
              ? 'Купите контракты на маркетплейсе или выиграйте в лотерее'
              : 'Выставьте свои контракты на продажу'
            }
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="btn btn-primary"
          >
            Перейти на маркетплейс
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
          {displayContracts.map((contract) => (
            <div
              key={contract.id}
              className="card p-4 cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => navigate(`/contract/${contract.id}`)}
            >
              {/* Contract Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold mb-1">{contract.metadata?.name || `Contract #${contract.id}`}</h3>
                  <p className="text-xs text-dark-text-secondary">#{contract.id}</p>
                  {contract.status === 'mining' && (
                    <span className="inline-flex items-center gap-1 text-xs text-success mt-1">
                      <Play className="w-3 h-3" />
                      Mining active
                    </span>
                  )}
                  {contract.status === 'on_sale' && (
                    <span className="inline-flex items-center gap-1 text-xs text-primary mt-1">
                      <DollarSign className="w-3 h-3" />
                      На продаже
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-dark-text-secondary">Floor price</p>
                  <p className="text-lg font-bold text-primary">${contract.currentPrice}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-dark-bg/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-dark-text-secondary mb-1">Hashrate</p>
                  <p className="font-bold">{contract.hashrate} TH/s</p>
                </div>
                <div className="bg-dark-bg/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-dark-text-secondary mb-1">Days left</p>
                  <p className="font-bold">{getDaysLeft(contract.expirationDate)}d</p>
                </div>
                <div className="bg-dark-bg/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-dark-text-secondary mb-1">Daily</p>
                  <p className="font-bold text-warning text-sm" title={`${contract.dailyIncome.toFixed(8)} BTC`}>
                    {contract.dailyIncome.toFixed(6)} BTC
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                {activeTab === 'unlisted' ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (contract.status === 'mining') {
                          handleStopMining(contract.id)
                        } else {
                          handleStartMining(contract.id)
                        }
                      }}
                      className={`${
                        contract.status === 'mining' 
                          ? 'bg-gradient-to-r from-warning to-orange-500' 
                          : 'bg-gradient-to-r from-success to-emerald-500'
                      } text-white font-semibold text-xs py-2.5 rounded-lg transition-all hover:scale-105 hover:shadow-lg inline-flex items-center justify-center gap-1`}
                    >
                      {contract.status === 'mining' ? (
                        <>
                          <StopCircle className="w-3 h-3" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          Mine
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleListOnMarket(contract.id)
                      }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-xs py-2.5 rounded-lg transition-all hover:scale-105 hover:shadow-lg inline-flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={contract.status === 'mining'}
                    >
                      <Upload className="w-3 h-3" />
                      Sell
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleWithdraw(contract.id)
                      }}
                      className="bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-xs py-2.5 rounded-lg transition-all hover:scale-105 hover:shadow-lg inline-flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={contract.status === 'mining'}
                    >
                      <TrendingUp className="w-3 h-3" />
                      Withdraw
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: Update price
                      }}
                      className="btn btn-primary text-xs py-2"
                    >
                      Edit price
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: Remove from market
                      }}
                      className="btn btn-danger text-xs py-2 col-span-2"
                    >
                      Remove from market
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
