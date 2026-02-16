import { useAppStore } from '@/store/appStore'
import { translations, type LanguageCode } from '@/i18n/languages'

export function useTranslation() {
  const { language } = useAppStore()
  
  const t = (key: string): string => {
    const translation = translations[language as LanguageCode]?.[key]
    
    // Fallback to English if translation not found
    if (!translation) {
      return translations['en']?.[key] || key
    }
    
    return translation
  }
  
  return { t, language }
}
