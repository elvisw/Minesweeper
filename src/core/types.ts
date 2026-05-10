/** 单个格子的完整状态 */
export interface CellState {
  isMined: boolean
  isRevealed: boolean
  isFlagged: boolean
  isQuestion: boolean
  adjacentMines: number
}

/** 游戏阶段 */
export enum GamePhase {
  Idle = 'idle',
  Playing = 'playing',
  Won = 'won',
  Lost = 'lost',
}

/** 完整游戏状态 */
export interface GameState {
  phase: GamePhase
  grid: CellState[][]
  rows: number
  cols: number
  mineCount: number
  flagCount: number
  elapsedSeconds: number
  firstClickDone: boolean
}

/** 难度配置 */
export interface DifficultyConfig {
  label: string
  rows: number
  cols: number
  mines: number
}

/** 预置难度 */
export const BEGINNER: DifficultyConfig = {
  label: '初级',
  rows: 9,
  cols: 9,
  mines: 10,
}

export const INTERMEDIATE: DifficultyConfig = {
  label: '中级',
  rows: 16,
  cols: 16,
  mines: 40,
}

export const EXPERT: DifficultyConfig = {
  label: '高级',
  rows: 16,
  cols: 30,
  mines: 99,
}
