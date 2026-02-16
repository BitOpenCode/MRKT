import { useState, useEffect } from 'react'
import { X, LogIn, User, Lock } from 'lucide-react'
import api from '@/services/api'
import { useAppStore } from '@/store/appStore'

// Updated: Fixed icon positioning with pl-12 and pointer-events-none
interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTestUsers, setShowTestUsers] = useState(false)
  const { setUser } = useAppStore()

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const testUsers = [
    { username: 'alice', level: 3, points: 5000 },
    { username: 'bob', level: 4, points: 12000 },
    { username: 'charlie', level: 5, points: 25000 },
    { username: 'david', level: 1, points: 800 },
    { username: 'emma', level: 2, points: 3500 },
    { username: 'frank', level: 4, points: 15000 },
    { username: 'grace', level: 2, points: 2000 },
    { username: 'henry', level: 3, points: 8000 },
    { username: 'iris', level: 5, points: 30000 },
    { username: 'jack', level: 1, points: 1200 },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.login(username, password)
      
      if (response.success) {
        const userData = response.data.user
        
        // Save to localStorage
        localStorage.setItem('user_id', userData.id)
        localStorage.setItem('username', userData.username)
        
        // Update store with full user data
        setUser({
          id: userData.id,
          telegramId: userData.telegramId,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          walletAddress: userData.walletAddress,
          usdtBalance: userData.usdtBalance || 0,
          btcBalance: userData.btcBalance || 0,
          ecosPoints: userData.ecosPoints || 0,
          level: userData.level || 1,
          totalVolume: userData.totalVolume || 0,
          cashbackBonus: userData.cashbackBonus || 0,
          referralCode: userData.referralCode,
          referredBy: userData.referredBy,
          friendsInvited: userData.friendsInvited || 0,
          createdAt: userData.createdAt,
        })
        
        // Close modal
        onClose()
        
        // Reload page to fetch user data
        window.location.reload()
      } else {
        setError(response.error || 'Login failed')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.error || err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTestUserLogin = (testUsername: string) => {
    setUsername(testUsername)
    setPassword('password123')
    setShowTestUsers(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <form onSubmit={handleLogin} className="login-form">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <h2 className="login-heading">Login</h2>

        {/* Error Message */}
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* Username Field */}
        <div className="login-field">
          <User className="login-icon" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="login-input"
            autoComplete="off"
            required
          />
        </div>

        {/* Password Field */}
        <div className="login-field">
          <Lock className="login-icon" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input"
            required
          />
        </div>

        {/* Buttons */}
        <div className="login-buttons">
          <button
            type="submit"
            disabled={loading}
            className="login-btn login-btn-primary"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </div>

        {/* Test Users */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowTestUsers(!showTestUsers)}
            className="login-btn-secondary w-full mb-2"
          >
            {showTestUsers ? '🔒 Hide' : '🔓 Show'} Test Users
          </button>

          {showTestUsers && (
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
              <p className="text-xs text-gray-400 mb-2 text-center">
                Password: <code className="bg-black/30 px-2 py-1 rounded">password123</code>
              </p>
              {testUsers.map((user) => (
                <button
                  key={user.username}
                  type="button"
                  onClick={() => handleTestUserLogin(user.username)}
                  className="login-test-user"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{user.username}</p>
                      <p className="text-xs opacity-60">
                        Level {user.level} • {user.points.toLocaleString()}⭐
                      </p>
                    </div>
                    <LogIn className="w-4 h-4 text-primary" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
