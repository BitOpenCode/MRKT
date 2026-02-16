import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe, Moon, Sun, Bell, User, Shield, Info } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useTelegram } from '@/hooks/useTelegram'
import { useTranslation } from '@/hooks/useTranslation'
import { languages } from '@/i18n/languages'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { haptic } = useTelegram()
  const { t } = useTranslation()
  const { theme, toggleTheme, language, setLanguage } = useAppStore()

  const handleLanguageChange = (langCode: string) => {
    haptic.selection()
    setLanguage(langCode)
    const selectedLang = languages.find(l => l.code === langCode)
    toast.success(`${selectedLang?.flag} ${selectedLang?.nativeName}`)
  }

  const handleThemeToggle = () => {
    haptic.medium()
    toggleTheme()
    toast.success(theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode')
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            haptic.light()
            navigate(-1)
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Customize your experience
          </p>
        </div>
      </div>

      {/* Language Section */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{t('settings.language')}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('settings.selectLanguage')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`
                p-3 rounded-lg border-2 transition-all duration-300
                ${language === lang.code
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                }
              `}
            >
              <div className="text-2xl mb-1">{lang.flag}</div>
              <div className="text-xs font-semibold text-gray-900 dark:text-white">
                {lang.nativeName}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">
                {lang.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Section */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-white" />
            ) : (
              <Sun className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-lg">{t('settings.theme')}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Choose your preferred theme
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleThemeToggle}
            className={`
              p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2
              ${theme === 'light'
                ? 'border-primary bg-primary/10 scale-105'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
              }
            `}
          >
            <Sun className="w-8 h-8 text-yellow-500" />
            <span className="font-semibold">{t('settings.light')}</span>
          </button>

          <button
            onClick={handleThemeToggle}
            className={`
              p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2
              ${theme === 'dark'
                ? 'border-primary bg-primary/10 scale-105'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
              }
            `}
          >
            <Moon className="w-8 h-8 text-blue-500" />
            <span className="font-semibold">{t('settings.dark')}</span>
          </button>
        </div>
      </div>

      {/* Other Settings */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{t('settings.notifications')}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Manage notification preferences
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <span className="text-sm font-medium">Push Notifications</span>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <span className="text-sm font-medium">Email Notifications</span>
            <input type="checkbox" className="w-5 h-5" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <span className="text-sm font-medium">Offer Alerts</span>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </label>
        </div>
      </div>

      {/* Account Info */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{t('settings.account')}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Account information
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <span className="text-gray-600 dark:text-gray-400">Version</span>
            <span className="font-semibold">1.0.0</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <span className="text-gray-600 dark:text-gray-400">Build</span>
            <span className="font-semibold">2026.02.15</span>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <Info className="w-5 h-5 text-primary" />
          <h3 className="font-bold">About ECOS Marketplace</h3>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          ECOS Marketplace is a decentralized platform for trading BTC mining contracts.
          Built on TON blockchain with love ❤️
        </p>
      </div>
    </div>
  )
}
