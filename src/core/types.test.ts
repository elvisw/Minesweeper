import { describe, it, expect } from 'vitest'
import {
  GamePhase,
  BEGINNER,
  INTERMEDIATE,
  EXPERT,
  type CellState,
  type GameState,
} from './types'

describe('CellState', () => {
  it('should create a default covered cell', () => {
    const cell: CellState = {
      isMined: false,
      isRevealed: false,
      isFlagged: false,
      isQuestion: false,
      adjacentMines: 0,
    }
    expect(cell.isMined).toBe(false)
    expect(cell.isRevealed).toBe(false)
  })
})

describe('GamePhase', () => {
  it('should have four distinct phases', () => {
    const phases = Object.values(GamePhase)
    expect(phases).toHaveLength(4)
    expect(phases).toContain('idle')
    expect(phases).toContain('playing')
    expect(phases).toContain('won')
    expect(phases).toContain('lost')
  })
})

describe('GameState', () => {
  it('should initialize with idle phase', () => {
    const state: GameState = {
      phase: GamePhase.Idle,
      grid: [],
      rows: 9,
      cols: 9,
      mineCount: 10,
      flagCount: 0,
      elapsedSeconds: 0,
      firstClickDone: false,
    }
    expect(state.phase).toBe(GamePhase.Idle)
    expect(state.rows).toBe(9)
  })
})

describe('DifficultyConfig', () => {
  it('should have correct beginner difficulty', () => {
    expect(BEGINNER.label).toBe('初级')
    expect(BEGINNER.rows).toBe(9)
    expect(BEGINNER.cols).toBe(9)
    expect(BEGINNER.mines).toBe(10)
  })

  it('should have correct intermediate difficulty', () => {
    expect(INTERMEDIATE.label).toBe('中级')
    expect(INTERMEDIATE.rows).toBe(16)
    expect(INTERMEDIATE.cols).toBe(16)
    expect(INTERMEDIATE.mines).toBe(40)
  })

  it('should have correct expert difficulty', () => {
    expect(EXPERT.label).toBe('高级')
    expect(EXPERT.rows).toBe(16)
    expect(EXPERT.cols).toBe(30)
    expect(EXPERT.mines).toBe(99)
  })
})
