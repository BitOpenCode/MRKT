import { Clock, Trophy, Users, ChevronRight } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import type { LotteryDraw } from '@/types'

interface Props {
  history: LotteryDraw[]
  onViewDetails: (drawId: string) => void
}

export default function LotteryHistory({ history, onViewDetails }: Props) {
  const { haptic } = useTelegram()

  if (history.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Clock className="w-16 h-16 text-dark-text-secondary mx-auto mb-3 opacity-50" />
        <p className="text-dark-text-secondary">No draw history yet</p>
        <p className="text-xs text-dark-text-secondary mt-2">
          History will appear after the first draw
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-dark-text">Draw History</h3>
        <span className="text-sm text-dark-text-secondary">
          {history.length} draw{history.length > 1 ? 's' : ''}
        </span>
      </div>

      {history.map((draw) => (
        <div
          key={draw.id}
          onClick={() => {
            haptic.light()
            onViewDetails(draw.id)
          }}
          className="card p-4 cursor-pointer hover:border-primary transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-dark-text">Draw #{draw.drawNumber}</h4>
                <p className="text-xs text-dark-text-secondary">
                  {new Date(draw.drawDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-dark-text-secondary" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-dark-bg/50 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Trophy className="w-3 h-3 text-success" />
                <p className="text-xs text-dark-text-secondary">Winner</p>
              </div>
              <p className="font-bold text-success">#{draw.winner}</p>
            </div>
            <div className="bg-dark-bg/50 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Users className="w-3 h-3 text-primary" />
                <p className="text-xs text-dark-text-secondary">Participants</p>
              </div>
              <p className="font-bold text-dark-text">{draw.tickets.length}</p>
            </div>
          </div>

          {/* Verification Status */}
          {draw.verified && (
            <div className="mt-2 flex items-center gap-1 text-xs text-success">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <span>Verified on Bitcoin Blockchain</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
