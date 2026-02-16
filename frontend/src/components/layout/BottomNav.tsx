import { NavLink } from 'react-router-dom'
import { Home, ShoppingBag, Gift, Ticket, User } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/marketplace', icon: ShoppingBag, label: 'Market' },
  { path: '/portfolio', icon: Gift, label: 'Portfolio' },
  { path: '/lottery', icon: Ticket, label: 'Lottery' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const { haptic } = useTelegram()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-light-surface dark:bg-dark-surface border-t border-light-border dark:border-dark-border backdrop-blur-md bg-opacity-95">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => haptic.selection()}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all
              ${isActive 
                ? 'text-primary bg-primary/10' 
                : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-bg'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={`w-5 h-5 ${isActive ? 'animate-pulse-slow' : ''}`}
                />
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
