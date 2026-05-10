import { describe, it, expect } from 'vitest'
import { calculateAdjacentMines } from './number-calculator'

describe('calculateAdjacentMines', () => {
  it('should return -1 for mine cells', () => {
    const mineGrid = [
      [true, false],
      [false, false],
    ]
    const numbers = calculateAdjacentMines(mineGrid)
    expect(numbers[0][0]).toBe(-1)
  })

  it('should count adjacent mines correctly', () => {
    const mineGrid = [
      [true, false, false],
      [false, false, false],
      [false, false, true],
    ]
    const numbers = calculateAdjacentMines(mineGrid)
    expect(numbers[0][0]).toBe(-1) // mine
    expect(numbers[2][2]).toBe(-1) // mine
    expect(numbers[1][1]).toBe(2) // adjacent to both mines
    expect(numbers[0][1]).toBe(1) // adjacent to top-left mine only
  })

  it('should handle edge cells correctly', () => {
    const mineGrid = [
      [true, true],
      [false, false],
    ]
    const numbers = calculateAdjacentMines(mineGrid)
    // top-left mine
    expect(numbers[0][0]).toBe(-1)
    // top-right mine
    expect(numbers[0][1]).toBe(-1)
    // bottom-left: adjacent to top-left and top-right (diagonal)
    expect(numbers[1][0]).toBe(2)
    // bottom-right: adjacent to both mines
    expect(numbers[1][1]).toBe(2)
  })

  it('should return all zeros for empty grid', () => {
    const mineGrid = [
      [false, false],
      [false, false],
    ]
    const numbers = calculateAdjacentMines(mineGrid)
    for (const row of numbers) {
      for (const cell of row) {
        expect(cell).toBe(0)
      }
    }
  })

  it('should work with larger grid', () => {
    // 5x5, mines on diagonal
    const size = 5
    const mineGrid: boolean[][] = Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => r === c)
    )
    const numbers = calculateAdjacentMines(mineGrid)
    expect(numbers.length).toBe(5)
    expect(numbers[0].length).toBe(5)
    // Corner: (0,0) is mine, (0,1) should see 2 mines (0,0 and 1,1)
    expect(numbers[0][0]).toBe(-1)
    expect(numbers[0][1]).toBe(2)
  })
})
