import { useEffect, useState } from 'react'
import { Trophy, Ticket, Clock, ShoppingCart, History } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/store/appStore'
import api from '@/services/api'
import toast from 'react-hot-toast'
import LotteryTicketPurchase from '@/components/LotteryTicketPurchase'
import LotteryDraw from '@/components/LotteryDraw'
import LotteryHistory from '@/components/LotteryHistory'
import MyLotteryTickets from '@/components/MyLotteryTickets'
import type { LotteryDraw as LotteryDrawType, LotteryTicket } from '@/types'

export default function LotteryPage() {
  const { haptic } = useTelegram()
  const { user } = useAppStore()
  const [currentDraw, setCurrentDraw] = useState<LotteryDrawType | null>(null)
  const [history, setHistory] = useState<LotteryDrawType[]>([])
  const [userTickets, setUserTickets] = useState<LotteryTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'buy' | 'draw' | 'mytickets' | 'history'>('buy')
  
  // Lottery config
  const ticketPrice = 0.5 // TON
  const nextDrawTime = new Date(Date.now() + 3600000).toISOString() // 1 hour from now

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load current draw
      const currentRes = await api.getCurrentDraw()
      if (currentRes.success && currentRes.data) {
        setCurrentDraw(currentRes.data)
      }

      // Load history
      const historyRes = await api.getLotteryHistory(1, 10)
      if (historyRes.success && historyRes.data) {
        setHistory(historyRes.data.items)
      }

      // Load user tickets
      const ticketsRes = await api.getUserTickets()
      if (ticketsRes.success && ticketsRes.data) {
        setUserTickets(ticketsRes.data)
      }
    } catch (error) {
      console.error('Failed to load lottery data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTestDraw = async () => {
    try {
      haptic.medium()
      toast.loading('Creating test draw with 10 tickets...', { duration: 2000 })
      
      // Create a test draw with 10 tickets (prize: 100 TH)
      const res = await api.post('/lottery/test-draw', {
        ticketCount: 10,
        prize: '100 TH Mining Contract'
      })
      
      if (res.data.success) {
        toast.success(`✅ Created test draw with ${res.data.data.ticketCount} tickets!`)
        await loadData()
      }
    } catch (error) {
      console.error('Failed to create test draw:', error)
      toast.error('Failed to create test draw')
    }
  }

  const handleConductDraw = async () => {
    try {
      haptic.heavy()
      toast.loading('Conducting draw...', { duration: 2000 })
      
      const res = await api.conductDraw(3)
      if (res.success && res.data) {
        toast.success(`🎉 Winner: Ticket #${res.data.winningTicket}!`, { duration: 5000 })
        toast.success(`Hash: ${res.data.blockHash?.substring(0, 16)}...`, { duration: 5000 })
        await loadData()
        setActiveTab('draw')
      }
    } catch (error) {
      console.error('Failed to conduct draw:', error)
      toast.error('Failed to conduct draw')
    }
  }

  const handlePurchaseTickets = async (count: number, usePoints: boolean) => {
    try {
      // TODO: Implement API call
      // toast.success moved to LotteryTicketPurchase component
      
      // Mock: Add tickets to user's collection
      const newTickets: LotteryTicket[] = Array.from({ length: count }, (_, i) => ({
        id: `ticket-${Date.now()}-${i}`,
        ticketNumber: Math.floor(Math.random() * 10000),
        userId: user?.id || 'user1',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }))
      
      setUserTickets([...userTickets, ...newTickets])
      setActiveTab('mytickets')
    } catch (error) {
      throw error
    }
  }

  const handleViewDrawDetails = (drawId: string) => {
    haptic.light()
    const draw = history.find(d => d.id === drawId)
    if (draw) {
      setCurrentDraw(draw)
      setActiveTab('draw')
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
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Trophy className="w-7 h-7" />
            BTC Lottery
          </h1>
          <button
            onClick={handleCreateTestDraw}
            className="btn btn-warning text-xs px-3 py-2"
          >
            🧪 Test: Create 10 tickets
          </button>
        </div>
        <p className="text-sm text-dark-text-secondary">
          Fair lottery based on Bitcoin blocks • Prize: 100 TH Mining Contract
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
        <button
          onClick={() => {
            haptic.selection()
            setActiveTab('buy')
          }}
          className={`btn flex-shrink-0 text-sm ${
            activeTab === 'buy' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          Buy Tickets
        </button>
        <button
          onClick={() => {
            haptic.selection()
            setActiveTab('draw')
          }}
          className={`btn flex-shrink-0 text-sm ${
            activeTab === 'draw' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          <Trophy className="w-4 h-4 mr-1" />
          Current Draw
        </button>
        <button
          onClick={() => {
            haptic.selection()
            setActiveTab('mytickets')
          }}
          className={`btn flex-shrink-0 text-sm ${
            activeTab === 'mytickets' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          <Ticket className="w-4 h-4 mr-1" />
          My Tickets ({userTickets.length})
        </button>
        <button
          onClick={() => {
            haptic.selection()
            setActiveTab('history')
          }}
          className={`btn flex-shrink-0 text-sm ${
            activeTab === 'history' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          <History className="w-4 h-4 mr-1" />
          History
        </button>
      </div>

      {/* Tab Content */}
          {activeTab === 'buy' && (
            <LotteryTicketPurchase
              ticketPrice={ticketPrice}
              userEcosPoints={user?.ecosPoints || 0}
              userBalance={user?.usdtBalance || 0}
              userLevel={user?.level || 1}
              onPurchase={handlePurchaseTickets}
            />
          )}

      {activeTab === 'draw' && (
        <LotteryDraw
          draw={currentDraw}
          nextDrawTime={nextDrawTime}
          onConduct={handleConductDraw}
        />
      )}

      {activeTab === 'mytickets' && (
        <MyLotteryTickets tickets={userTickets} />
      )}

      {activeTab === 'history' && (
        <LotteryHistory
          history={history}
          onViewDetails={handleViewDrawDetails}
        />
      )}

      {/* Info Card - Always visible */}
      <div className="card p-4 border-info/30">
        <div className="flex items-start gap-3">
          <Trophy className="w-8 h-8 text-info flex-shrink-0" />
          <div>
            <h3 className="font-bold text-sm mb-2">How it works?</h3>
            <ul className="text-xs text-dark-text-secondary space-y-1">
              <li>• Uses real Bitcoin block hashes</li>
              <li>• Fully transparent and verifiable algorithm</li>
              <li>• Impossible to predict or manipulate</li>
              <li>• Each draw can be independently verified</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
