import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, WalletInfo, SmartContract } from '@/types'

export interface CartItem {
  contract: SmartContract
  quantity: number
  addedAt: string
}

interface AppState {
  // User
  user: User | null
  setUser: (user: User | null) => void
  
  // Wallet
  wallet: WalletInfo | null
  setWallet: (wallet: WalletInfo | null) => void
  
  // Cart
  cart: CartItem[]
  addToCart: (contract: SmartContract) => void
  removeFromCart: (contractId: string) => void
  updateCartQuantity: (contractId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
  
  // Theme
  theme: 'dark' | 'light'
  toggleTheme: () => void
  setTheme: (theme: 'dark' | 'light') => void
  
  // Language
  language: string
  setLanguage: (language: string) => void
  
  // Loading
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // Notifications
  notifications: number
  setNotifications: (count: number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      
      // Wallet
      wallet: null,
      setWallet: (wallet) => set({ wallet }),
      
      // Cart
      cart: [],
      addToCart: (contract) => set((state) => {
        const existingItem = state.cart.find(item => item.contract.id === contract.id)
        if (existingItem) {
          // Update quantity if already in cart
          return {
            cart: state.cart.map(item =>
              item.contract.id === contract.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }
        } else {
          // Add new item to cart
          return {
            cart: [...state.cart, {
              contract,
              quantity: 1,
              addedAt: new Date().toISOString()
            }]
          }
        }
      }),
      removeFromCart: (contractId) => set((state) => ({
        cart: state.cart.filter(item => item.contract.id !== contractId)
      })),
      updateCartQuantity: (contractId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.contract.id === contractId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter(item => item.quantity > 0)
      })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const state = get()
        return state.cart.reduce((total, item) => {
          return total + (item.contract.currentPrice || 0) * item.quantity
        }, 0)
      },
      getCartItemCount: () => {
        const state = get()
        return state.cart.reduce((count, item) => count + item.quantity, 0)
      },
      
      // Theme
      theme: 'dark',
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark'
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        return { theme: newTheme }
      }),
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        return set({ theme })
      },
      
      // Language
      language: 'ru', // Default to Russian
      setLanguage: (language) => set({ language }),
      
      // Loading
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      
      // Notifications
      notifications: 0,
      setNotifications: (notifications) => set({ notifications }),
    }),
    {
      name: 'ton-marketplace-storage',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        cart: state.cart,
        language: state.language,
      }),
    }
  )
)
