/**
 * BFS flood fill。从 (startRow, startCol) 出发，
 * 0 格继续向相邻格扩展，非 0 格仅翻开自身。
 * 地雷格（-1）会标记但不会扩展。
 * 返回应翻开的格子集合（true = 翻开）。
 */
export function floodFill(
  numbers: number[][],
  startRow: number,
  startCol: number
): boolean[][] {
  const rows = numbers.length
  const cols = numbers[0].length
  const revealed: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  )

  const queue: [number, number][] = [[startRow, startCol]]
  revealed[startRow][startCol] = true

  while (queue.length > 0) {
    const [r, c] = queue.shift()!
    if (numbers[r][c] !== 0) continue // 非 0 格只翻开，不扩展

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const nr = r + dr
        const nc = c + dc
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !revealed[nr][nc]
        ) {
          revealed[nr][nc] = true
          queue.push([nr, nc])
        }
      }
    }
  }

  return revealed
}
