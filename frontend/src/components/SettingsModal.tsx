import { useEffect } from 'react'
import { X, Bell, Lock, Shield, Globe, Palette } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/store/appStore'
import { languages } from '@/i18n/languages'

interface Props {
  onClose: () => void
}

export default function SettingsModal({ onClose }: Props) {
  const { haptic } = useTelegram()
  const { theme, setTheme, language, setLanguage } = useAppStore()

  // Block body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    haptic.selection()
    setTheme(newTheme)
  }

  const handleLanguageChange = (newLang: string) => {
    haptic.selection()
    setLanguage(newLang)
  }

  const settingsOptions = [
    {
      icon: Bell,
      title: 'Уведомления',
      description: 'Настроить push-уведомления',
      action: () => {
        haptic.medium()
        // TODO: Implement notifications settings
        alert('Настройка уведомлений в разработке')
      }
    },
    {
      icon: Lock,
      title: 'Сменить пароль',
      description: 'Изменить пароль аккаунта',
      action: () => {
        haptic.medium()
        // TODO: Implement change password
        alert('Смена пароля в разработке')
      }
    },
    {
      icon: Shield,
      title: 'Двухфакторная аутентификация',
      description: 'Настроить 2FA для безопасности',
      action: () => {
        haptic.medium()
        // TODO: Implement 2FA
        alert('Настройка 2FA в разработке')
      }
    }
  ]

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="card relative w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Настройки</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Управление вашим аккаунтом
          </p>
        </div>

        {/* Settings Options */}
        <div className="space-y-3 mb-6">
          {settingsOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="w-full card p-4 hover:scale-[1.02] transition-all duration-300 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <option.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1 truncate">{option.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Язык приложения</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  language === lang.code
                    ? 'bg-primary text-white'
                    : 'card hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm font-medium truncate">{lang.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Тема</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-xl transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-primary text-white ring-2 ring-primary'
                  : 'card hover:scale-[1.02]'
              }`}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-gray-700" />
                </div>
                <p className="font-semibold">Темная</p>
              </div>
            </button>
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-xl transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-primary text-white ring-2 ring-primary'
                  : 'card hover:scale-[1.02]'
              }`}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white" />
                </div>
                <p className="font-semibold">Светлая</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
