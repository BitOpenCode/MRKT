import { useEffect } from 'react'
import { X, Wallet, ExternalLink } from 'lucide-react'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { useTelegram } from '@/hooks/useTelegram'

interface Props {
  onClose: () => void
}

export default function DepositModal({ onClose }: Props) {
  const [tonConnectUI] = useTonConnectUI()
  const { haptic } = useTelegram()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleConnect = () => {
    haptic.medium()
    tonConnectUI.openModal()
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="card relative w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Пополнить баланс</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Открытие окна подключенного кошелька
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="card p-4 bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm mb-2">
              💡 Для пополнения баланса необходимо подключить TON кошелек
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ваши средства будут зачислены на внутренний баланс маркетплейса
            </p>
          </div>
        </div>

        <button
          onClick={handleConnect}
          className="btn btn-success w-full py-3 text-lg font-semibold flex items-center justify-center gap-2"
        >
          <Wallet className="w-5 h-5" />
          Подключить кошелек
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
