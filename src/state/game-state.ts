import {
  type GameState,
  type CellState,
  type DifficultyConfig,
  GamePhase,
} from '../core/types'

export function createCellState(): CellState {
  return {
    isMined: false,
    isRevealed: false,
    isFlagged: false,
    isQuestion: false,
    adjacentMines: 0,
  }
}

export function createInitialState(config: DifficultyConfig): GameState {
  const grid: CellState[][] = []
  for (let r = 0; r < config.rows; r++) {
    const row: CellState[] = []
    for (let c = 0; c < config.cols; c++) {
      row.push(createCellState())
    }
    grid.push(row)
  }

  return {
    phase: GamePhase.Idle,
    grid,
    rows: config.rows,
    cols: config.cols,
    mineCount: config.mines,
    flagCount: 0,
    elapsedSeconds: 0,
    firstClickDone: false,
  }
}
