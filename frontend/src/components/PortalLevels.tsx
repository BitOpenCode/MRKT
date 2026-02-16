import { Diamond, Star, TrendingUp, Gift } from 'lucide-react'
import { USER_LEVELS } from '@/types'

interface Props {
  currentLevel: number
  currentVolume: number
  ecosPoints: number
}

export default function PortalLevels({ currentLevel, currentVolume, ecosPoints }: Props) {
  const currentLevelData = USER_LEVELS.find(l => l.level === currentLevel) || USER_LEVELS[0]
  const nextLevelData = USER_LEVELS.find(l => l.level === currentLevel + 1)
  
  const progressToNextLevel = nextLevelData 
    ? Math.min(100, (currentVolume / nextLevelData.volumeRequired) * 100)
    : 100

  return (
    <div className="space-y-4">
      {/* Current Level Card */}
      <div className={`card p-6 ${
        currentLevelData.isSpecial 
          ? 'border-warning/50' 
          : 'border-primary/30'
      }`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${
            currentLevelData.isSpecial
              ? 'border-warning/50 bg-warning/10'
              : 'border-primary/40 bg-primary/10'
          }`}>
            <Diamond className={`w-8 h-8 ${currentLevelData.isSpecial ? 'text-warning' : 'text-primary'}`} />
          </div>
          <div>
            <p className="text-sm text-dark-text-secondary mb-1">Your Level</p>
            <h2 className="text-3xl font-bold gradient-text">{currentLevelData.name}</h2>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-dark-bg/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <p className="text-xs text-dark-text-secondary">Commission Rate</p>
            </div>
            <p className="text-2xl font-bold text-success">{currentLevelData.commissionRate}%</p>
          </div>
          <div className="bg-dark-bg/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-warning" />
              <p className="text-xs text-dark-text-secondary">Points Discount</p>
            </div>
            <p className="text-2xl font-bold text-warning">{currentLevelData.ecosPointsDiscount}%</p>
          </div>
        </div>

        {/* ECOS Points Balance */}
        <div className="mt-4 bg-dark-surface/50 rounded-lg p-3 border border-warning/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              <span className="text-sm text-dark-text-secondary">Your ECOS Points</span>
            </div>
            <span className="text-2xl font-bold text-warning">
              {ecosPoints.toLocaleString()}⭐
            </span>
          </div>
        </div>
      </div>

      {/* Progress to Next Level */}
      {nextLevelData && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-dark-text">Progress to {nextLevelData.name}</h3>
            <span className="text-sm text-dark-text-secondary">
              {currentVolume.toLocaleString()} / {nextLevelData.volumeRequired.toLocaleString()} ∇
            </span>
          </div>
          
          <div className="w-full bg-dark-bg rounded-full h-3 mb-3">
            <div
              className="bg-gradient-to-r from-primary to-success h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressToNextLevel}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-dark-bg/50 rounded-lg p-2">
              <p className="text-xs text-dark-text-secondary mb-1">Next Commission</p>
              <p className="text-lg font-bold text-success">+{nextLevelData.commissionRate}%</p>
            </div>
            <div className="bg-dark-bg/50 rounded-lg p-2">
              <p className="text-xs text-dark-text-secondary mb-1">Next Discount</p>
              <p className="text-lg font-bold text-warning">+{nextLevelData.ecosPointsDiscount}%</p>
            </div>
          </div>
        </div>
      )}

      {/* All Levels Overview */}
      <div className="card p-4">
        <h3 className="font-bold text-dark-text mb-4">All Levels</h3>
        <div className="space-y-2">
          {USER_LEVELS.map((level) => (
            <div
              key={level.level}
              className={`p-3 rounded-lg border-2 transition-all ${
                level.level === currentLevel
                  ? 'border-primary bg-primary/10'
                  : level.level < currentLevel
                  ? 'border-success/30 bg-success/5'
                  : 'border-dark-border bg-dark-bg/30 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    level.level === currentLevel ? 'bg-primary/20' :
                    level.level < currentLevel ? 'bg-success/20' :
                    'bg-dark-bg'
                  }`}>
                    {level.isSpecial ? (
                      <Gift className="w-5 h-5 text-warning" />
                    ) : (
                      <Diamond className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-dark-text">{level.name}</p>
                    <p className="text-xs text-dark-text-secondary">
                      {level.volumeRequired.toLocaleString()}∇ volume required
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-success">{level.commissionRate}%</p>
                  <p className="text-xs text-warning">{level.ecosPointsDiscount}% discount</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Level 5 Benefits */}
      {currentLevel === 5 && (
        <div className="card p-4 border-warning/50">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="w-8 h-8 text-warning" />
            <h3 className="font-bold text-lg text-dark-text">Level 5 Exclusive Benefits</h3>
          </div>
          <ul className="space-y-2 text-sm text-dark-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span>Pay up to 30% of purchases with ECOS Points</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span>Earn 5% commission on friends' purchases</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span>Priority customer support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span>Exclusive access to premium listings</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
