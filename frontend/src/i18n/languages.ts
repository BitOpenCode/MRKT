export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
] as const

export type LanguageCode = typeof languages[number]['code']

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.marketplace': 'Marketplace',
    'nav.profile': 'Profile',
    'nav.mining': 'Mining',
    'nav.lottery': 'Lottery',
    'nav.portfolio': 'Portfolio',
    'nav.offers': 'Offers',
    'nav.activity': 'Activity',
    'nav.notifications': 'Notifications',
    'nav.settings': 'Settings',
    'nav.cart': 'Cart',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.close': 'Close',
    'common.buy': 'Buy',
    'common.sell': 'Sell',
    'common.price': 'Price',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.selectLanguage': 'Select Language',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.notifications': 'Notifications',
    'settings.account': 'Account',
    
    // Contract
    'contract.hashrate': 'Hashrate',
    'contract.dailyIncome': 'Daily Income',
    'contract.expirationDate': 'Expiration Date',
    'contract.daysLeft': 'Days Left',
    'contract.fairPrice': 'Fair Price',
    'contract.currentPrice': 'Current Price',
    'contract.roi': 'ROI',
    
    // Actions
    'action.buyNow': 'Buy Now',
    'action.addToCart': 'Add to Cart',
    'action.startMining': 'Start Mining',
    'action.stopMining': 'Stop Mining',
    'action.withdraw': 'Withdraw',
    'action.list': 'List on Market',
  },
  
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.marketplace': 'Маркетплейс',
    'nav.profile': 'Профиль',
    'nav.mining': 'Майнинг',
    'nav.lottery': 'Лотерея',
    'nav.portfolio': 'Портфолио',
    'nav.offers': 'Офферы',
    'nav.activity': 'Активность',
    'nav.notifications': 'Уведомления',
    'nav.settings': 'Настройки',
    'nav.cart': 'Корзина',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
    'common.close': 'Закрыть',
    'common.buy': 'Купить',
    'common.sell': 'Продать',
    'common.price': 'Цена',
    
    // Settings
    'settings.title': 'Настройки',
    'settings.language': 'Язык',
    'settings.selectLanguage': 'Выберите язык',
    'settings.theme': 'Тема',
    'settings.light': 'Светлая',
    'settings.dark': 'Темная',
    'settings.notifications': 'Уведомления',
    'settings.account': 'Аккаунт',
    
    // Contract
    'contract.hashrate': 'Хешрейт',
    'contract.dailyIncome': 'Дневной доход',
    'contract.expirationDate': 'Дата истечения',
    'contract.daysLeft': 'Дней осталось',
    'contract.fairPrice': 'Справедливая цена',
    'contract.currentPrice': 'Текущая цена',
    'contract.roi': 'ROI',
    
    // Actions
    'action.buyNow': 'Купить сейчас',
    'action.addToCart': 'В корзину',
    'action.startMining': 'Начать майнинг',
    'action.stopMining': 'Остановить',
    'action.withdraw': 'Вывести',
    'action.list': 'Выставить на продажу',
  },
  
  zh: {
    'nav.home': '主页',
    'nav.marketplace': '市场',
    'nav.profile': '个人资料',
    'nav.mining': '挖矿',
    'nav.lottery': '抽奖',
    'nav.portfolio': '投资组合',
    'settings.title': '设置',
    'settings.language': '语言',
    'settings.selectLanguage': '选择语言',
    'common.loading': '加载中...',
    'common.save': '保存',
    'action.buyNow': '立即购买',
  },
  
  es: {
    'nav.home': 'Inicio',
    'nav.marketplace': 'Mercado',
    'nav.profile': 'Perfil',
    'settings.title': 'Configuración',
    'settings.language': 'Idioma',
    'settings.selectLanguage': 'Seleccionar idioma',
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'action.buyNow': 'Comprar ahora',
  },
  
  ar: {
    'nav.home': 'الرئيسية',
    'nav.marketplace': 'السوق',
    'nav.profile': 'الملف الشخصي',
    'settings.title': 'الإعدادات',
    'settings.language': 'اللغة',
    'settings.selectLanguage': 'اختر اللغة',
    'common.loading': 'جار التحميل...',
    'common.save': 'حفظ',
    'action.buyNow': 'اشتر الآن',
  },
  
  fr: {
    'nav.home': 'Accueil',
    'nav.marketplace': 'Marché',
    'nav.profile': 'Profil',
    'settings.title': 'Paramètres',
    'settings.language': 'Langue',
    'settings.selectLanguage': 'Sélectionner la langue',
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'action.buyNow': 'Acheter maintenant',
  },
  
  de: {
    'nav.home': 'Startseite',
    'nav.marketplace': 'Marktplatz',
    'nav.profile': 'Profil',
    'settings.title': 'Einstellungen',
    'settings.language': 'Sprache',
    'settings.selectLanguage': 'Sprache auswählen',
    'common.loading': 'Wird geladen...',
    'common.save': 'Speichern',
    'action.buyNow': 'Jetzt kaufen',
  },
  
  ja: {
    'nav.home': 'ホーム',
    'nav.marketplace': 'マーケット',
    'nav.profile': 'プロフィール',
    'settings.title': '設定',
    'settings.language': '言語',
    'settings.selectLanguage': '言語を選択',
    'common.loading': '読み込み中...',
    'common.save': '保存',
    'action.buyNow': '今すぐ購入',
  },
  
  ko: {
    'nav.home': '홈',
    'nav.marketplace': '마켓플레이스',
    'nav.profile': '프로필',
    'settings.title': '설정',
    'settings.language': '언어',
    'settings.selectLanguage': '언어 선택',
    'common.loading': '로딩 중...',
    'common.save': '저장',
    'action.buyNow': '지금 구매',
  },
  
  pt: {
    'nav.home': 'Início',
    'nav.marketplace': 'Mercado',
    'nav.profile': 'Perfil',
    'settings.title': 'Configurações',
    'settings.language': 'Idioma',
    'settings.selectLanguage': 'Selecionar idioma',
    'common.loading': 'Carregando...',
    'common.save': 'Salvar',
    'action.buyNow': 'Comprar agora',
  },
}
