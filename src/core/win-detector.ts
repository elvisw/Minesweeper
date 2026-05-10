import { type CellState, GamePhase, type GameState } from './types'

/**
 * 检查是否所有非地雷格已被翻开 → 胜利
 */
export function checkWin(grid: CellState[][]): boolean {
  for (const row of grid) {
    for (const cell of row) {
      if (!cell.isMined && !cell.isRevealed) return false
    }
  }
  return true
}

/**
 * 检查指定位置是否为地雷 → 失败
 */
export function checkLoss(
  mineGrid: boolean[][],
  row: number,
  col: number
): boolean {
  return mineGrid[row][col]
}

/**
 * 游戏是否已结束（Won 或 Lost）
 */
export function isGameOver(state: GameState): boolean {
  return state.phase === GamePhase.Won || state.phase === GamePhase.Lost
}
