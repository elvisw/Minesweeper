export interface GameStats {
  gamesPlayed: number
  gamesWon: number
  bestTime: number | null // seconds
  currentStreak: number
  bestStreak: number
}

const STORAGE_KEY = 'minesweeper-stats'

function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as GameStats
  } catch { /* ignore corrupt data */ }
  return { gamesPlayed: 0, gamesWon: 0, bestTime: null, currentStreak: 0, bestStreak: 0 }
}

function saveStats(stats: GameStats): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function recordGame(won: boolean, time: number): GameStats {
  const s = loadStats()
  s.gamesPlayed++
  if (won) {
    s.gamesWon++
    s.currentStreak++
    if (s.currentStreak > s.bestStreak) s.bestStreak = s.currentStreak
    if (s.bestTime === null || time < s.bestTime) s.bestTime = time
  } else {
    s.currentStreak = 0
  }
  saveStats(s)
  return s
}

export function getStats(): GameStats {
  return loadStats()
}
