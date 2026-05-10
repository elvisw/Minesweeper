import { type GameState, GamePhase, type DifficultyConfig } from '../core/types'
import { createInitialState } from './game-state'

export function startGame(state: GameState): GameState {
  if (state.phase !== GamePhase.Idle) return state
  return { ...state, phase: GamePhase.Playing, firstClickDone: true }
}

export function winGame(state: GameState): GameState {
  if (state.phase !== GamePhase.Playing) return state
  return { ...state, phase: GamePhase.Won }
}

export function loseGame(state: GameState): GameState {
  if (state.phase !== GamePhase.Playing) return state
  return { ...state, phase: GamePhase.Lost }
}

export function resetGame(_state: GameState, config: DifficultyConfig): GameState {
  return createInitialState(config)
}
