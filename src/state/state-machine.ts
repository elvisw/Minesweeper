import { type GameState, GamePhase, type DifficultyConfig } from '../core/types'
import { createInitialState } from './game-state'

export function startGame(state: GameState): GameState {
  if (state.phase !== GamePhase.Idle) return state
  return { ...state, phase: GamePhase.Playing, firstClickDone: true }
}

export function winGame(state: GameState): GameState {
  if (state.phase !== GamePhase.Playing) return state

  const grid = state.grid.map(row =>
    row.map(cell => {
      if (!cell.isRevealed && !cell.isFlagged) {
        return { ...cell, isFlagged: true, isQuestion: false }
      }
      return cell
    })
  )

  return { ...state, grid, phase: GamePhase.Won, flagCount: state.mineCount }
}

export function loseGame(state: GameState): GameState {
  if (state.phase !== GamePhase.Playing) return state
  return { ...state, phase: GamePhase.Lost }
}

export function resetGame(_state: GameState, config: DifficultyConfig): GameState {
  return createInitialState(config)
}
