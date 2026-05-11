import { describe, it, expect } from 'vitest'
import { startGame, winGame, loseGame, resetGame } from './state-machine'
import { createInitialState } from './game-state'
import { GamePhase, BEGINNER, INTERMEDIATE } from '../core/types'

describe('startGame', () => {
  it('should transition from Idle to Playing', () => {
    const state = createInitialState(BEGINNER)
    const next = startGame(state)
    expect(next.phase).toBe(GamePhase.Playing)
    expect(next.firstClickDone).toBe(true)
  })

  it('should not mutate original state', () => {
    const state = createInitialState(BEGINNER)
    const next = startGame(state)
    expect(state.phase).toBe(GamePhase.Idle)
    expect(next).not.toBe(state)
  })

  it('should not transition from Playing', () => {
    const state = createInitialState(BEGINNER)
    const playing = startGame(state)
    const again = startGame(playing)
    expect(again.phase).toBe(GamePhase.Playing)
  })

  it('should not transition from Won', () => {
    const state = createInitialState(BEGINNER)
    const won = winGame(startGame(state))
    const again = startGame(won)
    expect(again.phase).toBe(GamePhase.Won)
  })

  it('should not transition from Lost', () => {
    const state = createInitialState(BEGINNER)
    const lost = loseGame(startGame(state))
    const again = startGame(lost)
    expect(again.phase).toBe(GamePhase.Lost)
  })
})

describe('winGame', () => {
  it('should transition from Playing to Won', () => {
    const state = startGame(createInitialState(BEGINNER))
    const won = winGame(state)
    expect(won.phase).toBe(GamePhase.Won)
  })

  it('should auto-flag all unrevealed cells on win', () => {
    const state = startGame(createInitialState(BEGINNER))
    // Simulate: one cell revealed, rest hidden
    state.grid[0][0] = { ...state.grid[0][0], isRevealed: true }

    const won = winGame(state)

    // Every unrevealed cell should now be flagged
    for (let r = 0; r < won.rows; r++) {
      for (let c = 0; c < won.cols; c++) {
        const cell = won.grid[r][c]
        if (!cell.isRevealed) {
          expect(cell.isFlagged).toBe(true)
        }
      }
    }
  })

  it('should update flagCount to mineCount on win', () => {
    const state = startGame(createInitialState(BEGINNER))
    const won = winGame(state)
    expect(won.flagCount).toBe(won.mineCount)
  })

  it('should keep already flagged cells flagged on win', () => {
    const state = startGame(createInitialState(BEGINNER))
    state.grid[0][0] = { ...state.grid[0][0], isFlagged: true }
    state.flagCount = 1

    const won = winGame(state)

    expect(won.grid[0][0].isFlagged).toBe(true)
  })

  it('should clear isQuestion when auto-flagging on win', () => {
    const state = startGame(createInitialState(BEGINNER))
    state.grid[0][0] = { ...state.grid[0][0], isQuestion: true, isRevealed: false }

    const won = winGame(state)

    expect(won.grid[0][0].isFlagged).toBe(true)
    expect(won.grid[0][0].isQuestion).toBe(false)
  })

  it('should not transition from Idle', () => {
    const state = createInitialState(BEGINNER)
    const won = winGame(state)
    expect(won.phase).toBe(GamePhase.Idle)
  })
})

describe('loseGame', () => {
  it('should transition from Playing to Lost', () => {
    const state = startGame(createInitialState(BEGINNER))
    const lost = loseGame(state)
    expect(lost.phase).toBe(GamePhase.Lost)
  })

  it('should not transition from Idle', () => {
    const state = createInitialState(BEGINNER)
    const lost = loseGame(state)
    expect(lost.phase).toBe(GamePhase.Idle)
  })
})

describe('resetGame', () => {
  it('should return to Idle from any state', () => {
    const state = startGame(createInitialState(BEGINNER))
    const won = winGame(state)
    const reset = resetGame(won, BEGINNER)
    expect(reset.phase).toBe(GamePhase.Idle)
    expect(reset.firstClickDone).toBe(false)
    expect(reset.elapsedSeconds).toBe(0)
  })

  it('should use the provided difficulty config', () => {
    const state = createInitialState(BEGINNER)
    const reset = resetGame(state, INTERMEDIATE)
    expect(reset.rows).toBe(16)
    expect(reset.cols).toBe(16)
    expect(reset.mineCount).toBe(40)
  })

  it('should return new object', () => {
    const state = createInitialState(BEGINNER)
    const reset = resetGame(state, BEGINNER)
    expect(reset).not.toBe(state)
  })
})
