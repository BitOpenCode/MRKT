import { Ticket, Calendar, CheckCircle, Clock } from 'lucide-react'
import type { LotteryTicket } from '@/types'

interface Props {
  tickets: LotteryTicket[]
}

export default function MyLotteryTickets({ tickets }: Props) {
  if (tickets.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Ticket className="w-16 h-16 text-dark-text-secondary mx-auto mb-3 opacity-50" />
        <p className="text-xl font-semibold mb-2">No tickets yet</p>
        <p className="text-dark-text-secondary text-sm">
          Purchase tickets to participate in the lottery
        </p>
      </div>
    )
  }

  // Group tickets by status
  const activeTickets = tickets.filter(t => t.status === 'pending')
  const wonTickets = tickets.filter(t => t.status === 'won')
  const lostTickets = tickets.filter(t => t.status === 'lost')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'text-success'
      case 'lost': return 'text-danger'
      case 'pending': return 'text-warning'
      default: return 'text-dark-text-secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <Ticket className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3 text-center border-warning/30">
          <p className="text-2xl font-bold text-warning">{activeTickets.length}</p>
          <p className="text-xs text-dark-text-secondary">Active</p>
        </div>
        <div className="card p-3 text-center border-success/30">
          <p className="text-2xl font-bold text-success">{wonTickets.length}</p>
          <p className="text-xs text-dark-text-secondary">Won</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-dark-text">{tickets.length}</p>
          <p className="text-xs text-dark-text-secondary">Total</p>
        </div>
      </div>

      {/* Tickets List */}
      <div>
        <h3 className="text-lg font-bold text-dark-text mb-3">Your Tickets</h3>
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`card p-4 border-2 ${
                ticket.status === 'won' ? 'border-success bg-success/5' :
                ticket.status === 'pending' ? 'border-warning/50' :
                'border-dark-border opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    ticket.status === 'won' ? 'bg-success/20' :
                    ticket.status === 'pending' ? 'bg-warning/20' :
                    'bg-dark-bg'
                  }`}>
                    <Ticket className={`w-5 h-5 ${getStatusColor(ticket.status)}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-text text-lg">
                      Ticket #{ticket.ticketNumber}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-dark-text-secondary mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`flex items-center gap-1 ${getStatusColor(ticket.status)} mb-1`}>
                    {getStatusIcon(ticket.status)}
                    <span className="text-sm font-semibold capitalize">
                      {ticket.status}
                    </span>
                  </div>
                  {ticket.drawId && (
                    <span className="text-xs text-dark-text-secondary">
                      Draw #{ticket.drawId.substring(0, 6)}
                    </span>
                  )}
                </div>
              </div>

              {/* Won Badge */}
              {ticket.status === 'won' && (
                <div className="mt-3 pt-3 border-t border-success/30">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-success/10 rounded-lg p-2">
                      <p className="text-xs text-success font-semibold">
                        🎉 Congratulations! You won this draw!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Total Value */}
      <div className="card p-4 border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-text-secondary mb-1">Total Investment</p>
            <p className="text-2xl font-bold text-dark-text">
              {(tickets.length * 0.5).toFixed(1)} TON
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-dark-text-secondary mb-1">Potential Win</p>
            <p className="text-2xl font-bold text-success">
              {activeTickets.length > 0 ? '🎁 NFT Contract' : '--'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
