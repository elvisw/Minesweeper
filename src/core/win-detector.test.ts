import { describe, it, expect } from 'vitest'
import { checkWin, checkLoss, isGameOver } from './win-detector'
import { GamePhase, type GameState } from './types'

describe('checkWin', () => {
  it('should return true when all non-mine cells are revealed', () => {
    const grid = [
      [
        { isMined: false, isRevealed: true, isFlagged: false, isQuestion: false, adjacentMines: 1 },
      ],
    ]
    expect(checkWin(grid)).toBe(true)
  })

  it('should return false when some non-mine cells are hidden', () => {
    const grid = [
      [
        { isMined: false, isRevealed: false, isFlagged: false, isQuestion: false, adjacentMines: 0 },
      ],
    ]
    expect(checkWin(grid)).toBe(false)
  })

  it('should ignore mine cells (they never need to be revealed)', () => {
    const grid = [
      [
        { isMined: false, isRevealed: true, isFlagged: false, isQuestion: false, adjacentMines: 0 },
        { isMined: true, isRevealed: false, isFlagged: false, isQuestion: false, adjacentMines: -1 },
      ],
    ]
    expect(checkWin(grid)).toBe(true)
  })
})

describe('checkLoss', () => {
  it('should return true when clicking on a mine', () => {
    const mineGrid = [[true]]
    expect(checkLoss(mineGrid, 0, 0)).toBe(true)
  })

  it('should return false when clicking on a safe cell', () => {
    const mineGrid = [[false]]
    expect(checkLoss(mineGrid, 0, 0)).toBe(false)
  })
})

describe('isGameOver', () => {
  it('should return true when phase is Won', () => {
    const state = { phase: GamePhase.Won } as GameState
    expect(isGameOver(state)).toBe(true)
  })

  it('should return true when phase is Lost', () => {
    const state = { phase: GamePhase.Lost } as GameState
    expect(isGameOver(state)).toBe(true)
  })

  it('should return false when phase is Playing', () => {
    const state = { phase: GamePhase.Playing } as GameState
    expect(isGameOver(state)).toBe(false)
  })

  it('should return false when phase is Idle', () => {
    const state = { phase: GamePhase.Idle } as GameState
    expect(isGameOver(state)).toBe(false)
  })
})
