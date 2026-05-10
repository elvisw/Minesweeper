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
