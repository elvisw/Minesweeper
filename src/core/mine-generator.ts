/**
 * 使用 Fisher-Yates 部分 shuffle 随机生成地雷位置。
 * safeRow/safeCol 及其相邻 8 格（边界内）不会放置地雷。
 * 返回地雷网格及实际生成的地雷数（当 mineCount 超过可用格数时会自动截断）。
 */
export function generateMines(
  rows: number,
  cols: number,
  mineCount: number,
  safeRow: number,
  safeCol: number
): { grid: boolean[][]; actualMineCount: number } {
  const safeZone = new Set<string>()
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = safeRow + dr
      const c = safeCol + dc
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        safeZone.add(`${r},${c}`)
      }
    }
  }

  const totalCells = rows * cols
  const availableCells = totalCells - safeZone.size
  const actualMineCount = Math.min(mineCount, availableCells)

  const candidates: number[] = []
  for (let i = 0; i < totalCells; i++) {
    const r = Math.floor(i / cols)
    const c = i % cols
    if (!safeZone.has(`${r},${c}`)) {
      candidates.push(i)
    }
  }

  for (let i = 0; i < actualMineCount; i++) {
    const j = i + Math.floor(Math.random() * (candidates.length - i))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }

  const mineSet = new Set(candidates.slice(0, actualMineCount))

  const grid: boolean[][] = []
  for (let r = 0; r < rows; r++) {
    const row: boolean[] = []
    for (let c = 0; c < cols; c++) {
      row.push(mineSet.has(r * cols + c))
    }
    grid.push(row)
  }

  return { grid, actualMineCount }
}
