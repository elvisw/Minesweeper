import { describe, it, expect } from 'vitest'
import { generateMines } from './mine-generator'

describe('generateMines', () => {
  it('should generate correct number of mines', () => {
    const { grid, actualMineCount } = generateMines(9, 9, 10, 4, 4)
    expect(actualMineCount).toBe(10)
    let count = 0
    for (const row of grid) {
      for (const cell of row) {
        if (cell) count++
      }
    }
    expect(count).toBe(10)
  })

  it('should not place mines in safe zone (center)', () => {
    const { grid } = generateMines(9, 9, 10, 4, 4)
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = 4 + dr
        const c = 4 + dc
        if (r >= 0 && r < 9 && c >= 0 && c < 9) {
          expect(grid[r][c]).toBe(false)
        }
      }
    }
  })

  it('should not place mines in safe zone (corner 0,0)', () => {
    const { grid } = generateMines(9, 9, 10, 0, 0)
    const safeCells = [[0, 0], [0, 1], [1, 0], [1, 1]]
    for (const [r, c] of safeCells) {
      expect(grid[r][c]).toBe(false)
    }
  })

  it('should not place mines in safe zone (corner 8,8)', () => {
    const { grid } = generateMines(9, 9, 10, 8, 8)
    const safeCells = [[8, 8], [8, 7], [7, 8], [7, 7]]
    for (const [r, c] of safeCells) {
      expect(grid[r][c]).toBe(false)
    }
  })

  it('should handle mineCount=0', () => {
    const { grid, actualMineCount } = generateMines(5, 5, 0, 2, 2)
    expect(actualMineCount).toBe(0)
    for (const row of grid) {
      for (const cell of row) {
        expect(cell).toBe(false)
      }
    }
  })

  it('should cap mineCount at available cells and report actual count', () => {
    const { grid, actualMineCount } = generateMines(3, 3, 10, 1, 1)
    expect(actualMineCount).toBe(0)
    let count = 0
    for (const row of grid) {
      for (const cell of row) {
        if (cell) count++
      }
    }
    expect(count).toBe(0)
  })

  it('should produce deterministic size grid', () => {
    const { grid } = generateMines(10, 15, 20, 5, 7)
    expect(grid.length).toBe(10)
    for (const row of grid) {
      expect(row.length).toBe(15)
    }
  })
})
