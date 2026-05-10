/**
 * 计算每个格子的相邻地雷数。
 * mineGrid[r][c] = true 表示该格有地雷。
 * 返回同尺寸二维数组：地雷格 = -1，安全格 = 周围 8 格的地雷数。
 */
export function calculateAdjacentMines(mineGrid: boolean[][]): number[][] {
  const rows = mineGrid.length
  const cols = mineGrid[0].length
  const numbers: number[][] = []

  for (let r = 0; r < rows; r++) {
    const row: number[] = []
    for (let c = 0; c < cols; c++) {
      if (mineGrid[r][c]) {
        row.push(-1)
      } else {
        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue
            const nr = r + dr
            const nc = c + dc
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && mineGrid[nr][nc]) {
              count++
            }
          }
        }
        row.push(count)
      }
    }
    numbers.push(row)
  }

  return numbers
}
