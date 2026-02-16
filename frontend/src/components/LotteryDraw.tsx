import { useState, useEffect } from 'react'
import { Trophy, Clock, Hash, CheckCircle, AlertCircle } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import type { LotteryDraw as LotteryDrawType } from '@/types'

interface Props {
  draw: LotteryDrawType | null
  nextDrawTime: string
  onConduct: () => Promise<void>
}

export default function LotteryDraw({ draw, nextDrawTime, onConduct }: Props) {
  const { haptic } = useTelegram()
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [conducting, setConducting] = useState(false)

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date().getTime()
      const target = new Date(nextDrawTime).getTime()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft('Ready to draw!')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [nextDrawTime])

  const handleConduct = async () => {
    haptic.heavy()
    setConducting(true)
    try {
      await onConduct()
    } finally {
      setConducting(false)
    }
  }

  const isReady = timeLeft === 'Ready to draw!'

  return (
    <div className="card p-6 border-success/30 relative overflow-hidden">
      {/* Decorative Trophy Icon */}
      <div className="absolute top-4 right-4 opacity-10">
        <Trophy className="w-32 h-32 text-warning" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success to-primary flex items-center justify-center shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-dark-text">
              {draw ? `Draw #${draw.drawNumber}` : 'Ready for New Draw!'}
            </h2>
            <p className="text-sm text-dark-text-secondary">
              Bitcoin Block-Based Lottery
            </p>
          </div>
        </div>

        {/* Current Draw Info */}
        {draw ? (
          <div className="space-y-4">
            {/* Winner */}
            <div className="bg-dark-bg/50 rounded-lg p-4 border-2 border-success">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <p className="text-sm font-semibold text-success uppercase">Winner</p>
              </div>
              <p className="text-3xl font-bold text-dark-text">
                Ticket #{draw.winner}
              </p>
            </div>

            {/* Draw Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-dark-bg/50 rounded-lg p-3">
                <p className="text-xs text-dark-text-secondary mb-1">Total Participants</p>
                <p className="text-xl font-bold">{draw.tickets.length}</p>
              </div>
              <div className="bg-dark-bg/50 rounded-lg p-3">
                <p className="text-xs text-dark-text-secondary mb-1">Draw Date</p>
                <p className="text-sm font-semibold">
                  {new Date(draw.drawDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Seed & Verification */}
            <div className="bg-dark-surface/50 rounded-lg p-4 border border-dark-border">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold text-dark-text-secondary uppercase">
                  Verification Seed
                </p>
              </div>
              <p className="font-mono text-xs break-all text-dark-text-secondary mb-3">
                {draw.seedHex}
              </p>
              
              {/* Bitcoin Blocks */}
              <div className="space-y-2">
                <p className="text-xs text-dark-text-secondary">Bitcoin Blocks Used:</p>
                {draw.blockHeights.map((height, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="text-primary font-semibold">#{height}</span>
                    <span className="font-mono text-dark-text-secondary truncate">
                      {draw.blockHashes[idx].substring(0, 16)}...
                    </span>
                  </div>
                ))}
              </div>

              {/* Verified Badge */}
              {draw.verified && (
                <div className="mt-3 pt-3 border-t border-dark-border">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-semibold">Verified on Bitcoin Blockchain</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Next Draw Countdown */}
            <div className="bg-dark-bg/50 rounded-lg p-6 mb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-warning" />
                <p className="text-sm text-dark-text-secondary uppercase font-semibold">
                  Next Draw In
                </p>
              </div>
              <p className={`text-4xl font-bold mb-2 ${
                isReady ? 'text-success animate-pulse' : 'text-dark-text'
              }`}>
                {timeLeft}
              </p>
              <p className="text-xs text-dark-text-secondary">
                Click the button below when ready
              </p>
            </div>

            {/* Conduct Draw Button */}
            <button
              onClick={handleConduct}
              disabled={!isReady || conducting}
              className={`btn w-full btn-lg flex items-center justify-center gap-2 ${
                isReady ? 'btn-primary animate-pulse' : 'btn-secondary opacity-50'
              }`}
            >
              {conducting ? (
                <>
                  <div className="spinner w-5 h-5 border-2"></div>
                  <span>Conducting Draw...</span>
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  <span>{isReady ? '🎲 Conduct Draw Now!' : 'Waiting for Next Draw'}</span>
                </>
              )}
            </button>

            {/* Info */}
            <div className="mt-4 bg-info/10 border border-info/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
                <p className="text-xs text-dark-text-secondary">
                  The draw uses real Bitcoin block hashes as a source of randomness, ensuring complete transparency and fairness. Anyone can verify the results.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
