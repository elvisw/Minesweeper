import { describe, it, expect } from 'vitest'
import { createInitialState, createCellState } from './game-state'
import { GamePhase, BEGINNER } from '../core/types'

describe('createCellState', () => {
  it('should return a default covered cell', () => {
    const cell = createCellState()
    expect(cell.isMined).toBe(false)
    expect(cell.isRevealed).toBe(false)
    expect(cell.isFlagged).toBe(false)
    expect(cell.isQuestion).toBe(false)
    expect(cell.adjacentMines).toBe(0)
  })
})

describe('createInitialState', () => {
  it('should create state with Idle phase', () => {
    const state = createInitialState(BEGINNER)
    expect(state.phase).toBe(GamePhase.Idle)
  })

  it('should create grid matching config dimensions', () => {
    const state = createInitialState(BEGINNER)
    expect(state.grid.length).toBe(9)
    expect(state.grid[0].length).toBe(9)
  })

  it('should set correct metadata', () => {
    const state = createInitialState(BEGINNER)
    expect(state.rows).toBe(9)
    expect(state.cols).toBe(9)
    expect(state.mineCount).toBe(10)
    expect(state.flagCount).toBe(0)
    expect(state.elapsedSeconds).toBe(0)
    expect(state.firstClickDone).toBe(false)
  })

  it('should create all cells as default covered', () => {
    const state = createInitialState(BEGINNER)
    for (const row of state.grid) {
      for (const cell of row) {
        expect(cell.isMined).toBe(false)
        expect(cell.isRevealed).toBe(false)
      }
    }
  })

  it('should work with different difficulty configs', () => {
    const config = { label: 'test', rows: 20, cols: 30, mines: 99 }
    const state = createInitialState(config)
    expect(state.grid.length).toBe(20)
    expect(state.grid[0].length).toBe(30)
    expect(state.mineCount).toBe(99)
  })
})
