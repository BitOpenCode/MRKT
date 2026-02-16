import { useEffect, useState } from 'react'
import { X, DollarSign, AlertCircle } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/store/appStore'
import toast from 'react-hot-toast'

interface Props {
  onClose: () => void
  usdtBalance: number
}

export default function WithdrawModal({ onClose, usdtBalance }: Props) {
  const { haptic } = useTelegram()
  const { user } = useAppStore()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const userLevel = user?.level || 1
  const minWithdraw = 20 // Минимум для Level 1
  const withdrawFee = 1 // Комиссия $1
  const maxAmount = usdtBalance - withdrawFee

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount)
    
    if (!withdrawAmount || withdrawAmount < minWithdraw) {
      toast.error(`Минимальная сумма вывода: $${minWithdraw}`)
      haptic.error()
      return
    }

    if (withdrawAmount + withdrawFee > usdtBalance) {
      toast.error('Недостаточно средств')
      haptic.error()
      return
    }

    setLoading(true)
    haptic.medium()

    try {
      // TODO: Implement withdrawal API
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(`Выведено: $${withdrawAmount}`)
      onClose()
    } catch (error) {
      toast.error('Ошибка вывода')
      haptic.error()
    } finally {
      setLoading(false)
    }
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Вывести средства</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Доступный баланс: <span className="font-bold text-success">${usdtBalance.toFixed(2)}</span>
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="card p-4 bg-warning/10 border border-warning/30">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold mb-1">Условия вывода (Level {userLevel})</p>
                <ul className="text-xs space-y-1">
                  <li>• Минимальная сумма: <span className="font-bold">${minWithdraw}</span></li>
                  <li>• Комиссия за вывод: <span className="font-bold">${withdrawFee}</span></li>
                  <li>• Средства поступят на подключенный кошелек</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Сумма вывода (USDT)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Минимум $${minWithdraw}`}
              className="input w-full"
              min={minWithdraw}
              max={maxAmount}
              step="0.01"
            />
            <button
              onClick={() => setAmount(maxAmount.toFixed(2))}
              className="text-xs text-primary mt-1 hover:underline"
            >
              Максимум: ${maxAmount.toFixed(2)}
            </button>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="card p-3 bg-success/10">
              <div className="flex justify-between text-sm mb-1">
                <span>Сумма вывода:</span>
                <span className="font-bold">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Комиссия:</span>
                <span className="font-bold">-${withdrawFee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-300 dark:bg-gray-600 my-2"></div>
              <div className="flex justify-between text-base font-bold">
                <span>Итого:</span>
                <span className="text-success">${(parseFloat(amount) + withdrawFee).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleWithdraw}
          disabled={loading || !amount || parseFloat(amount) < minWithdraw}
          className="btn btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Обработка...' : 'Вывести средства'}
        </button>
      </div>
    </div>
  )
}
