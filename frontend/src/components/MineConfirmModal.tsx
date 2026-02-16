import { useEffect } from 'react'
import { X, AlertTriangle, Cpu } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'

interface Props {
  onClose: () => void
  onConfirm: () => void
  contractNumber: string
}

export default function MineConfirmModal({ onClose, onConfirm, contractNumber }: Props) {
  const { haptic } = useTelegram()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleConfirm = () => {
    haptic.heavy()
    onConfirm()
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warning/10 flex items-center justify-center">
            <Cpu className="w-8 h-8 text-warning" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Начать майнинг?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Контракт: <span className="font-bold">{contractNumber}</span>
          </p>
        </div>

        <div className="card p-4 bg-warning/10 border border-warning/30 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
            <div>
              <p className="font-semibold mb-2">⚠️ Важное предупреждение:</p>
              <ul className="text-sm space-y-2">
                <li>• Вы не сможете выполнять действия с контрактом минимум <span className="font-bold text-warning">7 дней</span></li>
                <li>• Контракт будет заблокирован для продажи и вывода</li>
                <li>• Майнинг начнется сразу после подтверждения</li>
                <li>• BTC будет начисляться ежедневно</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="btn btn-secondary py-3"
          >
            Отмена
          </button>
          <button
            onClick={handleConfirm}
            className="btn btn-success py-3 font-semibold"
          >
            ✓ Подтвердить
          </button>
        </div>
      </div>
    </div>
  )
}
